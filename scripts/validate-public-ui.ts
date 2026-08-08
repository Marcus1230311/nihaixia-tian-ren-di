import fs from "node:fs";
import path from "node:path";
import { entities, lessons } from "../data/knowledge";

const root = path.resolve(process.cwd(), "out");
if (!fs.existsSync(root)) throw new Error("缺少 out；請先執行靜態建置");

const expectedRoutes = [
  "/",
  ...lessons.map((lesson) => `/lessons/${lesson.route.join("/")}/`),
  ...entities.map((entity) => `/entities/${entity.slug}/`),
];

const forbiddenPublicText = [
  "V2", "分批遷移", "代表性遷移", "首批", "已遷移", "本批次", "內容對帳", "開發中", "pilot",
  "part_of", "belongs_to", "appears_in", "sourced_from", "contains_herb", "related_formula",
  "corresponds_to", "element_of", "upper_trigram", "lower_trigram", "related_to",
];

function routeFile(route: string) {
  return route === "/" ? path.join(root, "index.html") : path.join(root, ...route.split("/").filter(Boolean), "index.html");
}

function textContent(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function targetExists(href: string) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || !clean.startsWith("/") || clean.startsWith("/_next/")) return true;
  const decoded = decodeURIComponent(clean);
  const relative = decoded.replace(/^\//, "");
  const direct = path.join(root, relative);
  if (path.extname(relative)) return fs.existsSync(direct);
  return fs.existsSync(path.join(direct, "index.html")) || fs.existsSync(`${direct}.html`) || fs.existsSync(direct);
}

const errors: string[] = [];
for (const route of expectedRoutes) {
  const file = routeFile(route);
  if (!fs.existsSync(file)) {
    errors.push(`${route} 未輸出`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const visible = textContent(html);
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  if (h1Count !== 1) errors.push(`${route} H1 數量為 ${h1Count}`);
  for (const word of forbiddenPublicText) {
    if (visible.toLocaleLowerCase().includes(word.toLocaleLowerCase())) errors.push(`${route} 顯示內部文字：${word}`);
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    if (!targetExists(match[1])) errors.push(`${route} 壞連結：${match[1]}`);
  }
}

if (errors.length) throw new Error(`公開頁驗證失敗：\n${errors.join("\n")}`);
console.log(JSON.stringify({ routes: expectedRoutes.length, brokenLinks: 0, forbiddenPublicText: 0, singleH1: true }, null, 2));
