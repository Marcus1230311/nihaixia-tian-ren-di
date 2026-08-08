import Link from "next/link";
import { FiveElementCycle } from "@/components/five-element-cycle";
import { FiveShuDiagram, MeridianOverview } from "@/components/renji-acupuncture-visuals";
import type { KnowledgeEntity, Lesson } from "@/lib/knowledge-schema";
import { localize } from "@/lib/presentation";

function EntityGrid({ entities }: { entities: KnowledgeEntity[] }) {
  return <div className="learning-entity-grid">{entities.map((entity) => <Link key={entity.id} href={`/entities/${entity.slug}/`}><strong>{localize(entity.labels)}</strong><span>{localize(entity.descriptions)}</span></Link>)}</div>;
}

export function StructuredRenjiLesson({ lesson, relatedEntities }: { lesson: Lesson; relatedEntities: KnowledgeEntity[] }) {
  const archiveHref = `/v1/${lesson.legacyPath.replaceAll("\\", "/")}`;
  if (lesson.id === "lesson:renji:acupuncture:01") {
    const meridians = relatedEntities.filter((entity) => entity.type === "meridian");
    const organs = relatedEntities.filter((entity) => entity.type === "organ");
    const levels = relatedEntities.filter((entity) => entity.type === "meridian_level");
    return <article className="migrated-content structured-lesson">
      <h2>十二正經如何組織？</h2><p>每條正經同時有手／足、陰／陽，以及太陰、少陰、厥陰或陽明、太陽、少陽的層級名稱，再連到對應臟腑。這些是彼此獨立但可連結的知識身份，不應塞進一段不可查詢的文字。</p>
      <MeridianOverview />
      <h2>十二條經脈</h2><EntityGrid entities={meridians} />
      <h2>六個經脈層級</h2><p>太陰、少陰、厥陰、陽明、太陽、少陽先作為十二正經命名層級；它們可供未來《傷寒論》引用，但本頁不建立六經辨證推論。</p><EntityGrid entities={levels} />
      <h2>臟腑如何接到共享五行？</h2><p>臟腑採全站共用身份，再連到既有五行，因此可沿「足厥陰肝經 → 肝 → 木」逐層閱讀，不為針灸複製另一套肝或木。</p><FiveElementCycle /><EntityGrid entities={organs} />
      <p className="medical-boundary"><strong>研讀與安全邊界：</strong>本頁只整理知識結構，不提供穴位定位、自行針刺、診斷或個別治療建議；針刺須由受過訓練的合格專業人員施行。</p>
      <p><a href={archiveHref}>閱讀典藏課程的十二經流注與循行說明</a></p>
    </article>;
  }

  const categories = relatedEntities.filter((entity) => entity.type === "point_category");
  const meridians = relatedEntities.filter((entity) => entity.type === "meridian");
  return <article className="migrated-content structured-lesson">
    <h2>為什麼分類要成為知識條目？</h2><p>穴位可以同時是輸穴、原穴或八脈交會穴。把分類建成一級條目，再用「分類為」關係連結，才能回答「哪些穴是原穴」及「太衝有哪些分類」，又不製造針灸專用關係類型。</p>
    <FiveShuDiagram />
    <h2>本頁使用的穴位分類</h2><EntityGrid entities={categories} />
    <h2>十二正經 309 個標準穴位</h2><p>十二條經脈頁各自提供依標準代碼排序的完整穴位清單，並連到每個穴位的經脈隸屬、五輸與有來源支持的原、絡、郄、募、背俞及交會分類。</p><EntityGrid entities={meridians} />
    <p className="medical-boundary"><strong>研讀與安全邊界：</strong>條目頁不新增主治、配穴或操作步驟。若需查看既有定位與課程背景，請閱讀典藏頁，並由合格專業人員處理臨床問題。</p>
    <p><a href={archiveHref}>閱讀典藏課程的足三陰三陽穴位表</a>；亦可<a href="/v1/renji/zhenjiu/02-shou-sanyin-sanyang.html">查看手三陰三陽穴位表</a>。</p>
  </article>;
}
