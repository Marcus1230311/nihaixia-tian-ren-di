import fs from "node:fs";
import path from "node:path";
import { runPipeline, serialize, validateInfrastructure } from "./pipeline";

const root = path.resolve(import.meta.dirname, "../..");
const command = process.argv[2] ?? "dry-run";
const inputPath = path.resolve(root, process.argv[3] ?? "data/import/acupuncture/pilot-points.json");
const generatedPath = path.resolve(root, "data/generated/acupuncture/pilot-points.json");
const reportJsonPath = path.resolve(root, "reports/acupuncture-ingestion-report.json");
const reportMarkdownPath = path.resolve(root, "reports/acupuncture-ingestion-report.md");

function write(file: string, contents: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents, "utf8");
}

function assertCommitted(file: string, expected: string) {
  if (!fs.existsSync(file)) throw new Error(`Missing committed pipeline artifact: ${path.relative(root, file)}`);
  if (fs.readFileSync(file, "utf8") !== expected) throw new Error(`Stale pipeline artifact: ${path.relative(root, file)}; run npm run acupuncture:generate`);
}

try {
  validateInfrastructure();
  const result = runPipeline(inputPath);
  const hasErrors = result.report.summary.errors > 0;
  const reconciliationFailed = result.report.reconciliation.mismatched > 0;

  if (command === "generate") {
    if (hasErrors || reconciliationFailed) throw new Error("Generation refused because validation or pilot reconciliation failed");
    write(generatedPath, serialize(result.generated));
    write(reportJsonPath, serialize(result.report));
    write(reportMarkdownPath, result.markdown);
  } else if (command === "dry-run") {
    write(reportJsonPath, serialize(result.report));
    write(reportMarkdownPath, result.markdown);
  } else if (command === "validate") {
    if (hasErrors) throw new Error(`Ingestion contains ${result.report.summary.errors} error(s)`);
    if (reconciliationFailed) throw new Error(`Pilot reconciliation has ${result.report.reconciliation.mismatched} mismatch(es)`);
    assertCommitted(generatedPath, serialize(result.generated));
    assertCommitted(reportJsonPath, serialize(result.report));
    assertCommitted(reportMarkdownPath, result.markdown);
  } else {
    throw new Error(`Unknown command ${command}; use validate, dry-run, or generate`);
  }

  console.log(JSON.stringify({ command, input: result.report.inputFile, ...result.report.summary, reconciliation: result.report.reconciliation }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
