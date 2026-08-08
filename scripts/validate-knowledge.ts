import fs from "node:fs";
import path from "node:path";
import { knowledgeGraph } from "../data/knowledge";
import { entityTypes, knowledgeGraphSchema, relationTypes, sourceCategories } from "../lib/knowledge-schema";
import { entityTypeLabels, localize, relationTypeLabels, sourceCategoryLabels } from "../lib/presentation";

const graph = knowledgeGraphSchema.parse(knowledgeGraph);
const lessons = graph.entities.filter((entity) => entity.type === "lesson");
const trigrams = graph.entities.filter((entity) => entity.type === "trigram");
const hexagrams = graph.entities.filter((entity) => entity.type === "hexagram");
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
  relations: graph.relations.length,
  legacySourcesPresent: lessons.length,
}, null, 2));
