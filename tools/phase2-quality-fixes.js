const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  if (entry.name === '.git' || entry.name === 'tools') return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const htmlFiles = walk(root).filter(file => file.endsWith('.html'));
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const strip = value => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const escAttr = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

const provenanceByArea = {
  neijing: '資料性質：本頁以《黃帝內經》相關概念與本站既有課程筆記為底稿，由編者重組為學習提要；不是逐字講義，也不代替現代診斷或醫療建議。',
  zhenjiu: '資料性質與安全：本頁依傳統針灸文獻、本站既有課程筆記與編輯整理而成。穴位定位、主治與配穴僅供研讀，並非自行操作指南；針刺須由受過訓練的合格專業人員施行。',
  bencao: '資料性質與安全：本頁整理本草經典、本站既有課程筆記與編輯性說明。性味、主治、配伍及傳統劑量只供文獻研讀，不構成用藥或自行配方建議。',
  shanghan: '資料性質與安全：本頁整理《傷寒論》方證、本站既有課程筆記與編輯性說明。方名與治法用於經典研讀，不可據此自行診斷、購藥或調整處方。',
  jingui: '資料性質與安全：本頁整理《金匱要略》方證、本站既有課程筆記與編輯性說明。婦兒、急重症及方藥內容尤其不可作為自行診療依據。',
  yijing: '資料性質：卦辭、爻辭及《彖》《象》屬古典原文；課程脈絡取自本站既有筆記，其餘導讀與編排為編者整理，並非倪海廈逐字講稿。',
  bazi: '資料性質：本頁依本站既有課程筆記、傳統命理概念與編輯整理而成；不是逐字講稿，也不提供確定性命運判斷。',
  heluo: '資料性質：本頁結合本站既有課程筆記、傳統術語與編輯性補充；不同流派規則可能有別，內容不是逐字講稿或效果保證。',
  diji: '資料性質：本頁屬編輯性補充，以傳統文獻與外部公共資料為核對基礎；不是倪海廈逐字講稿，也不提供吉凶或選址保證。'
};

function areaFor(relative) {
  for (const key of Object.keys(provenanceByArea)) if (relative.includes(`/${key}/`) || relative.startsWith(`${key}/`) || relative.startsWith(`renji/${key}/`) || relative.startsWith(`tianji/${key}/`)) return key;
  if (relative.startsWith('diji/')) return 'diji';
  return null;
}

for (const file of htmlFiles) {
  const relative = rel(file);
  let html = fs.readFileSync(file, 'utf8');

  // Remove obsolete public completion badges.
  html = html.replace(/\s*<span class="badge done">已上線<\/span>/g, '');

  // Add one concise, unique meta description based on the page's visible promise.
  if (!/<meta\s+name="description"/i.test(html)) {
    const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]);
    const sub = strip((html.match(/<div class="sub">([\s\S]*?)<\/div>/i) || [,''])[1]);
    const description = (`${h1}${sub ? `：${sub}` : ''}。本站提供繁體中文課程筆記、經典原文與編輯導讀。`).slice(0, 158);
    html = html.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n<meta name="description" content="${escAttr(description)}">`);
  }

  // Every article declares whether its material is classical, course-note, or editorial.
  const area = areaFor(relative);
  if (area && /<article class="classic">/.test(html) && !/class="provenance-note"/.test(html)) {
    html = html.replace(/<article class="classic">/, `<article class="classic">\n\n    <aside class="provenance-note"><strong>來源與編輯說明</strong>${provenanceByArea[area]}</aside>`);
  }

  fs.writeFileSync(file, html, 'utf8');
}

function edit(relative, replacements) {
  const file = path.join(root, relative);
  let html = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    if (typeof from === 'string' && !html.includes(from)) throw new Error(`${relative} 找不到預期文字：${from}`);
    html = html.replace(from, to);
  }
  fs.writeFileSync(file, html, 'utf8');
}

// Module indexes: restore a continuous heading hierarchy and explain provenance.
for (const relative of ['tianji/index.html', 'renji/index.html', 'diji/index.html']) {
  edit(relative, [
    [/<h3>([\s\S]*?)<\/h3>/g, '<h2>$1</h2>']
  ]);
}

edit('index.html', [[
  '本站將倪海廈公開講授的天紀、人紀、地紀三條教學主線，重新整理為體系化的自學網站。\n    內容依經典 / 主題拆成專題頁面，並以連續導覽串起每條學習主線，方便查閱、複習與交叉引用。',
  '本站以天紀、人紀、地紀的既有課程架構作為學習路徑，內容不是課堂逐字稿。正文分別包含本站既有課程筆記、古典原文、編者導讀與外部補充資料；頁面會依資料性質標示來源，方便讀者分辨與核對。'
], [
  '  <div class="note">',
  '  <aside class="provenance-note"><strong>怎麼辨認資料來源</strong><span class="source-key">課程筆記整理</span>代表本站既有筆記的轉述；<span class="source-key">古典原文</span>使用原文框呈現；<span class="source-key">編者整理／補充參考</span>則不是倪海廈逐字講授內容。</aside>\n\n  <div class="note">'
]]);

edit('tianji/index.html', [[
  '  <div class="module">',
  '  <aside class="provenance-note"><strong>本線資料說明</strong>天紀各頁包含本站既有課程筆記、易學與命理傳統材料及編者導讀；除明示的古典原文外，正文均非逐字講稿，也不作確定性預測。</aside>\n\n  <div class="module">'
], [
  '天紀三部主線至此全部完結，建議依易經→八字命理→河洛姓名風水的順序研讀，最後可接續地紀堪輿主線。',
  '天紀三部主線的建議閱讀順序為易經→八字命理→河洛姓名風水，之後可接續地紀堪輿主線。'
], [
  '<footer>天紀 · 共 3 模組 14 頁　·　全線完結</footer>',
  '<footer>天紀 · 共 3 模組 14 頁</footer>'
]]);

edit('renji/index.html', [[
  '人紀是倪海廈教學體系的核心主線，五部經典彼此有明確依存關係：先立理論（內經），再學工具（針、藥），',
  '本站把人紀整理為五部彼此銜接的經典課程：先立理論（內經），再學工具（針、藥），'
], [
  '  <div class="module">',
  '  <aside class="provenance-note"><strong>本線資料與安全說明</strong>人紀各頁由經典原文、本站既有課程筆記與編者整理構成，並非逐字講義。穴位、方藥、診斷與治法只供文獻研讀，不可代替合格中醫師的診療。</aside>\n\n  <div class="module">'
], [
  '人紀五部經典至此全部上線，建議依內經→針灸大成→本草經→傷寒論→金匱要略的順序完整研讀一遍後，',
  '人紀五部經典的建議閱讀順序為內經→針灸大成→本草經→傷寒論→金匱要略；完整研讀一遍後，'
], [
  '<footer>人紀 · 共 5 模組 31 頁　·　全線完結</footer>',
  '<footer>人紀 · 共 5 模組 31 頁</footer>'
], [
  '<span class="t-desc">全書方劑速查</span>',
  '<span class="t-desc">六經代表方證複習索引</span>'
], [
  '<span class="t-desc">全書方劑彙整，人紀完結篇</span>',
  '<span class="t-desc">前五講核心方劑複習索引</span>'
]]);

edit('diji/index.html', [[
  '地紀是倪海廈教學體系中流傳資料相對較少、體系不如人紀完整的一條線，內容以形勢宗（觀山水形勢）與',
  '本站沿用地紀這條課程分類；由於可核對的既有課程資料相對較少，本模組主要是編者依傳統文獻與公共資料整理的補充導讀，內容以形勢取向（觀山水形勢）與'
], [
  '  <div class="module">',
  '  <aside class="provenance-note"><strong>本線資料說明</strong>地紀五講屬編輯性補充，不是倪海廈逐字講稿；古籍引文與外部資料列於各頁來源區，傳統象徵說法不作實際吉凶或選址保證。</aside>\n\n  <div class="module">'
], [
  '<footer>地紀 · 5 講完整上線</footer>',
  '<footer>地紀 · 共 5 講</footer>'
]]);

// Replace unsupported direct attribution with explicit course-note provenance.
const attributionEdits = {
  'renji/neijing/01-yinyang-wuxing.html': [['倪海廈上課時反覆強調：', '依本站既有課程筆記整理：']],
  'renji/neijing/02-zangxiang.html': [['倪海廈反覆提醒：', '依本站既有課程筆記整理：']],
  'renji/jingui/02-neishang-zabing.html': [['倪海廈特別提醒臨床上要仔細鑑別', '依本站既有課程筆記整理，臨床辨證需仔細鑑別']],
  'renji/jingui/03-feixi-bing.html': [['倪海廈講這一篇時特別強調「先辨虛實寒熱，再談止咳」', '依本站既有課程筆記，本篇的閱讀重點是「先辨虛實寒熱，再談止咳」']],
  'tianji/yijing/04-shifa.html': [['倪海廈在講解筮法時，常拿中醫的四診（望聞問切）做類比：', '依本站既有課程筆記，筮法曾以中醫四診（望聞問切）作類比：']],
  'tianji/yijing/05-yijing-yu-zhongyi.html': [['有助於理解倪海廈教學體系「天人同構」的整體設計思路。', '可作為理解本站天紀與人紀交叉閱讀方式的一條線索。']],
  'tianji/bazi/05-dayun-liunian.html': [['大運流年分析的實際價值，倪海廈認為不在於', '依本站既有課程筆記，大運流年分析的重點不在於']],
  'tianji/bazi/06-shili-shizhan.html': [['底層卻是同一套倪海廈教學體系共用的思維方法。', '本站把兩者整理為一套可交叉比較的思維方法。']],
  'tianji/heluo/02-xingming-jichu.html': [['倪海廈教學體系中', '本站既有課程筆記中']],
  'tianji/heluo/03-fengshui-yangzhai.html': [
    ['這也是倪海廈教學體系中', '這也是本站課程編排中'],
    ['有助於更全面理解倪海廈教學體系的整體設計。', '有助於理解本站三條研讀主線的編排方式。']
  ]
};
for (const [relative, replacements] of Object.entries(attributionEdits)) edit(relative, replacements);

// Restore real previous-lesson links at module boundaries.
const previousLinks = {
  'tianji/yijing/01-yinyang-bagua.html': ['<div class="pager">', '<div class="pager">\n    <a href="../index.html"><span class="dir">← 返回目錄</span>天紀總覽</a>'],
  'renji/zhenjiu/01-jingluo-liuzhu.html': ['<a class="prev-disabled"><span class="dir">← 上一部</span>黃帝內經（已完結）</a>', '<a href="../neijing/07-zhize-zhifa.html"><span class="dir">← 上一部</span>黃帝內經 · 治則治法</a>'],
  'renji/bencao/01-shangpin-yangming.html': ['<a class="prev-disabled"><span class="dir">← 上一部</span>針灸大成（已完結）</a>', '<a href="../zhenjiu/06-changjian-bingzheng.html"><span class="dir">← 上一部</span>針灸大成 · 常見病症取穴</a>'],
  'renji/shanghan/01-taiyang.html': ['<a class="prev-disabled"><span class="dir">← 上一部</span>神農本草經（已完結）</a>', '<a href="../bencao/05-junchen-zuoshi.html"><span class="dir">← 上一部</span>神農本草經 · 君臣佐使</a>'],
  'renji/jingui/01-zangfu-jingluo.html': ['<a class="prev-disabled"><span class="dir">← 上一部</span>傷寒論（已完結）</a>', '<a href="../shanghan/07-fangzheng-duizhao.html"><span class="dir">← 上一部</span>傷寒論 · 六經核心方證</a>']
};
for (const [relative, replacements] of Object.entries(previousLinks)) edit(relative, [replacements]);

// Remove completion-state metadata from headers, pagers, and footers.
const uiCleanup = {
  'tianji/yijing/05-yijing-yu-zhongyi.html': [['（易經完結篇）', ''], [' · 模組完結</footer>', '</footer>']],
  'tianji/bazi/01-tiangan-dizhi.html': [['易經（已完結）', '易經 · 易經與中醫']],
  'tianji/bazi/06-shili-shizhan.html': [['（八字命理完結篇）', ''], [' · 模組完結</footer>', '</footer>']],
  'tianji/heluo/01-hetu-luoshu.html': [['八字命理（已完結）', '八字命理 · 命例實戰']],
  'tianji/heluo/03-fengshui-yangzhai.html': [['（本主題完結篇 · 天紀全線完結）', ''], [' · 天紀全線完結</footer>', '</footer>']],
  'renji/zhenjiu/06-changjian-bingzheng.html': [['（針灸大成完結篇）', ''], [' · 模組完結</footer>', '</footer>']],
  'renji/shanghan/07-fangzheng-duizhao.html': [['（傷寒論完結篇）', ''], [' · 模組完結</footer>', '</footer>']],
  'renji/jingui/05-furen-bing.html': [['常用方劑速查表（金匱要略完結篇）', '常用方劑速查表']],
  'renji/jingui/06-fangji-suzha.html': [
    ['（金匱要略完結篇 · 人紀全線完結）', ''],
    ['<div class="sub">金匱要略全書方劑彙整，並回顧人紀五部經典的完整學習路徑</div>', '<div class="sub">前五講核心方劑彙整，並回顧人紀五部經典的學習路徑</div>'],
    ['到這裡，人紀五部經典全部上線，完整路徑是：', '人紀五部經典的完整路徑是：'],
    ['人紀總覽（五部經典已全部完結）', '人紀總覽'],
    [' · 模組完結 · 人紀全線完結</footer>', '</footer>'],
    ['「通讀→抄寫→背誦→跟課→實踐」', '「通讀→抄寫→背誦→對照原典→複習」']
  ]
};
for (const [relative, replacements] of Object.entries(uiCleanup)) edit(relative, replacements);

// Make the two summary pages accurately promise representative/core coverage.
for (const relative of ['renji/shanghan/07-fangzheng-duizhao.html', 'renji/index.html', 'renji/jingui/01-zangfu-jingluo.html']) {
  edit(relative, [[/經方總覽與方證對應表/g, '六經核心方證總覽']]);
}
edit('renji/shanghan/07-fangzheng-duizhao.html', [
  ['<div class="sub">六經六方一次看完，作為全書的速查總結</div>', '<div class="sub">六經代表方證集中對照，作為前六講的複習索引</div>'],
  ['作為日後複習、臨床快速定位的速查工具', '作為日後複習與查找前文的索引'],
  ['七講讀完，代表已具備人紀路線核心的辨證論治能力', '七講讀完，代表已建立進一步研讀六經方證的基礎框架']
]);
edit('renji/jingui/06-fangji-suzha.html', [
  ['這一講把主要方劑收攏成總表，方便日後臨床速查', '這一講把前五講出現的主要方劑收攏成總表，方便日後複習查找']
]);

// Add scannable in-page navigation to the two long acupuncture indexes.
function addLessonToc(relative, items) {
  const file = path.join(root, relative);
  let html = fs.readFileSync(file, 'utf8');
  for (const item of items) {
    const heading = `<h2>${item.heading}</h2>`;
    if (!html.includes(heading)) throw new Error(`${relative} 找不到標題：${item.heading}`);
    html = html.replace(heading, `<h2 id="${item.id}">${item.heading}</h2>`);
  }
  const nav = `<nav class="lesson-toc" aria-label="本講目錄"><strong>本講目錄</strong>${items.map(item => `<a href="#${item.id}">${item.label}</a>`).join('')}</nav>`;
  const noteEnd = '</aside>';
  const firstNote = html.indexOf(noteEnd, html.indexOf('class="provenance-note"'));
  html = html.slice(0, firstNote + noteEnd.length) + `\n\n    ${nav}` + html.slice(firstNote + noteEnd.length);
  fs.writeFileSync(file, html, 'utf8');
}

addLessonToc('renji/zhenjiu/02-shou-sanyin-sanyang.html', [
  { id: 'lung', heading: '一、手太陰肺經（11穴）', label: '肺經' },
  { id: 'large-intestine', heading: '二、手陽明大腸經（20穴）', label: '大腸經' },
  { id: 'pericardium', heading: '三、手厥陰心包經（9穴）', label: '心包經' },
  { id: 'sanjiao', heading: '四、手少陽三焦經（23穴）', label: '三焦經' },
  { id: 'heart', heading: '五、手少陰心經（9穴）', label: '心經' },
  { id: 'small-intestine', heading: '六、手太陽小腸經（19穴）', label: '小腸經' },
  { id: 'measurement', heading: '七、取穴要領：骨度分寸與同身寸', label: '取穴要領' }
]);
addLessonToc('renji/zhenjiu/03-zu-sanyin-sanyang.html', [
  { id: 'stomach', heading: '一、足陽明胃經（45穴）', label: '胃經' },
  { id: 'spleen', heading: '二、足太陰脾經（21穴）', label: '脾經' },
  { id: 'gallbladder', heading: '三、足少陽膽經（44穴）', label: '膽經' },
  { id: 'liver', heading: '四、足厥陰肝經（14穴）', label: '肝經' },
  { id: 'kidney', heading: '五、足少陰腎經（27穴）', label: '腎經' },
  { id: 'bladder', heading: '六、足太陽膀胱經（67穴）', label: '膀胱經' }
]);

console.log(`第二階段修正完成：${htmlFiles.length} 個 HTML 已處理。`);
