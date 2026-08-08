import Link from "next/link";
import { FiveElementCycle } from "@/components/five-element-cycle";
import { HeluoDiagrams } from "@/components/heluo-diagrams";
import type { KnowledgeEntity, Lesson } from "@/lib/knowledge-schema";
import { displayMetadata, localize } from "@/lib/presentation";

function EntityGrid({ entities }: { entities: KnowledgeEntity[] }) {
  return <div className="learning-entity-grid">{entities.map((entity) => <Link key={entity.id} href={`/entities/${entity.slug}/`}><strong>{localize(entity.labels)}</strong><span>{localize(entity.descriptions)}</span></Link>)}</div>;
}

export function StructuredTianjiLesson({ lesson, relatedEntities }: { lesson: Lesson; relatedEntities: KnowledgeEntity[] }) {
  const archiveHref = `/v1/${lesson.legacyPath.replaceAll("\\", "/")}`;

  if (lesson.id === "lesson:tianji:bazi:01") {
    const stems = relatedEntities.filter((entity) => entity.type === "heavenly_stem");
    const branches = relatedEntities.filter((entity) => entity.type === "earthly_branch");
    return <article className="migrated-content structured-lesson">
      <h2>先建立哪三層基礎？</h2><ol><li>先認得五行與陰陽是兩套不同的分類軸。</li><li>再記十天干：每種五行各有一陰一陽。</li><li>最後學十二地支的本氣五行；藏干、合沖刑害留待進階課程。</li></ol>
      <h2>五行的兩種基本關係</h2><p>相生與相剋是理解干支和十神的共同語法。此圖只呈現最基本的生、剋，不加入旺衰或用神判斷。</p><FiveElementCycle />
      <h2>十天干</h2><EntityGrid entities={stems} />
      <h2>十二地支</h2><EntityGrid entities={branches} />
      <p className="learning-next"><strong>下一步：</strong>能逐一說出干支的陰陽與本氣五行後，再讀十神系統；本頁不提供排盤、出生資料輸入或命運預測。</p>
      <p><a href={archiveHref}>閱讀典藏課程頁以了解六十甲子與後續概念</a></p>
    </article>;
  }

  if (lesson.id === "lesson:tianji:bazi:03") {
    return <article className="migrated-content structured-lesson">
      <h2>十神不是十個固定物件</h2><p>十神描述某一干支相對「日主」的關係。先判斷五行方向是同我、我生、我剋、剋我或生我，再比較陰陽同異，才得到十神名稱。</p>
      <div className="ten-god-grid">{relatedEntities.filter((entity) => entity.type === "ten_god").map((entity) => <Link key={entity.id} href={`/entities/${entity.slug}/`}><strong>{localize(entity.labels)}</strong><span>{displayMetadata(entity.metadata.relationAxis)} · {displayMetadata(entity.metadata.polarityRule)}</span></Link>)}</div>
      <h2>應該在哪裡停下來？</h2><p>本階段只建立分類語法與術語入口，不把十神直接綁定到性格、六親或吉凶，也不生成個人命盤。這些解讀必須連同完整命局與來源脈絡處理。</p>
      <p className="learning-next"><strong>建議順序：</strong>若還不能熟練辨認干支五行與陰陽，先回到<Link href="/lessons/tianji/bazi/01-tiangan-dizhi/">天干地支基礎</Link>。</p>
      <p><a href={archiveHref}>閱讀典藏課程頁的十神分類表</a></p>
    </article>;
  }

  return <article className="migrated-content structured-lesson">
    <h2>先分清河圖與洛書</h2><p>河圖著重一至十的生成數、五方與五行；洛書著重一至九的九宮排列、方位與後天八卦。兩者共用數字和方位概念，但不是同一張圖。</p>
    <HeluoDiagrams />
    <h2>核心條目</h2><EntityGrid entities={relatedEntities.filter((entity) => ["concept", "direction"].includes(entity.type))} />
    <p className="learning-next"><strong>下一步：</strong>先能由洛書數字找到方位與八卦，再進入姓名或風水延伸。本站沿用既有八卦、五行與陰陽條目，不建立河洛專用副本。</p>
    <p><a href={archiveHref}>閱讀典藏課程頁的完整對照表與背景說明</a></p>
  </article>;
}
