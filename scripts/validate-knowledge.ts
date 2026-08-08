import fs from "node:fs";
import path from "node:path";
import { knowledgeGraph } from "../data/knowledge";
import { knowledgeGraphSchema } from "../lib/knowledge-schema";

const graph = knowledgeGraphSchema.parse(knowledgeGraph);
const missingLegacy = graph.lessons.filter((lesson) => !fs.existsSync(path.resolve(process.cwd(), lesson.legacyPath)));
if (missingLegacy.length) throw new Error(`缺少 V1 來源：${missingLegacy.map((lesson) => lesson.legacyPath).join("、")}`);

const relationIds = new Set<string>();
for (const relation of graph.relations) {
  if (relationIds.has(relation.id)) throw new Error(`重複關係 ID：${relation.id}`);
  relationIds.add(relation.id);
}

console.log(JSON.stringify({ schemaVersion: graph.schemaVersion, lessons: graph.lessons.length, entities: graph.entities.length, relations: graph.relations.length, legacySourcesPresent: graph.lessons.length }, null, 2));
