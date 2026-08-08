import type { KnowledgeEntity, KnowledgeRelation, Lesson, Source } from "@/lib/knowledge-schema";

const editorialSourceId = "source:project:renji-jingui-notes";
const classicalSourceId = "source:classical:jingui-yaolue";
const derivedSourceId = "source:derived:renji-jingui-model";

export const renjiJinguiSources: Source[] = [
  {
    id: editorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站人紀《金匱要略》既有課程筆記", "zh-Hans": "本站人纪《金匮要略》既有课程笔记" },
    section: "renji/jingui/01–06",
    note: {
      "zh-Hant": "用於病類、代表病證與方劑導讀；屬本站編輯整理，沒有可追溯依據的內容不標為倪海廈老師講授資料。",
      "zh-Hans": "用于病类、代表病证与方剂导读；属本站编辑整理，没有可追溯依据的内容不标为倪海厦老师讲授资料。",
    },
  },
  {
    id: classicalSourceId,
    category: "classical",
    title: { "zh-Hant": "《金匱要略》古典原文", "zh-Hans": "《金匮要略》古典原文" },
    work: { "zh-Hant": "金匱要略", "zh-Hans": "金匮要略" },
    author: { "zh-Hant": "張仲景", "zh-Hans": "张仲景" },
    url: "https://zh.wikisource.org/zh-hant/%E9%87%91%E5%8C%B1%E8%A6%81%E7%95%A5",
    note: { "zh-Hant": "用於核對經典身份、方名、方證與藥味組成；本站不重製全文、劑量或煎服法。", "zh-Hans": "用于核对经典身份、方名、方证与药味组成；本站不重制全文、剂量或煎服法。" },
  },
  {
    id: derivedSourceId,
    category: "derived",
    title: { "zh-Hant": "人紀金匱跨經典知識結構化整理", "zh-Hans": "人纪金匮跨经典知识结构化整理" },
    note: { "zh-Hant": "區分方劑／藥材身份與逐條關係證據，驗證跨經典重用；不產生診斷或處方推薦。", "zh-Hans": "区分方剂／药材身份与逐条关系证据，验证跨经典重用；不产生诊断或处方推荐。" },
  },
];

const lessonIds = Array.from({ length: 5 }, (_, index) => `lesson:renji:jingui:${String(index + 1).padStart(2, "0")}`);

const conditionRows = [
  ["blood-bi", "血痹", "血痹", "以肌膚不仁等為主題的金匱病類。"],
  ["lijie", "歷節", "历节", "以關節疼痛及風濕寒熱複合病機為主題的金匱病類。"],
  ["xulao", "虛勞", "虚劳", "以五勞七傷與內在不足為組織中心的金匱病類。"],
  ["lung-system", "肺系病", "肺系病", "本站將肺痿、肺癰與咳嗽上氣放在同一研讀入口，但不把三者合併為一證。"],
  ["abdominal-hanshan", "腹滿寒疝", "腹满寒疝", "用於比較中陽虛寒腹滿與血虛內寒寒疝的病類入口。"],
  ["fluid-retention", "痰飲", "痰饮", "以水飲停聚及其不同部位表現為組織中心的金匱病類。"],
  ["women", "婦人病", "妇人病", "涵蓋妊娠、產後與婦人雜病的章篇病類，不等同於任何單一病證。"],
] as const;

const syndromeRows = [
  ["blood-bi-qi-blood-deficiency", "血痹氣血不足證", "血痹气血不足证", "blood-bi"],
  ["lijie-wind-damp-cold-heat", "歷節風濕寒熱錯雜證", "历节风湿寒热错杂证", "lijie"],
  ["xulao-interior-urgency", "虛勞裡急證", "虚劳里急证", "xulao"],
  ["lung-wilt-dry-deficiency", "肺痿虛燥證", "肺痿虚燥证", "lung-system"],
  ["lung-abscess-heat-stasis", "肺癰熱毒瘀結證", "肺痈热毒瘀结证", "lung-system"],
  ["cough-cold-fluid", "咳嗽上氣寒飲證", "咳嗽上气寒饮证", "lung-system"],
  ["abdominal-fullness-cold-deficiency", "中陽虛寒腹滿證", "中阳虚寒腹满证", "abdominal-hanshan"],
  ["hanshan-blood-deficiency-cold", "血虛內寒寒疝證", "血虚内寒寒疝证", "abdominal-hanshan"],
  ["phlegm-fluid-spleen-yang", "脾陽不足痰飲證", "脾阳不足痰饮证", "fluid-retention"],
  ["pregnancy-mass-bleeding", "妊娠癥病漏下證", "妊娠症病漏下证", "women"],
  ["women-organ-restlessness", "婦人臟躁證", "妇人脏躁证", "women"],
  ["women-liver-spleen-abdominal-pain", "婦人肝脾失調腹痛證", "妇人肝脾失调腹痛证", "women"],
  ["pregnancy-guizhi", "妊娠桂枝湯證", "妊娠桂枝汤证", "women"],
  ["postpartum-stomach-repletion", "產後胃實證", "产后胃实证", "women"],
  ["postpartum-yumao", "產後鬱冒證", "产后郁冒证", "women"],
] as const;

const newFormulaRows = [
  ["huangqi-guizhi-wuwu-tang", "黃耆桂枝五物湯", "黄芪桂枝五物汤", "blood-bi-qi-blood-deficiency", ["huangqi", "guizhi", "shaoyao", "shengjiang", "dazao"]],
  ["guizhi-shaoyao-zhimu-tang", "桂枝芍藥知母湯", "桂枝芍药知母汤", "lijie-wind-damp-cold-heat", ["guizhi", "shaoyao", "gancao", "mahuang", "shengjiang", "baizhu", "zhimu", "fangfeng", "fuzi"]],
  ["xiaojianzhong-tang", "小建中湯", "小建中汤", "xulao-interior-urgency", ["guizhi", "shaoyao", "shengjiang", "dazao", "gancao", "yitang"]],
  ["maimendong-tang", "麥門冬湯", "麦门冬汤", "lung-wilt-dry-deficiency", ["maimendong", "banxia", "renshen", "gancao", "jingmi", "dazao"]],
  ["weijing-tang", "葦莖湯", "苇茎汤", "lung-abscess-heat-stasis", ["weijing", "yiyiren", "taoren", "dongguaren"]],
  ["shegan-mahuang-tang", "射干麻黃湯", "射干麻黄汤", "cough-cold-fluid", ["shegan", "mahuang", "shengjiang", "xixin", "ziwan", "kuandonghua", "wuweizi", "banxia", "dazao"]],
  ["dajianzhong-tang", "大建中湯", "大建中汤", "abdominal-fullness-cold-deficiency", ["shujiao", "ganjiang", "renshen", "yitang"]],
  ["danggui-shengjiang-yangrou-tang", "當歸生薑羊肉湯", "当归生姜羊肉汤", "hanshan-blood-deficiency-cold", ["danggui", "shengjiang", "yangrou"]],
  ["linggui-zhugan-tang", "苓桂朮甘湯", "苓桂术甘汤", "phlegm-fluid-spleen-yang", ["fuling", "guizhi", "baizhu", "gancao"]],
  ["guizhi-fuling-wan", "桂枝茯苓丸", "桂枝茯苓丸", "pregnancy-mass-bleeding", ["guizhi", "fuling", "mudanpi", "taoren", "shaoyao"]],
  ["ganmai-dazao-tang", "甘麥大棗湯", "甘麦大枣汤", "women-organ-restlessness", ["gancao", "xiaomai", "dazao"]],
  ["danggui-shaoyao-san", "當歸芍藥散", "当归芍药散", "women-liver-spleen-abdominal-pain", ["danggui", "shaoyao", "chuanxiong", "fuling", "baizhu", "zexie"]],
] as const;

const reusedFormulaRows = [
  ["guizhi-tang", "pregnancy-guizhi"],
  ["dachengqi-tang", "postpartum-stomach-repletion"],
  ["xiaochaihu-tang", "postpartum-yumao"],
] as const;

const newHerbRows = [
  ["huangqi", "黃耆", "黄芪"], ["fangfeng", "防風", "防风"], ["yitang", "飴糖", "饴糖"],
  ["maimendong", "麥門冬", "麦门冬"], ["weijing", "葦莖", "苇茎"], ["yiyiren", "薏苡仁", "薏苡仁"],
  ["taoren", "桃仁", "桃仁"], ["dongguaren", "冬瓜仁", "冬瓜仁"], ["shegan", "射干", "射干"],
  ["ziwan", "紫菀", "紫菀"], ["kuandonghua", "款冬花", "款冬花"], ["wuweizi", "五味子", "五味子"],
  ["yangrou", "羊肉", "羊肉"], ["fuling", "茯苓", "茯苓"], ["mudanpi", "牡丹皮", "牡丹皮"],
  ["xiaomai", "小麥", "小麦"], ["chuanxiong", "川芎", "川芎"], ["zexie", "澤瀉", "泽泻"],
] as const;

export const jinguiReusedFormulaIds = reusedFormulaRows.map(([id]) => `formula:${id}`);
export const jinguiReusedHerbIds = ["guizhi", "shaoyao", "shengjiang", "dazao", "gancao", "mahuang", "baizhu", "zhimu", "fuzi", "banxia", "renshen", "jingmi", "xixin", "shujiao", "ganjiang", "danggui"].map((id) => `herb:${id}`);
export const jinguiNewFormulaIds = newFormulaRows.map(([id]) => `formula:${id}`);
export const jinguiNewHerbIds = newHerbRows.map(([id]) => `herb:${id}`);
export const jinguiConditionIds = conditionRows.map(([id]) => `condition:jingui-${id}`);
export const jinguiSyndromeIds = syndromeRows.map(([id]) => `syndrome:jingui-${id}`);

const formulaIds = [...jinguiNewFormulaIds, ...jinguiReusedFormulaIds];
const herbIds = [...jinguiReusedHerbIds, ...jinguiNewHerbIds];

const lessonRows = [
  [1, "金匱如何組織雜病", "金匮如何组织杂病", "區分病類與病證，建立《金匱要略》在人紀主線中的受控閱讀地圖。", "区分病类与病证，建立《金匮要略》在人纪主线中的受控阅读地图。", "01-overview", "renji/jingui/01-zangfu-jingluo.html", [...jinguiConditionIds, ...jinguiSyndromeIds.slice(0, 3)]],
  [2, "內傷與肺系代表方證", "内伤与肺系代表方证", "以血痹、歷節、虛勞及肺系病比較一病多證與方證關係。", "以血痹、历节、虚劳及肺系病比较一病多证与方证关系。", "02-internal-lung", "renji/jingui/02-neishang-zabing.html", [...jinguiConditionIds.slice(0, 4), ...jinguiSyndromeIds.slice(0, 6), ...jinguiNewFormulaIds.slice(0, 6)]],
  [3, "腹滿、寒疝與痰飲", "腹满、寒疝与痰饮", "從病類進入代表病證，再閱讀三張方劑如何重用既有藥材身份。", "从病类进入代表病证，再阅读三张方剂如何重用既有药材身份。", "03-abdominal-fluid", "renji/jingui/04-piwei-bing.html", [...jinguiConditionIds.slice(4, 6), ...jinguiSyndromeIds.slice(6, 9), ...jinguiNewFormulaIds.slice(6, 9)]],
  [4, "婦人病的病類與病證", "妇人病的病类与病证", "把婦人病章篇入口與妊娠、產後及婦人雜病的具體方證分開。", "把妇人病章篇入口与妊娠、产后及妇人杂病的具体方证分开。", "04-women", "renji/jingui/05-furen-bing.html", [jinguiConditionIds[6], ...jinguiSyndromeIds.slice(9), ...jinguiNewFormulaIds.slice(9), ...jinguiReusedFormulaIds]],
  [5, "跨經典方藥身份與證據", "跨经典方药身份与证据", "以桂枝湯、大承氣湯、小柴胡湯檢驗一個方劑身份如何保留不同經典關係證據。", "以桂枝汤、大承气汤、小柴胡汤检验一个方剂身份如何保留不同经典关系证据。", "05-cross-classic", "renji/jingui/06-fangji-suzha.html", [...formulaIds, ...herbIds]],
] as const;

export const renjiJinguiLessons: Lesson[] = lessonRows.map(([order, hant, hans, descriptionHant, descriptionHans, route, legacyPath, relatedEntityIds]) => ({
  id: lessonIds[order - 1], slug: `lesson-renji-jingui-${String(order).padStart(2, "0")}`, type: "lesson",
  labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": descriptionHant, "zh-Hans": descriptionHans },
  aliases: { "zh-Hant": order === 1 ? ["金匱要略導讀"] : [], "zh-Hans": order === 1 ? ["金匮要略导读"] : [] },
  metadata: { order, module: { "zh-Hant": "金匱要略", "zh-Hans": "金匮要略" } },
  sourceIds: [editorialSourceId, classicalSourceId, derivedSourceId],
  relatedLessonIds: [lessonIds[order - 2], lessonIds[order]].filter((id): id is string => Boolean(id)),
  courseId: "course:renji", moduleId: "classic:jingui-yaolue", order, route: ["renji", "jingui", route], legacyPath, relatedEntityIds: [...relatedEntityIds],
}));

export const renjiJinguiEntities: KnowledgeEntity[] = [
  {
    id: "classic:jingui-yaolue", slug: "classic-jingui-yaolue", type: "classic",
    labels: { "zh-Hant": "金匱要略", "zh-Hans": "金匮要略" },
    descriptions: { "zh-Hant": "以臟腑雜病、婦人病等病類和具體方證組織的醫學經典；本站只建立受控研讀範圍。", "zh-Hans": "以脏腑杂病、妇人病等病类和具体方证组织的医学经典；本站只建立受控研读范围。" },
    aliases: { "zh-Hant": ["《金匱要略》", "金匱要略方論"], "zh-Hans": ["《金匮要略》", "金匮要略方论"] },
    metadata: { module: { "zh-Hant": "金匱要略", "zh-Hans": "金匮要略" } }, sourceIds: [classicalSourceId, editorialSourceId], relatedLessonIds: lessonIds,
  },
  ...conditionRows.map(([id, hant, hans, description]) => ({
    id: `condition:jingui-${id}`, slug: `condition-jingui-${id}`, type: "condition" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans },
    descriptions: { "zh-Hant": `${description}病類是章篇／疾病組織入口，不等同於具體方證，也不作個人診斷。`, "zh-Hans": `${description.replaceAll("類", "类").replaceAll("證", "证").replaceAll("與", "与").replaceAll("婦", "妇").replaceAll("為", "为").replaceAll("關", "关").replaceAll("節", "节").replaceAll("風", "风").replaceAll("熱", "热").replaceAll("勞", "劳").replaceAll("虛", "虚").replaceAll("滿", "满").replaceAll("飲", "饮")}病类是章篇／疾病组织入口，不等同于具体方证，也不作个人诊断。` },
    aliases: { "zh-Hant": [], "zh-Hans": [] }, metadata: { modelScope: { "zh-Hant": "金匱病類", "zh-Hans": "金匮病类" } },
    sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: lessonIds,
  })),
  ...syndromeRows.map(([id, hant, hans]) => ({
    id: `syndrome:jingui-${id}`, slug: `syndrome-jingui-${id}`, type: "syndrome" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}是本輪依既有課程與古典出處建立的代表病證；關係用於研讀，不是治療建議。`, "zh-Hans": `${hans}是本轮依既有课程与古典出处建立的代表病证；关系用于研读，不是治疗建议。` },
    aliases: { "zh-Hant": [hant.replace(/證$/, "")], "zh-Hans": [hans.replace(/证$/, "")] }, metadata: { modelScope: { "zh-Hant": "金匱代表病證", "zh-Hans": "金匮代表病证" } },
    sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: lessonIds,
  })),
  ...newFormulaRows.map(([id, hant, hans, syndrome, herbs]) => ({
    id: `formula:${id}`, slug: `formula-${id}`, type: "formula" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}在本輪《金匱要略》研讀中與${syndromeRows.find(([key]) => key === syndrome)?.[1]}建立有來源的經典方證關聯；不構成用藥建議。`, "zh-Hans": `${hans}在本轮《金匮要略》研读中与${syndromeRows.find(([key]) => key === syndrome)?.[2]}建立有来源的经典方证关联；不构成用药建议。` },
    aliases: { "zh-Hant": id === "huangqi-guizhi-wuwu-tang" ? ["黃芪桂枝五物湯"] : [], "zh-Hans": [] },
    metadata: { ingredientCount: herbs.length, modelScope: { "zh-Hant": "金匱代表方", "zh-Hans": "金匮代表方" } }, sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: lessonIds,
  })),
  ...newHerbRows.map(([id, hant, hans]) => ({
    id: `herb:${id}`, slug: `herb-${id}`, type: "herb" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}是可跨方、跨經典及未來本草模組重用的單一藥材身份；不提供劑量、代換或自行用藥指示。`, "zh-Hans": `${hans}是可跨方、跨经典及未来本草模块重用的单一药材身份；不提供剂量、代换或自行用药指示。` },
    aliases: {
      "zh-Hant": id === "huangqi" ? ["黃芪"] : id === "chuanxiong" ? ["芎藭"] : [],
      "zh-Hans": id === "huangqi" ? ["黄耆"] : id === "chuanxiong" ? ["芎䓖"] : [],
    }, metadata: { modelScope: { "zh-Hant": "方劑組成身份", "zh-Hans": "方剂组成身份" } }, sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: [lessonIds[4]],
  })),
];

export function augmentJinguiSharedEntity(entity: KnowledgeEntity): KnowledgeEntity {
  const formulaIndex = jinguiReusedFormulaIds.indexOf(entity.id);
  const isReusedFormula = formulaIndex >= 0;
  const isReusedHerb = jinguiReusedHerbIds.includes(entity.id);
  if (!isReusedFormula && !isReusedHerb) return entity;
  const formulaDescriptions = [
    ["桂枝湯保留單一方劑身份，分別透過有來源的關係連到《傷寒論》與《金匱要略》語境；不構成用藥建議。", "桂枝汤保留单一方剂身份，分别通过有来源的关系连到《伤寒论》与《金匮要略》语境；不构成用药建议。"],
    ["大承氣湯保留單一方劑身份，分別連到傷寒陽明方證與金匱產後胃實語境；不構成用藥建議。", "大承气汤保留单一方剂身份，分别连到伤寒阳明方证与金匮产后胃实语境；不构成用药建议。"],
    ["小柴胡湯保留單一方劑身份，分別連到傷寒少陽方證與金匱產後鬱冒語境；不構成用藥建議。", "小柴胡汤保留单一方剂身份，分别连到伤寒少阳方证与金匮产后郁冒语境；不构成用药建议。"],
  ] as const;
  return {
    ...entity,
    descriptions: isReusedFormula ? { "zh-Hant": formulaDescriptions[formulaIndex][0], "zh-Hans": formulaDescriptions[formulaIndex][1] } : entity.descriptions,
    metadata: isReusedFormula ? { ...entity.metadata, classicReuse: true } : entity.metadata,
    sourceIds: [...new Set([...entity.sourceIds, classicalSourceId, editorialSourceId, derivedSourceId])],
    relatedLessonIds: [...new Set([...entity.relatedLessonIds, lessonIds[4]])],
  };
}

const relation = (type: KnowledgeRelation["type"], from: string, to: string, sourceIds: string[]): KnowledgeRelation => ({
  id: `relation:${from.replaceAll(":", "-")}:${type.replaceAll("_", "-")}:${to.replaceAll(":", "-")}`,
  type, from, to, sourceIds,
});

export const renjiJinguiRelations: KnowledgeRelation[] = [
  relation("part_of", "classic:jingui-yaolue", "course:renji", [classicalSourceId, editorialSourceId]),
  ...renjiJinguiLessons.map((lesson) => relation("part_of", lesson.id, "classic:jingui-yaolue", lesson.sourceIds)),
  ...renjiJinguiLessons.flatMap((lesson) => lesson.relatedEntityIds.map((target) => relation("contains", lesson.id, target, [editorialSourceId, derivedSourceId]))),
  ...conditionRows.map(([id]) => relation("part_of", `condition:jingui-${id}`, "classic:jingui-yaolue", [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...syndromeRows.map(([id, , , condition]) => relation("belongs_to", `syndrome:jingui-${id}`, `condition:jingui-${condition}`, [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...newFormulaRows.map(([id, , , syndrome]) => relation("classically_associated_with", `formula:${id}`, `syndrome:jingui-${syndrome}`, [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...reusedFormulaRows.map(([id, syndrome]) => relation("classically_associated_with", `formula:${id}`, `syndrome:jingui-${syndrome}`, [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...formulaIds.map((id) => relation("appears_in", id, "classic:jingui-yaolue", [classicalSourceId])),
  ...newFormulaRows.flatMap(([formula, , , , herbs]) => herbs.map((herb) => relation("contains_herb", `formula:${formula}`, `herb:${herb}`, [classicalSourceId, derivedSourceId]))),
];

export const jinguiExpectedIngredients = Object.fromEntries(newFormulaRows.map(([id, , , , herbs]) => [`formula:${id}`, herbs.map((herb) => `herb:${herb}`)]));

export const renjiJinguiPilotCounts = {
  conditions: conditionRows.length,
  syndromes: syndromeRows.length,
  formulas: formulaIds.length,
  newFormulas: jinguiNewFormulaIds.length,
  reusedFormulas: jinguiReusedFormulaIds.length,
  herbsUsed: herbIds.length,
  newHerbs: jinguiNewHerbIds.length,
  reusedHerbs: jinguiReusedHerbIds.length,
  newIngredientRelations: newFormulaRows.reduce((total, row) => total + row[4].length, 0),
};
