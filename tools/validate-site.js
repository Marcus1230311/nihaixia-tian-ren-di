const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  if (entry.name === '.git' || entry.name === 'tools') return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const errors = [];
const warnings = [];
const inbound = new Map(htmlFiles.map(file => [file, 0]));
const graph = new Map(htmlFiles.map(file => [file, []]));
const statuses = /未建置|規劃中|分批建置中|已上線|建置完成|coming\s+soon|placeholder|TODO|待補|prev-disabled|badge\s+done/gi;
const titles = new Map();
const descriptions = new Map();
const longParagraphs = new Map();

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  if (source.trim().length < 200) errors.push(`空白或近空白頁：${rel(file)}`);
  if (!/<html\b/i.test(source) || !/<\/html>/i.test(source)) errors.push(`缺少 HTML 根標籤：${rel(file)}`);
  const title = (source.match(/<title>([^<]+)<\/title>/i) || [,''])[1].trim();
  if (!title) errors.push(`缺少標題：${rel(file)}`);
  else if (titles.has(title)) errors.push(`重複標題：${rel(file)} 與 ${titles.get(title)}`);
  else titles.set(title, rel(file));
  const description = (source.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) || [,''])[1].trim();
  if (!description) errors.push(`缺少 meta description：${rel(file)}`);
  else if (descriptions.has(description)) errors.push(`重複 meta description：${rel(file)} 與 ${descriptions.get(description)}`);
  else descriptions.set(description, rel(file));
  const h1Count = (source.match(/<h1(?:\s|>)/gi) || []).length;
  if (h1Count !== 1) errors.push(`H1 數量不符：${rel(file)} (${h1Count})`);
  if (/<article class=["']classic["']>/.test(source) && !/class=["']provenance-note["']/.test(source)) errors.push(`內容頁缺少來源說明：${rel(file)}`);
  if (/^(?:tianji|renji|diji)\/index\.html$/.test(rel(file)) && /<div class=["']module["']>[\s\S]*?<h3>/i.test(source)) errors.push(`模組目錄跳過 H2：${rel(file)}`);
  for (const block of source.matchAll(/<(?:div|footer)[^>]*class=["'](?:eyebrow|pager)["'][^>]*>[\s\S]*?<\/(?:div|footer)>|<footer[^>]*>[\s\S]*?<\/footer>/gi)) {
    if (/已完成|完結|已上線|建置|PASS|Online|Completed/i.test(block[0])) errors.push(`公開導覽含維護狀態：${rel(file)}`);
  }
  const foundStatuses = source.match(statuses);
  if (foundStatuses) errors.push(`未實作狀態文字：${rel(file)} (${[...new Set(foundStatuses)].join('、')})`);
  const contentOnly = source.replace(/<aside class=["']provenance-note["']>[\s\S]*?<\/aside>/gi, '');
  for (const match of contentOnly.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const paragraph = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (paragraph.length < 80) continue;
    if (longParagraphs.has(paragraph) && longParagraphs.get(paragraph) !== rel(file)) errors.push(`跨頁重複長段落：${rel(file)} 與 ${longParagraphs.get(paragraph)}`);
    else longParagraphs.set(paragraph, rel(file));
  }

  for (const match of source.matchAll(/(?:href|src)=["']([^"'?]+)["']/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(target)) continue;
    const [pathname, fragment] = target.split('#');
    const resolved = path.resolve(path.dirname(file), decodeURI(pathname || path.basename(file)));
    if (!fs.existsSync(resolved)) errors.push(`缺失連結／資源：${rel(file)} -> ${target}`);
    else if (resolved.endsWith('.html') && inbound.has(resolved)) {
      inbound.set(resolved, inbound.get(resolved) + 1);
      graph.get(file).push(resolved);
      if (fragment && !new RegExp(`\\bid=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(fs.readFileSync(resolved, 'utf8'))) errors.push(`缺失頁內錨點：${rel(file)} -> ${target}`);
    }
  }

  for (const tag of ['html', 'head', 'body', 'table', 'tr', 'ul', 'article', 'div']) {
    const opens = (source.match(new RegExp(`<${tag}(?:\\s|>)`, 'gi')) || []).length;
    const closes = (source.match(new RegExp(`</${tag}\\s*>`, 'gi')) || []).length;
    if (opens !== closes) errors.push(`標籤失衡：${rel(file)} <${tag}> ${opens}/${closes}`);
  }
}

for (const page of ['renji/zhenjiu/02-shou-sanyin-sanyang.html', 'renji/zhenjiu/03-zu-sanyin-sanyang.html']) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  if (!/class=["']lesson-toc["']/.test(source)) errors.push(`長頁缺少頁內目錄：${page}`);
}

for (const [file, count] of inbound) {
  if (rel(file) !== 'index.html' && count === 0) errors.push(`無站內入口頁：${rel(file)}`);
}

const visited = new Set();
const queue = [path.join(root, 'index.html')];
while (queue.length) {
  const current = queue.shift();
  if (visited.has(current)) continue;
  visited.add(current);
  for (const next of graph.get(current) || []) if (!visited.has(next)) queue.push(next);
}
for (const file of htmlFiles) if (!visited.has(file)) errors.push(`首頁無法到達：${rel(file)}`);

const moduleCounts = { root: 0, tianji: 0, renji: 0, diji: 0 };
for (const file of htmlFiles) {
  const first = rel(file).split('/')[0];
  moduleCounts[first === 'index.html' ? 'root' : first]++;
}

const expectedDiji = [
  'diji/01-kanyu-zonglun.html',
  'diji/02-long-xue-sha-shui.html',
  'diji/03-luopan-fangwei.html',
  'diji/04-yangzhai-anli.html',
  'diji/05-yinzhai-jichu.html'
];
for (const page of expectedDiji) if (!fs.existsSync(path.join(root, page))) errors.push(`地紀承諾頁缺失：${page}`);

for (const [page, expected] of [
  ['tianji/yijing/02-shangjing-30gua.html', 30],
  ['tianji/yijing/03-xiajing-34gua.html', 34]
]) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  const actual = (source.match(/class=["']hexagram-entry["']/g) || []).length;
  if (actual !== expected) errors.push(`逐卦覆蓋不足：${page} ${actual}/${expected}`);
  const originals = [...source.matchAll(/<section class="hexagram-entry"[\s\S]*?<div class="original">([\s\S]*?)<\/div>/g)];
  originals.forEach((match, index) => {
    const lines = (match[1].match(/<p>/g) || []).length;
    if (lines < 7) errors.push(`卦爻原文不足：${page} 第 ${index + 1} 卦僅 ${lines} 段`);
  });
}

if (moduleCounts.tianji !== 15) errors.push(`天紀頁數不符：${moduleCounts.tianji}（含目錄應為 15）`);
if (moduleCounts.renji !== 32) errors.push(`人紀頁數不符：${moduleCounts.renji}（含目錄應為 32）`);
if (moduleCounts.diji !== 6) errors.push(`地紀頁數不符：${moduleCounts.diji}（含目錄應為 6）`);
for (const page of expectedDiji) {
  if (!fs.existsSync(path.join(root, page))) continue;
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  const sections = (source.match(/<h2>/g) || []).length;
  if (sections < 5) errors.push(`地紀內容深度不足：${page} 僅 ${sections} 節`);
}

console.log(JSON.stringify({ files: files.length, html: htmlFiles.length, moduleCounts, errors, warnings }, null, 2));
process.exitCode = errors.length ? 1 : 0;
