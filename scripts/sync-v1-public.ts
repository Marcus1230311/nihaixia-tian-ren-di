import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const destination = path.join(root, "public", "v1");
const roots = ["assets", "tianji", "renji", "diji"];

function copyTree(source: string, target: string) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
for (const directory of roots) copyTree(path.join(root, directory), path.join(destination, directory));
fs.copyFileSync(path.join(root, "index.html"), path.join(destination, "index.html"));

const sourceHtml = [path.join(root, "index.html")];
for (const directory of ["tianji", "renji", "diji"]) {
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (full.endsWith(".html")) sourceHtml.push(full);
    }
  };
  walk(path.join(root, directory));
}
if (sourceHtml.length !== 54) throw new Error(`V1 HTML 頁數不符：${sourceHtml.length}/54`);
console.log(`V1 靜態基線已同步至 public/v1：${sourceHtml.length} 頁。`);
