import type { Locale, LocalizedText } from "@/lib/knowledge-schema";

export const defaultLocale = "zh-Hant" as const;

export function localize(value: LocalizedText, locale: Locale = defaultLocale): string {
  return value[locale] ?? value[defaultLocale];
}

export const entityTypeLabels = {
  course: { "zh-Hant": "課程主線", "zh-Hans": "课程主线" },
  classic: { "zh-Hant": "經典", "zh-Hans": "经典" },
  lesson: { "zh-Hant": "研讀課程", "zh-Hans": "研读课程" },
  trigram: { "zh-Hant": "八卦", "zh-Hans": "八卦" },
  hexagram: { "zh-Hant": "六十四卦", "zh-Hans": "六十四卦" },
  heavenly_stem: { "zh-Hant": "天干", "zh-Hans": "天干" },
  earthly_branch: { "zh-Hant": "地支", "zh-Hans": "地支" },
  element: { "zh-Hant": "五行", "zh-Hans": "五行" },
  yin_yang: { "zh-Hant": "陰陽", "zh-Hans": "阴阳" },
  ten_god: { "zh-Hant": "十神", "zh-Hans": "十神" },
  direction: { "zh-Hant": "方位", "zh-Hans": "方位" },
  concept: { "zh-Hant": "概念", "zh-Hans": "概念" },
  formula: { "zh-Hant": "方劑", "zh-Hans": "方剂" },
  herb: { "zh-Hant": "藥材", "zh-Hans": "药材" },
} satisfies Record<string, LocalizedText>;

export const relationTypeLabels = {
  part_of: { "zh-Hant": "屬於", "zh-Hans": "属于" },
  belongs_to: { "zh-Hant": "隸屬於", "zh-Hans": "隶属于" },
  contains: { "zh-Hant": "包含", "zh-Hans": "包含" },
  appears_in: { "zh-Hant": "見於", "zh-Hans": "见于" },
  sourced_from: { "zh-Hant": "出處", "zh-Hans": "出处" },
  contains_herb: { "zh-Hant": "組成", "zh-Hans": "组成" },
  related_formula: { "zh-Hant": "相關方劑", "zh-Hans": "相关方剂" },
  corresponds_to: { "zh-Hant": "對應", "zh-Hans": "对应" },
  element_of: { "zh-Hant": "五行屬性", "zh-Hans": "五行属性" },
  upper_trigram: { "zh-Hant": "上卦", "zh-Hans": "上卦" },
  lower_trigram: { "zh-Hant": "下卦", "zh-Hans": "下卦" },
  related_to: { "zh-Hant": "相關", "zh-Hans": "相关" },
  generates: { "zh-Hant": "相生", "zh-Hans": "相生" },
  controls: { "zh-Hant": "相剋", "zh-Hans": "相克" },
} satisfies Record<string, LocalizedText>;

export const sourceCategoryLabels = {
  nihaixia: { "zh-Hant": "倪海廈講授資料", "zh-Hans": "倪海厦讲授资料" },
  classical: { "zh-Hant": "古典原文", "zh-Hans": "古典原文" },
  editorial: { "zh-Hant": "編輯整理", "zh-Hans": "编辑整理" },
  reference: { "zh-Hant": "參考資料", "zh-Hans": "参考资料" },
  derived: { "zh-Hant": "結構化整理", "zh-Hans": "结构化整理" },
} satisfies Record<string, LocalizedText>;

export const metadataLabels: Record<string, LocalizedText> = {
  order: { "zh-Hant": "次序", "zh-Hans": "次序" },
  module: { "zh-Hant": "研讀單元", "zh-Hans": "研读单元" },
  symbol: { "zh-Hant": "卦符", "zh-Hans": "卦符" },
  linePattern: { "zh-Hant": "爻形（自下而上）", "zh-Hans": "爻形（自下而上）" },
  naturalImage: { "zh-Hant": "自然取象", "zh-Hans": "自然取象" },
  quality: { "zh-Hant": "核心性質", "zh-Hans": "核心性质" },
  hexagramNumber: { "zh-Hant": "通行卦序", "zh-Hans": "通行卦序" },
  unicodeSymbol: { "zh-Hant": "卦符", "zh-Hans": "卦符" },
  upperTrigramId: { "zh-Hant": "上卦", "zh-Hans": "上卦" },
  lowerTrigramId: { "zh-Hant": "下卦", "zh-Hans": "下卦" },
  zodiac: { "zh-Hant": "生肖", "zh-Hans": "生肖" },
  numberValue: { "zh-Hant": "河洛數字", "zh-Hans": "河洛数字" },
  numberRole: { "zh-Hant": "河圖角色", "zh-Hans": "河图角色" },
  relationAxis: { "zh-Hant": "與日主關係", "zh-Hans": "与日主关系" },
  polarityRule: { "zh-Hant": "陰陽判準", "zh-Hans": "阴阳判准" },
  bearing: { "zh-Hant": "方位角", "zh-Hans": "方位角" },
};

export function displayMetadata(value: unknown, locale: Locale = defaultLocale) {
  if (value && typeof value === "object" && !Array.isArray(value) && "zh-Hant" in value) {
    return localize(value as LocalizedText, locale);
  }
  if (Array.isArray(value)) return value.join("、");
  if (typeof value === "boolean") return value ? "是" : "否";
  return String(value);
}
