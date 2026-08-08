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
  "V2", "分批遷移", "代表性遷移", "首批", "已遷移", "本批次", "內容對帳", "開發中", "pilot", "試點", "试点",
  "part_of", "belongs_to", "appears_in", "sourced_from", "contains_herb", "related_formula",
  "corresponds_to", "element_of", "upper_trigram", "lower_trigram", "related_to",
  "generates", "controls", "heavenly_stem", "earthly_branch", "yin_yang", "ten_god",
  "classified_as", "meridian_level", "point_category", "acupoint",
  "shanghan_channel", "syndrome", "classically_associated_with",
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
  if (route.startsWith("/entities/") && !html.includes('data-local-graph="depth-1"')) errors.push(`${route} 缺少一層知識連結圖`);
  if (route.startsWith("/entities/") && !visible.includes("知識關係")) errors.push(`${route} 缺少文字知識關係列表`);
  for (const word of forbiddenPublicText) {
    if (visible.toLocaleLowerCase().includes(word.toLocaleLowerCase())) errors.push(`${route} 顯示內部文字：${word}`);
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    if (!targetExists(match[1])) errors.push(`${route} 壞連結：${match[1]}`);
  }
}

const searchIndexFile = path.join(root, "search-index.json");
if (!fs.existsSync(searchIndexFile)) errors.push("缺少公開搜尋索引");
else {
  const records = JSON.parse(fs.readFileSync(searchIndexFile, "utf8")) as Array<{ labels: Record<string, string>; descriptions: Record<string, string>; keywords: Record<string, string[]> }>;
  if (records.length !== entities.length + lessons.length) errors.push(`搜尋索引數量錯誤：${records.length}`);
  for (const query of ["甲", "伤官", "河图", "洛书", "北方", "太衝", "太冲", "肝經", "肝经", "原穴", "五輸穴", "五输穴", "桂枝湯", "桂枝汤", "太陽中風", "太阳中风", "少陰", "少阴", "黃連阿膠湯", "黄连阿胶汤"]) {
    const found = records.some((record) => JSON.stringify(record).includes(query));
    if (!found) errors.push(`搜尋索引缺少繁簡或別名查找詞：${query}`);
  }
}

const baziLessonHtml = fs.readFileSync(routeFile("/lessons/tianji/bazi/01-tiangan-dizhi/"), "utf8");
if (!baziLessonHtml.includes("five-element-visual") || !baziLessonHtml.includes("structured-lesson")) errors.push("八字基礎頁缺少結構化導讀或五行圖");
const heluoLessonHtml = fs.readFileSync(routeFile("/lessons/tianji/heluo/01-hetu-luoshu/"), "utf8");
if (!heluoLessonHtml.includes("heluo-visuals") || !heluoLessonHtml.includes("structured-lesson")) errors.push("河圖洛書頁缺少結構化導讀或數字圖");
const meridianLessonHtml = fs.readFileSync(routeFile("/lessons/renji/acupuncture/01-meridians/"), "utf8");
if (!meridianLessonHtml.includes("acupuncture-visual") || !meridianLessonHtml.includes("medical-boundary")) errors.push("十二正經頁缺少結構圖或醫療安全邊界");
const fiveShuLessonHtml = fs.readFileSync(routeFile("/lessons/renji/acupuncture/02-five-shu/"), "utf8");
if (!fiveShuLessonHtml.includes("acupuncture-visual") || !fiveShuLessonHtml.includes("十二正經 309 個標準穴位")) errors.push("五輸穴頁缺少結構圖或完整穴位導覽");
if (fiveShuLessonHtml.includes("回到易經導覽")) errors.push("人紀課程頁仍使用易經導覽假設");
const shanghanOverviewHtml = fs.readFileSync(routeFile("/lessons/renji/shanghan/01-overview/"), "utf8");
if (!shanghanOverviewHtml.includes("shanghan-visual") || !shanghanOverviewHtml.includes("同名不等於同一概念") || !shanghanOverviewHtml.includes("medical-boundary")) errors.push("傷寒六經總覽缺少分組圖、語意辨識或醫療安全邊界");
const shanghanFormulaHtml = fs.readFileSync(routeFile("/lessons/renji/shanghan/05-formula-links/"), "utf8");
if (!shanghanFormulaHtml.includes("formula-node") || !shanghanFormulaHtml.includes("二十九味共享藥材") || !shanghanFormulaHtml.includes("不提供個人診斷")) errors.push("傷寒方劑導讀缺少組成圖、共享藥材或安全說明");

if (errors.length) throw new Error(`公開頁驗證失敗：\n${errors.join("\n")}`);
console.log(JSON.stringify({ routes: expectedRoutes.length, searchIndex: entities.length + lessons.length, brokenLinks: 0, forbiddenPublicText: 0, singleH1: true, structuredVisualLessons: 6 }, null, 2));
