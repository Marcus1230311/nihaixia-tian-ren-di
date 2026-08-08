import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

export function readLegacyArticle(legacyPath: string) {
  const absolute = path.resolve(root, legacyPath);
  if (!absolute.startsWith(root) || !fs.existsSync(absolute)) throw new Error(`V1 來源不存在：${legacyPath}`);
  const html = fs.readFileSync(absolute, "utf8");
  const article = html.match(/<article class="classic">([\s\S]*?)<\/article>/i)?.[1];
  if (!article) throw new Error(`V1 文章區不存在：${legacyPath}`);
  return article;
}

export function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
