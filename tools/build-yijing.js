const https = require('https');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const names = [
  '乾','坤','屯','蒙','需','訟','師','比','小畜','履','泰','否','同人','大有','謙','豫','隨','蠱','臨','觀',
  '噬嗑','賁','剝','復','無妄','大畜','頤','大過','坎','離','咸','恆','遯','大壯','晉','明夷','家人','睽','蹇','解',
  '損','益','夬','姤','萃','升','困','井','革','鼎','震','艮','漸','歸妹','豐','旅','巽','兌','渙','節','中孚','小過','既濟','未濟'
];
const structures = [
  '乾上乾下','坤上坤下','坎上震下','艮上坎下','坎上乾下','乾上坎下','坤上坎下','坎上坤下','巽上乾下','乾上兌下',
  '坤上乾下','乾上坤下','乾上離下','離上乾下','坤上艮下','震上坤下','兌上震下','艮上巽下','坤上兌下','巽上坤下',
  '離上震下','艮上離下','艮上坤下','坤上震下','乾上震下','艮上乾下','艮上震下','兌上巽下','坎上坎下','離上離下',
  '兌上艮下','震上巽下','乾上艮下','震上乾下','離上坤下','坤上離下','巽上離下','離上兌下','坎上艮下','震上坎下',
  '艮上兌下','巽上震下','兌上乾下','乾上巽下','兌上坤下','坤上巽下','兌上坎下','坎上巽下','兌上離下','離上巽下',
  '震上震下','艮上艮下','巽上艮下','震上兌下','震上離下','離上艮下','巽上巽下','兌上兌下','巽上坎下','坎上兌下',
  '巽上兌下','震上艮下','坎上離下','離上坎下'
];
const themes = [
  '剛健創始，六爻呈現由潛藏、進德到盛極知退的完整進程。','柔順承載，以守正、配合與厚德完成事物。','初生多難，重點在建立秩序、尋求合宜助力。','蒙昧待啟，問學須誠，教導亦須有節。','有所等待，守信蓄勢，不因險在前而躁進。','意見相違，先辨理與止爭，不把衝突推到極端。','眾人之事，重紀律、正當性與能任事的領導。','親比相助，先審所親是否正當，再求長久互信。','小有積蓄，宜涵養文德，尚未到大舉施為之時。','行於風險之中，以禮自持、辨位而行。',
  '上下交通而安泰；六爻同時提醒治盛須防衰。','上下不交而閉塞；君子在逆境中收斂守正。','求同於公共領域，以明辨、公正建立合作。','資源豐有之時，以謙明、公正避免自滿。','居下而有德，謙能受益，亦須落實於行動。','順勢而動帶來和樂，但不可沉溺於安逸。','隨時從善，隨的前提是正而不苟從。','積弊待治，先追根究柢，再整飭更新。','由上臨下亦是教養與照顧，盛勢中須預見轉折。','觀察與被觀察並存，先潔淨自身再示人以則。',
  '以明斷處理阻隔，刑罰象徵須兼具威與明。','文飾要依附實質，修飾有節才不掩本。','陰盛剝陽，宜止而守，不冒進消耗僅存根本。','一陽來復，重在返本、復正與保護初生之機。','不妄為才可行動；一念不正，後續皆失其本。','積蓄才德並適時止進，使所養可成大用。','頤是養：既看所養之物，也反觀養人的方式。','承載過重而失常，宜採非常之行但須守正。','重險相習，以誠信與反覆操練通過險境。','明有所附，明智必依正道，柔順守中方能長久。',
  '感應貴在真誠與無心，從近身細微處觀其發展。','持久不是僵化，而是在正道上持續調整與實踐。','時勢不利則退避，遯是保全正道而非逃避責任。','陽氣盛壯，力量愈大愈要以禮與正節制。','向明而進，受賞受遇之時仍須自昭明德。','光明受傷，宜韜光守正，在困境中保存內在之明。','由家內角色與秩序推及外部，正家先正己。','差異與乖離中仍可求小同、辨方向。','前有險阻，宜反身修德、求助而不強進。','險勢解除後重在及早整頓、寬緩復常。',
  '有所減損以成就平衡，減欲、益德而守誠。','增益要投向根本，見善則遷、有過則改。','決除之時須公開、審慎，不以暴力逞強。','意外相遇的力量不可輕忽，起初即要辨其走向。','聚集眾人須有共同中心、誠敬與備患。','由下而上積累，順勢進德，不求一步登天。','處困仍守所信，言語不見信時尤須反求諸己。','制度可改而共同資源須維護；井養眾人而不窮。','變革須有時機、信任與前後秩序。','革故之後建立新器，正位凝命，使新秩序可長久。',
  '震動帶來警醒；先懼後整，方能臨事不亂。','止於其所，該止則止、該行則行，重在不失時。','循序漸進，進展須合禮、合位，不以躁求破壞根基。','關係與位置未正時，宜知限制，不可只憑情感躁進。','盛大光明之時仍有遮蔽，須把握中正與時限。','寄居在外，柔順明慎、小事守正以免失所。','柔順深入、反覆申命；順從必以正當目標為準。','和悅交流，以誠相感，也戒諂媚與口舌取悅。','離散之時先解隔閡、聚人心，再重建共同秩序。','節制使制度可行，但過苦的限制不能長久。',
  '內在誠信足以感通，仍須驗證、守中而不輕信。','小事可行、大事宜慎；能謙下，不可越位高飛。','事情已成仍須防初吉終亂，持續修補細節。','尚未完成時最重辨位、慎終與保留前進可能。'
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function get(url, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await new Promise((resolve, reject) => {
      https.get(url, { headers: { 'User-Agent': 'nihaixia-site-maintenance/1.0 (educational static-site audit)' } }, message => {
        let body = '';
        message.setEncoding('utf8');
        message.on('data', chunk => body += chunk);
        message.on('end', () => resolve({ status: message.statusCode, body }));
      }).on('error', reject);
    });
    if (response.status === 200) return response.body;
    if (response.status !== 429 || attempt === attempts) throw new Error(`HTTP ${response.status}: ${response.body.slice(0, 120)}`);
    await sleep(attempt * 5000);
  }
}

const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const paragraphs = value => value.split(/\n+/).map(line => line.trim()).filter(Boolean).map(line => `<p>${esc(line)}</p>`).join('\n');

async function loadTexts() {
  const sourceUrl = 'https://gist.githubusercontent.com/sui1491/52e8214c8e5f4a189b94f5ea2b8bdb05/raw/d628f824a90d7b41b5149199e0fa0767e030b3af/%E6%98%93%E7%BB%8F%E5%85%A8%E6%96%87';
  const full = (await get(sourceUrl)).replaceAll('\r', '');
  const starts = names.map((name, index) => {
    const match = new RegExp(`^${index + 1}\\.?\\s+`, 'm').exec(full);
    if (!match) throw new Error(`找不到第 ${index + 1} 卦段落`);
    return match.index;
  });
  const result = new Map(names.map((name, index) => [name, full.slice(starts[index], starts[index + 1] ?? full.indexOf('繫辭上傳', starts[index]))]));
  return result;
}

function parse(name, extract) {
  const lines = extract.split('\n').map(line => line.trim()).filter(Boolean);
  const first = lines[0].replace(/^\d+\.?\s*/, '');
  const yao = lines.filter(line => /^(?:初[九六]|[九六][二三四五]|上[九六]|用[九六])[，：]/.test(line));
  const tuanLine = lines.find(line => /^《彖》曰：/.test(line));
  const imageLines = lines.filter(line => /^《象》曰：/.test(line)).map(line => line.replace(/^《象》曰：/, ''));
  const classic = [first, ...yao].join('\n');
  const tuan = tuanLine && tuanLine.replace(/^《彖》曰：/, '');
  const image = imageLines.join('\n');
  if (!classic || !tuan || imageLines.length < 1) throw new Error(`${name} 經文區段解析失敗 classic=${Boolean(classic)} tuan=${Boolean(tuan)} imageLines=${imageLines.length} extract=${extract.length}`);
  return { classic, tuan, image };
}

function entry(index, text) {
  const number = index + 1;
  const name = names[index];
  const symbol = String.fromCodePoint(0x4dc0 + index);
  const source = `https://zh.wikisource.org/zh-hant/周易/${encodeURIComponent(name)}`;
  return `    <section class="hexagram-entry" id="gua-${String(number).padStart(2, '0')}">
      <h2>${number}　${symbol} ${name}卦</h2>
      <div class="hexagram-meta"><span>${structures[index]}</span><span>${themes[index]}</span></div>
      <h3>卦辭與爻辭</h3>
      <div class="original">${paragraphs(text.classic)}</div>
      <details>
        <summary>展開《彖傳》與《象傳》逐爻說明</summary>
        <h3>《彖傳》</h3>
        ${paragraphs(text.tuan)}
        <h3>《象傳》</h3>
        ${paragraphs(text.image)}
      </details>
      <p class="source-note">原典校讀：<a href="${source}">維基文庫《周易・${name}》</a>（公版文本）。</p>
    </section>`;
}

function page(start, end, texts) {
  const upper = start === 0;
  const filename = upper ? '02-shangjing-30gua.html' : '03-xiajing-34gua.html';
  const part = upper ? '上經 30 卦' : '下經 34 卦';
  const lesson = upper ? 2 : 3;
  const firstLast = upper ? '乾坤至離' : '咸恆至未濟';
  const previous = upper ? '<a href="01-yinyang-bagua.html"><span class="dir">← 上一講</span>陰陽爻與八卦總論</a>' : '<a href="02-shangjing-30gua.html"><span class="dir">← 上一講</span>六十四卦詳解（上經30卦）</a>';
  const next = upper ? '<a class="next" href="03-xiajing-34gua.html"><span class="dir">下一講 →</span>六十四卦詳解（下經34卦）</a>' : '<a class="next" href="04-shifa.html"><span class="dir">下一講 →</span>易經占卜方法：筮法</a>';
  const contents = names.slice(start, end).map((name, offset) => `<a href="#gua-${String(start + offset + 1).padStart(2, '0')}">${start + offset + 1} ${name}</a>`).join('');
  const entries = names.slice(start, end).map((name, offset) => entry(start + offset, texts.get(name))).join('\n\n');
  return { filename, html: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="六十四卦詳解（${part.replaceAll(' ', '')}）：${firstLast}，逐卦收錄卦辭、六爻與《彖》《象》導讀。">
<title>六十四卦詳解（${part.replaceAll(' ', '')}） | 易經 | 天紀</title>
<link rel="stylesheet" href="../../assets/style.css">
</head>
<body>
<nav class="topnav"><div class="inner"><div class="brand"><a href="../../index.html">倪海廈醫道傳習網</a></div><div class="lines"><a href="../../tianji/index.html" class="on">天紀</a><a href="../../renji/index.html">人紀</a><a href="../../diji/index.html">地紀</a></div></div></nav>
<div class="wrap">
  <div class="crumb"><a href="../../index.html">首頁</a><span class="sep">/</span><a href="../index.html">天紀</a><span class="sep">/</span>易經<span class="sep">/</span> ${String(lesson).padStart(2, '0')} 六十四卦詳解（${part}）</div>
  <div class="hero" style="padding-top:26px;"><div class="eyebrow">易 經 · 第 ${lesson === 2 ? '二' : '三'} 講</div><h1 style="font-size:clamp(28px,5vw,42px);">六十四卦詳解（${part}）</h1><div class="sub">${firstLast}，逐卦收錄卦辭、六爻與《彖》《象》解讀</div></div>
  <article class="classic">
    <aside class="provenance-note"><strong>來源與編輯說明</strong>資料性質：卦辭、爻辭及《彖》《象》屬古典原文；課程脈絡取自本站既有筆記，其餘導讀與編排為編者整理，並非倪海廈逐字講稿。</aside>
    <p>本講依《周易》通行卦序完整收錄${part}。每卦採同一閱讀模板：先辨上下卦與核心課題，再讀卦辭、由初爻到上爻的變化，最後以《彖傳》說明全卦義理、以《象傳》對照大象與各爻。古文字義與歷代注解多有異說，本站只作經文導讀，不把單一解釋包裝成唯一答案。</p>
    <div class="hexagram-index" aria-label="本講卦目">${contents}</div>
${entries}
    <div class="callout"><h4>閱讀方法</h4>先讀卦辭掌握全局，再由初爻依序讀到上爻，觀察處境如何隨時位改變；遇到疑義，回到《彖傳》《象傳》與不同注本交叉核對。卦辭與爻辭是文化經典，不宜直接當成醫療、投資或重大人生決策的保證。</div>
  </article>
  <div class="pager">${previous}${next}</div>
  <footer>易經 · 第 ${lesson} / 5 講　·　${end - start} 卦完整收錄</footer>
</div>
</body>
</html>
`};
}

(async () => {
  if (names.length !== 64 || structures.length !== 64 || themes.length !== 64) throw new Error('六十四卦資料列長度錯誤');
  const extracts = await loadTexts();
  const texts = new Map(names.map(name => [name, parse(name, extracts.get(name) || '')]));
  for (const built of [page(0, 30, texts), page(30, 64, texts)]) {
    fs.writeFileSync(path.join(root, 'tianji', 'yijing', built.filename), built.html, 'utf8');
  }
  console.log('已建立上經 30 卦與下經 34 卦完整頁。');
})().catch(error => { console.error(error); process.exitCode = 1; });
