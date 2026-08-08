import fs from "node:fs";
import path from "node:path";
import { entities, lessons } from "../data/knowledge";
import { searchRecordSchema } from "../lib/knowledge-schema";
import { entityTypeLabels } from "../lib/presentation";
import { readLegacyArticle, stripHtml } from "../lib/v1-content";

const records = [
  ...lessons.map((lesson) => ({
    id: lesson.id,
    type: lesson.type,
    typeLabels: entityTypeLabels.lesson,
    labels: lesson.labels,
    descriptions: lesson.descriptions,
    href: `/lessons/${lesson.route.join("/")}/`,
    keywords: {
      "zh-Hant": [stripHtml(readLegacyArticle(lesson.legacyPath)).slice(0, 12000), lesson.moduleId, ...lesson.relatedEntityIds, ...lesson.aliases["zh-Hant"]],
      "zh-Hans": lesson.aliases["zh-Hans"] ?? [],
    },
  })),
  ...entities.map((entity) => ({
    id: entity.id,
    type: entity.type,
    typeLabels: entityTypeLabels[entity.type],
    labels: entity.labels,
    descriptions: entity.descriptions,
    href: `/entities/${entity.slug}/`,
    keywords: {
      "zh-Hant": [...entity.aliases["zh-Hant"], ...Object.values(entity.metadata).map((value) => typeof value === "object" && !Array.isArray(value) ? value["zh-Hant"] : String(value))],
      "zh-Hans": entity.aliases["zh-Hans"] ?? [],
    },
  })),
].map((record) => searchRecordSchema.parse(record));

const publicDir = path.resolve(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(records), "utf8");
console.log(`搜尋索引完成：${records.length} 筆。`);
