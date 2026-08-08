import type { KnowledgeEntity, KnowledgeRelation, Lesson, Source } from "@/lib/knowledge-schema";

const editorialSourceId = "source:project:renji-bencao-notes";
const classicalSourceId = "source:classical:shennong-bencao-jing";
const referenceSourceId = "source:reference:hkbu-cmed-herbs";
const derivedSourceId = "source:derived:renji-bencao-model";

export const renjiBencaoSources: Source[] = [
  {
    id: editorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站人紀《神農本草經》既有課程筆記", "zh-Hans": "本站人纪《神农本草经》既有课程笔记" },
    section: "renji/bencao/01–05",
    note: {
      "zh-Hant": "用於本站三品、性味、歸經與方藥教學脈絡；屬編輯整理，沒有可追溯依據的內容不標為倪海廈老師講授資料。",
      "zh-Hans": "用于本站三品、性味、归经与方药教学脉络；属编辑整理，没有可追溯依据的内容不标为倪海厦老师讲授资料。",
    },
  },
  {
    id: classicalSourceId,
    category: "classical",
    title: { "zh-Hant": "《神農本草經》古典原文整理本", "zh-Hans": "《神农本草经》古典原文整理本" },
    work: { "zh-Hant": "神農本草經", "zh-Hans": "神农本草经" },
    url: "https://zh.wikisource.org/wiki/%E7%A5%9E%E8%BE%B2%E6%9C%AC%E8%8D%89%E7%B6%93",
    note: { "zh-Hant": "用於核對經典身份、序錄、五味四氣及可明確對應的藥材條目；傳本與後世規範不一致處分開保留。", "zh-Hans": "用于核对经典身份、序录、五味四气及可明确对应的药材条目；传本与后世规范不一致处分开保留。" },
  },
  {
    id: referenceSourceId,
    category: "reference",
    title: { "zh-Hant": "香港浸會大學中藥材圖像數據庫", "zh-Hans": "香港浸会大学中药材图像数据库" },
    url: "https://sys01.lib.hkbu.edu.hk/cmed/mmid/index.php",
    note: { "zh-Hant": "用於二十四味既有藥材的現代性味與歸經名稱規範化；不取代本站教學或古典主張。", "zh-Hans": "用于二十四味既有药材的现代性味与归经名称规范化；不取代本站教学或古典主张。" },
  },
  {
    id: derivedSourceId,
    category: "derived",
    title: { "zh-Hant": "人紀本草性味歸經結構化整理", "zh-Hans": "人纪本草性味归经结构化整理" },
    note: { "zh-Hant": "將藥材、藥性、藥味、歸經、三品與方劑關係轉為可查詢結構；不推導診斷、劑量或用藥建議。", "zh-Hans": "将药材、药性、药味、归经、三品与方剂关系转为可查询结构；不推导诊断、剂量或用药建议。" },
  },
];

export const bencaoPilotHerbIds = [
  "guizhi", "shaoyao", "shengjiang", "dazao", "gancao", "mahuang", "huangqi", "shigao",
  "zhimu", "chaihu", "huangqin", "banxia", "renshen", "fuzi", "ganjiang", "huanglian",
  "danggui", "fuling", "baizhu", "chuanxiong", "wuweizi", "maimendong", "dahuang", "mangxiao",
].map((id) => `herb:${id}`);

const lessonIds = Array.from({ length: 5 }, (_, index) => `lesson:renji:bencao:${String(index + 1).padStart(2, "0")}`);
const lessonRows = [
  [1, "本草在知識系統中的位置", "本草在知识系统中的位置", "從單一藥材身份進入經典、性味、歸經、方劑與證據的共用網絡。", "从单一药材身份进入经典、性味、归经、方剂与证据的共用网络。", "01-overview", "renji/bencao/01-shangpin-yangming.html", bencaoPilotHerbIds.slice(0, 8)],
  [2, "四氣與藥性", "四气与药性", "把寒、涼、平、溫、熱建成可重用節點，並保留來源差異。", "把寒、凉、平、温、热建成可重用节点，并保留来源差异。", "02-nature", "renji/bencao/02-zhongpin-yangxing.html", bencaoPilotHerbIds],
  [3, "五味與多重分類", "五味与多重分类", "以酸、苦、甘、辛、鹹理解一味藥可以同時具有多個藥味。", "以酸、苦、甘、辛、咸理解一味药可以同时具有多个药味。", "03-flavor", "renji/bencao/03-xiapin-gongxie.html", bencaoPilotHerbIds],
  [4, "歸經不是穴位隸屬", "归经不是穴位隶属", "藥材歸經連到既有臟腑系統，但與穴位隸屬經脈保持不同關係語意。", "药材归经连到既有脏腑系统，但与穴位隶属经脉保持不同关系语意。", "04-tropism", "renji/bencao/04-yaodui-peiwu.html", bencaoPilotHerbIds],
  [5, "從單味藥回看傷寒與金匱", "从单味药回看伤寒与金匮", "以共享藥材身份查看方劑、病證與兩部經典，並測試高連結節點。", "以共享药材身份查看方剂、病证与两部经典，并测试高连接节点。", "05-cross-classic", "renji/bencao/05-junchen-zuoshi.html", bencaoPilotHerbIds],
] as const;

export const renjiBencaoLessons: Lesson[] = lessonRows.map(([order, hant, hans, descriptionHant, descriptionHans, route, legacyPath, relatedEntityIds]) => ({
  id: lessonIds[order - 1], slug: `lesson-renji-bencao-${String(order).padStart(2, "0")}`, type: "lesson",
  labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": descriptionHant, "zh-Hans": descriptionHans },
  aliases: { "zh-Hant": order === 1 ? ["神農本草經導讀", "本草導讀"] : [], "zh-Hans": order === 1 ? ["神农本草经导读", "本草导读"] : [] },
  metadata: { order, module: { "zh-Hant": "神農本草經", "zh-Hans": "神农本草经" } },
  sourceIds: [editorialSourceId, classicalSourceId, referenceSourceId, derivedSourceId],
  relatedLessonIds: [lessonIds[order - 2], lessonIds[order]].filter((id): id is string => Boolean(id)),
  courseId: "course:renji", moduleId: "classic:shennong-bencao-jing", order, route: ["renji", "bencao", route], legacyPath, relatedEntityIds: [...relatedEntityIds],
}));

const natureRows = [["cold", "寒", "寒"], ["cool", "涼", "凉"], ["neutral", "平", "平"], ["warm", "溫", "温"], ["hot", "熱", "热"]] as const;
const flavorRows = [["sour", "酸", "酸"], ["bitter", "苦", "苦"], ["sweet", "甘", "甘"], ["pungent", "辛", "辛"], ["salty", "鹹", "咸"]] as const;
const gradeRows = [["upper", "上品", "上品", "主養命以應天"], ["middle", "中品", "中品", "主養性以應人"], ["lower", "下品", "下品", "主治病以應地"]] as const;

export const renjiBencaoEntities: KnowledgeEntity[] = [
  {
    id: "classic:shennong-bencao-jing", slug: "classic-shennong-bencao-jing", type: "classic",
    labels: { "zh-Hant": "神農本草經", "zh-Hans": "神农本草经" },
    descriptions: { "zh-Hant": "以三品、四氣五味與藥物配伍等觀念組織的古典本草；本站只建立二十四味藥的受控研讀模型。", "zh-Hans": "以三品、四气五味与药物配伍等观念组织的古典本草；本站只建立二十四味药的受控研读模型。" },
    aliases: { "zh-Hant": ["《神農本草經》", "本草經", "神農本經"], "zh-Hans": ["《神农本草经》", "本草经", "神农本经"] },
    metadata: { module: { "zh-Hant": "神農本草經", "zh-Hans": "神农本草经" } }, sourceIds: [classicalSourceId, editorialSourceId], relatedLessonIds: lessonIds,
  },
  ...natureRows.map(([id, hant, hans]) => ({
    id: `herb-nature:${id}`, slug: `herb-nature-${id}`, type: "herb_nature" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}是藥性（四氣）軸上的可重用分類，不是藥味。`, "zh-Hans": `${hans}是药性（四气）轴上的可重用分类，不是药味。` },
    aliases: { "zh-Hant": id === "cool" ? ["微寒", "小寒"] : id === "hot" ? ["大熱"] : [], "zh-Hans": id === "cool" ? ["微寒", "小寒"] : id === "hot" ? ["大热"] : [] },
    metadata: { modelScope: { "zh-Hant": "藥性／四氣", "zh-Hans": "药性／四气" } }, sourceIds: [classicalSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[1]],
  })),
  ...flavorRows.map(([id, hant, hans]) => ({
    id: `herb-flavor:${id}`, slug: `herb-flavor-${id}`, type: "herb_flavor" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}是五味軸上的可重用分類；一味藥可以連到多個藥味。`, "zh-Hans": `${hans}是五味轴上的可重用分类；一味药可以连到多个药味。` },
    aliases: { "zh-Hant": [], "zh-Hans": [] }, metadata: { modelScope: { "zh-Hant": "藥味／五味", "zh-Hans": "药味／五味" } }, sourceIds: [classicalSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[2]],
  })),
  ...gradeRows.map(([id, hant, hans, description]) => ({
    id: `herb-grade:${id}`, slug: `herb-grade-${id}`, type: "herb_grade" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `《神農本草經》三品研讀分類：${description}；不能直接當作現代安全等級。`, "zh-Hans": `《神农本草经》三品研读分类：${description.replaceAll("養", "养").replaceAll("應", "应")}；不能直接当作现代安全等级。` },
    aliases: { "zh-Hant": [], "zh-Hans": [] }, metadata: { modelScope: { "zh-Hant": "古典三品", "zh-Hans": "古典三品" } }, sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: [lessonIds[0]],
  })),
];

type HerbPropertyRow = readonly [string, string, readonly string[], readonly string[]];
const herbPropertyRows: HerbPropertyRow[] = [
  ["guizhi", "warm", ["pungent", "sweet"], ["heart", "lung", "bladder"]],
  ["shaoyao", "cool", ["bitter", "sour"], ["liver", "spleen"]],
  ["shengjiang", "warm", ["pungent"], ["lung", "spleen", "stomach"]],
  ["dazao", "warm", ["sweet"], ["spleen", "stomach"]],
  ["gancao", "neutral", ["sweet"], ["heart", "lung", "spleen", "stomach"]],
  ["mahuang", "warm", ["pungent", "bitter"], ["lung", "bladder"]],
  ["huangqi", "warm", ["sweet"], ["lung", "spleen"]],
  ["shigao", "cold", ["pungent", "sweet"], ["lung", "stomach"]],
  ["zhimu", "cold", ["bitter", "sweet"], ["lung", "stomach", "kidney"]],
  ["chaihu", "cool", ["pungent", "bitter"], ["liver", "gallbladder", "lung"]],
  ["huangqin", "cold", ["bitter"], ["lung", "gallbladder", "spleen", "large-intestine", "small-intestine"]],
  ["banxia", "warm", ["pungent"], ["spleen", "stomach", "lung"]],
  ["renshen", "warm", ["sweet", "bitter"], ["spleen", "lung", "heart", "kidney"]],
  ["fuzi", "hot", ["pungent", "sweet"], ["heart", "kidney", "spleen"]],
  ["ganjiang", "hot", ["pungent"], ["spleen", "stomach", "kidney", "heart", "lung"]],
  ["huanglian", "cold", ["bitter"], ["heart", "spleen", "stomach", "liver", "gallbladder", "large-intestine"]],
  ["danggui", "warm", ["sweet", "pungent"], ["liver", "heart", "spleen"]],
  ["fuling", "neutral", ["sweet"], ["heart", "lung", "spleen", "kidney"]],
  ["baizhu", "warm", ["bitter", "sweet"], ["spleen", "stomach"]],
  ["chuanxiong", "warm", ["pungent"], ["liver", "gallbladder", "pericardium"]],
  ["wuweizi", "warm", ["sour", "sweet"], ["lung", "heart", "kidney"]],
  ["maimendong", "cool", ["sweet", "bitter"], ["heart", "lung", "stomach"]],
  ["dahuang", "cold", ["bitter"], ["spleen", "stomach", "large-intestine", "liver", "pericardium"]],
  ["mangxiao", "cold", ["salty", "bitter"], ["stomach", "large-intestine"]],
];

const gradeAssignments = {
  upper: ["renshen", "dazao", "huangqi", "gancao"],
  middle: ["guizhi", "mahuang", "baizhu", "ganjiang"],
  lower: ["dahuang", "fuzi", "mangxiao", "banxia"],
} as const;

const editorialPropertyHerbs = new Set(["guizhi", "shaoyao", "dazao", "gancao", "mahuang", "shigao", "zhimu", "banxia", "renshen", "fuzi", "ganjiang", "dahuang", "mangxiao"]);
const editorialTropismHerbs = new Set(["guizhi", "mahuang", "renshen", "fuzi", "dahuang"]);
const classicalAppearanceHerbs = new Set(["shaoyao", "dazao", "gancao", "mahuang", "huangqi", "shigao", "zhimu", "chaihu", "huangqin", "banxia", "renshen", "fuzi", "ganjiang", "huanglian", "danggui", "fuling", "chuanxiong", "wuweizi", "maimendong", "dahuang", "mangxiao"]);
const classicalNatureConflicts = [["renshen", "cool"], ["dazao", "neutral"], ["maimendong", "neutral"]] as const;

const relation = (type: KnowledgeRelation["type"], from: string, to: string, sourceIds: string[], suffix = ""): KnowledgeRelation => ({
  id: `relation:${from.replaceAll(":", "-")}:${type.replaceAll("_", "-")}:${to.replaceAll(":", "-")}${suffix}`,
  type, from, to, sourceIds,
});

export const renjiBencaoRelations: KnowledgeRelation[] = [
  relation("part_of", "classic:shennong-bencao-jing", "course:renji", [classicalSourceId, editorialSourceId]),
  ...renjiBencaoLessons.map((lesson) => relation("part_of", lesson.id, "classic:shennong-bencao-jing", lesson.sourceIds)),
  ...renjiBencaoLessons.flatMap((lesson) => lesson.relatedEntityIds.map((target) => relation("contains", lesson.id, target, [editorialSourceId, derivedSourceId]))),
  ...herbPropertyRows.flatMap(([herb, nature, flavors, organs]) => {
    const propertySources = [referenceSourceId, derivedSourceId, ...(editorialPropertyHerbs.has(herb) ? [editorialSourceId] : [])];
    const tropismSources = [referenceSourceId, derivedSourceId, ...(editorialTropismHerbs.has(herb) ? [editorialSourceId] : [])];
    return [
      relation("has_nature", `herb:${herb}`, `herb-nature:${nature}`, propertySources),
      ...flavors.map((flavor) => relation("has_flavor", `herb:${herb}`, `herb-flavor:${flavor}`, propertySources)),
      ...organs.map((organ) => relation("has_tropism", `herb:${herb}`, `organ:${organ}`, tropismSources)),
    ];
  }),
  ...classicalNatureConflicts.map(([herb, nature]) => relation("has_nature", `herb:${herb}`, `herb-nature:${nature}`, [classicalSourceId], "-classical")),
  ...[...classicalAppearanceHerbs].map((herb) => relation("appears_in", `herb:${herb}`, "classic:shennong-bencao-jing", [classicalSourceId])),
  ...Object.entries(gradeAssignments).flatMap(([grade, herbs]) => herbs.map((herb) => relation("classified_as", `herb:${herb}`, `herb-grade:${grade}`, [editorialSourceId, derivedSourceId]))),
];

const actionSummaries: Record<string, readonly [string, string]> = {
  guizhi: ["溫通與解肌的代表藥材，並在傷寒、金匱多張方劑中重用。", "温通与解肌的代表药材，并在伤寒、金匮多张方剂中重用。"],
  shaoyao: ["以酸苦微寒與斂陰和營為既有課程重點。", "以酸苦微寒与敛阴和营为既有课程重点。"],
  shengjiang: ["以辛溫、助解表與和胃為方劑閱讀線索。", "以辛温、助解表与和胃为方剂阅读线索。"],
  dazao: ["以甘味、補中與緩和藥性為既有課程重點。", "以甘味、补中与缓和药性为既有课程重点。"],
  gancao: ["以甘平與調和方中諸藥為核心閱讀線索。", "以甘平与调和方中诸药为核心阅读线索。"],
  mahuang: ["以辛溫發散與宣肺為既有課程重點。", "以辛温发散与宣肺为既有课程重点。"],
  huangqi: ["以甘微溫、補氣與固表方向為既有課程重點。", "以甘微温、补气与固表方向为既有课程重点。"],
  shigao: ["以辛甘大寒及與知母的配伍為既有課程重點。", "以辛甘大寒及与知母的配伍为既有课程重点。"],
  zhimu: ["以苦甘寒及與石膏的配伍為既有課程重點。", "以苦甘寒及与石膏的配伍为既有课程重点。"],
  fuzi: ["以辛甘大熱及高風險配伍邊界為既有課程重點。", "以辛甘大热及高风险配伍边界为既有课程重点。"],
  ganjiang: ["以辛熱、溫中與回陽方向為既有課程重點。", "以辛热、温中与回阳方向为既有课程重点。"],
  dahuang: ["以苦寒沉降與承氣湯方群為既有課程重點。", "以苦寒沉降与承气汤方群为既有课程重点。"],
  mangxiao: ["以鹹苦寒及與大黃的方劑組合為閱讀線索。", "以咸苦寒及与大黄的方剂组合为阅读线索。"],
};

export function augmentBencaoHerb(entity: KnowledgeEntity): KnowledgeEntity {
  if (!bencaoPilotHerbIds.includes(entity.id)) return entity;
  const key = entity.id.slice("herb:".length);
  const summary = actionSummaries[key] ?? [`${entity.labels["zh-Hant"]}在本輪以性味、歸經、方劑與出處關係研讀。`, `${entity.labels["zh-Hans"] ?? entity.labels["zh-Hant"]}在本轮以性味、归经、方剂与出处关系研读。`];
  return {
    ...entity,
    descriptions: { "zh-Hant": `${summary[0]}此身份代表傳統醫藥使用的藥材，不等同植物物種或所有炮製品。`, "zh-Hans": `${summary[1]}此身份代表传统医药使用的药材，不等同植物物种或所有炮制品。` },
    metadata: { ...entity.metadata, modelScope: { "zh-Hant": "傳統藥材身份", "zh-Hans": "传统药材身份" } },
    sourceIds: [...new Set([...entity.sourceIds, editorialSourceId, referenceSourceId, derivedSourceId, ...(classicalAppearanceHerbs.has(key) ? [classicalSourceId] : [])])],
    relatedLessonIds: [...new Set([...entity.relatedLessonIds, ...lessonIds])],
  };
}

export const bencaoPilotCounts = {
  herbs: bencaoPilotHerbIds.length,
  newHerbs: 0,
  natures: natureRows.length,
  flavors: flavorRows.length,
  grades: gradeRows.length,
  tropismRelations: herbPropertyRows.reduce((total, row) => total + row[3].length, 0),
  propertyRelations: renjiBencaoRelations.filter((item) => ["has_nature", "has_flavor", "has_tropism"].includes(item.type)).length,
};
