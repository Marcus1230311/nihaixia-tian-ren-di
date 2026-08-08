import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();

export const sourceLocatorSchema = z.object({
  sourceId: z.string().trim().min(1),
  sourceTitle: optionalText,
  page: optionalText,
  chapter: optionalText,
  section: optionalText,
  heading: optionalText,
  sourceUrl: z.string().url().optional(),
  localFile: optionalText,
  note: optionalText,
}).strict();

export const importRecordSchema = z.object({
  sourceKey: z.string().trim().min(1),
  canonicalNameHant: z.string().trim().min(1),
  canonicalNameHans: z.string().trim().min(1),
  standardCode: z.string().trim().min(1),
  meridianId: z.string().trim().min(1),
  aliasesHant: z.array(z.string()).default([]),
  aliasesHans: z.array(z.string()).default([]),
  sequenceNumber: z.number().int().positive(),
  locationSummary: z.object({ "zh-Hant": z.string().trim().min(1), "zh-Hans": optionalText }).strict().optional(),
  pointCategories: z.array(z.string()).default([]),
  elementId: optionalText,
  relatedLessonIds: z.array(z.string()).min(1),
  sourceIds: z.array(z.string()).min(1),
  relationSourceIds: z.object({
    membership: z.array(z.string()).min(1),
    category: z.array(z.string()).min(1),
    fiveShu: z.array(z.string()).min(1),
  }).strict(),
  sourceLocator: z.array(sourceLocatorSchema).min(1),
  notes: optionalText,
  status: z.enum(["draft", "review", "accepted", "blocked"]).default("review"),
}).strict();

export const importDefaultsSchema = importRecordSchema.omit({
  sourceKey: true,
  canonicalNameHant: true,
  canonicalNameHans: true,
  standardCode: true,
  meridianId: true,
  sequenceNumber: true,
}).partial();

export const importDocumentSchema = z.object({
  formatVersion: z.literal("1.0"),
  defaults: importDefaultsSchema.optional(),
  records: z.array(z.record(z.string(), z.unknown())),
}).strict();

export type AcupointImportRecord = z.infer<typeof importRecordSchema>;
export type SourceLocator = z.infer<typeof sourceLocatorSchema>;

export type IssueSeverity = "error" | "warning";
export type IngestionIssue = {
  severity: IssueSeverity;
  code: string;
  message: string;
  field?: string;
};

export type RecordResult = {
  sourceKey: string;
  status: "valid" | "invalid" | "duplicate" | "conflict";
  entityId: string | null;
  standardCode: string | null;
  issues: IngestionIssue[];
  normalizations: string[];
};

export type IngestionReport = {
  reportVersion: "1.0";
  schemaVersion: "1.2.0";
  inputFile: string;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicate: number;
    conflict: number;
    errors: number;
    warnings: number;
    unresolvedSource: number;
    unresolvedMeridian: number;
    unresolvedCategory: number;
    normalizationWarnings: number;
  };
  records: RecordResult[];
  reconciliation: {
    checked: number;
    equivalent: number;
    mismatched: number;
    differences: string[];
  };
};
