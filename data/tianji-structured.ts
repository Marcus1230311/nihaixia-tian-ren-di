import type { KnowledgeEntity, KnowledgeRelation, Lesson, Source } from "@/lib/knowledge-schema";

export const baziEditorialSourceId = "source:project:tianji-bazi-notes";
export const heluoEditorialSourceId = "source:project:tianji-heluo-notes";
export const baziDerivedSourceId = "source:derived:bazi-core-structure";
export const heluoDerivedSourceId = "source:derived:heluo-correspondences";

export const tianjiStructuredSources: Source[] = [
  {
    id: baziEditorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站天紀八字課程筆記整理", "zh-Hans": "本站天纪八字课程笔记整理" },
    note: {
      "zh-Hant": "依既有天紀八字頁、傳統命理基礎概念與編輯整理而成；不是逐字講稿，也不提供命運判斷。",
      "zh-Hans": "依既有天纪八字页、传统命理基础概念与编辑整理而成；不是逐字讲稿，也不提供命运判断。",
    },
  },
  {
    id: heluoEditorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站天紀河圖洛書課程筆記整理", "zh-Hans": "本站天纪河图洛书课程笔记整理" },
    note: {
      "zh-Hant": "依既有河圖洛書入門頁的數字、方位、五行與後天八卦表整理；不同流派的延伸規則不在本次範圍。",
      "zh-Hans": "依既有河图洛书入门页的数字、方位、五行与后天八卦表整理；不同流派的延伸规则不在本次范围。",
    },
  },
  {
    id: baziDerivedSourceId,
    category: "derived",
    title: { "zh-Hant": "天干地支與十神結構化整理", "zh-Hans": "天干地支与十神结构化整理" },
    note: {
      "zh-Hant": "將既有課程表格轉為穩定 ID、陰陽、五行與十神分類；未納入藏干、合沖刑害或命盤推導。",
      "zh-Hans": "将既有课程表格转为稳定 ID、阴阳、五行与十神分类；未纳入藏干、合冲刑害或命盘推导。",
    },
  },
  {
    id: heluoDerivedSourceId,
    category: "derived",
    title: { "zh-Hant": "河洛數字與方位對應結構化整理", "zh-Hans": "河洛数字与方位对应结构化整理" },
    note: {
      "zh-Hant": "將既有河圖、洛書表格轉為數字、方位、五行、陰陽與八卦之間的可驗證關係。",
      "zh-Hans": "将既有河图、洛书表格转为数字、方位、五行、阴阳与八卦之间的可验证关系。",
    },
  },
];

export const elementRows = [
  ["wood", "木", "木", "生發、條達的五行類別", "生发、条达的五行类别"],
  ["fire", "火", "火", "炎上、溫熱的五行類別", "炎上、温热的五行类别"],
  ["earth", "土", "土", "承載、化育的五行類別", "承载、化育的五行类别"],
  ["metal", "金", "金", "收斂、肅降的五行類別", "收敛、肃降的五行类别"],
  ["water", "水", "水", "潤下、收藏的五行類別", "润下、收藏的五行类别"],
] as const;

const yinYangRows = [
  ["yang", "陽", "阳", "偏向主動、外展與明顯的分類面向"],
  ["yin", "陰", "阴", "偏向安靜、內收與含藏的分類面向"],
] as const;

const stemRows = [
  ["jia", "甲", "甲", "wood", "yang"], ["yi", "乙", "乙", "wood", "yin"],
  ["bing", "丙", "丙", "fire", "yang"], ["ding", "丁", "丁", "fire", "yin"],
  ["wu", "戊", "戊", "earth", "yang"], ["ji", "己", "己", "earth", "yin"],
  ["geng", "庚", "庚", "metal", "yang"], ["xin", "辛", "辛", "metal", "yin"],
  ["ren", "壬", "壬", "water", "yang"], ["gui", "癸", "癸", "water", "yin"],
] as const;

const branchRows = [
  ["zi", "子", "子", "鼠", "鼠", "water", "yang"], ["chou", "丑", "丑", "牛", "牛", "earth", "yin"],
  ["yin", "寅", "寅", "虎", "虎", "wood", "yang"], ["mao", "卯", "卯", "兔", "兔", "wood", "yin"],
  ["chen", "辰", "辰", "龍", "龙", "earth", "yang"], ["si", "巳", "巳", "蛇", "蛇", "fire", "yin"],
  ["wu", "午", "午", "馬", "马", "fire", "yang"], ["wei", "未", "未", "羊", "羊", "earth", "yin"],
  ["shen", "申", "申", "猴", "猴", "metal", "yang"], ["you", "酉", "酉", "雞", "鸡", "metal", "yin"],
  ["xu", "戌", "戌", "狗", "狗", "earth", "yang"], ["hai", "亥", "亥", "豬", "猪", "water", "yin"],
] as const;

const tenGodRows = [
  ["bijian", "比肩", "比肩", "同我", "陰陽相同", []],
  ["jiecai", "劫財", "劫财", "同我", "陰陽不同", []],
  ["shishen", "食神", "食神", "我生", "陰陽相同", []],
  ["shangguan", "傷官", "伤官", "我生", "陰陽不同", []],
  ["piancai", "偏財", "偏财", "我剋", "陰陽相同", []],
  ["zhengcai", "正財", "正财", "我剋", "陰陽不同", []],
  ["qisha", "七殺", "七杀", "剋我", "陰陽相同", ["偏官"]],
  ["zhengguan", "正官", "正官", "剋我", "陰陽不同", []],
  ["pianyin", "偏印", "偏印", "生我", "陰陽相同", ["梟神"]],
  ["zhengyin", "正印", "正印", "生我", "陰陽不同", []],
] as const;

export const directionRows = [
  ["north", "北", "北", 0], ["northeast", "東北", "东北", 45],
  ["east", "東", "东", 90], ["southeast", "東南", "东南", 135],
  ["south", "南", "南", 180], ["southwest", "西南", "西南", 225],
  ["west", "西", "西", 270], ["northwest", "西北", "西北", 315],
  ["center", "中央", "中央", "居中"],
] as const;

export const heluoNumberRows = [
  [1, "north", "water", "kan"], [2, "south", "fire", "kun"], [3, "east", "wood", "zhen"],
  [4, "west", "metal", "xun"], [5, "center", "earth", null], [6, "north", "water", "qian"],
  [7, "south", "fire", "dui"], [8, "east", "wood", "gen"], [9, "west", "metal", "li"],
  [10, "center", "earth", null],
] as const;

const baziFoundationLessonId = "lesson:tianji:bazi:01";
const tenGodLessonId = "lesson:tianji:bazi:03";
const heluoLessonId = "lesson:tianji:heluo:01";

const stemIds = stemRows.map(([id]) => `heavenly-stem:${id}`);
const branchIds = branchRows.map(([id]) => `earthly-branch:${id}`);
const elementIds = elementRows.map(([id]) => `element:${id}`);
const yinYangIds = yinYangRows.map(([id]) => `yin-yang:${id}`);
const tenGodIds = tenGodRows.map(([id]) => `ten-god:${id}`);
const directionIds = directionRows.map(([id]) => `direction:${id}`);
const numberIds = heluoNumberRows.map(([number]) => `heluo:number:${String(number).padStart(2, "0")}`);
const trigramIds = ["qian", "kun", "zhen", "xun", "kan", "li", "gen", "dui"].map((id) => `trigram:${id}`);

export const tianjiStructuredLessons: Lesson[] = [
  {
    id: baziFoundationLessonId, slug: "lesson-tianji-bazi-01", type: "lesson",
    labels: { "zh-Hant": "天干地支基礎", "zh-Hans": "天干地支基础" },
    descriptions: { "zh-Hant": "先掌握十天干、十二地支的本氣五行與陰陽，再進入四柱和十神。", "zh-Hans": "先掌握十天干、十二地支的本气五行与阴阳，再进入四柱和十神。" },
    aliases: { "zh-Hant": ["干支基礎"], "zh-Hans": ["干支基础"] }, metadata: { order: 1, module: { "zh-Hant": "八字命理", "zh-Hans": "八字命理" } },
    sourceIds: [baziEditorialSourceId, baziDerivedSourceId], relatedLessonIds: [tenGodLessonId], courseId: "course:tianji", moduleId: "system:bazi", order: 6,
    route: ["tianji", "bazi", "01-tiangan-dizhi"], legacyPath: "tianji/bazi/01-tiangan-dizhi.html", relatedEntityIds: [...stemIds, ...branchIds, ...elementIds, ...yinYangIds],
  },
  {
    id: tenGodLessonId, slug: "lesson-tianji-bazi-03", type: "lesson",
    labels: { "zh-Hant": "十神系統", "zh-Hans": "十神系统" },
    descriptions: { "zh-Hant": "以日主為中心，用五行生剋方向與陰陽同異理解十種關係分類。", "zh-Hans": "以日主为中心，用五行生克方向与阴阳同异理解十种关系分类。" },
    aliases: { "zh-Hant": ["比劫食傷財官印"], "zh-Hans": ["比劫食伤财官印"] }, metadata: { order: 3, module: { "zh-Hant": "八字命理", "zh-Hans": "八字命理" } },
    sourceIds: [baziEditorialSourceId, baziDerivedSourceId], relatedLessonIds: [baziFoundationLessonId], courseId: "course:tianji", moduleId: "system:bazi", order: 7,
    route: ["tianji", "bazi", "03-shishen-xitong"], legacyPath: "tianji/bazi/03-shishen-xitong.html", relatedEntityIds: tenGodIds,
  },
  {
    id: heluoLessonId, slug: "lesson-tianji-heluo-01", type: "lesson",
    labels: { "zh-Hant": "河圖洛書基礎", "zh-Hans": "河图洛书基础" },
    descriptions: { "zh-Hant": "以河圖生成數與洛書九宮為主線，理解數字、方位、五行及後天八卦。", "zh-Hans": "以河图生成数与洛书九宫为主线，理解数字、方位、五行及后天八卦。" },
    aliases: { "zh-Hant": ["河洛理數", "九宮"], "zh-Hans": ["河洛理数", "九宫"] }, metadata: { order: 1, module: { "zh-Hant": "河洛理數", "zh-Hans": "河洛理数" } },
    sourceIds: [heluoEditorialSourceId, heluoDerivedSourceId], relatedLessonIds: [], courseId: "course:tianji", moduleId: "system:heluo", order: 8,
    route: ["tianji", "heluo", "01-hetu-luoshu"], legacyPath: "tianji/heluo/01-hetu-luoshu.html",
    relatedEntityIds: ["concept:hetu", "concept:luoshu", ...numberIds, ...directionIds, ...elementIds, ...yinYangIds, ...trigramIds],
  },
];

export const tianjiStructuredEntities: KnowledgeEntity[] = [
  {
    id: "system:bazi", slug: "system-bazi", type: "concept", labels: { "zh-Hant": "八字命理", "zh-Hans": "八字命理" },
    descriptions: { "zh-Hant": "以年月日時四柱干支為記錄框架，進一步學習五行、陰陽與十神關係的系統。", "zh-Hans": "以年月日时四柱干支为记录框架，进一步学习五行、阴阳与十神关系的系统。" },
    aliases: { "zh-Hant": ["四柱八字"], "zh-Hans": ["四柱八字"] }, metadata: {}, sourceIds: [baziEditorialSourceId], relatedLessonIds: [baziFoundationLessonId, tenGodLessonId],
  },
  {
    id: "system:heluo", slug: "system-heluo", type: "concept", labels: { "zh-Hant": "河洛理數", "zh-Hans": "河洛理数" },
    descriptions: { "zh-Hant": "以河圖與洛書的數字、方位及五行配置為核心的入門知識系統。", "zh-Hans": "以河图与洛书的数字、方位及五行配置为核心的入门知识系统。" },
    aliases: { "zh-Hant": ["河洛"], "zh-Hans": ["河洛"] }, metadata: {}, sourceIds: [heluoEditorialSourceId], relatedLessonIds: [heluoLessonId],
  },
  ...elementRows.map(([id, nameHant, nameHans, descriptionHant, descriptionHans]) => ({
    id: `element:${id}`, slug: `element-${id}`, type: "element" as const, labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": `${descriptionHant}；本站在易經、八字與河洛之間共用同一條目。`, "zh-Hans": `${descriptionHans}；本站在易经、八字与河洛之间共用同一条目。` },
    aliases: { "zh-Hant": [`${nameHant}行`], "zh-Hans": [`${nameHans}行`] }, metadata: {}, sourceIds: [baziEditorialSourceId, heluoEditorialSourceId], relatedLessonIds: ["lesson:tianji:yijing:05", baziFoundationLessonId, heluoLessonId],
  })),
  ...yinYangRows.map(([id, nameHant, nameHans, description]) => ({
    id: `yin-yang:${id}`, slug: `yin-yang-${id}`, type: "yin_yang" as const, labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": `${description}；作為跨易經、八字與河洛共用的分類概念。`, "zh-Hans": `${description}；作为跨易经、八字与河洛共用的分类概念。` },
    aliases: { "zh-Hant": [], "zh-Hans": [] }, metadata: {}, sourceIds: [baziEditorialSourceId, heluoEditorialSourceId], relatedLessonIds: ["lesson:tianji:yijing:01", baziFoundationLessonId, heluoLessonId],
  })),
  ...stemRows.map(([id, nameHant, nameHans, element, polarity], index) => ({
    id: `heavenly-stem:${id}`, slug: `heavenly-stem-${id}`, type: "heavenly_stem" as const, labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": `十天干第 ${index + 1} 位，屬${elementRows.find(([key]) => key === element)?.[1]}、${polarity === "yang" ? "陽" : "陰"}。`, "zh-Hans": `十天干第 ${index + 1} 位，属${elementRows.find(([key]) => key === element)?.[2]}、${polarity === "yang" ? "阳" : "阴"}。` },
    aliases: { "zh-Hant": [`${nameHant}干`], "zh-Hans": [`${nameHans}干`] }, metadata: { order: index + 1 }, sourceIds: [baziEditorialSourceId, baziDerivedSourceId], relatedLessonIds: [baziFoundationLessonId],
  })),
  ...branchRows.map(([id, nameHant, nameHans, zodiacHant, zodiacHans, element, polarity], index) => ({
    id: `earthly-branch:${id}`, slug: `earthly-branch-${id}`, type: "earthly_branch" as const, labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": `十二地支第 ${index + 1} 位，本氣屬${elementRows.find(([key]) => key === element)?.[1]}、${polarity === "yang" ? "陽" : "陰"}；進階藏干另行學習。`, "zh-Hans": `十二地支第 ${index + 1} 位，本气属${elementRows.find(([key]) => key === element)?.[2]}、${polarity === "yang" ? "阳" : "阴"}；进阶藏干另行学习。` },
    aliases: { "zh-Hant": [`${nameHant}支`, zodiacHant], "zh-Hans": [`${nameHans}支`, zodiacHans] }, metadata: { order: index + 1, zodiac: { "zh-Hant": zodiacHant, "zh-Hans": zodiacHans } }, sourceIds: [baziEditorialSourceId, baziDerivedSourceId], relatedLessonIds: [baziFoundationLessonId],
  })),
  ...tenGodRows.map(([id, nameHant, nameHans, axis, polarity, aliases]) => ({
    id: `ten-god:${id}`, slug: `ten-god-${id}`, type: "ten_god" as const, labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": `十神之一：相對日主為「${axis}」，判準為${polarity}；它是關係分類，不是固定附著於某一干支。`, "zh-Hans": `十神之一：相对日主为“${axis.replace("剋", "克")}”，判准为${polarity.replace("陰陽", "阴阳")}；它是关系分类，不是固定附着于某一干支。` },
    aliases: { "zh-Hant": [...aliases], "zh-Hans": aliases.map((alias) => alias.replace("梟", "枭")) }, metadata: { relationAxis: { "zh-Hant": axis, "zh-Hans": axis.replace("剋", "克") }, polarityRule: { "zh-Hant": polarity, "zh-Hans": polarity.replace("陰陽", "阴阳") } },
    sourceIds: [baziEditorialSourceId, baziDerivedSourceId], relatedLessonIds: [tenGodLessonId],
  })),
  ...directionRows.map(([id, nameHant, nameHans, bearing]) => ({
    id: `direction:${id}`, slug: `direction-${id}`, type: "direction" as const, labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": `${nameHant}方位；作為河洛、易經與未來其他領域共用的空間概念。`, "zh-Hans": `${nameHans}方位；作为河洛、易经与未来其他领域共用的空间概念。` },
    aliases: { "zh-Hant": id === "center" ? ["中"] : [`${nameHant}方`], "zh-Hans": id === "center" ? ["中"] : [`${nameHans}方`] }, metadata: { bearing }, sourceIds: [heluoEditorialSourceId, heluoDerivedSourceId], relatedLessonIds: [heluoLessonId],
  })),
  {
    id: "concept:hetu", slug: "concept-hetu", type: "concept", labels: { "zh-Hant": "河圖", "zh-Hans": "河图" }, descriptions: { "zh-Hant": "以一至十的生成數配合五方與五行的河洛圖式。", "zh-Hans": "以一至十的生成数配合五方与五行的河洛图式。" },
    aliases: { "zh-Hant": ["河圖生成數"], "zh-Hans": ["河图生成数"] }, metadata: {}, sourceIds: [heluoEditorialSourceId, heluoDerivedSourceId], relatedLessonIds: [heluoLessonId],
  },
  {
    id: "concept:luoshu", slug: "concept-luoshu", type: "concept", labels: { "zh-Hant": "洛書", "zh-Hans": "洛书" }, descriptions: { "zh-Hant": "一至九排列成九宮、各行列與對角線和皆為十五的數字圖式。", "zh-Hans": "一至九排列成九宫、各行列与对角线和皆为十五的数字图式。" },
    aliases: { "zh-Hant": ["洛書九宮", "九宮圖"], "zh-Hans": ["洛书九宫", "九宫图"] }, metadata: {}, sourceIds: [heluoEditorialSourceId, heluoDerivedSourceId], relatedLessonIds: [heluoLessonId],
  },
  ...heluoNumberRows.map(([number]) => ({
    id: `heluo:number:${String(number).padStart(2, "0")}`, slug: `heluo-number-${String(number).padStart(2, "0")}`, type: "concept" as const,
    labels: { "zh-Hant": `河洛數 ${number}`, "zh-Hans": `河洛数 ${number}` }, descriptions: { "zh-Hant": `數字 ${number} 在河圖生成數與洛書九宮脈絡中的語意條目，不代表一般整數。`, "zh-Hans": `数字 ${number} 在河图生成数与洛书九宫脉络中的语意条目，不代表一般整数。` },
    aliases: { "zh-Hant": [`河洛${number}`], "zh-Hans": [`河洛${number}`] }, metadata: { numberValue: number, numberRole: { "zh-Hant": number <= 5 ? "河圖生數" : "河圖成數", "zh-Hans": number <= 5 ? "河图生数" : "河图成数" } }, sourceIds: [heluoEditorialSourceId, heluoDerivedSourceId], relatedLessonIds: [heluoLessonId],
  })),
];

const relation = (type: KnowledgeRelation["type"], from: string, to: string, sourceIds: string[]): KnowledgeRelation => ({
  id: `relation:${from.replaceAll(":", "-")}:${type.replaceAll("_", "-")}:${to.replaceAll(":", "-")}`,
  type, from, to, sourceIds,
});

const baziSources = [baziEditorialSourceId, baziDerivedSourceId];
const heluoSources = [heluoEditorialSourceId, heluoDerivedSourceId];
const primaryLessonRelations = [
  ...stemIds.map((id) => relation("contains", baziFoundationLessonId, id, baziSources)),
  ...branchIds.map((id) => relation("contains", baziFoundationLessonId, id, baziSources)),
  ...tenGodIds.map((id) => relation("contains", tenGodLessonId, id, baziSources)),
  relation("contains", heluoLessonId, "concept:hetu", heluoSources),
  relation("contains", heluoLessonId, "concept:luoshu", heluoSources),
];

const elementByDirection = { north: "water", south: "fire", east: "wood", west: "metal", center: "earth" } as const;
const trigramByDirection = { north: "kan", southwest: "kun", east: "zhen", southeast: "xun", northwest: "qian", west: "dui", northeast: "gen", south: "li" } as const;
const elementByTrigram = { qian: "metal", kun: "earth", zhen: "wood", xun: "wood", kan: "water", li: "fire", gen: "earth", dui: "metal" } as const;
export const elementGeneratingPairs = [["wood", "fire"], ["fire", "earth"], ["earth", "metal"], ["metal", "water"], ["water", "wood"]] as const;
export const elementControllingPairs = [["wood", "earth"], ["earth", "water"], ["water", "fire"], ["fire", "metal"], ["metal", "wood"]] as const;

export const tianjiStructuredRelations: KnowledgeRelation[] = [
  relation("part_of", "system:bazi", "course:tianji", [baziEditorialSourceId]),
  relation("part_of", "system:heluo", "course:tianji", [heluoEditorialSourceId]),
  ...tianjiStructuredLessons.map((lesson) => relation("part_of", lesson.id, lesson.moduleId, lesson.sourceIds)),
  ...primaryLessonRelations,
  ...stemRows.flatMap(([id, , , element, polarity]) => [
    relation("element_of", `heavenly-stem:${id}`, `element:${element}`, baziSources),
    relation("corresponds_to", `heavenly-stem:${id}`, `yin-yang:${polarity}`, baziSources),
  ]),
  ...branchRows.flatMap(([id, , , , , element, polarity]) => [
    relation("element_of", `earthly-branch:${id}`, `element:${element}`, baziSources),
    relation("corresponds_to", `earthly-branch:${id}`, `yin-yang:${polarity}`, baziSources),
  ]),
  ...elementGeneratingPairs.map(([from, to]) => relation("generates", `element:${from}`, `element:${to}`, baziSources)),
  ...elementControllingPairs.map(([from, to]) => relation("controls", `element:${from}`, `element:${to}`, baziSources)),
  relation("part_of", "concept:hetu", "system:heluo", heluoSources),
  relation("part_of", "concept:luoshu", "system:heluo", heluoSources),
  ...heluoNumberRows.flatMap(([number, direction, element, trigram]) => {
    const numberId = `heluo:number:${String(number).padStart(2, "0")}`;
    const relations = [
      relation("part_of", numberId, "concept:hetu", heluoSources),
      relation("element_of", numberId, `element:${element}`, heluoSources),
      relation("corresponds_to", numberId, `direction:${direction}`, heluoSources),
      relation("corresponds_to", numberId, `yin-yang:${number % 2 ? "yang" : "yin"}`, heluoSources),
    ];
    if (number <= 9) relations.push(relation("part_of", numberId, "concept:luoshu", heluoSources));
    if (trigram) relations.push(relation("corresponds_to", numberId, `trigram:${trigram}`, heluoSources));
    return relations;
  }),
  ...Object.entries(elementByDirection).map(([direction, element]) => relation("element_of", `direction:${direction}`, `element:${element}`, heluoSources)),
  ...Object.entries(trigramByDirection).map(([direction, trigram]) => relation("corresponds_to", `trigram:${trigram}`, `direction:${direction}`, heluoSources)),
  ...Object.entries(elementByTrigram).map(([trigram, element]) => relation("element_of", `trigram:${trigram}`, `element:${element}`, heluoSources)),
];
