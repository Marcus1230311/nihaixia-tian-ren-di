import type { KnowledgeEntity, KnowledgeGraph, KnowledgeRelation, Lesson, Source } from "@/lib/knowledge-schema";
import { hexagramRows } from "@/data/yijing-hexagrams";
import { tianjiStructuredEntities, tianjiStructuredLessons, tianjiStructuredRelations, tianjiStructuredSources } from "@/data/tianji-structured";
import { renjiAcupunctureEntities, renjiAcupunctureLessons, renjiAcupunctureRelations, renjiAcupunctureSources } from "@/data/renji-acupuncture";
import { renjiShanghanEntities, renjiShanghanLessons, renjiShanghanRelations, renjiShanghanSources } from "@/data/renji-shanghan";

const editorialSourceId = "source:project:yijing-notes";
const classicalSourceId = "source:classical:zhouyi";
const derivedSourceId = "source:derived:trigram-lines";
const hexagramDerivedSourceId = "source:derived:hexagram-lines";

export const sources: Source[] = [
  {
    id: editorialSourceId,
    category: "editorial",
    title: { "zh-Hant": "本站《易經》研讀內容整理", "zh-Hans": "本站《易经》研读内容整理" },
    note: {
      "zh-Hant": "由既有課程頁重新編排的導讀內容；不是倪海廈老師講課的逐字稿。",
      "zh-Hans": "由既有课程页重新编排的导读内容；不是倪海厦老师讲课的逐字稿。",
    },
  },
  {
    id: classicalSourceId,
    category: "classical",
    title: { "zh-Hant": "《周易》古典原文", "zh-Hans": "《周易》古典原文" },
    work: { "zh-Hant": "周易", "zh-Hans": "周易" },
    url: "https://zh.wikisource.org/zh-hant/%E5%91%A8%E6%98%93",
  },
  {
    id: derivedSourceId,
    category: "derived",
    title: { "zh-Hant": "八卦爻形結構化整理", "zh-Hans": "八卦爻形结构化整理" },
    note: {
      "zh-Hant": "依八卦通行爻形、卦象與性質整理為機器可讀欄位。",
      "zh-Hans": "依八卦通行爻形、卦象与性质整理为机器可读字段。",
    },
  },
  {
    id: hexagramDerivedSourceId,
    category: "derived",
    title: { "zh-Hant": "六十四卦爻形與上下卦結構化整理", "zh-Hans": "六十四卦爻形与上下卦结构化整理" },
    note: {
      "zh-Hant": "依《周易》通行卦序與上下卦組合，將六爻由下而上轉為機器可讀結構；精簡說明沿用本站既有《易經》課程導讀。",
      "zh-Hans": "依《周易》通行卦序与上下卦组合，将六爻由下而上转为机器可读结构；精简说明沿用本站既有《易经》课程导读。",
    },
  },
  ...tianjiStructuredSources,
  ...renjiAcupunctureSources,
  ...renjiShanghanSources,
];

const lessonRows = [
  [1, "陰陽爻與八卦總論", "阴阳爻与八卦总论", "陰陽爻、八卦取象與六十四卦的基本結構", "阴阳爻、八卦取象与六十四卦的基本结构", "01-yinyang-bagua"],
  [2, "六十四卦詳解（上經30卦）", "六十四卦详解（上经30卦）", "乾坤至離，逐卦收錄卦辭、六爻與《彖》《象》導讀", "乾坤至离，逐卦收录卦辞、六爻与《彖》《象》导读", "02-shangjing-30gua"],
  [3, "六十四卦詳解（下經34卦）", "六十四卦详解（下经34卦）", "咸恆至未濟，逐卦收錄卦辭、六爻與《彖》《象》導讀", "咸恒至未济，逐卦收录卦辞、六爻与《彖》《象》导读", "03-xiajing-34gua"],
  [4, "易經占卜方法：筮法", "易经占卜方法：筮法", "蓍草與金錢起卦的研讀框架及判讀次序", "蓍草与金钱起卦的研读框架及判读次序", "04-shifa"],
  [5, "易經與中醫", "易经与中医", "以陰陽、五行、卦象與時位交叉理解天紀和人紀", "以阴阳、五行、卦象与时位交叉理解天纪和人纪", "05-yijing-yu-zhongyi"],
] as const;

const lessonIds = lessonRows.map(([order]) => `lesson:tianji:yijing:${String(order).padStart(2, "0")}`);
const trigramIds = ["qian", "kun", "zhen", "xun", "kan", "li", "gen", "dui"].map((id) => `trigram:${id}`);
const hexagramIds = hexagramRows.map(([number]) => `hexagram:${String(number).padStart(2, "0")}`);

const yijingLessons: Lesson[] = lessonRows.map(([order, titleHant, titleHans, summaryHant, summaryHans, file]) => ({
  id: `lesson:tianji:yijing:${String(order).padStart(2, "0")}`,
  slug: `lesson-tianji-yijing-${String(order).padStart(2, "0")}`,
  type: "lesson",
  labels: { "zh-Hant": titleHant, "zh-Hans": titleHans },
  descriptions: { "zh-Hant": summaryHant, "zh-Hans": summaryHans },
  aliases: { "zh-Hant": [], "zh-Hans": [] },
  metadata: { order, module: { "zh-Hant": "易經", "zh-Hans": "易经" } },
  sourceIds: [editorialSourceId, classicalSourceId],
  relatedLessonIds: [],
  courseId: "course:tianji",
  moduleId: "classic:yijing",
  order,
  route: ["tianji", "yijing", file],
  legacyPath: `tianji/yijing/${file}.html`,
  relatedEntityIds: order === 1
    ? ["classic:yijing", ...trigramIds, "yin-yang:yin", "yin-yang:yang"]
    : order === 2
      ? ["classic:yijing", ...hexagramIds.slice(0, 30)]
      : order === 3
        ? ["classic:yijing", ...hexagramIds.slice(30)]
        : order === 5
          ? ["classic:yijing", "element:wood", "element:fire", "element:earth", "element:metal", "element:water"]
          : ["classic:yijing"],
}));

export const lessons: Lesson[] = [...yijingLessons, ...tianjiStructuredLessons, ...renjiAcupunctureLessons, ...renjiShanghanLessons];

const trigramRows = [
  ["qian", "乾", "乾", "☰", "111", "天", "天", "健", "健"],
  ["kun", "坤", "坤", "☷", "000", "地", "地", "順", "顺"],
  ["zhen", "震", "震", "☳", "100", "雷", "雷", "動", "动"],
  ["xun", "巽", "巽", "☴", "011", "風", "风", "入", "入"],
  ["kan", "坎", "坎", "☵", "010", "水", "水", "陷", "陷"],
  ["li", "離", "离", "☲", "101", "火", "火", "麗", "丽"],
  ["gen", "艮", "艮", "☶", "001", "山", "山", "止", "止"],
  ["dui", "兌", "兑", "☱", "110", "澤", "泽", "悅", "悦"],
] as const;

const trigramLinePatterns = Object.fromEntries(trigramRows.map(([id, , , , lines]) => [id, lines]));

export const hexagrams: KnowledgeEntity[] = hexagramRows.map(([number, slugKey, nameHant, nameHans, upper, lower, summaryHant]) => {
  const paddedNumber = String(number).padStart(2, "0");
  const symbol = String.fromCodePoint(0x4dc0 + number - 1);
  return {
    id: `hexagram:${paddedNumber}`,
    slug: `hexagram-${paddedNumber}-${slugKey}`,
    type: "hexagram",
    labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: { "zh-Hant": summaryHant },
    aliases: {
      "zh-Hant": [symbol, `${nameHant}卦`, `第${number}卦`],
      "zh-Hans": [symbol, `${nameHans}卦`, `第${number}卦`],
    },
    metadata: {
      hexagramNumber: number,
      unicodeSymbol: symbol,
      upperTrigramId: `trigram:${upper}`,
      lowerTrigramId: `trigram:${lower}`,
      linePattern: `${trigramLinePatterns[lower]}${trigramLinePatterns[upper]}`,
    },
    sourceIds: [classicalSourceId, editorialSourceId, hexagramDerivedSourceId],
    relatedLessonIds: [lessonIds[0], number <= 30 ? lessonIds[1] : lessonIds[2]],
  };
});

export const entities: KnowledgeEntity[] = [
  {
    id: "course:tianji",
    slug: "course-tianji",
    type: "course",
    labels: { "zh-Hant": "天紀", "zh-Hans": "天纪" },
    descriptions: {
      "zh-Hant": "本站三條研讀主線之一，涵蓋易經、八字命理與河洛相關內容。",
      "zh-Hans": "本站三条研读主线之一，涵盖易经、八字命理与河洛相关内容。",
    },
    aliases: { "zh-Hant": [], "zh-Hans": [] },
    metadata: { order: 1 },
    sourceIds: [editorialSourceId],
    relatedLessonIds: lessons.filter((lesson) => lesson.courseId === "course:tianji").map((lesson) => lesson.id),
  },
  {
    id: "classic:yijing",
    slug: "classic-yijing",
    type: "classic",
    labels: { "zh-Hant": "周易", "zh-Hans": "周易" },
    descriptions: {
      "zh-Hant": "以陰陽、八卦與六十四卦展開的經典，也是本站《易經》研讀路徑的核心文本。",
      "zh-Hans": "以阴阳、八卦与六十四卦展开的经典，也是本站《易经》研读路径的核心文本。",
    },
    aliases: { "zh-Hant": ["易經"], "zh-Hans": ["易经"] },
    metadata: { module: { "zh-Hant": "易經", "zh-Hans": "易经" } },
    sourceIds: [classicalSourceId, editorialSourceId],
    relatedLessonIds: lessonIds,
  },
  ...trigramRows.map(([id, nameHant, nameHans, symbol, lines, imageHant, imageHans, qualityHant, qualityHans]) => ({
    id: `trigram:${id}`,
    slug: `trigram-${id}`,
    type: "trigram" as const,
    labels: { "zh-Hant": nameHant, "zh-Hans": nameHans },
    descriptions: {
      "zh-Hant": `${nameHant}卦，取象為${imageHant}，核心性質為${qualityHant}。`,
      "zh-Hans": `${nameHans}卦，取象为${imageHans}，核心性质为${qualityHans}。`,
    },
    aliases: { "zh-Hant": [symbol], "zh-Hans": [symbol] },
    metadata: {
      symbol,
      linePattern: lines,
      naturalImage: { "zh-Hant": imageHant, "zh-Hans": imageHans },
      quality: { "zh-Hant": qualityHant, "zh-Hans": qualityHans },
    },
    sourceIds: [classicalSourceId, derivedSourceId],
    relatedLessonIds: [lessonIds[0], "lesson:tianji:heluo:01"],
  })),
  ...tianjiStructuredEntities,
  ...renjiAcupunctureEntities.map((entity) => entity.id === "course:renji" ? { ...entity, relatedLessonIds: [...entity.relatedLessonIds, ...renjiShanghanLessons.map((lesson) => lesson.id)] } : entity),
  ...renjiShanghanEntities,
  ...hexagrams,
];

export const relations: KnowledgeRelation[] = [
  {
    id: "relation:classic-yijing:part-of:course-tianji",
    type: "part_of",
    from: "classic:yijing",
    to: "course:tianji",
    sourceIds: [editorialSourceId],
  },
  ...yijingLessons.map((lesson) => ({
    id: `relation:${lesson.slug}:part-of:classic-yijing`,
    type: "part_of" as const,
    from: lesson.id,
    to: "classic:yijing",
    sourceIds: [editorialSourceId],
  })),
  ...["yin", "yang"].map((polarity) => ({
    id: `relation:lesson-tianji-yijing-01:contains:yin-yang-${polarity}`,
    type: "contains" as const,
    from: "lesson:tianji:yijing:01",
    to: `yin-yang:${polarity}`,
    sourceIds: [editorialSourceId],
  })),
  ...["wood", "fire", "earth", "metal", "water"].map((element) => ({
    id: `relation:lesson-tianji-yijing-05:contains:element-${element}`,
    type: "contains" as const,
    from: "lesson:tianji:yijing:05",
    to: `element:${element}`,
    sourceIds: [editorialSourceId],
  })),
  ...trigramRows.map(([id]) => ({
    id: `relation:trigram-${id}:appears-in:classic-yijing`,
    type: "appears_in" as const,
    from: `trigram:${id}`,
    to: "classic:yijing",
    sourceIds: [classicalSourceId],
  })),
  ...hexagramRows.flatMap(([number, , , , upper, lower]) => {
    const paddedNumber = String(number).padStart(2, "0");
    return [
      {
        id: `relation:hexagram-${paddedNumber}:appears-in:classic-yijing`,
        type: "appears_in" as const,
        from: `hexagram:${paddedNumber}`,
        to: "classic:yijing",
        sourceIds: [classicalSourceId],
      },
      {
        id: `relation:hexagram-${paddedNumber}:upper-trigram:trigram-${upper}`,
        type: "upper_trigram" as const,
        from: `hexagram:${paddedNumber}`,
        to: `trigram:${upper}`,
        sourceIds: [classicalSourceId, hexagramDerivedSourceId],
      },
      {
        id: `relation:hexagram-${paddedNumber}:lower-trigram:trigram-${lower}`,
        type: "lower_trigram" as const,
        from: `hexagram:${paddedNumber}`,
        to: `trigram:${lower}`,
        sourceIds: [classicalSourceId, hexagramDerivedSourceId],
      },
    ];
  }),
  ...tianjiStructuredRelations,
  ...renjiAcupunctureRelations,
  ...renjiShanghanRelations,
];

export const knowledgeGraph: KnowledgeGraph = {
  schemaVersion: "1.3.0",
  sources,
  entities: [...lessons, ...entities],
  relations,
};
