export const teachingJourneyIds = ["five-element-to-point", "shanghan-to-herb", "guizhi-hub"] as const;

export type TeachingJourneyId = (typeof teachingJourneyIds)[number];

export type TeachingContextStep = {
  label: string;
  href: string;
  current?: boolean;
};

export type TeachingRelationship = {
  label: string;
  explanation: string;
  sourceIds: string[];
};

export type TeachingComparison = {
  question: string;
  answer: string;
  items: Array<{ label: string; href: string; system: string; role: string }>;
};

export type TeachingPageGuide = {
  journeyId: TeachingJourneyId;
  journeyLabel: string;
  objective: string;
  orientation: string;
  prerequisites: string[];
  takeaways: string[];
  context: TeachingContextStep[];
  relationships: TeachingRelationship[];
  deeper?: string[];
  comparison?: TeachingComparison;
  next: { label: string; href: string; reason: string };
};

const acupunctureSources = ["source:project:renji-acupuncture-notes", "source:derived:renji-acupuncture-pilot"];
const shanghanSources = ["source:classical:shanghan-lun", "source:project:renji-shanghan-notes", "source:derived:renji-shanghan-pilot"];

const journeyA = (current: string): TeachingContextStep[] => [
  { label: "木", href: "/entities/element-wood/", current: current === "wood" },
  { label: "肝", href: "/entities/organ-liver/", current: current === "liver" },
  { label: "足厥陰肝經", href: "/entities/meridian-liver/", current: current === "meridian" },
  { label: "太衝 LR3", href: "/entities/acupoint-lr-03/", current: current === "lr3" },
];

const journeyB = (current: string): TeachingContextStep[] => [
  { label: "傷寒六經", href: "/lessons/renji/shanghan/01-overview/", current: current === "framework" },
  { label: "太陽", href: "/entities/shanghan-channel-taiyang/", current: current === "taiyang" },
  { label: "太陽中風", href: "/entities/syndrome-taiyang-zhongfeng/", current: current === "syndrome" },
  { label: "桂枝湯", href: "/entities/formula-guizhi-tang/", current: current === "formula" },
  { label: "桂枝", href: "/entities/herb-guizhi/", current: current === "herb" },
];

export const teachingGuides: Record<string, TeachingPageGuide> = {
  "element:wood": {
    journeyId: "five-element-to-point", journeyLabel: "Golden Journey A · 從分類到具體穴位",
    objective: "辨認「五行分類、臟腑身份、經脈系統、穴位」四個概念層次，而不是把它們視為同一種事物。",
    orientation: "木是共用的五行分類。這一站先建立分類座標，再沿既有關係走向肝、肝經與太衝。",
    prerequisites: ["知道五行是分類框架，不是人體部位", "能區分概念名稱與具體條目身份"],
    takeaways: ["木在多個模組共用同一身份", "肝被歸入木，但木不等於肝", "後續路徑會逐步從抽象走向具體"],
    context: journeyA("wood"), relationships: [],
    deeper: ["這條路徑是教學順序；只有知識關係區中有來源的連線才是 graph edge。"],
    next: { label: "肝", href: "/entities/organ-liver/", reason: "先看臟腑如何被歸入五行，才能理解分類如何落到人體知識層。" },
  },
  "organ:liver": {
    journeyId: "five-element-to-point", journeyLabel: "Golden Journey A · 從分類到具體穴位",
    objective: "理解肝同時可被五行分類，也可與一條正經建立對應；兩種關係回答不同問題。",
    orientation: "此處從抽象的木進入臟腑身份。肝是被分類與被經脈對應的節點，不是兩者的別名。",
    prerequisites: ["木是分類，不是器官", "relation 的方向不代表兩個節點相同"],
    takeaways: ["肝歸屬木的分類", "足厥陰肝經對應肝", "臟腑是五行與經脈之間的概念橋接"],
    context: journeyA("liver"),
    relationships: [{ label: "肝 → 木", explanation: "這條關係表示肝被放入五行的木類，用來回答「肝的五行歸屬是什麼」；它不表示木只指肝。", sourceIds: acupunctureSources }],
    next: { label: "足厥陰肝經", href: "/entities/meridian-liver/", reason: "接著從臟腑身份進入經脈系統，觀察「對應」與「分類」的差別。" },
  },
  "meridian:liver": {
    journeyId: "five-element-to-point", journeyLabel: "Golden Journey A · 從分類到具體穴位",
    objective: "把經脈理解為有自身身份與穴位成員的系統，而不是臟腑的另一個名稱。",
    orientation: "足厥陰肝經對應肝，並收納 LR1–LR14 的標準穴位。這一站把臟腑層帶到可瀏覽的經脈層。",
    prerequisites: ["肝是臟腑身份", "經脈與臟腑之間是對應，不是身份合併"],
    takeaways: ["足厥陰肝經有獨立 canonical identity", "本經穴位以標準代碼排序", "太衝是本經的一個成員，不代表整條肝經"],
    context: journeyA("meridian"),
    relationships: [{ label: "足厥陰肝經 → 肝", explanation: "「對應」連接經脈系統與臟腑身份；它保留兩個節點各自可被查詢、引用與延伸的語義。", sourceIds: acupunctureSources }],
    next: { label: "太衝 LR3", href: "/entities/acupoint-lr-03/", reason: "在看完整條經脈後，再用一個標準穴位理解「成員隸屬」如何落到具體條目。" },
  },
  "acupoint:lr-03": {
    journeyId: "five-element-to-point", journeyLabel: "Golden Journey A · 從分類到具體穴位",
    objective: "完成從抽象分類到具體穴位的層級辨識，並把 LR3 放回其經脈與穴位分類語境。",
    orientation: "太衝（LR3）是足厥陰肝經的一個標準穴位。頁面呈現身份與分類，不提供取穴或治療操作建議。",
    prerequisites: ["足厥陰肝經是一個經脈系統", "穴位代碼用來識別條目，不等於功效主張"],
    takeaways: ["LR3 的主經脈是足厥陰肝經", "穴位還可有五輸穴等多重分類", "一路上的四個名稱分屬四種概念層"],
    context: journeyA("lr3"),
    relationships: [{ label: "太衝 LR3 → 足厥陰肝經", explanation: "「隸屬」回答太衝是哪一條正經的穴位；標準代碼與經脈成員關係共同維持可核對的身份。", sourceIds: [...acupunctureSources, "source:reference:who-acupuncture-nomenclature"] }],
    deeper: ["太衝另有原穴、輸穴與五行等分類。這些是同一穴位的多重分類，不是多個名為太衝的節點。"],
    next: { label: "五輸穴導讀", href: "/lessons/renji/acupuncture/02-five-shu/", reason: "路徑已抵達具體穴位；回到五輸穴框架可把 LR3 的分類遷移到其他經脈比較。" },
  },
  "lesson:renji:shanghan:01": {
    journeyId: "shanghan-to-herb", journeyLabel: "Golden Journey B · 從辨證框架到方藥身份",
    objective: "先建立六經辨證的閱讀層級，再沿一條可核對的經典路徑走到方劑與藥材。",
    orientation: "「傷寒六經」是本旅程的框架入口；接下來依序查看六經分類、病證、經典方劑與其中藥材。",
    prerequisites: ["本路徑是經典知識導讀，不是個人診斷流程", "同名詞在不同系統可能有不同身份"],
    takeaways: ["框架、六經、病證、方劑、藥材是不同層次", "路徑用既有來源關係串接", "研讀順序不等於處方建議"],
    context: journeyB("framework"), relationships: [],
    next: { label: "傷寒六經的太陽", href: "/entities/shanghan-channel-taiyang/", reason: "先選定六經中的一個分類，才能觀察病證如何隸屬其下。" },
  },
  "shanghan-channel:taiyang": {
    journeyId: "shanghan-to-herb", journeyLabel: "Golden Journey B · 從辨證框架到方藥身份",
    objective: "把《傷寒論》六經的太陽定位為辨證分類，並避免和針灸命名層級的同名概念混為一談。",
    orientation: "目前的「太陽」屬於《傷寒論》六經語境。它收納相關病證，但不是一條針灸經脈，也不是治療結論。",
    prerequisites: ["六經辨證是一種經典閱讀框架", "先看系統與角色，再用顯示名稱辨認概念"],
    takeaways: ["本節點屬《傷寒論》框架", "太陽中風是其下的一個病證身份", "針灸太陽與傷寒太陽名稱相同、身份不同"],
    context: journeyB("taiyang"),
    relationships: [{ label: "太陽 →《傷寒論》", explanation: "這條關係標示六經分類所屬的經典框架，限定了此處「太陽」的解讀語境。", sourceIds: shanghanSources }],
    comparison: {
      question: "兩個「太陽」是同一個概念嗎？",
      answer: "不是。可見名稱相同，但所屬系統、知識角色與穩定身份都不同；閱讀時應先確認頁面語境。",
      items: [
        { label: "針灸命名層級的太陽", href: "/entities/meridian-level-taiyang/", system: "十二正經命名", role: "分類具有太陽名稱的經脈；不是病證分類" },
        { label: "傷寒六經的太陽", href: "/entities/shanghan-channel-taiyang/", system: "《傷寒論》六經辨證", role: "組織相關病證的經典框架；不是針灸路徑" },
      ],
    },
    next: { label: "太陽中風", href: "/entities/syndrome-taiyang-zhongfeng/", reason: "從框架分類進入一個具體病證，才能理解方劑關聯所指向的語境。" },
  },
  "syndrome:taiyang-zhongfeng": {
    journeyId: "shanghan-to-herb", journeyLabel: "Golden Journey B · 從辨證框架到方藥身份",
    objective: "理解病證如何隸屬六經分類，以及經典方劑關聯為何不等於對讀者的治療建議。",
    orientation: "太陽中風是《傷寒論》太陽語境下的病證身份。頁面只呈現文獻與模型關係，不判斷任何人的狀況。",
    prerequisites: ["傷寒太陽是六經分類", "病證名稱不是線上自我診斷工具"],
    takeaways: ["太陽中風隸屬傷寒太陽", "桂枝湯與此病證有經典關聯", "有關聯不表示任何個人可自行使用"],
    context: journeyB("syndrome"),
    relationships: [{ label: "太陽中風 → 傷寒太陽", explanation: "這條隸屬關係把具體病證放回六經分類，避免只憑名稱脫離經典語境。", sourceIds: shanghanSources }],
    next: { label: "桂枝湯", href: "/entities/formula-guizhi-tang/", reason: "接著查看與此病證有經典關聯的方劑身份、組成與文獻邊界。" },
  },
  "formula:guizhi-tang": {
    journeyId: "shanghan-to-herb", journeyLabel: "Golden Journey B · 從辨證框架到方藥身份",
    objective: "把桂枝湯理解為跨經典重用的單一方劑身份，並區分方證關聯、方劑組成與經典出處。",
    orientation: "同一桂枝湯節點同時保存《傷寒論》《金匱要略》的來源語境；組成中的桂枝則是可跨方劑重用的藥材身份。",
    prerequisites: ["方證關聯是文獻主張，不是個人處方", "方劑與組成藥材各有獨立身份"],
    takeaways: ["桂枝湯與太陽中風有經典關聯", "桂枝是其組成藥材之一", "同一方劑可在不同經典語境出現"],
    context: journeyB("formula"),
    relationships: [
      { label: "桂枝湯 → 太陽中風", explanation: "這是《傷寒論》語境中的經典方證關聯，用於知識研讀，不構成診斷或用方建議。", sourceIds: shanghanSources },
      { label: "桂枝湯 → 桂枝", explanation: "這條組成關係說明桂枝是方中的一味藥；它不把藥材身份併入方劑。", sourceIds: ["source:reference:gxtcmu-shanghan-text", "source:derived:renji-shanghan-pilot"] },
    ],
    deeper: ["桂枝湯亦見於《金匱要略》。各經典關係保留各自來源，而方劑仍維持單一 canonical identity。"],
    next: { label: "桂枝", href: "/entities/herb-guizhi/", reason: "最後進入一味組成藥材，觀察同一 Herb 如何連接本草屬性、方劑與多部經典語境。" },
  },
  "herb:guizhi": {
    journeyId: "guizhi-hub", journeyLabel: "Golden Journey C · 桂枝的跨語境樞紐",
    objective: "以單一桂枝身份整合本草屬性、方劑組成、《傷寒論》《金匱要略》語境與來源，而不製造藥材副本。",
    orientation: "這一站不是線性處方路徑，而是 identity hub：本草資料描述桂枝，方劑關係讓桂枝參與組成，經典語境則透過既有方劑與來源連接。",
    prerequisites: ["藥材與方劑是不同身份", "來源類別說明證據性質，不代表所有資料都出自同一作者或課程"],
    takeaways: ["所有頁面共用同一桂枝 Herb", "性味歸經與方劑組成是不同關係", "《傷寒論》《金匱要略》的語境分別保留來源", "本站整理不自動宣稱倪海廈專屬歸屬"],
    context: [
      { label: "本草性味", href: "/lessons/renji/bencao/02-nature/" },
      { label: "桂枝", href: "/entities/herb-guizhi/", current: true },
      { label: "桂枝湯（傷寒／金匱語境）", href: "/entities/formula-guizhi-tang/" },
    ],
    relationships: [
      { label: "本草屬性 → 桂枝", explanation: "性味與歸經資料以獨立關係描述同一味桂枝；它們不是從方劑組成反推而來。", sourceIds: ["source:project:renji-bencao-notes", "source:reference:hkbu-cmed-herbs", "source:derived:renji-bencao-model"] },
      { label: "桂枝湯 → 桂枝", explanation: "桂枝湯的組成關係引用同一個桂枝節點，所以從《傷寒論》或《金匱要略》進入都不會產生第二味「桂枝」。", sourceIds: ["source:reference:gxtcmu-shanghan-text", "source:derived:renji-shanghan-pilot"] },
      { label: "桂枝湯 →《傷寒論》／《金匱要略》", explanation: "同一方劑分別連到兩部經典，各自保留古典來源；這是兩個並列語境，不是兩部經典之間的線性關係。", sourceIds: ["source:classical:shanghan-lun", "source:classical:jingui-yaolue"] },
    ],
    deeper: ["本草屬性的依據來自本站既有課程整理、外部參考與結構化整理；方劑的兩部經典語境則由方劑頁分別列出。", "目前資料沒有把現代桂枝身份直接斷言為《神農本草經》中的同名原物，避免跨時代藥物身份的過度合併。"],
    next: { label: "回看桂枝湯的雙經典語境", href: "/entities/formula-guizhi-tang/", reason: "帶著單一藥材身份回到方劑，可比較同一方劑在兩部經典中的來源與關聯，而不重複建立節點。" },
  },
};

export function getTeachingGuide(id: string) {
  return teachingGuides[id];
}
