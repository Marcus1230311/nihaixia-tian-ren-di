import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const referenceFile = path.resolve(root, "data/import/acupuncture/reference/primary-meridian-names.json");
const outputDir = path.resolve(root, "data/import/acupuncture/primary-batches");
const aggregateFile = path.resolve(root, "data/import/acupuncture/primary-meridians.json");

type Reference = {
  totalExpected: number;
  meridians: Array<{
    meridianId: string;
    code: string;
    expectedCount: number;
    projectFile: string;
    names: Array<{ standardCode: string; nameHant: string; nameHans: string }>;
  }>;
};

const batches = [
  ["01-lu-li", ["LU", "LI"]], ["02-st-sp", ["ST", "SP"]], ["03-ht-si", ["HT", "SI"]],
  ["04-bl-ki", ["BL", "KI"]], ["05-pc-te", ["PC", "TE"]], ["06-gb-lr", ["GB", "LR"]],
] as const;

const fiveShu: Record<string, Array<[number, string, string]>> = {
  LU: [[11, "well", "wood"], [10, "spring", "fire"], [9, "stream", "earth"], [8, "river", "metal"], [5, "sea", "water"]],
  LI: [[1, "well", "metal"], [2, "spring", "water"], [3, "stream", "wood"], [5, "river", "fire"], [11, "sea", "earth"]],
  ST: [[45, "well", "metal"], [44, "spring", "water"], [43, "stream", "wood"], [41, "river", "fire"], [36, "sea", "earth"]],
  SP: [[1, "well", "wood"], [2, "spring", "fire"], [3, "stream", "earth"], [5, "river", "metal"], [9, "sea", "water"]],
  HT: [[9, "well", "wood"], [8, "spring", "fire"], [7, "stream", "earth"], [4, "river", "metal"], [3, "sea", "water"]],
  SI: [[1, "well", "metal"], [2, "spring", "water"], [3, "stream", "wood"], [5, "river", "fire"], [8, "sea", "earth"]],
  BL: [[67, "well", "metal"], [66, "spring", "water"], [65, "stream", "wood"], [60, "river", "fire"], [40, "sea", "earth"]],
  KI: [[1, "well", "wood"], [2, "spring", "fire"], [3, "stream", "earth"], [7, "river", "metal"], [10, "sea", "water"]],
  PC: [[9, "well", "wood"], [8, "spring", "fire"], [7, "stream", "earth"], [5, "river", "metal"], [3, "sea", "water"]],
  TE: [[1, "well", "metal"], [2, "spring", "water"], [3, "stream", "wood"], [6, "river", "fire"], [10, "sea", "earth"]],
  GB: [[44, "well", "metal"], [43, "spring", "water"], [41, "stream", "wood"], [38, "river", "fire"], [34, "sea", "earth"]],
  LR: [[1, "well", "wood"], [2, "spring", "fire"], [3, "stream", "earth"], [4, "river", "metal"], [8, "sea", "water"]],
};

const categoryGroups: Record<string, string[]> = {
  source: ["LU9", "LI4", "ST42", "SP3", "HT7", "SI4", "BL64", "KI3", "PC7", "TE4", "GB40", "LR3"],
  connecting: ["LU7", "LI6", "ST40", "SP4", "HT5", "SI7", "BL58", "KI4", "PC6", "TE5", "GB37", "LR5"],
  cleft: ["LU6", "LI7", "ST34", "SP8", "HT6", "SI6", "BL63", "KI5", "PC4", "TE7", "GB36", "LR6"],
  "front-mu": ["LU1", "ST25", "GB24", "GB25", "LR13", "LR14"],
  "back-shu": ["BL13", "BL14", "BL15", "BL18", "BL19", "BL20", "BL21", "BL22", "BL23", "BL25", "BL27", "BL28"],
  "eight-confluent": ["LU7", "SP4", "SI3", "BL62", "KI6", "PC6", "TE5", "GB41"],
  crossing: ["SP6"],
};

const categoriesByCode = new Map<string, Set<string>>();
const elementsByCode = new Map<string, string>();
for (const [prefix, rows] of Object.entries(fiveShu)) for (const [number, category, element] of rows) {
  const code = `${prefix}${number}`;
  categoriesByCode.set(code, new Set([`point-category:${category}`]));
  elementsByCode.set(code, `element:${element}`);
}
for (const [category, codes] of Object.entries(categoryGroups)) for (const code of codes) {
  const categories = categoriesByCode.get(code) ?? new Set<string>();
  categories.add(`point-category:${category}`);
  categoriesByCode.set(code, categories);
}

const defaults = {
  relatedLessonIds: ["lesson:renji:acupuncture:02"],
  sourceIds: ["source:project:renji-acupuncture-notes", "source:reference:who-acupuncture-nomenclature", "source:derived:renji-acupuncture-pilot"],
  relationSourceIds: {
    membership: ["source:project:renji-acupuncture-notes", "source:reference:who-acupuncture-nomenclature", "source:derived:renji-acupuncture-pilot"],
    category: ["source:project:renji-acupuncture-notes", "source:derived:renji-acupuncture-pilot"],
    fiveShu: ["source:project:renji-acupuncture-notes", "source:reference:bucm-five-shu", "source:derived:renji-acupuncture-pilot"],
  },
  sourceLocator: [
    { sourceId: "source:project:renji-acupuncture-notes", sourceTitle: "本站人紀針灸既有課程筆記", section: "renji/zhenjiu/02–03", localFile: "renji/zhenjiu", note: "十二正經穴名次序的本站既有編輯表。" },
    { sourceId: "source:reference:who-acupuncture-nomenclature", sourceTitle: "WHO Standard Acupuncture Nomenclature", section: "twelve primary meridian codes and names", sourceUrl: "https://iris.who.int/handle/10665/353407", note: "用於標準代碼、經脈與穴名核對。" },
    { sourceId: "source:reference:bucm-five-shu", sourceTitle: "北京中醫藥大學針灸學：五輸穴", section: "五輸穴次序與五行配屬", sourceUrl: "https://jxjyxb.bucm.edu.cn/BZYAttachs/courseware/zhenjiuxue/c1/c1_61a.htm" },
    { sourceId: "source:derived:renji-acupuncture-pilot", section: "V2.5B-2 production expansion", note: "由受控來源快照和分類映射生成。" },
  ],
  status: "accepted",
};

const reference = JSON.parse(fs.readFileSync(referenceFile, "utf8")) as Reference;
const records = reference.meridians.flatMap((meridian) => meridian.names.map((point, index) => ({
  sourceKey: `primary:${point.standardCode}`,
  canonicalNameHant: point.nameHant,
  canonicalNameHans: point.nameHans,
  standardCode: point.standardCode,
  meridianId: meridian.meridianId,
  aliasesHant: [point.standardCode],
  aliasesHans: [point.standardCode],
  sequenceNumber: index + 1,
  pointCategories: [...(categoriesByCode.get(point.standardCode) ?? [])],
  ...(elementsByCode.has(point.standardCode) ? { elementId: elementsByCode.get(point.standardCode) } : {}),
})));

if (records.length !== reference.totalExpected) throw new Error(`Expected ${reference.totalExpected} records, received ${records.length}`);
fs.mkdirSync(outputDir, { recursive: true });
for (const [batchId, prefixes] of batches) {
  const batchRecords = records.filter((record) => prefixes.some((prefix) => record.standardCode.startsWith(prefix)));
  fs.writeFileSync(path.resolve(outputDir, `${batchId}.json`), `${JSON.stringify({ formatVersion: "1.0", defaults, records: batchRecords }, null, 2)}\n`, "utf8");
}
fs.writeFileSync(aggregateFile, `${JSON.stringify({ formatVersion: "1.0", defaults, records }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ batches: batches.length, records: records.length, fiveShu: elementsByCode.size, categories: [...categoriesByCode.values()].reduce((sum, value) => sum + value.size, 0) }));
