import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(import.meta.dirname, "../..");
const snapshotDir = path.resolve(root, "tmp/acupuncture-source");
const outputFile = path.resolve(root, "data/import/acupuncture/reference/primary-meridian-names.json");

const meridians = [
  ["lung", "LU", 11, "02-shou-sanyin-sanyang.html"],
  ["large-intestine", "LI", 20, "02-shou-sanyin-sanyang.html"],
  ["stomach", "ST", 45, "03-zu-sanyin-sanyang.html"],
  ["spleen", "SP", 21, "03-zu-sanyin-sanyang.html"],
  ["heart", "HT", 9, "02-shou-sanyin-sanyang.html"],
  ["small-intestine", "SI", 19, "02-shou-sanyin-sanyang.html"],
  ["bladder", "BL", 67, "03-zu-sanyin-sanyang.html"],
  ["kidney", "KI", 27, "03-zu-sanyin-sanyang.html"],
  ["pericardium", "PC", 9, "02-shou-sanyin-sanyang.html"],
  ["sanjiao", "TE", 23, "02-shou-sanyin-sanyang.html"],
  ["gallbladder", "GB", 44, "03-zu-sanyin-sanyang.html"],
  ["liver", "LR", 14, "03-zu-sanyin-sanyang.html"],
] as const;

function text(value: string) {
  return value.replace(/<b>[\s\S]*?<\/b>/g, "").replace(/<[^>]+>/g, "").replaceAll("&nbsp;", " ").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();
}

const simplifiedOverrides: Record<string, string> = {
  LI5: "阳溪", LI19: "口禾髎", SI3: "后溪", KI3: "太溪", GB1: "瞳子髎", GB3: "上关", GB6: "悬厘",
};

function wikiRows(file: string) {
  const html = fs.readFileSync(file, "utf8");
  const output = new Map<string, string[]>();
  const primaryCodes = new Set(meridians.map(([, code]) => code));
  for (const match of html.matchAll(/<tr>\s*<td>[\s\S]*?<\/td>\s*<td[^>]*>\s*([A-Z]{2})\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)) {
    if (!primaryCodes.has(match[1] as (typeof meridians)[number][1])) continue;
    const points = [...match[3].matchAll(/>(\d+)\.([^<]+)<\/a>/g)].map((point) => point[2].trim());
    if (points.length !== Number(match[2])) throw new Error(`${match[1]} snapshot count ${points.length} != ${match[2]}`);
    output.set(match[1], points);
  }
  return output;
}

function projectRows(id: string, file: string) {
  const html = fs.readFileSync(path.resolve(root, "renji/zhenjiu", file), "utf8");
  const section = html.match(new RegExp(`<h2 id="${id}">[\\s\\S]*?<table>([\\s\\S]*?)<\\/table>`));
  if (!section) throw new Error(`Missing project table for ${id}`);
  return [...section[1].matchAll(/<tr><td>([\s\S]*?)<\/td>/g)].map((row) => text(row[1]));
}

function sha256(file: string) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const hantFile = path.resolve(snapshotDir, "zh-hant.html");
const hansFile = path.resolve(snapshotDir, "zh-hans.html");
const hant = wikiRows(hantFile);
const hans = wikiRows(hansFile);
const records = meridians.map(([id, code, expectedCount, file]) => {
  const canonicalHant = projectRows(id, file);
  const wikiHant = hant.get(code) ?? [];
  const canonicalHans = hans.get(code) ?? [];
  if (canonicalHant.length !== expectedCount || canonicalHans.length !== expectedCount || wikiHant.length !== expectedCount) {
    throw new Error(`${code} expected ${expectedCount}; project ${canonicalHant.length}, hant ${wikiHant.length}, hans ${canonicalHans.length}`);
  }
  return {
    meridianId: `meridian:${id}`,
    code,
    expectedCount,
    projectFile: `renji/zhenjiu/${file}`,
    names: canonicalHant.map((nameHant, index) => ({
      standardCode: `${code}${index + 1}`,
      nameHant,
      nameHans: simplifiedOverrides[`${code}${index + 1}`] ?? canonicalHans[index],
      crossCheckHant: wikiHant[index],
    })),
  };
});

const payload = {
  formatVersion: "1.0",
  generatedBy: "tools/acupuncture/extract-primary-reference.ts",
  scope: "twelve-primary-meridians",
  totalExpected: 309,
  sources: {
    projectTables: ["renji/zhenjiu/02-shou-sanyin-sanyang.html", "renji/zhenjiu/03-zu-sanyin-sanyang.html"],
    wikipediaPage: "https://zh.wikipedia.org/wiki/腧穴列表",
    wikipediaApi: "https://zh.wikipedia.org/w/api.php?action=parse&page=腧穴列表&prop=text&format=json&formatversion=2",
    snapshotSha256: { "zh-Hant": sha256(hantFile), "zh-Hans": sha256(hansFile) },
    whoReference: "https://iris.who.int/handle/10665/353407",
    currentChinaStandard: "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=397548AE7248D3D87DD15E0AB8107185",
  },
  meridians: records,
};

if (records.reduce((sum, row) => sum + row.names.length, 0) !== payload.totalExpected) throw new Error("Primary-meridian total is not 309");
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`wrote ${path.relative(root, outputFile)} (${payload.totalExpected} points)`);
