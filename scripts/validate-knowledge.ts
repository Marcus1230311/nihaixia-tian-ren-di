import fs from "node:fs";
import path from "node:path";
import { knowledgeGraph } from "../data/knowledge";
import { entityTypes, knowledgeGraphSchema, relationTypes, sourceCategories } from "../lib/knowledge-schema";
import { entityTypeLabels, localize, relationTypeLabels, sourceCategoryLabels } from "../lib/presentation";

const graph = knowledgeGraphSchema.parse(knowledgeGraph);
const lessons = graph.entities.filter((entity) => entity.type === "lesson");
const trigrams = graph.entities.filter((entity) => entity.type === "trigram");
const hexagrams = graph.entities.filter((entity) => entity.type === "hexagram");
const heavenlyStems = graph.entities.filter((entity) => entity.type === "heavenly_stem");
const earthlyBranches = graph.entities.filter((entity) => entity.type === "earthly_branch");
const elements = graph.entities.filter((entity) => entity.type === "element");
const yinYang = graph.entities.filter((entity) => entity.type === "yin_yang");
const tenGods = graph.entities.filter((entity) => entity.type === "ten_god");
const directions = graph.entities.filter((entity) => entity.type === "direction");
const heluoNumbers = graph.entities.filter((entity) => entity.id.startsWith("heluo:number:"));
const missingLegacy = lessons.filter((lesson) => !fs.existsSync(path.resolve(process.cwd(), lesson.legacyPath)));
if (missingLegacy.length) throw new Error(`缺少既有內容來源：${missingLegacy.map((lesson) => lesson.legacyPath).join("、")}`);

if (localize({ "zh-Hant": "繁體回退" }, "zh-Hans") !== "繁體回退") throw new Error("zh-Hans 缺值時未安全回退至 zh-Hant");
for (const type of entityTypes) if (!entityTypeLabels[type]) throw new Error(`缺少 entity 展示名稱：${type}`);
for (const type of relationTypes) if (!relationTypeLabels[type]) throw new Error(`缺少 relation 展示名稱：${type}`);
for (const category of sourceCategories) if (!sourceCategoryLabels[category]) throw new Error(`缺少 source 展示名稱：${category}`);

const expectedTrigramIds = ["trigram:qian", "trigram:kun", "trigram:zhen", "trigram:xun", "trigram:kan", "trigram:li", "trigram:gen", "trigram:dui"];
if (trigrams.length !== 8) throw new Error(`八卦數量應為 8，實際為 ${trigrams.length}`);
if (expectedTrigramIds.some((id) => !trigrams.some((entity) => entity.id === id))) throw new Error("八卦穩定 ID 集合不完整");
if (hexagrams.length !== 64) throw new Error(`六十四卦數量應為 64，實際為 ${hexagrams.length}`);
for (const entity of [...trigrams, ...hexagrams]) {
  if (!entity.labels["zh-Hant"] || !entity.labels["zh-Hans"]) throw new Error(`${entity.id} 必須同時提供繁體與簡體標籤`);
}

const trigramPatterns = new Map<string, string>();
for (const trigram of trigrams) {
  const pattern = trigram.metadata.linePattern;
  if (typeof pattern !== "string" || !/^[01]{3}$/.test(pattern)) throw new Error(`${trigram.id} 必須有三爻陰陽結構`);
  trigramPatterns.set(trigram.id, pattern);
}

const hexagramNumbers = new Set<number>();
for (const hexagram of hexagrams) {
  const number = hexagram.metadata.hexagramNumber;
  const pattern = hexagram.metadata.linePattern;
  const upperTrigramId = hexagram.metadata.upperTrigramId;
  const lowerTrigramId = hexagram.metadata.lowerTrigramId;
  if (typeof number !== "number" || !Number.isInteger(number)) throw new Error(`${hexagram.id} 缺少有效卦序`);
  if (hexagramNumbers.has(number)) throw new Error(`重複卦序：${number}`);
  hexagramNumbers.add(number);
  if (typeof pattern !== "string" || !/^[01]{6}$/.test(pattern)) throw new Error(`${hexagram.id} 必須有六爻陰陽結構`);
  if (typeof upperTrigramId !== "string" || !trigramPatterns.has(upperTrigramId)) throw new Error(`${hexagram.id} 上卦無法解析`);
  if (typeof lowerTrigramId !== "string" || !trigramPatterns.has(lowerTrigramId)) throw new Error(`${hexagram.id} 下卦無法解析`);
  const expectedPattern = `${trigramPatterns.get(lowerTrigramId)}${trigramPatterns.get(upperTrigramId)}`;
  if (pattern !== expectedPattern) throw new Error(`${hexagram.id} 六爻結構與上下卦不一致：${pattern} !== ${expectedPattern}`);

  const upperRelations = graph.relations.filter((relation) => relation.from === hexagram.id && relation.type === "upper_trigram");
  const lowerRelations = graph.relations.filter((relation) => relation.from === hexagram.id && relation.type === "lower_trigram");
  if (upperRelations.length !== 1 || upperRelations[0].to !== upperTrigramId) throw new Error(`${hexagram.id} 上卦關係必須唯一且與資料一致`);
  if (lowerRelations.length !== 1 || lowerRelations[0].to !== lowerTrigramId) throw new Error(`${hexagram.id} 下卦關係必須唯一且與資料一致`);
}

const expectedNumbers = Array.from({ length: 64 }, (_, index) => index + 1);
if (expectedNumbers.some((number) => !hexagramNumbers.has(number))) throw new Error("卦序必須完整覆蓋 1–64");

if (heavenlyStems.length !== 10) throw new Error(`天干數量應為 10，實際為 ${heavenlyStems.length}`);
if (earthlyBranches.length !== 12) throw new Error(`地支數量應為 12，實際為 ${earthlyBranches.length}`);
if (elements.length !== 5) throw new Error(`共用五行數量應為 5，實際為 ${elements.length}`);
if (yinYang.length !== 2) throw new Error(`共用陰陽數量應為 2，實際為 ${yinYang.length}`);
if (tenGods.length !== 10) throw new Error(`十神數量應為 10，實際為 ${tenGods.length}`);
if (directions.length !== 9) throw new Error(`河洛所需方位數量應為 9，實際為 ${directions.length}`);
if (heluoNumbers.length !== 10) throw new Error(`河洛語意數字數量應為 10，實際為 ${heluoNumbers.length}`);

const expectedElementIds = new Set(["element:wood", "element:fire", "element:earth", "element:metal", "element:water"]);
if (elements.some((entity) => !expectedElementIds.has(entity.id)) || expectedElementIds.size !== elements.length) throw new Error("五行必須使用唯一的跨領域穩定 ID");
if (graph.entities.some((entity) => /^(bazi|yijing|heluo):element:/.test(entity.id))) throw new Error("不得建立模組專用的重複五行條目");

for (const entity of [...heavenlyStems, ...earthlyBranches]) {
  const elementRelations = graph.relations.filter((relation) => relation.from === entity.id && relation.type === "element_of" && expectedElementIds.has(relation.to));
  const polarityRelations = graph.relations.filter((relation) => relation.from === entity.id && relation.type === "corresponds_to" && ["yin-yang:yin", "yin-yang:yang"].includes(relation.to));
  if (elementRelations.length !== 1) throw new Error(`${entity.id} 必須有唯一且有效的五行關係`);
  if (polarityRelations.length !== 1) throw new Error(`${entity.id} 必須有唯一且有效的陰陽關係`);
}

const expectedTenGodLabels = new Set(["比肩", "劫財", "食神", "傷官", "偏財", "正財", "七殺", "正官", "偏印", "正印"]);
if (tenGods.some((entity) => !expectedTenGodLabels.has(entity.labels["zh-Hant"]))) throw new Error("十神標籤集合不完整");
if (!tenGods.find((entity) => entity.id === "ten-god:qisha")?.aliases["zh-Hant"].includes("偏官")) throw new Error("七殺必須一致處理偏官別名");
if (!tenGods.find((entity) => entity.id === "ten-god:pianyin")?.aliases["zh-Hant"].includes("梟神")) throw new Error("偏印必須一致處理梟神別名");

if (graph.relations.filter((relation) => relation.type === "generates").length !== 5) throw new Error("五行相生關係應恰為 5 條");
if (graph.relations.filter((relation) => relation.type === "controls").length !== 5) throw new Error("五行相剋關係應恰為 5 條");
for (const number of heluoNumbers) {
  const relations = graph.relations.filter((relation) => relation.from === number.id);
  if (!relations.some((relation) => relation.type === "part_of" && relation.to === "concept:hetu")) throw new Error(`${number.id} 必須屬於河圖語意系統`);
  if (!relations.some((relation) => relation.type === "element_of" && expectedElementIds.has(relation.to))) throw new Error(`${number.id} 缺少五行對應`);
  if (!relations.some((relation) => relation.type === "corresponds_to" && relation.to.startsWith("direction:"))) throw new Error(`${number.id} 缺少方位對應`);
}
if (!graph.entities.some((entity) => entity.id === "concept:hetu") || !graph.entities.some((entity) => entity.id === "concept:luoshu")) throw new Error("河圖與洛書必須各有第一級條目");
if (graph.entities.some((entity) => entity.id.startsWith("renji:") || entity.id.startsWith("diji:"))) throw new Error("本里程碑不得開始人紀或地紀建模");

const relationTriples = new Set<string>();
for (const relation of graph.relations) {
  const triple = `${relation.type}|${relation.from}|${relation.to}`;
  if (relationTriples.has(triple)) throw new Error(`重複關係記錄：${triple}`);
  relationTriples.add(triple);
}

console.log(JSON.stringify({
  schemaVersion: graph.schemaVersion,
  sources: graph.sources.length,
  lessons: lessons.length,
  entities: graph.entities.length,
  trigrams: trigrams.length,
  hexagrams: hexagrams.length,
  heavenlyStems: heavenlyStems.length,
  earthlyBranches: earthlyBranches.length,
  elements: elements.length,
  yinYang: yinYang.length,
  tenGods: tenGods.length,
  directions: directions.length,
  heluoNumbers: heluoNumbers.length,
  relations: graph.relations.length,
  legacySourcesPresent: lessons.length,
}, null, 2));
