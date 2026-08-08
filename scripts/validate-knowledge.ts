import fs from "node:fs";
import path from "node:path";
import { knowledgeGraph } from "../data/knowledge";
import { entityTypes, knowledgeGraphSchema, relationTypes, sourceCategories } from "../lib/knowledge-schema";
import { entityTypeLabels, localize, relationTypeLabels, sourceCategoryLabels } from "../lib/presentation";

const graph = knowledgeGraphSchema.parse(knowledgeGraph);
const lessons = graph.entities.filter((entity) => entity.type === "lesson");
const missingLegacy = lessons.filter((lesson) => !fs.existsSync(path.resolve(process.cwd(), lesson.legacyPath)));
if (missingLegacy.length) throw new Error(`缺少既有內容來源：${missingLegacy.map((lesson) => lesson.legacyPath).join("、")}`);

if (localize({ "zh-Hant": "繁體回退" }, "zh-Hans") !== "繁體回退") throw new Error("zh-Hans 缺值時未安全回退至 zh-Hant");
for (const type of entityTypes) if (!entityTypeLabels[type]) throw new Error(`缺少 entity 展示名稱：${type}`);
for (const type of relationTypes) if (!relationTypeLabels[type]) throw new Error(`缺少 relation 展示名稱：${type}`);
for (const category of sourceCategories) if (!sourceCategoryLabels[category]) throw new Error(`缺少 source 展示名稱：${category}`);

console.log(JSON.stringify({
  schemaVersion: graph.schemaVersion,
  sources: graph.sources.length,
  lessons: lessons.length,
  entities: graph.entities.length,
  relations: graph.relations.length,
  legacySourcesPresent: lessons.length,
}, null, 2));
