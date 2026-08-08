import type { KnowledgeEntity, KnowledgeRelation, Lesson, Source } from "@/lib/knowledge-schema";

const editorialSourceId = "source:project:renji-shanghan-notes";
const classicalSourceId = "source:classical:shanghan-lun";
const referenceSourceId = "source:reference:gxtcmu-shanghan-text";
const derivedSourceId = "source:derived:renji-shanghan-pilot";

export const renjiShanghanSources: Source[] = [
  {
    id: editorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站人紀《傷寒論》既有課程筆記", "zh-Hans": "本站人纪《伤寒论》既有课程笔记" },
    section: "renji/shanghan/01–07；renji/bencao/05",
    note: {
      "zh-Hant": "用於本輪六經、方證與組方教學結構；屬本站編輯整理，不宣稱是倪海廈老師講課逐字稿。",
      "zh-Hans": "用于本轮六经、方证与组方教学结构；属本站编辑整理，不宣称是倪海厦老师讲课逐字稿。",
    },
  },
  {
    id: classicalSourceId,
    category: "classical",
    title: { "zh-Hant": "《傷寒論》古典原文", "zh-Hans": "《伤寒论》古典原文" },
    work: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" },
    author: { "zh-Hant": "張仲景", "zh-Hans": "张仲景" },
    url: "https://zh.wikisource.org/zh-hant/%E5%82%B7%E5%AF%92%E8%AB%96",
    note: { "zh-Hant": "用於經典身份與方名出處；本站不重製全篇原文。", "zh-Hans": "用于经典身份与方名出处；本站不重制全篇原文。" },
  },
  {
    id: referenceSourceId,
    category: "reference",
    title: { "zh-Hant": "廣西中醫藥大學《傷寒論》原文教學資源", "zh-Hans": "广西中医药大学《伤寒论》原文教学资源" },
    author: { "zh-Hant": "廣西中醫藥大學基礎醫學院傷寒論教研室", "zh-Hans": "广西中医药大学基础医学院伤寒论教研室" },
    url: "https://www.gxtcmu.edu.cn/jcyxy/jysjs/shljys/jcjsyyzjxzygx1/jcjs1/content_27749",
    note: { "zh-Hant": "只用於核對本輪十一方的藥味身份與組成數，不發布劑量、煎服法或個別化建議。", "zh-Hans": "只用于核对本轮十一方的药味身份与组成数，不发布剂量、煎服法或个别化建议。" },
  },
  {
    id: derivedSourceId,
    category: "derived",
    title: { "zh-Hant": "人紀傷寒知識結構化整理", "zh-Hans": "人纪伤寒知识结构化整理" },
    note: { "zh-Hant": "把六經診斷分類、代表病證、方劑與藥味轉為可驗證關係；不產生診斷或處方推薦。", "zh-Hans": "把六经诊断分类、代表病证、方剂与药味转为可验证关系；不产生诊断或处方推荐。" },
  },
];

const lessonIds = Array.from({ length: 5 }, (_, index) => `lesson:renji:shanghan:${String(index + 1).padStart(2, "0")}`);

const channelRows = [
  ["taiyang", "太陽", "太阳", "三陽病中的表證分類"],
  ["yangming", "陽明", "阳明", "三陽病中的裡熱實證分類"],
  ["shaoyang", "少陽", "少阳", "三陽病中的半表半裡分類"],
  ["taiyin", "太陰", "太阴", "三陰病中的裡虛寒分類"],
  ["shaoyin", "少陰", "少阴", "三陰病中可再辨寒化與熱化的分類"],
  ["jueyin", "厥陰", "厥阴", "三陰病中的寒熱錯雜分類"],
] as const;

const syndromeRows = [
  ["taiyang-zhongfeng", "太陽中風", "太阳中风", "taiyang", "以汗出、惡風、脈浮緩為本站既有課程辨識重點。"],
  ["taiyang-shanghan", "太陽傷寒", "太阳伤寒", "taiyang", "以無汗、惡寒、頭身疼痛、脈浮緊為本站既有課程辨識重點。"],
  ["yangming-channel", "陽明經證", "阳明经证", "yangming", "本站課程以大熱、大汗、大渴、脈洪大整理的陽明代表病證。"],
  ["yangming-bowel", "陽明腑證", "阳明腑证", "yangming", "本站課程以腹滿痛拒按、大便不通整理的陽明裡實病證總類。"],
  ["yangming-bowel-severe", "陽明腑實重證", "阳明腑实重证", "yangming", "本站承氣湯對照中痞、滿、燥、實、堅俱全的重證層次。"],
  ["yangming-bowel-moderate", "陽明腑實中證", "阳明腑实中证", "yangming", "本站承氣湯對照中痞、滿、實而燥堅不甚的中證層次。"],
  ["yangming-bowel-mild", "陽明燥實輕證", "阳明燥实轻证", "yangming", "本站承氣湯對照中燥實為主而痞滿不甚的輕證層次。"],
  ["shaoyang", "少陽證", "少阳证", "shaoyang", "以口苦、咽乾、目眩及往來寒熱等整理的少陽代表病證。"],
  ["taiyin", "太陰證", "太阴证", "taiyin", "以腹滿而吐、食不下、自利等整理的太陰代表病證。"],
  ["shaoyin-cold", "少陰寒化證", "少阴寒化证", "shaoyin", "本站課程在少陰分類下整理的寒化代表病證。"],
  ["shaoyin-heat", "少陰熱化證", "少阴热化证", "shaoyin", "本站課程在少陰分類下整理的熱化代表病證。"],
  ["jueyin-cold-heat", "厥陰寒熱錯雜證", "厥阴寒热错杂证", "jueyin", "本站課程以上熱下寒、寒熱錯雜整理的厥陰代表病證。"],
] as const;

const formulaRows = [
  ["guizhi-tang", "桂枝湯", "桂枝汤", "taiyang-zhongfeng", ["guizhi", "shaoyao", "shengjiang", "dazao", "gancao"]],
  ["mahuang-tang", "麻黃湯", "麻黄汤", "taiyang-shanghan", ["mahuang", "guizhi", "xingren", "gancao"]],
  ["baihu-tang", "白虎湯", "白虎汤", "yangming-channel", ["shigao", "zhimu", "gancao", "jingmi"]],
  ["dachengqi-tang", "大承氣湯", "大承气汤", "yangming-bowel-severe", ["dahuang", "houpo", "zhishi", "mangxiao"]],
  ["xiaochengqi-tang", "小承氣湯", "小承气汤", "yangming-bowel-moderate", ["dahuang", "houpo", "zhishi"]],
  ["tiaowei-chengqi-tang", "調胃承氣湯", "调胃承气汤", "yangming-bowel-mild", ["dahuang", "mangxiao", "gancao"]],
  ["xiaochaihu-tang", "小柴胡湯", "小柴胡汤", "shaoyang", ["chaihu", "huangqin", "banxia", "shengjiang", "renshen", "dazao", "gancao"]],
  ["lizhong-tang", "理中湯", "理中汤", "taiyin", ["renshen", "baizhu", "ganjiang", "gancao"]],
  ["sini-tang", "四逆湯", "四逆汤", "shaoyin-cold", ["fuzi", "ganjiang", "gancao"]],
  ["huanglian-ejiao-tang", "黃連阿膠湯", "黄连阿胶汤", "shaoyin-heat", ["huanglian", "huangqin", "shaoyao", "ejiao", "jizihuang"]],
  ["wumei-wan", "烏梅丸", "乌梅丸", "jueyin-cold-heat", ["wumei", "xixin", "ganjiang", "huanglian", "danggui", "fuzi", "shujiao", "guizhi", "renshen", "huangbai"]],
] as const;

const herbRows = [
  ["guizhi", "桂枝", "桂枝"], ["shaoyao", "芍藥", "芍药"], ["shengjiang", "生薑", "生姜"],
  ["dazao", "大棗", "大枣"], ["gancao", "甘草", "甘草"], ["mahuang", "麻黃", "麻黄"],
  ["xingren", "杏仁", "杏仁"], ["shigao", "石膏", "石膏"], ["zhimu", "知母", "知母"],
  ["jingmi", "粳米", "粳米"], ["dahuang", "大黃", "大黄"], ["houpo", "厚朴", "厚朴"],
  ["zhishi", "枳實", "枳实"], ["mangxiao", "芒硝", "芒硝"], ["chaihu", "柴胡", "柴胡"],
  ["huangqin", "黃芩", "黄芩"], ["banxia", "半夏", "半夏"], ["renshen", "人參", "人参"],
  ["baizhu", "白朮", "白术"], ["ganjiang", "乾薑", "干姜"], ["fuzi", "附子", "附子"],
  ["huanglian", "黃連", "黄连"], ["ejiao", "阿膠", "阿胶"], ["jizihuang", "雞子黃", "鸡子黄"],
  ["wumei", "烏梅", "乌梅"], ["xixin", "細辛", "细辛"], ["danggui", "當歸", "当归"],
  ["shujiao", "蜀椒", "蜀椒"], ["huangbai", "黃柏", "黄柏"],
] as const;

const channelIds = channelRows.map(([id]) => `shanghan-channel:${id}`);
const syndromeIds = syndromeRows.map(([id]) => `syndrome:${id}`);
const formulaIds = formulaRows.map(([id]) => `formula:${id}`);
const herbIds = herbRows.map(([id]) => `herb:${id}`);

export const renjiShanghanLessons: Lesson[] = [
  {
    id: lessonIds[0], slug: "lesson-renji-shanghan-01", type: "lesson",
    labels: { "zh-Hant": "六經辨證總覽", "zh-Hans": "六经辨证总览" },
    descriptions: { "zh-Hant": "區分傷寒診斷六經與同名經脈層級，以三陽、三陰分組建立閱讀地圖。", "zh-Hans": "区分伤寒诊断六经与同名经脉层级，以三阳、三阴分组建立阅读地图。" },
    aliases: { "zh-Hant": ["傷寒六經", "六經總覽"], "zh-Hans": ["伤寒六经", "六经总览"] },
    metadata: { order: 1, module: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" } }, sourceIds: [editorialSourceId, classicalSourceId, derivedSourceId], relatedLessonIds: [lessonIds[1]],
    courseId: "course:renji", moduleId: "classic:shanghan-lun", order: 1, route: ["renji", "shanghan", "01-overview"], legacyPath: "renji/shanghan/07-fangzheng-duizhao.html", relatedEntityIds: channelIds,
  },
  {
    id: lessonIds[1], slug: "lesson-renji-shanghan-02", type: "lesson",
    labels: { "zh-Hant": "太陽病與代表方證", "zh-Hans": "太阳病与代表方证" },
    descriptions: { "zh-Hant": "用太陽中風與太陽傷寒對照方證關係，閱讀桂枝湯與麻黃湯的結構差異。", "zh-Hans": "用太阳中风与太阳伤寒对照方证关系，阅读桂枝汤与麻黄汤的结构差异。" },
    aliases: { "zh-Hant": ["桂枝湯與麻黃湯"], "zh-Hans": ["桂枝汤与麻黄汤"] },
    metadata: { order: 2, module: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" } }, sourceIds: [editorialSourceId, classicalSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[0], lessonIds[2]],
    courseId: "course:renji", moduleId: "classic:shanghan-lun", order: 2, route: ["renji", "shanghan", "02-taiyang"], legacyPath: "renji/shanghan/01-taiyang.html", relatedEntityIds: ["syndrome:taiyang-zhongfeng", "syndrome:taiyang-shanghan", "formula:guizhi-tang", "formula:mahuang-tang", ...herbIds.filter((id) => ["herb:guizhi", "herb:shaoyao", "herb:shengjiang", "herb:dazao", "herb:gancao", "herb:mahuang", "herb:xingren"].includes(id))],
  },
  {
    id: lessonIds[2], slug: "lesson-renji-shanghan-03", type: "lesson",
    labels: { "zh-Hant": "陽明與少陽的方證結構", "zh-Hans": "阳明与少阳的方证结构" },
    descriptions: { "zh-Hant": "比較陽明經證、腑證層次與少陽證，觀察白虎、承氣與小柴胡方系的關聯。", "zh-Hans": "比较阳明经证、腑证层次与少阳证，观察白虎、承气与小柴胡方系的关联。" },
    aliases: { "zh-Hant": ["白虎湯", "承氣湯", "小柴胡湯"], "zh-Hans": ["白虎汤", "承气汤", "小柴胡汤"] },
    metadata: { order: 3, module: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" } }, sourceIds: [editorialSourceId, classicalSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[1], lessonIds[3]],
    courseId: "course:renji", moduleId: "classic:shanghan-lun", order: 3, route: ["renji", "shanghan", "03-yangming-shaoyang"], legacyPath: "renji/shanghan/02-yangming.html", relatedEntityIds: ["shanghan-channel:yangming", "shanghan-channel:shaoyang", ...syndromeIds.filter((id) => id.includes("yangming") || id === "syndrome:shaoyang"), ...formulaIds.filter((id) => ["formula:baihu-tang", "formula:dachengqi-tang", "formula:xiaochengqi-tang", "formula:tiaowei-chengqi-tang", "formula:xiaochaihu-tang"].includes(id))],
  },
  {
    id: lessonIds[3], slug: "lesson-renji-shanghan-04", type: "lesson",
    labels: { "zh-Hant": "太陰、少陰與厥陰概覽", "zh-Hans": "太阴、少阴与厥阴概览" },
    descriptions: { "zh-Hant": "以三陰分組辨認太陰、少陰寒熱分化與厥陰寒熱錯雜的代表結構。", "zh-Hans": "以三阴分组辨认太阴、少阴寒热分化与厥阴寒热错杂的代表结构。" },
    aliases: { "zh-Hant": ["三陰病概覽"], "zh-Hans": ["三阴病概览"] },
    metadata: { order: 4, module: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" } }, sourceIds: [editorialSourceId, classicalSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[2], lessonIds[4]],
    courseId: "course:renji", moduleId: "classic:shanghan-lun", order: 4, route: ["renji", "shanghan", "04-three-yin"], legacyPath: "renji/shanghan/05-shaoyin.html", relatedEntityIds: ["shanghan-channel:taiyin", "shanghan-channel:shaoyin", "shanghan-channel:jueyin", "syndrome:taiyin", "syndrome:shaoyin-cold", "syndrome:shaoyin-heat", "syndrome:jueyin-cold-heat", "formula:lizhong-tang", "formula:sini-tang", "formula:huanglian-ejiao-tang", "formula:wumei-wan"],
  },
  {
    id: lessonIds[4], slug: "lesson-renji-shanghan-05", type: "lesson",
    labels: { "zh-Hant": "方劑、病證與藥物如何相連", "zh-Hans": "方剂、病证与药物如何相连" },
    descriptions: { "zh-Hant": "從方劑出發，分辨經典方證關聯與藥味組成兩種不同關係，不延伸為處方建議。", "zh-Hans": "从方剂出发，分辨经典方证关联与药味组成两种不同关系，不延伸为处方建议。" },
    aliases: { "zh-Hant": ["方證關係", "方劑組成"], "zh-Hans": ["方证关系", "方剂组成"] },
    metadata: { order: 5, module: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" } }, sourceIds: [editorialSourceId, classicalSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[3]],
    courseId: "course:renji", moduleId: "classic:shanghan-lun", order: 5, route: ["renji", "shanghan", "05-formula-links"], legacyPath: "renji/shanghan/03-shaoyang.html", relatedEntityIds: [...formulaIds, ...herbIds],
  },
];

export const renjiShanghanEntities: KnowledgeEntity[] = [
  {
    id: "classic:shanghan-lun", slug: "classic-shanghan-lun", type: "classic",
    labels: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" }, descriptions: { "zh-Hant": "以六經辨證與方證結構展開的醫學經典；本站只建立受控研讀範圍，不收錄全文或完整方劑庫。", "zh-Hans": "以六经辨证与方证结构展开的医学经典；本站只建立受控研读范围，不收录全文或完整方剂库。" },
    aliases: { "zh-Hant": ["《傷寒論》", "傷寒雜病論"], "zh-Hans": ["《伤寒论》", "伤寒杂病论"] }, metadata: { module: { "zh-Hant": "傷寒論", "zh-Hans": "伤寒论" } }, sourceIds: [classicalSourceId, editorialSourceId], relatedLessonIds: lessonIds,
  },
  ...channelRows.map(([id, hant, hans, summary], index) => ({
    id: `shanghan-channel:${id}`, slug: `shanghan-channel-${id}`, type: "shanghan_channel" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${summary}；這是《傷寒論》診斷分類，不等同於針灸經脈層級。`, "zh-Hans": `${summary.replaceAll("陽", "阳").replaceAll("陰", "阴").replaceAll("裡", "里").replaceAll("證", "证").replaceAll("熱", "热").replaceAll("錯", "错")}；这是《伤寒论》诊断分类，不等同于针灸经脉层级。` },
    aliases: { "zh-Hant": [`${hant}病`, `傷寒${hant}`], "zh-Hans": [`${hans}病`, `伤寒${hans}`] }, metadata: { order: index + 1, domainContext: { "zh-Hant": "傷寒六經辨證", "zh-Hans": "伤寒六经辨证" } }, sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: [lessonIds[0]],
  })),
  ...syndromeRows.map(([id, hant, hans, , description]) => ({
    id: `syndrome:${id}`, slug: `syndrome-${id}`, type: "syndrome" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${description}本條目只呈現經典研讀中的病證分類，不作個人診斷。`, "zh-Hans": `${description.replaceAll("陽", "阳").replaceAll("陰", "阴").replaceAll("證", "证").replaceAll("湯", "汤").replaceAll("經", "经").replaceAll("實", "实").replaceAll("輕", "轻").replaceAll("層", "层").replaceAll("與", "与").replaceAll("錯", "错").replaceAll("熱", "热").replaceAll("惡", "恶").replaceAll("脈", "脉").replaceAll("緩", "缓").replaceAll("無", "无").replaceAll("滿", "满").replaceAll("總", "总")}本条目只呈现经典研读中的病证分类，不作个人诊断。` },
    aliases: { "zh-Hant": [`${hant}證`], "zh-Hans": [`${hans}证`] }, metadata: { modelScope: { "zh-Hant": "代表性方證", "zh-Hans": "代表性方证" } }, sourceIds: [classicalSourceId, editorialSourceId, derivedSourceId], relatedLessonIds: lessonIds,
  })),
  ...formulaRows.map(([id, hant, hans, syndrome, herbs]) => ({
    id: `formula:${id}`, slug: `formula-${id}`, type: "formula" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}在本站《傷寒論》研讀中與${syndromeRows.find(([key]) => key === syndrome)?.[1]}建立經典方證關聯；只供研讀，不構成用藥建議。`, "zh-Hans": `${hans}在本站《伤寒论》研读中与${syndromeRows.find(([key]) => key === syndrome)?.[2]}建立经典方证关联；只供研读，不构成用药建议。` },
    aliases: { "zh-Hant": [], "zh-Hans": [] }, metadata: { ingredientCount: herbs.length, modelScope: { "zh-Hant": "代表方", "zh-Hans": "代表方" } }, sourceIds: [classicalSourceId, editorialSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: lessonIds,
  })),
  ...herbRows.map(([id, hant, hans]) => ({
    id: `herb:${id}`, slug: `herb-${id}`, type: "herb" as const,
    labels: { "zh-Hant": hant, "zh-Hans": hans }, descriptions: { "zh-Hant": `${hant}是本輪方劑組成中可跨方、跨經典重用的藥材身份；本頁不提供劑量、代換或自行用藥指示。`, "zh-Hans": `${hans}是本轮方剂组成中可跨方、跨经典重用的药材身份；本页不提供剂量、代换或自行用药指示。` },
    aliases: { "zh-Hant": id === "gancao" ? ["炙甘草"] : [], "zh-Hans": id === "gancao" ? ["炙甘草"] : [] }, metadata: { modelScope: { "zh-Hant": "方劑組成身份", "zh-Hans": "方剂组成身份" } }, sourceIds: [editorialSourceId, referenceSourceId, derivedSourceId], relatedLessonIds: [lessonIds[4]],
  })),
];

const relation = (type: KnowledgeRelation["type"], from: string, to: string, sourceIds: string[]): KnowledgeRelation => ({
  id: `relation:${from.replaceAll(":", "-")}:${type.replaceAll("_", "-")}:${to.replaceAll(":", "-")}`,
  type, from, to, sourceIds,
});

const lessonGraphTargets: Record<string, string[]> = {
  [lessonIds[0]]: channelIds,
  [lessonIds[1]]: ["syndrome:taiyang-zhongfeng", "syndrome:taiyang-shanghan", "formula:guizhi-tang", "formula:mahuang-tang"],
  [lessonIds[2]]: ["syndrome:yangming-channel", "syndrome:yangming-bowel", "syndrome:shaoyang", "formula:baihu-tang", "formula:dachengqi-tang", "formula:xiaochaihu-tang"],
  [lessonIds[3]]: ["shanghan-channel:taiyin", "shanghan-channel:shaoyin", "shanghan-channel:jueyin", "syndrome:taiyin", "syndrome:shaoyin-cold", "syndrome:shaoyin-heat", "syndrome:jueyin-cold-heat", "formula:lizhong-tang", "formula:sini-tang", "formula:huanglian-ejiao-tang", "formula:wumei-wan"],
  [lessonIds[4]]: formulaIds,
};

export const renjiShanghanRelations: KnowledgeRelation[] = [
  relation("part_of", "classic:shanghan-lun", "course:renji", [editorialSourceId, classicalSourceId]),
  ...renjiShanghanLessons.map((lesson) => relation("part_of", lesson.id, "classic:shanghan-lun", lesson.sourceIds)),
  ...renjiShanghanLessons.flatMap((lesson) => lessonGraphTargets[lesson.id].map((target) => relation("contains", lesson.id, target, [editorialSourceId, derivedSourceId]))),
  ...channelRows.map(([id]) => relation("part_of", `shanghan-channel:${id}`, "classic:shanghan-lun", [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...syndromeRows.map(([id, , , channel]) => relation("belongs_to", `syndrome:${id}`, `shanghan-channel:${channel}`, [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...["severe", "moderate", "mild"].map((level) => relation("part_of", `syndrome:yangming-bowel-${level}`, "syndrome:yangming-bowel", [editorialSourceId, derivedSourceId])),
  ...formulaRows.map(([id, , , syndrome]) => relation("classically_associated_with", `formula:${id}`, `syndrome:${syndrome}`, [classicalSourceId, editorialSourceId, derivedSourceId])),
  ...formulaRows.map(([id]) => relation("appears_in", `formula:${id}`, "classic:shanghan-lun", [classicalSourceId, referenceSourceId])),
  ...formulaRows.flatMap(([formula, , , , herbs]) => herbs.map((herb) => relation("contains_herb", `formula:${formula}`, `herb:${herb}`, [referenceSourceId, derivedSourceId]))),
];

export const renjiShanghanPilotCounts = {
  channels: channelRows.length,
  syndromes: syndromeRows.length,
  formulas: formulaRows.length,
  herbs: herbRows.length,
  ingredientRelations: formulaRows.reduce((total, row) => total + row[4].length, 0),
};
