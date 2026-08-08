import fs from "node:fs";
import path from "node:path";
import { entities, lessons } from "../data/knowledge";
import { searchRecordSchema } from "../lib/knowledge-schema";
import { readLegacyArticle, stripHtml } from "../lib/v1-content";

const records = [
  ...lessons.map((lesson) => ({ id: lesson.id, type: lesson.type, title: lesson.title, summary: lesson.summary, href: `/lessons/${lesson.slug.join("/")}/`, keywords: [stripHtml(readLegacyArticle(lesson.legacyPath)).slice(0, 12000), lesson.moduleId, ...lesson.entityIds] })),
  ...entities.map((entity) => ({ id: entity.id, type: entity.type, title: entity.name, summary: entity.description, href: `/entities/${entity.id}/`, keywords: [...entity.aliases, ...Object.values(entity.metadata).map(String)] })),
].map((record) => searchRecordSchema.parse(record));

const publicDir = path.resolve(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(records), "utf8");
console.log(`搜尋索引完成：${records.length} 筆。`);
