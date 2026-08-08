import Link from "next/link";
import { HerbCrossDomainPath, HerbPropertyModel } from "@/components/renji-bencao-visuals";
import type { KnowledgeEntity, Lesson } from "@/lib/knowledge-schema";
import { entityTypeLabels, localize } from "@/lib/presentation";

function EntityGrid({ entities }: { entities: KnowledgeEntity[] }) {
  return <div className="learning-entity-grid">{entities.map((entity) => <Link key={entity.id} href={`/entities/${entity.slug}/`}><span>{localize(entityTypeLabels[entity.type])}</span><strong>{localize(entity.labels)}</strong><small>{localize(entity.descriptions)}</small></Link>)}</div>;
}

export function StructuredBencaoLesson({ lesson, relatedEntities }: { lesson: Lesson; relatedEntities: KnowledgeEntity[] }) {
  const archiveHref = `/v1/${lesson.legacyPath.replaceAll("\\", "/")}`;
  return <article className="migrated-content structured-lesson bencao-lesson">
    {lesson.id === "lesson:renji:bencao:01" && <>
      <h2>藥材從方劑零件成為知識入口</h2><p>本輪沒有新增藥材副本：二十四味全部重用傷寒與金匱已存在的全域身份。從一味藥即可查看經典、性味、歸經、方劑、課程與逐條證據。</p>
      <HerbPropertyModel /><h2>二十四味受控範圍</h2><EntityGrid entities={relatedEntities} />
      <h2>三品是古典研讀分類</h2><p>上品、中品、下品只對本站舊課明確講授的十二味代表藥建立分類；它不是現代毒性或自行用藥安全等級。</p>
    </>}
    {lesson.id === "lesson:renji:bencao:02" && <>
      <h2>藥性與藥味分開建模</h2><p>寒、涼、平、溫、熱是藥性軸；酸、苦、甘、辛、鹹是藥味軸。兩者使用不同實體類型與關係，因而可以查詢「辛而溫」而不混淆概念。</p>
      <HerbPropertyModel /><h2>來源不同，可以得到不同分類</h2><p>現存整理本、本站課程與現代規範對少數藥材並不一致。例如人參的「小寒」與「微溫」都保留各自關係證據，不由系統替讀者裁決。</p><EntityGrid entities={relatedEntities} />
    </>}
    {lesson.id === "lesson:renji:bencao:03" && <>
      <h2>一味藥可以有多個藥味</h2><p>桂枝可同時連到辛與甘，芍藥可同時連到酸與苦；共享的藥味節點讓跨藥材比較不依賴文字搜尋。</p>
      <EntityGrid entities={relatedEntities} />
    </>}
    {lesson.id === "lesson:renji:bencao:04" && <>
      <h2>歸經不是穴位的經脈隸屬</h2><p>穴位用「隸屬」連到一條具體經脈；藥材用「歸經」連到既有臟腑／系統。兩種主張在來源、方向與語意上都不同，不能因為中文都帶「經」字而合併。</p>
      <HerbCrossDomainPath /><h2>共享臟腑，不複製臟腑</h2><EntityGrid entities={relatedEntities} />
    </>}
    {lesson.id === "lesson:renji:bencao:05" && <>
      <h2>從藥材返回兩部經典</h2><p>桂枝、甘草、生薑、附子、當歸等節點自然匯集多張方劑；再由方劑進入傷寒或金匱的病證關係。局部圖譜限制鄰居數，但頁面下方仍保留完整文字關係。</p>
      <HerbCrossDomainPath /><EntityGrid entities={relatedEntities} />
    </>}
    <p className="medical-boundary"><strong>研讀與安全邊界：</strong>本頁只呈現傳統藥材分類、文獻關係與方劑組成，不提供個人診斷、劑量、藥材替換、炮製操作、自行購藥或處方建議；缺少警示資料不表示藥材安全。</p>
    <p><a href={archiveHref}>閱讀對應的典藏課程背景</a></p>
  </article>;
}
