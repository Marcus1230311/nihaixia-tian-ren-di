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
  "shanghan_channel", "condition", "syndrome", "classically_associated_with",
  "herb_nature", "herb_flavor", "herb_grade", "has_nature", "has_flavor", "has_tropism",
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
  for (const query of ["甲", "伤官", "河图", "洛书", "北方", "太衝", "太冲", "肝經", "肝经", "原穴", "五輸穴", "五输穴", "桂枝湯", "桂枝汤", "太陽中風", "太阳中风", "少陰", "少阴", "黃連阿膠湯", "黄连阿胶汤", "金匱要略", "金匮要略", "黃耆桂枝五物湯", "黄芪桂枝五物汤", "婦人臟躁證", "妇人脏躁证", "茯苓", "泽泻", "神農本草經", "神农本草经", "微寒", "辛", "歸經", "归经", "大棗", "大枣"]) {
    const found = records.some((record) => JSON.stringify(record).includes(query));
    if (!found) errors.push(`搜尋索引缺少繁簡或別名查找詞：${query}`);
  }
  if (records.filter((record) => JSON.stringify(record).includes("formula:guizhi-tang")).length < 1) errors.push("搜尋索引缺少桂枝湯 canonical identity");
  if (records.filter((record: { labels: Record<string, string> }) => record.labels["zh-Hant"] === "桂枝湯").length !== 1) errors.push("跨經典桂枝湯搜尋結果必須只有一個 canonical 方劑條目");
}

const baziLessonHtml = fs.readFileSync(routeFile("/lessons/tianji/bazi/01-tiangan-dizhi/"), "utf8");
const homeHtml = fs.readFileSync(routeFile("/"), "utf8");
if (!homeHtml.includes('/lessons/renji/bencao/01-overview/') || !homeHtml.includes("研讀本草性味") || !textContent(homeHtml).includes("5 種藥性")) errors.push("首頁缺少本草導讀入口或屬性規模說明");
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
const jinguiOverviewHtml = fs.readFileSync(routeFile("/lessons/renji/jingui/01-overview/"), "utf8");
if (!jinguiOverviewHtml.includes("jingui-visual") || !jinguiOverviewHtml.includes("病類不是病證") || !jinguiOverviewHtml.includes("medical-boundary")) errors.push("金匱總覽缺少病類分層圖、語意辨識或醫療安全邊界");
const jinguiCrossClassicHtml = fs.readFileSync(routeFile("/lessons/renji/jingui/05-cross-classic/"), "utf8");
if (!jinguiCrossClassicHtml.includes("cross-classic-visual") || !jinguiCrossClassicHtml.includes("十五張方") || !jinguiCrossClassicHtml.includes("三十四味共享藥材")) errors.push("金匱跨經典導讀缺少身份圖或方藥重用報告");
const guizhiFormulaHtml = fs.readFileSync(routeFile("/entities/formula-guizhi-tang/"), "utf8");
if (!guizhiFormulaHtml.includes("傷寒論") || !guizhiFormulaHtml.includes("金匱要略") || !guizhiFormulaHtml.includes("證據：") || !guizhiFormulaHtml.includes("方劑組成與經典語境")) errors.push("桂枝湯公開頁未完整呈現跨經典語境與關係證據");
const bencaoOverviewHtml = fs.readFileSync(routeFile("/lessons/renji/bencao/01-overview/"), "utf8");
if (!bencaoOverviewHtml.includes("bencao-visual") || !bencaoOverviewHtml.includes("二十四味受控範圍") || !bencaoOverviewHtml.includes("medical-boundary")) errors.push("本草總覽缺少屬性模型、受控藥材或安全邊界");
const bencaoTropismHtml = fs.readFileSync(routeFile("/lessons/renji/bencao/04-tropism/"), "utf8");
if (!bencaoTropismHtml.includes("cross-domain-visual") || !bencaoTropismHtml.includes("歸經不是穴位")) errors.push("本草歸經頁缺少跨域圖或語意區分");
const renshenHtml = fs.readFileSync(routeFile("/entities/herb-renshen/"), "utf8");
if (!renshenHtml.includes("性味、歸經與經典方劑") || !renshenHtml.includes("香港浸會大學") || !renshenHtml.includes("神農本草經") || !renshenHtml.includes("未列警示不表示安全")) errors.push("人參頁未完整呈現屬性衝突、來源或安全邊界");
const guidedRoutes = [
  "/entities/element-wood/", "/entities/organ-liver/", "/entities/meridian-liver/", "/entities/acupoint-lr-03/",
  "/lessons/renji/shanghan/01-overview/", "/entities/shanghan-channel-taiyang/", "/entities/syndrome-taiyang-zhongfeng/",
  "/entities/formula-guizhi-tang/", "/entities/herb-guizhi/",
];
for (const route of guidedRoutes) {
  const html = fs.readFileSync(routeFile(route), "utf8");
  if (!html.includes("guided-learning") || !html.includes("Knowledge Context") || !html.includes("建議下一個研讀概念") || !html.includes('aria-current="step"')) errors.push(`${route} 缺少完整 Teaching Layer 導讀`);
}
const taiyangHtml = fs.readFileSync(routeFile("/entities/shanghan-channel-taiyang/"), "utf8");
if (!taiyangHtml.includes("針灸命名層級的太陽") || !taiyangHtml.includes("傷寒六經的太陽") || !taiyangHtml.includes("所屬系統") || !taiyangHtml.includes("知識角色")) errors.push("傷寒太陽頁缺少同名概念混淆解析");
const guizhiHerbHtml = fs.readFileSync(routeFile("/entities/herb-guizhi/"), "utf8");
if (!guizhiHerbHtml.includes("Golden Journey C") || !guizhiHerbHtml.includes("查看本段依據") || !guizhiHerbHtml.includes("深入理解")) errors.push("桂枝頁缺少跨語境樞紐與漸進揭露");

if (errors.length) throw new Error(`公開頁驗證失敗：\n${errors.join("\n")}`);
console.log(JSON.stringify({ routes: expectedRoutes.length, searchIndex: entities.length + lessons.length, brokenLinks: 0, forbiddenPublicText: 0, singleH1: true, structuredVisualLessons: 14 }, null, 2));
