import fs from "node:fs";
import path from "node:path";
import { entities, lessons, relations } from "../data/knowledge";
import { searchRecordSchema } from "../lib/knowledge-schema";
import { entityTypeLabels, localize } from "../lib/presentation";
import { readLegacyArticle, stripHtml } from "../lib/v1-content";

function metadataKeywords(metadata: Record<string, unknown>, locale: "zh-Hant" | "zh-Hans") {
  return Object.values(metadata).flatMap((value) => {
    if (Array.isArray(value)) return value.map(String);
    if (value && typeof value === "object") {
      const localized = value as { "zh-Hant"?: string; "zh-Hans"?: string };
      return [localized[locale] ?? localized["zh-Hant"]].filter((item): item is string => Boolean(item));
    }
    return [String(value)];
  });
}

const records = [
  ...lessons.map((lesson) => ({
    id: lesson.id,
    type: lesson.type,
    typeLabels: entityTypeLabels.lesson,
    labels: lesson.labels,
    descriptions: lesson.descriptions,
    href: `/lessons/${lesson.route.join("/")}/`,
    keywords: {
      "zh-Hant": [...(lesson.route[1] === "yijing" ? [stripHtml(readLegacyArticle(lesson.legacyPath)).slice(0, 12000)] : []), lesson.moduleId, ...lesson.relatedEntityIds, ...lesson.aliases["zh-Hant"]],
      "zh-Hans": lesson.aliases["zh-Hans"] ?? [],
    },
  })),
  ...entities.map((entity) => {
    const relatedLessons = entity.relatedLessonIds.map((lessonId) => lessons.find((lesson) => lesson.id === lessonId)).filter((lesson) => lesson !== undefined);
    const relatedMeridians = relations
      .filter((relation) => relation.from === entity.id && relation.type === "belongs_to")
      .map((relation) => entities.find((candidate) => candidate.id === relation.to))
      .filter((candidate): candidate is NonNullable<typeof candidate> => candidate?.type === "meridian");
    const relatedKnowledge = relations
      .filter((relation) => relation.from === entity.id || relation.to === entity.id)
      .map((relation) => entities.find((candidate) => candidate.id === (relation.from === entity.id ? relation.to : relation.from)))
      .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== undefined && ["shanghan_channel", "condition", "syndrome", "formula", "herb", "classic", "organ", "herb_nature", "herb_flavor", "herb_grade"].includes(candidate.type));
    return {
      id: entity.id,
      type: entity.type,
      typeLabels: entityTypeLabels[entity.type],
      labels: entity.labels,
      descriptions: entity.descriptions,
      href: `/entities/${entity.slug}/`,
      keywords: {
        "zh-Hant": [
          ...entity.aliases["zh-Hant"],
          ...metadataKeywords(entity.metadata, "zh-Hant"),
          ...relatedLessons.map((lesson) => localize(lesson.labels)),
          ...relatedMeridians.flatMap((meridian) => [localize(meridian.labels), ...meridian.aliases["zh-Hant"]]),
          ...relatedKnowledge.flatMap((candidate) => [localize(candidate.labels), ...candidate.aliases["zh-Hant"]]),
        ],
        "zh-Hans": [
          ...(entity.aliases["zh-Hans"] ?? []),
          ...metadataKeywords(entity.metadata, "zh-Hans"),
          ...relatedLessons.map((lesson) => localize(lesson.labels, "zh-Hans")),
          ...relatedMeridians.flatMap((meridian) => [localize(meridian.labels, "zh-Hans"), ...(meridian.aliases["zh-Hans"] ?? [])]),
          ...relatedKnowledge.flatMap((candidate) => [localize(candidate.labels, "zh-Hans"), ...(candidate.aliases["zh-Hans"] ?? [])]),
        ],
      },
    };
  }),
].map((record) => searchRecordSchema.parse(record));

const publicDir = path.resolve(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(records), "utf8");
console.log(`搜尋索引完成：${records.length} 筆。`);
