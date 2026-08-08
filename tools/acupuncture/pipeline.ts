import fs from "node:fs";
import path from "node:path";
import { entities, lessons, relations, sources } from "../../data/knowledge";
import { entitySchema, relationSchema, type KnowledgeEntity, type KnowledgeRelation } from "../../lib/knowledge-schema";
import {
  importDocumentSchema,
  importRecordSchema,
  type AcupointImportRecord,
  type IngestionIssue,
  type IngestionReport,
  type RecordResult,
} from "./ingestion-schema";
import {
  categoryAliases,
  elementAliases,
  fiveShuCategoryIds,
  meridianAliases,
  meridianCodePrefixes,
  normalizeCode,
  normalizeWhitespace,
  stablePointId,
} from "./normalization";

const root = path.resolve(import.meta.dirname, "../..");
const meridianOrder = Object.keys(meridianCodePrefixes);
const fiveShuOrder = ["point-category:well", "point-category:spring", "point-category:stream", "point-category:river", "point-category:sea"];
const expectedFiveShuElements = {
  yin: ["element:wood", "element:fire", "element:earth", "element:metal", "element:water"],
  yang: ["element:metal", "element:water", "element:wood", "element:fire", "element:earth"],
} as const;

export type GeneratedAcupunctureData = {
  formatVersion: "1.0";
  schemaVersion: "1.2.0";
  generator: "tools/acupuncture/pipeline.ts";
  inputFile: string;
  entities: KnowledgeEntity[];
  relations: KnowledgeRelation[];
};

type NormalizedRecord = AcupointImportRecord & { stableId: string | null };
type PipelineResult = { generated: GeneratedAcupunctureData; report: IngestionReport; markdown: string };

function list(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  return value.split("|").map((item) => item.trim()).filter(Boolean);
}

export function parseDelimited(text: string, delimiter: "," | "\t") {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  if (quoted) throw new Error("Unclosed quoted field in delimited input");
  const [headers, ...body] = rows.filter((candidate) => candidate.some((cell) => cell.trim()));
  if (!headers) return [];
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header.trim(), cells[index] ?? ""])));
}

function delimitedRecord(row: Record<string, string>) {
  const json = (key: string, fallback: unknown) => {
    if (!row[key]?.trim()) return fallback;
    try { return JSON.parse(row[key]); } catch { return fallback; }
  };
  return {
    ...row,
    sequenceNumber: Number(row.sequenceNumber),
    aliasesHant: list(row.aliasesHant), aliasesHans: list(row.aliasesHans),
    pointCategories: list(row.pointCategories), relatedLessonIds: list(row.relatedLessonIds), sourceIds: list(row.sourceIds),
    locationSummary: json("locationSummary", undefined), relationSourceIds: json("relationSourceIds", undefined),
    sourceLocator: json("sourceLocator", []),
    elementId: row.elementId || undefined, notes: row.notes || undefined,
  };
}

export function loadImport(inputPath: string): unknown[] {
  const extension = path.extname(inputPath).toLowerCase();
  const text = fs.readFileSync(inputPath, "utf8");
  if (extension === ".csv" || extension === ".tsv") return parseDelimited(text, extension === ".csv" ? "," : "\t").map(delimitedRecord);
  if (extension !== ".json") throw new Error(`Unsupported input format: ${extension || "none"}`);
  const value: unknown = JSON.parse(text);
  if (Array.isArray(value)) return value;
  const document = importDocumentSchema.parse(value);
  return document.records.map((record) => ({ ...document.defaults, ...record }));
}

function unique(values: string[], normalizations: string[], field: string) {
  const output: string[] = [];
  for (const raw of values) {
    const value = normalizeWhitespace(raw);
    if (!value || output.includes(value)) {
      if (value) normalizations.push(`${field}: collapsed duplicate ${value}`);
      continue;
    }
    output.push(value);
  }
  return output;
}

function mapReference(raw: string, aliases: Record<string, string>, field: string, normalizations: string[]) {
  const value = normalizeWhitespace(raw);
  const resolved = aliases[value] ?? value;
  if (resolved !== value) normalizations.push(`${field}: ${value} -> ${resolved}`);
  return resolved;
}

function normalizeRecord(record: AcupointImportRecord) {
  const normalizations: string[] = [];
  const code = normalizeCode(record.standardCode);
  if (code !== record.standardCode) normalizations.push(`standardCode: ${record.standardCode} -> ${code}`);
  const aliasesHant = unique(record.aliasesHant.map((alias) => normalizeCode(alias) === code ? code : alias), normalizations, "aliasesHant");
  const aliasesHans = unique(record.aliasesHans.map((alias) => normalizeCode(alias) === code ? code : alias), normalizations, "aliasesHans");
  const normalized: NormalizedRecord = {
    ...record,
    sourceKey: normalizeWhitespace(record.sourceKey), canonicalNameHant: normalizeWhitespace(record.canonicalNameHant), canonicalNameHans: normalizeWhitespace(record.canonicalNameHans),
    standardCode: code, meridianId: mapReference(record.meridianId, meridianAliases, "meridianId", normalizations),
    aliasesHant, aliasesHans,
    pointCategories: unique(record.pointCategories.map((item) => mapReference(item, categoryAliases, "pointCategories", normalizations)), normalizations, "pointCategories"),
    elementId: record.elementId ? mapReference(record.elementId, elementAliases, "elementId", normalizations) : undefined,
    relatedLessonIds: unique(record.relatedLessonIds, normalizations, "relatedLessonIds"), sourceIds: unique(record.sourceIds, normalizations, "sourceIds"),
    relationSourceIds: {
      membership: unique(record.relationSourceIds.membership, normalizations, "relationSourceIds.membership"),
      category: unique(record.relationSourceIds.category, normalizations, "relationSourceIds.category"),
      fiveShu: unique(record.relationSourceIds.fiveShu, normalizations, "relationSourceIds.fiveShu"),
    },
    stableId: stablePointId(code),
  };
  return { normalized, normalizations };
}

function relation(type: KnowledgeRelation["type"], from: string, to: string, sourceIds: string[]): KnowledgeRelation {
  return { id: `relation:${from.replaceAll(":", "-")}:${type.replaceAll("_", "-")}:${to.replaceAll(":", "-")}`, type, from, to, sourceIds };
}

function transform(record: NormalizedRecord) {
  if (!record.stableId) throw new Error(`Cannot transform invalid code ${record.standardCode}`);
  const meridian = entities.find((item) => item.id === record.meridianId);
  if (!meridian) throw new Error(`Cannot transform unknown meridian ${record.meridianId}`);
  const entity: KnowledgeEntity = {
    id: record.stableId, slug: record.stableId.replace(":", "-"), type: "acupoint",
    labels: { "zh-Hant": record.canonicalNameHant, "zh-Hans": record.canonicalNameHans },
    descriptions: {
      "zh-Hant": `${meridian.labels["zh-Hant"]}的代表穴位；本頁只整理經脈隸屬與可追溯分類，不提供自行針刺指示。`,
      "zh-Hans": `${meridian.labels["zh-Hans"] ?? meridian.labels["zh-Hant"]}的代表穴位；本页只整理经脉隶属与可追溯分类，不提供自行针刺指示。`,
    },
    aliases: { "zh-Hant": record.aliasesHant, "zh-Hans": record.aliasesHans },
    metadata: { standardCode: record.standardCode, visualReadiness: { "zh-Hant": "未加入人體座標", "zh-Hans": "未加入人体坐标" } },
    sourceIds: record.sourceIds, relatedLessonIds: record.relatedLessonIds,
  };
  const generatedRelations = [
    ...record.relatedLessonIds.map((lessonId) => relation("contains", lessonId, record.stableId!, record.relationSourceIds.category)),
    relation("belongs_to", record.stableId, record.meridianId, record.relationSourceIds.membership),
    ...record.pointCategories.map((categoryId) => relation("classified_as", record.stableId!, categoryId, fiveShuCategoryIds.has(categoryId) ? record.relationSourceIds.fiveShu : record.relationSourceIds.category)),
    ...(record.elementId ? [relation("element_of", record.stableId, record.elementId, record.relationSourceIds.fiveShu)] : []),
  ];
  return { entity, relations: generatedRelations };
}

function stable(value: unknown) { return JSON.stringify(value); }
function compare(record: NormalizedRecord, entity: KnowledgeEntity, generatedRelations: KnowledgeRelation[]) {
  const differences: string[] = [];
  const currentEntity = [...lessons, ...entities].find((item) => item.id === entity.id);
  if (!currentEntity) return { equivalent: false, differences: [`${record.sourceKey}: production entity ${entity.id} is missing`] };
  if (stable(currentEntity) !== stable(entity)) differences.push(`${record.sourceKey}: entity differs from production`);
  const currentRelations = relations.filter((item) => item.from === entity.id || (item.type === "contains" && item.to === entity.id)).sort((a, b) => a.id.localeCompare(b.id));
  const expectedRelations = generatedRelations.sort((a, b) => a.id.localeCompare(b.id));
  if (stable(currentRelations) !== stable(expectedRelations)) differences.push(`${record.sourceKey}: relation set differs from production`);
  return { equivalent: differences.length === 0, differences };
}

function markdownReport(report: IngestionReport) {
  const s = report.summary;
  const issueRows = report.records.flatMap((record) => record.issues.map((issue) => `| ${record.sourceKey} | ${issue.severity.toUpperCase()} | ${issue.code} | ${issue.message.replaceAll("|", "\\|")} |`));
  return `# Acupuncture ingestion report\n\n- Input: \`${report.inputFile}\`\n- Schema target: ${report.schemaVersion}\n- Records: ${s.total}; valid ${s.valid}; invalid ${s.invalid}; duplicate ${s.duplicate}; conflict ${s.conflict}\n- Errors: ${s.errors}; warnings: ${s.warnings}\n- Pilot reconciliation: ${report.reconciliation.equivalent}/${report.reconciliation.checked} equivalent\n\n## Exceptions\n\n| Record | Severity | Code | Message |\n| --- | --- | --- | --- |\n${issueRows.length ? issueRows.join("\n") : "| — | — | — | No exceptions |"}\n`;
}

export function runPipeline(inputPath: string): PipelineResult {
  const rawRecords = loadImport(inputPath);
  const sourceSet = new Set(sources.map((item) => item.id));
  const lessonSet = new Set(lessons.map((item) => item.id));
  const entitySet = new Set(entities.map((item) => item.id));
  const results: RecordResult[] = [];
  const accepted: Array<{ record: NormalizedRecord; normalizations: string[] }> = [];

  rawRecords.forEach((raw, index) => {
    const parsed = importRecordSchema.safeParse(raw);
    if (!parsed.success) {
      results.push({ sourceKey: typeof raw === "object" && raw && "sourceKey" in raw ? String(raw.sourceKey) : `row:${index + 1}`, status: "invalid", entityId: null, standardCode: null,
        issues: parsed.error.issues.map((issue) => ({ severity: "error", code: "MALFORMED_RECORD", field: issue.path.join("."), message: issue.message })), normalizations: [] });
      return;
    }
    const { normalized, normalizations } = normalizeRecord(parsed.data);
    const issues: IngestionIssue[] = [];
    const error = (code: string, message: string, field?: string) => issues.push({ severity: "error", code, message, field });
    const warning = (code: string, message: string, field?: string) => issues.push({ severity: "warning", code, message, field });
    const match = /^([A-Z]{2})(\d{1,3})$/.exec(normalized.standardCode);
    if (!match || !normalized.stableId) error("INVALID_STANDARD_CODE", `Invalid standard code ${normalized.standardCode}`, "standardCode");
    if (!entitySet.has(normalized.meridianId) || !meridianCodePrefixes[normalized.meridianId]) error("UNRESOLVED_MERIDIAN", `Unknown primary meridian ${normalized.meridianId}`, "meridianId");
    if (match && meridianCodePrefixes[normalized.meridianId] !== match[1]) error("MERIDIAN_CODE_MISMATCH", `${normalized.standardCode} does not match ${normalized.meridianId}`, "standardCode");
    if (match && Number(match[2]) !== normalized.sequenceNumber) error("SEQUENCE_CODE_MISMATCH", `Sequence ${normalized.sequenceNumber} does not match ${normalized.standardCode}`, "sequenceNumber");
    normalized.pointCategories.forEach((id) => { if (!entitySet.has(id) || !id.startsWith("point-category:")) error("UNRESOLVED_CATEGORY", `Unknown point category ${id}`, "pointCategories"); });
    if (normalized.elementId && (!entitySet.has(normalized.elementId) || !normalized.elementId.startsWith("element:"))) error("UNRESOLVED_ELEMENT", `Unknown element ${normalized.elementId}`, "elementId");
    normalized.relatedLessonIds.forEach((id) => { if (!lessonSet.has(id)) error("UNRESOLVED_LESSON", `Unknown lesson ${id}`, "relatedLessonIds"); });
    const evidenceIds = new Set([...normalized.sourceIds, ...normalized.relationSourceIds.membership, ...normalized.relationSourceIds.category, ...normalized.relationSourceIds.fiveShu]);
    evidenceIds.forEach((id) => { if (!sourceSet.has(id)) error("UNRESOLVED_SOURCE", `Unknown source ${id}`, "sourceIds"); });
    normalized.sourceLocator.forEach((locator) => {
      if (!sourceSet.has(locator.sourceId)) error("UNRESOLVED_SOURCE", `Locator references unknown source ${locator.sourceId}`, "sourceLocator");
      if (!evidenceIds.has(locator.sourceId)) warning("UNUSED_SOURCE_LOCATOR", `Locator ${locator.sourceId} is not used by entity or relations`, "sourceLocator");
      if (locator.localFile && !fs.existsSync(path.resolve(root, locator.localFile))) warning("MISSING_LOCAL_SOURCE", `Local reference not found: ${locator.localFile}`, "sourceLocator");
    });
    evidenceIds.forEach((id) => { if (!normalized.sourceLocator.some((locator) => locator.sourceId === id)) warning("MISSING_SOURCE_LOCATOR", `No locator supplied for ${id}`, "sourceLocator"); });
    if (![...evidenceIds].some((id) => sources.find((source) => source.id === id)?.category === "reference")) warning("SOURCE_QUALITY", "No authoritative/reference normalization source is attached", "sourceIds");
    const hasFiveShu = normalized.pointCategories.some((id) => fiveShuCategoryIds.has(id));
    const fiveShuCategories = normalized.pointCategories.filter((id) => fiveShuCategoryIds.has(id));
    if (fiveShuCategories.length > 1) error("FIVE_SHU_CONFLICT", `Multiple Five Shu categories supplied: ${fiveShuCategories.join(", ")}`, "pointCategories");
    if (hasFiveShu && !normalized.elementId) error("FIVE_SHU_ELEMENT_MISSING", "Five Shu classification requires an evidenced element relation", "elementId");
    if (!hasFiveShu && normalized.elementId) error("FIVE_SHU_CATEGORY_MISSING", "Element relation requires a Five Shu classification", "pointCategories");
    if (hasFiveShu && !normalized.relationSourceIds.fiveShu.some((id) => sources.find((source) => source.id === id)?.category === "reference")) error("FIVE_SHU_SOURCE_MISSING", "Five Shu classification requires a reference source", "relationSourceIds.fiveShu");
    if (fiveShuCategories.length === 1 && normalized.elementId) {
      const polarity = relations.find((item) => item.from === normalized.meridianId && item.type === "corresponds_to" && item.to.startsWith("yin-yang:"))?.to.split(":").at(-1);
      const categoryIndex = fiveShuOrder.indexOf(fiveShuCategories[0]);
      const expectedElement = polarity === "yin" || polarity === "yang" ? expectedFiveShuElements[polarity][categoryIndex] : undefined;
      if (!expectedElement || normalized.elementId !== expectedElement) error("FIVE_SHU_ELEMENT_CONFLICT", `${fiveShuCategories[0]} on ${normalized.meridianId} expects ${expectedElement ?? "a resolvable polarity mapping"}, received ${normalized.elementId}`, "elementId");
    }
    if (normalized.status === "blocked") error("RECORD_BLOCKED", "Record is explicitly blocked", "status");
    if (normalized.status !== "accepted") warning("REVIEW_STATE", `Record status is ${normalized.status}`, "status");
    accepted.push({ record: normalized, normalizations });
    results.push({ sourceKey: normalized.sourceKey, status: issues.some((issue) => issue.severity === "error") ? "invalid" : "valid", entityId: normalized.stableId, standardCode: normalized.standardCode, issues, normalizations });
  });

  const collisionFields: Array<[string, (record: NormalizedRecord) => string | null]> = [
    ["stable ID", (record) => record.stableId], ["standard code", (record) => record.standardCode],
    ["Traditional name", (record) => record.canonicalNameHant], ["Simplified name", (record) => record.canonicalNameHans],
  ];
  for (const [label, select] of collisionFields) {
    const buckets = new Map<string, number[]>();
    accepted.forEach(({ record }, index) => { const value = select(record); if (value) buckets.set(value, [...(buckets.get(value) ?? []), index]); });
    buckets.forEach((indexes, value) => { if (indexes.length > 1) indexes.forEach((acceptedIndex) => { const result = results.find((item) => item.sourceKey === accepted[acceptedIndex].record.sourceKey)!; result.status = label.includes("name") ? "conflict" : "duplicate"; result.issues.push({ severity: "error", code: label.includes("name") ? "NAME_CONFLICT" : "DUPLICATE_RECORD", message: `Duplicate ${label}: ${value}` }); }); });
  }
  const aliasOwners = new Map<string, string>();
  accepted.forEach(({ record }) => [...record.aliasesHant, ...record.aliasesHans].forEach((alias) => {
    const owner = aliasOwners.get(alias); if (owner && owner !== record.sourceKey) {
      const result = results.find((item) => item.sourceKey === record.sourceKey)!;
      result.issues.push({ severity: "warning", code: "ALIAS_COLLISION", message: `Alias ${alias} is also used by ${owner}` });
    } else aliasOwners.set(alias, record.sourceKey);
  }));

  const validKeys = new Set(results.filter((result) => result.status === "valid").map((result) => result.sourceKey));
  const transformed = accepted.filter(({ record }) => validKeys.has(record.sourceKey)).map(({ record }) => ({ record, ...transform(record) }));
  transformed.sort((a, b) => (meridianOrder.indexOf(a.record.meridianId) - meridianOrder.indexOf(b.record.meridianId)) || a.record.sequenceNumber - b.record.sequenceNumber || a.record.standardCode.localeCompare(b.record.standardCode));
  const generated: GeneratedAcupunctureData = {
    formatVersion: "1.0", schemaVersion: "1.2.0", generator: "tools/acupuncture/pipeline.ts", inputFile: path.relative(root, inputPath).replaceAll("\\", "/"),
    entities: transformed.map((item) => entitySchema.parse(item.entity)), relations: transformed.flatMap((item) => item.relations).sort((a, b) => a.id.localeCompare(b.id)).map((item) => relationSchema.parse(item)),
  };
  const reconciliation = transformed.map((item) => compare(item.record, item.entity, item.relations));
  const allIssues = results.flatMap((result) => result.issues);
  const report: IngestionReport = {
    reportVersion: "1.0", schemaVersion: "1.2.0", inputFile: generated.inputFile,
    summary: {
      total: results.length, valid: results.filter((item) => item.status === "valid").length, invalid: results.filter((item) => item.status === "invalid").length,
      duplicate: results.filter((item) => item.status === "duplicate").length, conflict: results.filter((item) => item.status === "conflict").length,
      errors: allIssues.filter((item) => item.severity === "error").length, warnings: allIssues.filter((item) => item.severity === "warning").length,
      unresolvedSource: allIssues.filter((item) => item.code === "UNRESOLVED_SOURCE").length, unresolvedMeridian: allIssues.filter((item) => item.code === "UNRESOLVED_MERIDIAN").length,
      unresolvedCategory: allIssues.filter((item) => item.code === "UNRESOLVED_CATEGORY").length, normalizationWarnings: results.reduce((sum, item) => sum + item.normalizations.length, 0),
    }, records: results,
    reconciliation: { checked: reconciliation.length, equivalent: reconciliation.filter((item) => item.equivalent).length, mismatched: reconciliation.filter((item) => !item.equivalent).length, differences: reconciliation.flatMap((item) => item.differences) },
  };
  return { generated, report, markdown: markdownReport(report) };
}

export function serialize(value: unknown) { return `${JSON.stringify(value, null, 2)}\n`; }

export function validateInfrastructure() {
  const parsed = parseDelimited('name,aliases\n"太衝","LR3|太冲"\n', ",");
  if (parsed[0]?.name !== "太衝" || parsed[0]?.aliases !== "LR3|太冲") throw new Error("CSV quoted-field parser self-test failed");
  if (normalizeCode(" lr-3 ") !== "LR3" || meridianAliases["肝经"] !== "meridian:liver") throw new Error("Normalization self-test failed");
  if (categoryAliases["輸穴"] === categoryAliases["俞穴"]) throw new Error("Stream and Back-Shu terms must remain distinct");
  if (fiveShuOrder.length !== 5) throw new Error("Five Shu reference order self-test failed");
}
