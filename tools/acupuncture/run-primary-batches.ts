import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { runPipeline, serialize, validateInfrastructure } from "./pipeline";

const root = path.resolve(import.meta.dirname, "../..");
const inputDir = path.resolve(root, "data/import/acupuncture/primary-batches");
const generatedDir = path.resolve(root, "data/generated/acupuncture/primary-batches");
const reportDir = path.resolve(root, "reports/acupuncture-batches");
const checkpointFile = path.resolve(reportDir, "checkpoints.json");
const validateOnly = process.argv.includes("--validate");

function sha256(value: string) { return createHash("sha256").update(value).digest("hex"); }
function write(file: string, value: string) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value, "utf8"); }
function commitArtifact(file: string, value: string) {
  if (!validateOnly) return write(file, value);
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== value) throw new Error(`Stale batch artifact: ${path.relative(root, file)}`);
}

validateInfrastructure();
const checkpoints = fs.readdirSync(inputDir).filter((file) => file.endsWith(".json")).sort().map((file) => {
  const inputFile = path.resolve(inputDir, file);
  const result = runPipeline(inputFile);
  if (result.report.summary.errors) throw new Error(`${file}: ${result.report.summary.errors} validation errors`);
  const generated = serialize(result.generated);
  const report = serialize(result.report);
  commitArtifact(path.resolve(generatedDir, file), generated);
  commitArtifact(path.resolve(reportDir, file), report);
  commitArtifact(path.resolve(reportDir, file.replace(/\.json$/, ".md")), result.markdown);
  const committed = fs.readFileSync(path.resolve(generatedDir, file), "utf8");
  if (committed !== generated) throw new Error(`${file}: generated artifact verification failed`);
  return {
    batch: file.replace(/\.json$/, ""),
    records: result.report.summary.total,
    valid: result.report.summary.valid,
    additions: result.report.reconciliation.additions,
    updates: result.report.reconciliation.mismatched,
    errors: result.report.summary.errors,
    warnings: result.report.summary.warnings,
    inputSha256: sha256(fs.readFileSync(inputFile, "utf8")),
    generatedSha256: sha256(generated),
    reportSha256: sha256(report),
  };
});
commitArtifact(checkpointFile, `${JSON.stringify({ formatVersion: "1.0", generatedBy: "tools/acupuncture/run-primary-batches.ts", checkpoints }, null, 2)}\n`);
console.log(JSON.stringify({ batches: checkpoints.length, records: checkpoints.reduce((sum, row) => sum + row.records, 0), checkpoints }, null, 2));
