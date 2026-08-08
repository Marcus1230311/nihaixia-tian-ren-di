import { entities, knowledgeGraph, lessons, relations, sources } from "../data/knowledge";
import { teachingGuides, teachingJourneyIds } from "../data/teaching";

if (knowledgeGraph.schemaVersion !== "1.5.0") throw new Error("Teaching Layer 必須建立在 Knowledge Model 1.5.0");
if (knowledgeGraph.entities.length !== 641 || relations.length !== 1933) throw new Error("Teaching Layer 不得改變 641／1,933 知識基線");
if (teachingJourneyIds.length !== 3 || new Set(teachingJourneyIds).size !== 3) throw new Error("必須恰有三條 Golden Journey");

const nodeIds = new Set([...entities, ...lessons].map((node) => node.id));
const sourceIds = new Set(sources.map((source) => source.id));
const publicRoutes = new Set(["/", ...entities.map((entity) => `/entities/${entity.slug}/`), ...lessons.map((lesson) => `/lessons/${lesson.route.join("/")}/`)]);
const expectedGuideIds = new Set([
  "element:wood", "organ:liver", "meridian:liver", "acupoint:lr-03",
  "lesson:renji:shanghan:01", "shanghan-channel:taiyang", "syndrome:taiyang-zhongfeng",
  "formula:guizhi-tang", "herb:guizhi",
]);

if (Object.keys(teachingGuides).length !== expectedGuideIds.size || Object.keys(teachingGuides).some((id) => !expectedGuideIds.has(id))) throw new Error("Teaching Layer 只能掛載九個受控旅程頁面");

for (const [id, guide] of Object.entries(teachingGuides)) {
  if (!nodeIds.has(id)) throw new Error(`${id} 不是既有 Knowledge Model 節點`);
  if (!teachingJourneyIds.includes(guide.journeyId)) throw new Error(`${id} 使用未知 Journey`);
  if (guide.context.filter((step) => step.current).length !== 1) throw new Error(`${id} Knowledge Context 必須恰有一個目前節點`);
  if (guide.takeaways.length < 2 || guide.takeaways.length > 4) throw new Error(`${id} 必須有 2–4 個學習重點`);
  if (!publicRoutes.has(guide.next.href)) throw new Error(`${id} 下一步不是既有公開路由：${guide.next.href}`);
  for (const step of guide.context) if (!publicRoutes.has(step.href)) throw new Error(`${id} Context 不是既有公開路由：${step.href}`);
  for (const relationship of guide.relationships) {
    if (!relationship.sourceIds.length) throw new Error(`${id} 關係解釋缺少依據`);
    for (const sourceId of relationship.sourceIds) if (!sourceIds.has(sourceId)) throw new Error(`${id} 引用未知來源：${sourceId}`);
  }
  for (const item of guide.comparison?.items ?? []) if (!publicRoutes.has(item.href)) throw new Error(`${id} 比較項不是既有公開路由：${item.href}`);
}

const taiyangComparison = teachingGuides["shanghan-channel:taiyang"].comparison;
if (!taiyangComparison || !taiyangComparison.items.some((item) => item.href === "/entities/meridian-level-taiyang/") || !taiyangComparison.items.some((item) => item.href === "/entities/shanghan-channel-taiyang/")) throw new Error("缺少針灸太陽／傷寒太陽混淆解析");

console.log(JSON.stringify({ journeys: teachingJourneyIds.length, guidedPages: Object.keys(teachingGuides).length, entities: knowledgeGraph.entities.length, relations: relations.length, schemaVersion: knowledgeGraph.schemaVersion }, null, 2));
