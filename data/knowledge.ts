import type { KnowledgeEntity, KnowledgeGraph, KnowledgeRelation, Lesson } from "@/lib/knowledge-schema";

const courseNote = { kind: "course_note" as const, label: "本站 V1 既有課程筆記整理" };
const classicSource = { kind: "classic_text" as const, label: "《周易》古典原文", url: "https://zh.wikisource.org/zh-hant/周易" };

export const lessons: Lesson[] = [
  [1, "陰陽爻與八卦總論", "陰陽爻、八卦取象與六十四卦的基本結構", "01-yinyang-bagua"],
  [2, "六十四卦詳解（上經30卦）", "乾坤至離，逐卦收錄卦辭、六爻與《彖》《象》導讀", "02-shangjing-30gua"],
  [3, "六十四卦詳解（下經34卦）", "咸恆至未濟，逐卦收錄卦辭、六爻與《彖》《象》導讀", "03-xiajing-34gua"],
  [4, "易經占卜方法：筮法", "蓍草與金錢起卦的研讀框架及判讀次序", "04-shifa"],
  [5, "易經與中醫", "以陰陽、五行、卦象與時位交叉理解天紀和人紀", "05-yijing-yu-zhongyi"],
].map(([order, title, summary, file]) => ({
  id: `lesson-tianji-yijing-${String(order).padStart(2, "0")}`,
  type: "lesson" as const,
  courseId: "course-tianji",
  moduleId: "classic-yijing",
  order: Number(order),
  title: String(title),
  summary: String(summary),
  slug: ["tianji", "yijing", String(file)],
  legacyPath: `tianji/yijing/${file}.html`,
  sources: [courseNote, classicSource],
  entityIds: order === 1 ? ["classic-yijing", "trigram-qian", "trigram-kun", "trigram-zhen", "trigram-xun", "trigram-kan", "trigram-li", "trigram-gen", "trigram-dui"] : ["classic-yijing"],
}));

const trigramRows = [
  ["qian", "乾", "☰", "111", "天", "健"], ["kun", "坤", "☷", "000", "地", "順"],
  ["zhen", "震", "☳", "100", "雷", "動"], ["xun", "巽", "☴", "011", "風", "入"],
  ["kan", "坎", "☵", "010", "水", "陷"], ["li", "離", "☲", "101", "火", "麗"],
  ["gen", "艮", "☶", "001", "山", "止"], ["dui", "兌", "☱", "110", "澤", "悅"],
] as const;

export const entities: KnowledgeEntity[] = [
  {
    id: "course-tianji", type: "course", name: "天紀", aliases: [],
    description: "本站三條研讀主線之一，涵蓋易經、八字命理與河洛相關內容。",
    sources: [courseNote], metadata: { order: 1 },
  },
  {
    id: "classic-yijing", type: "classic", name: "周易", aliases: ["易經"],
    description: "易學經典；V2 首批以五講課程與六十四卦結構作代表性遷移。",
    sources: [classicSource, courseNote], metadata: { module: "yijing" },
  },
  ...trigramRows.map(([id, name, symbol, lines, image, virtue]) => ({
    id: `trigram-${id}`, type: "trigram" as const, name, aliases: [symbol],
    description: `${name}卦，取象為${image}，核心性質為${virtue}。`,
    sources: [classicSource, courseNote], metadata: { symbol, lines, image, virtue },
  })),
];

export const relations: KnowledgeRelation[] = [
  { id: "rel-yijing-part-tianji", type: "part_of", from: "classic-yijing", to: "course-tianji" },
  ...lessons.map((lesson) => ({ id: `rel-${lesson.id}-part-yijing`, type: "part_of" as const, from: lesson.id, to: "classic-yijing" })),
  ...trigramRows.map(([id]) => ({ id: `rel-trigram-${id}-appears-yijing`, type: "appears_in" as const, from: `trigram-${id}`, to: "classic-yijing" })),
];

export const knowledgeGraph: KnowledgeGraph = {
  schemaVersion: "1.0.0",
  lessons,
  entities,
  relations,
};
