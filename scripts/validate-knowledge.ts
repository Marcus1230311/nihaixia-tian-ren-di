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
const meridians = graph.entities.filter((entity) => entity.type === "meridian");
const meridianLevels = graph.entities.filter((entity) => entity.type === "meridian_level");
const organs = graph.entities.filter((entity) => entity.type === "organ");
const acupoints = graph.entities.filter((entity) => entity.type === "acupoint");
const pointCategories = graph.entities.filter((entity) => entity.type === "point_category");
const shanghanChannels = graph.entities.filter((entity) => entity.type === "shanghan_channel");
const syndromes = graph.entities.filter((entity) => entity.type === "syndrome");
const formulas = graph.entities.filter((entity) => entity.type === "formula");
const herbs = graph.entities.filter((entity) => entity.type === "herb");
const shanghanLessons = graph.entities.filter((entity) => entity.type === "lesson" && entity.moduleId === "classic:shanghan-lun");
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
if (graph.entities.some((entity) => entity.id.startsWith("diji:"))) throw new Error("本里程碑不得開始地紀建模");

if (meridians.length !== 12) throw new Error(`十二正經數量應為 12，實際為 ${meridians.length}`);
if (organs.length !== 12) throw new Error(`針灸試點臟腑／系統數量應為 12，實際為 ${organs.length}`);
if (acupoints.length !== 309) throw new Error(`十二正經穴位數量應為 309，實際為 ${acupoints.length}`);
if (pointCategories.length !== 12) throw new Error(`針灸試點穴位分類數量應為 12，實際為 ${pointCategories.length}`);
if (meridianLevels.length !== 6) throw new Error(`經脈層級數量應為 6，實際為 ${meridianLevels.length}`);
if (graph.entities.some((entity) => /^(tcm|acupuncture):(element|yin-yang):/.test(entity.id))) throw new Error("針灸不得複製五行或陰陽條目");

const meridianIdSet = new Set(meridians.map((entity) => entity.id));
const categoryIdSet = new Set(pointCategories.map((entity) => entity.id));
for (const meridian of meridians) {
  const outgoing = graph.relations.filter((relation) => relation.from === meridian.id);
  if (outgoing.filter((relation) => relation.type === "corresponds_to" && relation.to.startsWith("organ:")).length !== 1) throw new Error(`${meridian.id} 必須對應唯一臟腑／系統`);
  if (outgoing.filter((relation) => relation.type === "corresponds_to" && relation.to.startsWith("meridian-level:")).length !== 1) throw new Error(`${meridian.id} 必須對應唯一經脈層級`);
  if (outgoing.filter((relation) => relation.type === "corresponds_to" && ["yin-yang:yin", "yin-yang:yang"].includes(relation.to)).length !== 1) throw new Error(`${meridian.id} 必須重用唯一陰陽條目`);
  const prefix = String(meridian.metadata.standardCode);
  const meridianPoints = acupoints.filter((point) => graph.relations.some((relation) => relation.type === "belongs_to" && relation.from === point.id && relation.to === meridian.id));
  const expectedCount = ({ LU: 11, LI: 20, ST: 45, SP: 21, HT: 9, SI: 19, BL: 67, KI: 27, PC: 9, TE: 23, GB: 44, LR: 14 } as Record<string, number>)[prefix];
  const sequences = meridianPoints.map((point) => Number(String(point.metadata.standardCode).match(/\d+$/)?.[0])).sort((a, b) => a - b);
  if (meridianPoints.length !== expectedCount || sequences.some((number, index) => number !== index + 1)) throw new Error(`${meridian.id} 穴位必須完整覆蓋 1–${expectedCount}`);
}

const shanghanClassic = graph.entities.find((entity) => entity.id === "classic:shanghan-lun");
if (shanghanClassic?.type !== "classic") throw new Error("《傷寒論》必須使用唯一 first-class classic 身份");
if (shanghanChannels.length !== 6) throw new Error(`傷寒診斷六經數量應為 6，實際為 ${shanghanChannels.length}`);
if (syndromes.length !== 12) throw new Error(`傷寒代表病證數量應為 12，實際為 ${syndromes.length}`);
if (formulas.length !== 11) throw new Error(`傷寒代表方數量應為 11，實際為 ${formulas.length}`);
if (herbs.length !== 29) throw new Error(`傷寒試點藥材數量應為 29，實際為 ${herbs.length}`);
if (shanghanLessons.length !== 5) throw new Error(`傷寒結構化導讀數量應為 5，實際為 ${shanghanLessons.length}`);

const expectedChannelIds = new Set(["taiyang", "yangming", "shaoyang", "taiyin", "shaoyin", "jueyin"].map((id) => `shanghan-channel:${id}`));
if (shanghanChannels.some((channel) => !expectedChannelIds.has(channel.id))) throw new Error("傷寒六經穩定 ID 集合不完整");
for (const channel of shanghanChannels) {
  const sameLabelMeridianLevel = meridianLevels.find((level) => level.labels["zh-Hant"] === channel.labels["zh-Hant"]);
  if (!sameLabelMeridianLevel || sameLabelMeridianLevel.id === channel.id) throw new Error(`${channel.id} 必須與同名針灸經脈層級保持不同身份`);
  if (channel.metadata.domainContext && localize(channel.metadata.domainContext as { "zh-Hant": string }) !== "傷寒六經辨證") throw new Error(`${channel.id} 語意領域不明確`);
}

const channelIdSet = new Set(shanghanChannels.map((entity) => entity.id));
const syndromeIdSet = new Set(syndromes.map((entity) => entity.id));
const herbIdSet = new Set(herbs.map((entity) => entity.id));
for (const syndrome of syndromes) {
  const memberships = graph.relations.filter((relation) => relation.from === syndrome.id && relation.type === "belongs_to" && channelIdSet.has(relation.to));
  if (memberships.length !== 1) throw new Error(`${syndrome.id} 必須隸屬唯一傷寒診斷六經`);
}
for (const subtype of ["severe", "moderate", "mild"]) {
  const id = `syndrome:yangming-bowel-${subtype}`;
  if (!graph.relations.some((relation) => relation.from === id && relation.to === "syndrome:yangming-bowel" && relation.type === "part_of")) throw new Error(`${id} 必須保留陽明腑證層次`);
}

const expectedIngredients: Record<string, string[]> = {
  "formula:guizhi-tang": ["guizhi", "shaoyao", "shengjiang", "dazao", "gancao"],
  "formula:mahuang-tang": ["mahuang", "guizhi", "xingren", "gancao"],
  "formula:baihu-tang": ["shigao", "zhimu", "gancao", "jingmi"],
  "formula:dachengqi-tang": ["dahuang", "houpo", "zhishi", "mangxiao"],
  "formula:xiaochengqi-tang": ["dahuang", "houpo", "zhishi"],
  "formula:tiaowei-chengqi-tang": ["dahuang", "mangxiao", "gancao"],
  "formula:xiaochaihu-tang": ["chaihu", "huangqin", "banxia", "shengjiang", "renshen", "dazao", "gancao"],
  "formula:lizhong-tang": ["renshen", "baizhu", "ganjiang", "gancao"],
  "formula:sini-tang": ["fuzi", "ganjiang", "gancao"],
  "formula:huanglian-ejiao-tang": ["huanglian", "huangqin", "shaoyao", "ejiao", "jizihuang"],
  "formula:wumei-wan": ["wumei", "xixin", "ganjiang", "huanglian", "danggui", "fuzi", "shujiao", "guizhi", "renshen", "huangbai"],
};
for (const formula of formulas) {
  const ingredientRelations = graph.relations.filter((relation) => relation.from === formula.id && relation.type === "contains_herb");
  const actual = ingredientRelations.map((relation) => relation.to).sort();
  const expected = (expectedIngredients[formula.id] ?? []).map((id) => `herb:${id}`).sort();
  if (actual.join("|") !== expected.join("|")) throw new Error(`${formula.id} 藥味組成與接受的試點來源資料不一致`);
  if (formula.metadata.ingredientCount !== expected.length) throw new Error(`${formula.id} ingredientCount 與關係數不一致`);
  if (ingredientRelations.some((relation) => !herbIdSet.has(relation.to))) throw new Error(`${formula.id} 組成關係必須只指向 herb`);
  const associations = graph.relations.filter((relation) => relation.from === formula.id && relation.type === "classically_associated_with" && syndromeIdSet.has(relation.to));
  if (associations.length !== 1) throw new Error(`${formula.id} 必須有唯一且明確的經典方證關聯`);
  if (!graph.relations.some((relation) => relation.from === formula.id && relation.to === "classic:shanghan-lun" && relation.type === "appears_in")) throw new Error(`${formula.id} 必須可追溯至《傷寒論》classic`);
}
const herbLabels = herbs.flatMap((herb) => [herb.labels["zh-Hant"], herb.labels["zh-Hans"]]).filter(Boolean);
if (new Set(herbLabels).size !== herbLabels.length - herbs.filter((herb) => herb.labels["zh-Hant"] === herb.labels["zh-Hans"]).length) throw new Error("試點藥材出現可避免的重複語意身份");
if (formulas.some((formula) => Object.keys(formula.metadata).some((key) => /dose|dosage|contraindication|recommendation/i.test(key)))) throw new Error("方劑 metadata 不得包含劑量、禁忌判斷或推薦欄位");
const shanghanNodeIds = new Set(["classic:shanghan-lun", ...shanghanChannels.map((entity) => entity.id), ...syndromes.map((entity) => entity.id), ...formulas.map((entity) => entity.id), ...herbs.map((entity) => entity.id), ...shanghanLessons.map((entity) => entity.id)]);
if (graph.entities.filter((entity) => shanghanNodeIds.has(entity.id)).some((entity) => entity.sourceIds.some((sourceId) => graph.sources.find((source) => source.id === sourceId)?.category === "nihaixia"))) throw new Error("無直接追溯依據的傷寒試點內容不得標為倪海廈講授資料");
for (const organ of organs) {
  const elementRelations = graph.relations.filter((relation) => relation.from === organ.id && relation.type === "element_of" && expectedElementIds.has(relation.to));
  if (elementRelations.length !== 1) throw new Error(`${organ.id} 必須重用唯一五行條目`);
}
for (const point of acupoints) {
  const outgoing = graph.relations.filter((relation) => relation.from === point.id);
  const memberships = outgoing.filter((relation) => relation.type === "belongs_to" && meridianIdSet.has(relation.to));
  if (memberships.length !== 1) throw new Error(`${point.id} 必須隸屬唯一有效十二正經`);
  if (outgoing.some((relation) => relation.type === "classified_as" && !categoryIdSet.has(relation.to))) throw new Error(`${point.id} 使用無效穴位分類`);
  if (["coordinates", "bodyCoordinates", "meridianPath"].some((key) => key in point.metadata)) throw new Error(`${point.id} 不得提前加入解剖座標欄位`);
}

const fiveShuCategoryIds = new Set(["point-category:well", "point-category:spring", "point-category:stream", "point-category:river", "point-category:sea"]);
const expectedFiveShuElements = {
  yin: { well: "wood", spring: "fire", stream: "earth", river: "metal", sea: "water" },
  yang: { well: "metal", spring: "water", stream: "wood", river: "fire", sea: "earth" },
} as const;
for (const point of acupoints) {
  const outgoing = graph.relations.filter((relation) => relation.from === point.id);
  const fiveShu = outgoing.filter((relation) => relation.type === "classified_as" && fiveShuCategoryIds.has(relation.to));
  if (!fiveShu.length) continue;
  if (fiveShu.length !== 1) throw new Error(`${point.id} 不得同時使用多個五輸分類`);
  const meridianId = outgoing.find((relation) => relation.type === "belongs_to")?.to;
  const polarity = graph.relations.find((relation) => relation.from === meridianId && relation.type === "corresponds_to" && relation.to.startsWith("yin-yang:"))?.to.split(":").at(-1) as "yin" | "yang" | undefined;
  const category = fiveShu[0].to.split(":").at(-1) as keyof typeof expectedFiveShuElements.yin;
  const expectedElement = polarity ? `element:${expectedFiveShuElements[polarity][category]}` : null;
  const elementRelations = outgoing.filter((relation) => relation.type === "element_of" && expectedElementIds.has(relation.to));
  if (!expectedElement || elementRelations.length !== 1 || elementRelations[0].to !== expectedElement) throw new Error(`${point.id} 五輸五行配屬不符合陰陽經結構`);
}
for (const meridian of meridians) {
  const meridianPointIds = new Set(graph.relations.filter((relation) => relation.type === "belongs_to" && relation.to === meridian.id).map((relation) => relation.from));
  const fiveShuCount = graph.relations.filter((relation) => relation.type === "classified_as" && meridianPointIds.has(relation.from) && fiveShuCategoryIds.has(relation.to)).length;
  if (fiveShuCount !== 5) throw new Error(`${meridian.id} 必須完整提供 5 個五輸穴，實際為 ${fiveShuCount}`);
}

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
  meridians: meridians.length,
  meridianLevels: meridianLevels.length,
  organs: organs.length,
  acupoints: acupoints.length,
  pointCategories: pointCategories.length,
  shanghanChannels: shanghanChannels.length,
  syndromes: syndromes.length,
  formulas: formulas.length,
  herbs: herbs.length,
  relations: graph.relations.length,
  legacySourcesPresent: lessons.length,
}, null, 2));
