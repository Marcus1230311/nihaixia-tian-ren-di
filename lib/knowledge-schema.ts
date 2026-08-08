import { z } from "zod";

export const supportedLocales = ["zh-Hant", "zh-Hans"] as const;
export const entityTypes = ["course", "classic", "lesson", "trigram", "hexagram", "heavenly_stem", "earthly_branch", "element", "yin_yang", "ten_god", "direction", "meridian", "meridian_level", "organ", "acupoint", "point_category", "shanghan_channel", "condition", "syndrome", "concept", "formula", "herb"] as const;
export const nonLessonEntityTypes = ["course", "classic", "trigram", "hexagram", "heavenly_stem", "earthly_branch", "element", "yin_yang", "ten_god", "direction", "meridian", "meridian_level", "organ", "acupoint", "point_category", "shanghan_channel", "condition", "syndrome", "concept", "formula", "herb"] as const;
export const relationTypes = [
  "part_of",
  "belongs_to",
  "contains",
  "appears_in",
  "sourced_from",
  "contains_herb",
  "related_formula",
  "corresponds_to",
  "element_of",
  "upper_trigram",
  "lower_trigram",
  "related_to",
  "generates",
  "controls",
  "classified_as",
  "classically_associated_with",
] as const;
export const sourceCategories = ["nihaixia", "classical", "editorial", "reference", "derived"] as const;

export const localizedTextSchema = z.object({
  "zh-Hant": z.string().trim().min(1),
  "zh-Hans": z.string().trim().min(1).optional(),
}).strict();

export const localizedAliasesSchema = z.object({
  "zh-Hant": z.array(z.string().trim().min(1)).default([]),
  "zh-Hans": z.array(z.string().trim().min(1)).optional(),
}).strict();

const stableIdSchema = z.string().regex(
  /^[a-z][a-z0-9_-]*(?::[a-z0-9][a-z0-9_-]*)+$/,
  "IDs must be language-independent, namespaced, and stable",
);
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs must be URL-safe kebab-case");

export const sourceSchema = z.object({
  id: stableIdSchema,
  category: z.enum(sourceCategories),
  title: localizedTextSchema,
  work: localizedTextSchema.optional(),
  author: localizedTextSchema.optional(),
  page: z.string().trim().min(1).optional(),
  section: z.string().trim().min(1).optional(),
  chapter: z.string().trim().min(1).optional(),
  url: z.string().url().optional(),
  note: localizedTextSchema.optional(),
}).strict();

const metadataScalarSchema = z.union([z.string(), z.number(), z.boolean()]);
const metadataValueSchema = z.union([
  metadataScalarSchema,
  z.array(metadataScalarSchema),
  localizedTextSchema,
]);

const entityBase = {
  id: stableIdSchema,
  slug: slugSchema,
  labels: localizedTextSchema,
  descriptions: localizedTextSchema,
  aliases: localizedAliasesSchema,
  metadata: z.record(z.string(), metadataValueSchema).default({}),
  sourceIds: z.array(stableIdSchema).min(1),
  relatedLessonIds: z.array(stableIdSchema).default([]),
};

export const entitySchema = z.object({
  ...entityBase,
  type: z.enum(nonLessonEntityTypes),
}).strict();

export const lessonSchema = z.object({
  ...entityBase,
  type: z.literal("lesson"),
  courseId: stableIdSchema,
  moduleId: stableIdSchema,
  order: z.number().int().positive(),
  route: z.array(slugSchema).min(1),
  legacyPath: z.string().trim().min(1),
  relatedEntityIds: z.array(stableIdSchema).default([]),
}).strict();

export const knowledgeNodeSchema = z.union([lessonSchema, entitySchema]);

export const relationSchema = z.object({
  id: stableIdSchema,
  type: z.enum(relationTypes),
  from: stableIdSchema,
  to: stableIdSchema,
  sourceIds: z.array(stableIdSchema).default([]),
  notes: localizedTextSchema.optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
}).strict();

export const knowledgeGraphSchema = z.object({
  schemaVersion: z.literal("1.4.0"),
  sources: z.array(sourceSchema),
  entities: z.array(knowledgeNodeSchema),
  relations: z.array(relationSchema),
}).strict().superRefine((graph, context) => {
  const unique = (values: string[], label: string) => {
    const seen = new Set<string>();
    for (const value of values) {
      if (seen.has(value)) context.addIssue({ code: "custom", message: `Duplicate ${label}: ${value}` });
      seen.add(value);
    }
  };

  unique(graph.sources.map((source) => source.id), "source ID");
  unique(graph.entities.map((entity) => entity.id), "entity ID");
  unique(graph.entities.map((entity) => entity.slug), "entity slug");
  unique(graph.relations.map((relation) => relation.id), "relation ID");

  const sourceIds = new Set(graph.sources.map((source) => source.id));
  const nodes = new Map(graph.entities.map((entity) => [entity.id, entity]));
  const lessonIds = new Set(graph.entities.filter((entity) => entity.type === "lesson").map((entity) => entity.id));

  for (const entity of graph.entities) {
    for (const sourceId of entity.sourceIds) {
      if (!sourceIds.has(sourceId)) context.addIssue({ code: "custom", message: `${entity.id} references unknown source ${sourceId}` });
    }
    for (const lessonId of entity.relatedLessonIds) {
      if (!lessonIds.has(lessonId)) context.addIssue({ code: "custom", message: `${entity.id} references unknown related lesson ${lessonId}` });
    }
    if (entity.type === "lesson") {
      if (nodes.get(entity.courseId)?.type !== "course") context.addIssue({ code: "custom", message: `${entity.id} has invalid course ${entity.courseId}` });
      if (!nodes.has(entity.moduleId)) context.addIssue({ code: "custom", message: `${entity.id} has invalid module ${entity.moduleId}` });
      for (const relatedId of entity.relatedEntityIds) {
        if (!nodes.has(relatedId)) context.addIssue({ code: "custom", message: `${entity.id} references unknown entity ${relatedId}` });
      }
    }
  }

  for (const relation of graph.relations) {
    if (!nodes.has(relation.from)) context.addIssue({ code: "custom", message: `${relation.id} has unknown source node ${relation.from}` });
    if (!nodes.has(relation.to)) context.addIssue({ code: "custom", message: `${relation.id} has unknown target node ${relation.to}` });
    if (relation.from === relation.to) context.addIssue({ code: "custom", message: `${relation.id} cannot reference itself` });
    for (const sourceId of relation.sourceIds) {
      if (!sourceIds.has(sourceId)) context.addIssue({ code: "custom", message: `${relation.id} references unknown source ${sourceId}` });
    }
  }
});

export const searchRecordSchema = z.object({
  id: stableIdSchema,
  type: z.enum(entityTypes),
  typeLabels: localizedTextSchema,
  labels: localizedTextSchema,
  descriptions: localizedTextSchema,
  href: z.string().startsWith("/"),
  keywords: localizedAliasesSchema,
}).strict();

export type Locale = (typeof supportedLocales)[number];
export type LocalizedText = { "zh-Hant": string; "zh-Hans"?: string };
export type Source = z.infer<typeof sourceSchema>;
export type KnowledgeEntity = z.infer<typeof entitySchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type KnowledgeNode = z.infer<typeof knowledgeNodeSchema>;
export type KnowledgeRelation = z.infer<typeof relationSchema>;
export type KnowledgeGraph = z.infer<typeof knowledgeGraphSchema>;
export type SearchRecord = z.infer<typeof searchRecordSchema>;
