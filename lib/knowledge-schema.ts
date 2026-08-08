import { z } from "zod";

export const entityTypes = [
  "course", "lesson", "classic", "meridian", "acupoint", "organ",
  "formula", "herb", "syndrome", "hexagram", "trigram", "element",
  "heavenly_stem", "earthly_branch", "direction",
] as const;

export const relationTypes = [
  "part_of", "belongs_to", "contains", "appears_in", "sourced_from",
  "contains_herb", "related_formula", "corresponds_to", "element_of",
  "upper_trigram", "lower_trigram", "related_to",
] as const;

export const sourceSchema = z.object({
  kind: z.enum(["course_note", "classic_text", "editorial", "external"]),
  label: z.string().min(1),
  url: z.string().url().optional(),
});

export const entitySchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  type: z.enum(entityTypes),
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  description: z.string().min(1),
  sources: z.array(sourceSchema).min(1),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
});

export const relationSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  type: z.enum(relationTypes),
  from: z.string().min(1),
  to: z.string().min(1),
  note: z.string().optional(),
  sourceId: z.string().optional(),
});

export const lessonSchema = z.object({
  id: z.string().regex(/^lesson-[a-z0-9-]+$/),
  type: z.literal("lesson"),
  courseId: z.string().regex(/^course-[a-z0-9-]+$/),
  moduleId: z.string().min(1),
  order: z.number().int().positive(),
  title: z.string().min(1),
  summary: z.string().min(1),
  slug: z.array(z.string().min(1)).min(1),
  legacyPath: z.string().endsWith(".html"),
  sources: z.array(sourceSchema).min(1),
  entityIds: z.array(z.string()).default([]),
});

export const knowledgeGraphSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  lessons: z.array(lessonSchema),
  entities: z.array(entitySchema),
  relations: z.array(relationSchema),
}).superRefine((graph, context) => {
  const ids = new Set<string>();
  for (const item of [...graph.lessons, ...graph.entities]) {
    if (ids.has(item.id)) context.addIssue({ code: "custom", message: `重複 ID：${item.id}` });
    ids.add(item.id);
  }
  for (const relation of graph.relations) {
    if (!ids.has(relation.from)) context.addIssue({ code: "custom", message: `關係來源不存在：${relation.from}` });
    if (!ids.has(relation.to)) context.addIssue({ code: "custom", message: `關係目標不存在：${relation.to}` });
  }
});

export type KnowledgeEntity = z.infer<typeof entitySchema>;
export const searchRecordSchema = z.object({
  id: z.string().min(1),
  type: z.enum(entityTypes),
  title: z.string().min(1),
  summary: z.string().min(1),
  href: z.string().startsWith("/"),
  keywords: z.array(z.string()),
});

export type KnowledgeRelation = z.infer<typeof relationSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type KnowledgeGraph = z.infer<typeof knowledgeGraphSchema>;
