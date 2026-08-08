import type { KnowledgeEntity, KnowledgeRelation, Lesson, Source } from "@/lib/knowledge-schema";

const editorialSourceId = "source:project:renji-acupuncture-notes";
const whoSourceId = "source:reference:who-acupuncture-nomenclature";
const fiveShuReferenceSourceId = "source:reference:bucm-five-shu";
const derivedSourceId = "source:derived:renji-acupuncture-pilot";
const overviewLessonId = "lesson:renji:acupuncture:01";
const fiveShuLessonId = "lesson:renji:acupuncture:02";

export const renjiAcupunctureSources: Source[] = [
  {
    id: editorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站人紀針灸既有課程筆記", "zh-Hans": "本站人纪针灸既有课程笔记" },
    section: "renji/zhenjiu/01–03",
    note: {
      "zh-Hant": "依傳統針灸文獻、本站既有課程筆記與編輯整理而成；不是倪海廈老師講課逐字稿。",
      "zh-Hans": "依传统针灸文献、本站既有课程笔记与编辑整理而成；不是倪海厦老师讲课逐字稿。",
    },
  },
  {
    id: whoSourceId,
    category: "reference",
    title: { "zh-Hant": "WHO 標準針灸穴位定位", "zh-Hans": "WHO 标准针灸穴位定位" },
    work: { "zh-Hant": "WHO Standard Acupuncture Point Locations in the Western Pacific Region", "zh-Hans": "WHO Standard Acupuncture Point Locations in the Western Pacific Region" },
    url: "https://iris.who.int/handle/10665/353407",
    note: { "zh-Hant": "僅用於核對經脈與穴位的標準代碼及命名，不作療效依據。", "zh-Hans": "仅用于核对经脉与穴位的标准代码及命名，不作疗效依据。" },
  },
  {
    id: fiveShuReferenceSourceId,
    category: "reference",
    title: { "zh-Hant": "北京中醫藥大學針灸學：五輸穴", "zh-Hans": "北京中医药大学针灸学：五输穴" },
    author: { "zh-Hant": "北京中醫藥大學遠程教育學院", "zh-Hans": "北京中医药大学远程教育学院" },
    url: "https://jxjyxb.bucm.edu.cn/BZYAttachs/courseware/zhenjiuxue/c1/c1_61a.htm",
    note: { "zh-Hant": "用於核對陰陽經五輸次序與五行配屬；不將教學頁內容歸為倪海廈講授。", "zh-Hans": "用于核对阴阳经五输次序与五行配属；不将教学页内容归为倪海厦讲授。" },
  },
  {
    id: derivedSourceId,
    category: "derived",
    title: { "zh-Hant": "人紀針灸知識結構化整理", "zh-Hans": "人纪针灸知识结构化整理" },
    note: { "zh-Hant": "將經脈、臟腑、穴位、穴位分類與共享五行／陰陽轉為可驗證關係；不新增診斷或治療推論。", "zh-Hans": "将经脉、脏腑、穴位、穴位分类与共享五行／阴阳转为可验证关系；不新增诊断或治疗推论。" },
  },
];

const meridianRows = [
  ["lung", "手太陰肺經", "手太阴肺经", "lung", "taiyin", "yin", "metal", "LU", "手三陰"],
  ["large-intestine", "手陽明大腸經", "手阳明大肠经", "large-intestine", "yangming", "yang", "metal", "LI", "手三陽"],
  ["stomach", "足陽明胃經", "足阳明胃经", "stomach", "yangming", "yang", "earth", "ST", "足三陽"],
  ["spleen", "足太陰脾經", "足太阴脾经", "spleen", "taiyin", "yin", "earth", "SP", "足三陰"],
  ["heart", "手少陰心經", "手少阴心经", "heart", "shaoyin", "yin", "fire", "HT", "手三陰"],
  ["small-intestine", "手太陽小腸經", "手太阳小肠经", "small-intestine", "taiyang", "yang", "fire", "SI", "手三陽"],
  ["bladder", "足太陽膀胱經", "足太阳膀胱经", "bladder", "taiyang", "yang", "water", "BL", "足三陽"],
  ["kidney", "足少陰腎經", "足少阴肾经", "kidney", "shaoyin", "yin", "water", "KI", "足三陰"],
  ["pericardium", "手厥陰心包經", "手厥阴心包经", "pericardium", "jueyin", "yin", "fire", "PC", "手三陰"],
  ["sanjiao", "手少陽三焦經", "手少阳三焦经", "sanjiao", "shaoyang", "yang", "fire", "TE", "手三陽"],
  ["gallbladder", "足少陽膽經", "足少阳胆经", "gallbladder", "shaoyang", "yang", "wood", "GB", "足三陽"],
  ["liver", "足厥陰肝經", "足厥阴肝经", "liver", "jueyin", "yin", "wood", "LR", "足三陰"],
] as const;

const organRows = [
  ["lung", "肺", "肺", "metal"], ["large-intestine", "大腸", "大肠", "metal"],
  ["stomach", "胃", "胃", "earth"], ["spleen", "脾", "脾", "earth"],
  ["heart", "心", "心", "fire"], ["small-intestine", "小腸", "小肠", "fire"],
  ["bladder", "膀胱", "膀胱", "water"], ["kidney", "腎", "肾", "water"],
  ["pericardium", "心包", "心包", "fire"], ["sanjiao", "三焦", "三焦", "fire"],
  ["gallbladder", "膽", "胆", "wood"], ["liver", "肝", "肝", "wood"],
] as const;

const levelRows = [
  ["taiyin", "太陰", "太阴", "yin"], ["shaoyin", "少陰", "少阴", "yin"], ["jueyin", "厥陰", "厥阴", "yin"],
  ["yangming", "陽明", "阳明", "yang"], ["taiyang", "太陽", "太阳", "yang"], ["shaoyang", "少陽", "少阳", "yang"],
] as const;

const categoryRows = [
  ["well", "井穴", "井穴", ["井"]], ["spring", "滎穴", "荥穴", ["滎", "荥"]],
  ["stream", "輸穴", "输穴", ["輸", "输", "腧穴"]], ["river", "經穴", "经穴", ["經", "经"]],
  ["sea", "合穴", "合穴", ["合"]], ["source", "原穴", "原穴", []],
  ["connecting", "絡穴", "络穴", []], ["cleft", "郄穴", "郄穴", []],
  ["front-mu", "募穴", "募穴", ["前募穴"]], ["back-shu", "背俞穴", "背俞穴", ["俞穴"]],
  ["eight-confluent", "八脈交會穴", "八脉交会穴", []], ["crossing", "交會穴", "交会穴", ["三經交會穴", "三经交会穴"]],
] as const;

type PointRow = readonly [string, string, string, string, string, readonly string[], string?];
const pointRows: PointRow[] = [
  ["lu-01", "LU1", "中府", "中府", "lung", ["front-mu"]],
  ["lu-05", "LU5", "尺澤", "尺泽", "lung", ["sea"], "water"],
  ["lu-06", "LU6", "孔最", "孔最", "lung", ["cleft"]],
  ["lu-07", "LU7", "列缺", "列缺", "lung", ["connecting", "eight-confluent"]],
  ["lu-09", "LU9", "太淵", "太渊", "lung", ["stream", "source"], "earth"],
  ["lu-11", "LU11", "少商", "少商", "lung", ["well"], "wood"],
  ["li-01", "LI1", "商陽", "商阳", "large-intestine", ["well"], "metal"],
  ["li-04", "LI4", "合谷", "合谷", "large-intestine", ["source"]],
  ["li-11", "LI11", "曲池", "曲池", "large-intestine", ["sea"], "earth"],
  ["st-36", "ST36", "足三里", "足三里", "stomach", ["sea"], "earth"],
  ["st-40", "ST40", "豐隆", "丰隆", "stomach", ["connecting"]],
  ["sp-04", "SP4", "公孫", "公孙", "spleen", ["connecting", "eight-confluent"]],
  ["sp-06", "SP6", "三陰交", "三阴交", "spleen", ["crossing"]],
  ["sp-09", "SP9", "陰陵泉", "阴陵泉", "spleen", ["sea"], "water"],
  ["ht-07", "HT7", "神門", "神门", "heart", ["stream", "source"], "earth"],
  ["si-03", "SI3", "後溪", "后溪", "small-intestine", ["stream", "eight-confluent"], "wood"],
  ["bl-13", "BL13", "肺俞", "肺俞", "bladder", ["back-shu"]],
  ["bl-40", "BL40", "委中", "委中", "bladder", ["sea"], "earth"],
  ["bl-60", "BL60", "崑崙", "昆仑", "bladder", ["river"], "fire"],
  ["ki-01", "KI1", "湧泉", "涌泉", "kidney", ["well"], "wood"],
  ["ki-03", "KI3", "太谿", "太溪", "kidney", ["stream", "source"], "earth"],
  ["pc-06", "PC6", "內關", "内关", "pericardium", ["eight-confluent"]],
  ["te-05", "TE5", "外關", "外关", "sanjiao", ["eight-confluent"]],
  ["gb-34", "GB34", "陽陵泉", "阳陵泉", "gallbladder", ["sea"], "earth"],
  ["lr-01", "LR1", "大敦", "大敦", "liver", ["well"], "wood"],
  ["lr-02", "LR2", "行間", "行间", "liver", ["spring"], "fire"],
  ["lr-03", "LR3", "太衝", "太冲", "liver", ["stream", "source"], "earth"],
  ["lr-04", "LR4", "中封", "中封", "liver", ["river"], "metal"],
  ["lr-08", "LR8", "曲泉", "曲泉", "liver", ["sea"], "water"],
];

const meridianIds = meridianRows.map(([id]) => `meridian:${id}`);
const organIds = organRows.map(([id]) => `organ:${id}`);
const levelIds = levelRows.map(([id]) => `meridian-level:${id}`);
const categoryIds = categoryRows.map(([id]) => `point-category:${id}`);
const pointIds = pointRows.map(([id]) => `acupoint:${id}`);

export const renjiAcupunctureLessons: Lesson[] = [
  {
    id: overviewLessonId, slug: "lesson-renji-acupuncture-01", type: "lesson",
    labels: { "zh-Hant": "十二正經、臟腑與陰陽五行", "zh-Hans": "十二正经、脏腑与阴阳五行" },
    descriptions: { "zh-Hant": "以十二正經為入口，辨認手足、陰陽、六個經脈層級、所屬臟腑與共享五行。", "zh-Hans": "以十二正经为入口，辨认手足、阴阳、六个经脉层级、所属脏腑与共享五行。" },
    aliases: { "zh-Hant": ["十二經脈", "經絡總論"], "zh-Hans": ["十二经脉", "经络总论"] },
    metadata: { order: 1, module: { "zh-Hant": "針灸", "zh-Hans": "针灸" } },
    sourceIds: [editorialSourceId, whoSourceId, derivedSourceId], relatedLessonIds: [fiveShuLessonId],
    courseId: "course:renji", moduleId: "system:acupuncture", order: 1,
    route: ["renji", "acupuncture", "01-meridians"], legacyPath: "renji/zhenjiu/01-jingluo-liuzhu.html",
    relatedEntityIds: [...meridianIds, ...organIds, ...levelIds, "yin-yang:yin", "yin-yang:yang", "element:wood", "element:fire", "element:earth", "element:metal", "element:water"],
  },
  {
    id: fiveShuLessonId, slug: "lesson-renji-acupuncture-02", type: "lesson",
    labels: { "zh-Hant": "五輸穴與代表穴位分類", "zh-Hans": "五输穴与代表穴位分类" },
    descriptions: { "zh-Hant": "以 29 個代表穴位說明經脈隸屬、原絡郄募俞分類、五輸次序與五行配屬。", "zh-Hans": "以 29 个代表穴位说明经脉隶属、原络郄募俞分类、五输次序与五行配属。" },
    aliases: { "zh-Hant": ["五輸穴", "穴位分類"], "zh-Hans": ["五输穴", "穴位分类"] },
    metadata: { order: 2, module: { "zh-Hant": "針灸", "zh-Hans": "针灸" } },
    sourceIds: [editorialSourceId, whoSourceId, fiveShuReferenceSourceId, derivedSourceId], relatedLessonIds: [overviewLessonId],
    courseId: "course:renji", moduleId: "system:acupuncture", order: 2,
    route: ["renji", "acupuncture", "02-five-shu"], legacyPath: "renji/zhenjiu/03-zu-sanyin-sanyang.html",
    relatedEntityIds: ["concept:five-shu", ...categoryIds, ...pointIds, "element:wood", "element:fire", "element:earth", "element:metal", "element:water"],
  },
];

export const renjiAcupunctureEntities: KnowledgeEntity[] = [
  {
    id: "course:renji", slug: "course-renji", type: "course", labels: { "zh-Hant": "人紀", "zh-Hans": "人纪" },
    descriptions: { "zh-Hant": "本站醫學經典研讀主線；針灸結構化內容只作教育入口，不延伸為診療工具。", "zh-Hans": "本站医学经典研读主线；针灸结构化内容只作教育入口，不延伸为诊疗工具。" },
    aliases: { "zh-Hant": [], "zh-Hans": [] }, metadata: { order: 2 }, sourceIds: [editorialSourceId], relatedLessonIds: [overviewLessonId, fiveShuLessonId],
  },
  {
    id: "system:acupuncture", slug: "system-acupuncture", type: "concept", labels: { "zh-Hant": "針灸知識系統", "zh-Hans": "针灸知识系统" },
    descriptions: { "zh-Hant": "連結經脈、臟腑、穴位、分類與來源的教育性知識入口。", "zh-Hans": "连接经脉、脏腑、穴位、分类与来源的教育性知识入口。" },
    aliases: { "zh-Hant": ["針灸", "針灸大成"], "zh-Hans": ["针灸", "针灸大成"] }, metadata: {}, sourceIds: [editorialSourceId, derivedSourceId], relatedLessonIds: [overviewLessonId, fiveShuLessonId],
  },
  {
    id: "concept:five-shu", slug: "concept-five-shu", type: "concept", labels: { "zh-Hant": "五輸穴", "zh-Hans": "五输穴" },
    descriptions: { "zh-Hant": "井、滎、輸、經、合五類特定穴的共同系統；穴位身份、分類與五行配屬分開建模。", "zh-Hans": "井、荥、输、经、合五类特定穴的共同系统；穴位身份、分类与五行配属分开建模。" },
    aliases: { "zh-Hant": ["五俞穴"], "zh-Hans": ["五腧穴", "五俞穴"] }, metadata: {}, sourceIds: [editorialSourceId, fiveShuReferenceSourceId, derivedSourceId], relatedLessonIds: [fiveShuLessonId],
  },
  ...levelRows.map(([id, hant, hans, polarity]) => ({
    id: `meridian-level:${id}`, slug: `meridian-level-${id}`, type: "meridian_level" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}是十二正經命名中的經脈層級；此處不把它等同於《傷寒論》辨證。`, "zh-Hans": `${hans}是十二正经命名中的经脉层级；此处不把它等同于《伤寒论》辨证。` },
    aliases: { "zh-Hant": [`${hant}經`], "zh-Hans": [`${hans}经`] }, metadata: {}, sourceIds: [editorialSourceId, derivedSourceId], relatedLessonIds: [overviewLessonId],
  })),
  ...organRows.map(([id, hant, hans, element]) => ({
    id: `organ:${id}`, slug: `organ-${id}`, type: "organ" as const, labels: { "zh-Hant": hant, "zh-Hans": hans },
    descriptions: { "zh-Hant": `${hant}的共享知識身份，可由針灸、內經、傷寒、金匱與方藥模組共同引用。`, "zh-Hans": `${hans}的共享知识身份，可由针灸、内经、伤寒、金匮与方药模块共同引用。` },
    aliases: { "zh-Hant": [`${hant}系統`], "zh-Hans": [`${hans}系统`] }, metadata: {}, sourceIds: [editorialSourceId, derivedSourceId], relatedLessonIds: [overviewLessonId],
  })),
  ...meridianRows.map(([id, hant, hans, organ, level, polarity, element, code, bodyDivision]) => ({
    id: `meridian:${id}`, slug: `meridian-${id}`, type: "meridian" as const, labels: { "zh-Hant": hant, "zh-Hans": hans },
    descriptions: { "zh-Hant": `${bodyDivision}之一，對應${organRows.find(([key]) => key === organ)?.[1]}、${levelRows.find(([key]) => key === level)?.[1]}與${polarity === "yin" ? "陰" : "陽"}；循行與穴位定位請回典藏課程深讀。`, "zh-Hans": `${bodyDivision.replace("陰", "阴").replace("陽", "阳")}之一，对应${organRows.find(([key]) => key === organ)?.[2]}、${levelRows.find(([key]) => key === level)?.[2]}与${polarity === "yin" ? "阴" : "阳"}；循行与穴位定位请回典藏课程深读。` },
    aliases: { "zh-Hant": [`${organRows.find(([key]) => key === organ)?.[1]}經`, code], "zh-Hans": [`${organRows.find(([key]) => key === organ)?.[2]}经`, code] },
    metadata: { standardCode: code, bodyDivision: { "zh-Hant": bodyDivision, "zh-Hans": bodyDivision.replace("陰", "阴").replace("陽", "阳") }, visualReadiness: { "zh-Hant": "未加入解剖座標／經脈路徑", "zh-Hans": "未加入解剖坐标／经脉路径" } },
    sourceIds: [editorialSourceId, whoSourceId, derivedSourceId], relatedLessonIds: [overviewLessonId, fiveShuLessonId],
  })),
  ...categoryRows.map(([id, hant, hans, aliases]) => ({
    id: `point-category:${id}`, slug: `point-category-${id}`, type: "point_category" as const, labels: { "zh-Hant": hant, "zh-Hans": hans },
    descriptions: { "zh-Hant": `${hant}是可跨經脈查詢的穴位分類，不等同於任何單一穴位。`, "zh-Hans": `${hans}是可跨经脉查询的穴位分类，不等同于任何单一穴位。` },
    aliases: { "zh-Hant": [...aliases], "zh-Hans": [...aliases.map((alias) => alias.replace("輸", "输").replace("滎", "荥").replace("絡", "络").replace("會", "会").replace("經", "经"))] },
    metadata: {}, sourceIds: [editorialSourceId, derivedSourceId], relatedLessonIds: [fiveShuLessonId],
  })),
  ...pointRows.map(([id, code, hant, hans, meridian, categories, element]) => ({
    id: `acupoint:${id}`, slug: `acupoint-${id}`, type: "acupoint" as const, labels: { "zh-Hant": hant, "zh-Hans": hans },
    descriptions: { "zh-Hant": `${meridianRows.find(([key]) => key === meridian)?.[1]}的代表穴位；本頁只整理經脈隸屬與可追溯分類，不提供自行針刺指示。`, "zh-Hans": `${meridianRows.find(([key]) => key === meridian)?.[2]}的代表穴位；本页只整理经脉隶属与可追溯分类，不提供自行针刺指示。` },
    aliases: { "zh-Hant": [code], "zh-Hans": [code] }, metadata: { standardCode: code, visualReadiness: { "zh-Hant": "未加入人體座標", "zh-Hans": "未加入人体坐标" } },
    sourceIds: [editorialSourceId, whoSourceId, derivedSourceId], relatedLessonIds: [fiveShuLessonId],
  })),
];

const relation = (type: KnowledgeRelation["type"], from: string, to: string, sourceIds: string[]): KnowledgeRelation => ({
  id: `relation:${from.replaceAll(":", "-")}:${type.replaceAll("_", "-")}:${to.replaceAll(":", "-")}`,
  type, from, to, sourceIds,
});

const coreSources = [editorialSourceId, derivedSourceId];
const pointSources = [editorialSourceId, whoSourceId, derivedSourceId];
const fiveShuSources = [editorialSourceId, fiveShuReferenceSourceId, derivedSourceId];

export const renjiAcupunctureRelations: KnowledgeRelation[] = [
  relation("part_of", "system:acupuncture", "course:renji", coreSources),
  ...renjiAcupunctureLessons.map((lesson) => relation("part_of", lesson.id, lesson.moduleId, lesson.sourceIds)),
  ...meridianIds.map((id) => relation("contains", overviewLessonId, id, coreSources)),
  ...organIds.map((id) => relation("contains", overviewLessonId, id, coreSources)),
  ...levelIds.map((id) => relation("contains", overviewLessonId, id, coreSources)),
  ...pointIds.map((id) => relation("contains", fiveShuLessonId, id, coreSources)),
  ...categoryIds.map((id) => relation("contains", fiveShuLessonId, id, coreSources)),
  relation("contains", fiveShuLessonId, "concept:five-shu", coreSources),
  ...categoryRows.slice(0, 5).map(([id]) => relation("part_of", `point-category:${id}`, "concept:five-shu", fiveShuSources)),
  ...levelRows.map(([id, , , polarity]) => relation("corresponds_to", `meridian-level:${id}`, `yin-yang:${polarity}`, coreSources)),
  ...organRows.map(([id, , , element]) => relation("element_of", `organ:${id}`, `element:${element}`, coreSources)),
  ...meridianRows.flatMap(([id, , , organ, level, polarity]) => [
    relation("corresponds_to", `meridian:${id}`, `organ:${organ}`, coreSources),
    relation("corresponds_to", `meridian:${id}`, `meridian-level:${level}`, coreSources),
    relation("corresponds_to", `meridian:${id}`, `yin-yang:${polarity}`, coreSources),
  ]),
  ...pointRows.flatMap(([id, , , , meridian, categories, element]) => [
    relation("belongs_to", `acupoint:${id}`, `meridian:${meridian}`, pointSources),
    ...categories.map((category) => relation("classified_as", `acupoint:${id}`, `point-category:${category}`, category === "well" || category === "spring" || category === "stream" || category === "river" || category === "sea" ? fiveShuSources : coreSources)),
    ...(element ? [relation("element_of", `acupoint:${id}`, `element:${element}`, fiveShuSources)] : []),
  ]),
];

export const renjiPilotCounts = {
  meridians: meridianRows.length,
  organs: organRows.length,
  meridianLevels: levelRows.length,
  pointCategories: categoryRows.length,
  acupoints: pointRows.length,
};
