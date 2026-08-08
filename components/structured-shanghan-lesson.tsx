import Link from "next/link";
import { FormulaCompositionDiagram, SixChannelDiagnosticMap } from "@/components/renji-shanghan-visuals";
import type { KnowledgeEntity, KnowledgeRelation, Lesson } from "@/lib/knowledge-schema";
import { entityTypeLabels, localize } from "@/lib/presentation";

function EntityGrid({ entities }: { entities: KnowledgeEntity[] }) {
  return <div className="learning-entity-grid">{entities.map((entity) => <Link key={entity.id} href={`/entities/${entity.slug}/`}><span>{localize(entityTypeLabels[entity.type])}</span><strong>{localize(entity.labels)}</strong><small>{localize(entity.descriptions)}</small></Link>)}</div>;
}

export function StructuredShanghanLesson({ lesson, relatedEntities, relations }: { lesson: Lesson; relatedEntities: KnowledgeEntity[]; relations: KnowledgeRelation[] }) {
  const archiveHref = `/v1/${lesson.legacyPath.replaceAll("\\", "/")}`;
  const channels = relatedEntities.filter((entity) => entity.type === "shanghan_channel");
  const syndromes = relatedEntities.filter((entity) => entity.type === "syndrome");
  const formulas = relatedEntities.filter((entity) => entity.type === "formula");
  const herbs = relatedEntities.filter((entity) => entity.type === "herb");
  const guizhiTang = formulas.find((formula) => formula.id === "formula:guizhi-tang");
  const guizhiHerbIds = guizhiTang ? relations.filter((relation) => relation.from === guizhiTang.id && relation.type === "contains_herb").map((relation) => relation.to) : [];
  const guizhiHerbs = guizhiHerbIds.map((id) => herbs.find((herb) => herb.id === id)).filter((herb): herb is KnowledgeEntity => herb !== undefined);

  return <article className="migrated-content structured-lesson">
    {lesson.id === "lesson:renji:shanghan:01" && <>
      <h2>同名不等於同一概念</h2><p>傷寒六經是診斷與病理分類；針灸資料中的太陽、陽明等是十二正經命名層級。兩者使用不同穩定 ID 與條目類型，搜尋時可並列辨認，圖譜不會因名稱相同而自動合併。</p>
      <SixChannelDiagnosticMap />
      <h2>六個診斷分類</h2><EntityGrid entities={channels} />
    </>}
    {lesson.id === "lesson:renji:shanghan:02" && <>
      <h2>太陽的兩個代表病證</h2><p>本輪把太陽中風與太陽傷寒建為可查詢病證，再讓桂枝湯、麻黃湯分別建立「經典方證關聯」。這是文獻研讀關係，不是由單一症狀觸發的用藥規則。</p><EntityGrid entities={syndromes} />
      <h2>代表方</h2><EntityGrid entities={formulas} />
    </>}
    {lesson.id === "lesson:renji:shanghan:03" && <>
      <h2>陽明與少陽如何分層？</h2><p>陽明先分經證與腑證；腑證再保留本站承氣湯對照中的輕、中、重層次。少陽證保持獨立，不把不同病證壓成一個方名索引。</p><EntityGrid entities={[...channels, ...syndromes]} />
      <h2>代表方證關聯</h2><EntityGrid entities={formulas} />
    </>}
    {lesson.id === "lesson:renji:shanghan:04" && <>
      <h2>三陰不是單一寒證清單</h2><p>太陰、少陰、厥陰各有獨立診斷身份；少陰另分寒化與熱化，避免僅由「少陰」標籤推導固定治法。厥陰只保留既有課程支持的寒熱錯雜代表結構。</p><EntityGrid entities={[...channels, ...syndromes]} />
      <h2>代表方</h2><EntityGrid entities={formulas} />
    </>}
    {lesson.id === "lesson:renji:shanghan:05" && <>
      <h2>兩種關係回答兩個問題</h2><p>「經典方證關聯」回答某方在本研讀範圍與哪個病證相連；「組成」回答某方包含哪些藥材。來源、方證與組成分開，未來擴至《金匱要略》時可以重用同一味藥，而不複製身份。</p>
      {guizhiTang && guizhiHerbs.length > 0 && <FormulaCompositionDiagram formula={guizhiTang} herbs={guizhiHerbs} />}
      <h2>十一張代表方</h2><EntityGrid entities={formulas} />
      <h2>二十九味共享藥材</h2><EntityGrid entities={herbs} />
    </>}
    <p className="medical-boundary"><strong>研讀與安全邊界：</strong>本頁呈現《傷寒論》研讀框架中的經典方證與組成關係，不提供個人診斷、劑量、自行購藥、替代藥或處方調整建議；實際醫療問題應由合格專業人員評估。</p>
    <p><a href={archiveHref}>閱讀對應的典藏課程背景</a></p>
  </article>;
}
