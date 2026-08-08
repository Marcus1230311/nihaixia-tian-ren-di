import Link from "next/link";
import { CrossClassicFormulaMap, JinguiConditionStructureMap } from "@/components/renji-jingui-visuals";
import type { KnowledgeEntity, Lesson } from "@/lib/knowledge-schema";
import { entityTypeLabels, localize } from "@/lib/presentation";

function EntityGrid({ entities }: { entities: KnowledgeEntity[] }) {
  return <div className="learning-entity-grid">{entities.map((entity) => <Link key={entity.id} href={`/entities/${entity.slug}/`}><span>{localize(entityTypeLabels[entity.type])}</span><strong>{localize(entity.labels)}</strong><small>{localize(entity.descriptions)}</small></Link>)}</div>;
}

export function StructuredJinguiLesson({ lesson, relatedEntities }: { lesson: Lesson; relatedEntities: KnowledgeEntity[] }) {
  const archiveHref = `/v1/${lesson.legacyPath.replaceAll("\\", "/")}`;
  const conditions = relatedEntities.filter((entity) => entity.type === "condition");
  const syndromes = relatedEntities.filter((entity) => entity.type === "syndrome");
  const formulas = relatedEntities.filter((entity) => entity.type === "formula");
  const herbs = relatedEntities.filter((entity) => entity.type === "herb");

  return <article className="migrated-content structured-lesson">
    {lesson.id === "lesson:renji:jingui:01" && <>
      <h2>病類不是病證的另一個名字</h2>
      <p>《金匱要略》常以疾病或章篇範圍組織材料；同一病類之下仍需分辨具體病機與方證。本輪因此新增通用「病類」身份，病證仍沿用跨人紀共享的病證類型。</p>
      <JinguiConditionStructureMap />
      <h2>七個受控病類入口</h2><EntityGrid entities={conditions} />
      <h2>先讀三個代表病證</h2><EntityGrid entities={syndromes} />
    </>}
    {lesson.id === "lesson:renji:jingui:02" && <>
      <h2>病名相近，不代表證候相同</h2><p>血痹、歷節、虛勞與肺系病各自保留病類入口；肺痿虛燥、肺癰熱毒瘀結與寒飲咳嗽上氣則是不同病證，不會壓成一張「肺病方」清單。</p>
      <EntityGrid entities={[...conditions, ...syndromes]} />
      <h2>六張代表方</h2><EntityGrid entities={formulas} />
    </>}
    {lesson.id === "lesson:renji:jingui:03" && <>
      <h2>同一組藥材身份跨方重用</h2><p>大建中湯、當歸生薑羊肉湯與苓桂朮甘湯各有獨立方劑身份；桂枝、生薑、白朮、甘草等既有藥材不因進入金匱語境而複製。</p>
      <EntityGrid entities={[...conditions, ...syndromes, ...formulas]} />
    </>}
    {lesson.id === "lesson:renji:jingui:04" && <>
      <h2>章篇入口與具體方證分層</h2><p>婦人病是研讀範圍；妊娠癥病漏下、婦人臟躁、腹中諸疾痛、產後胃實與產後鬱冒則分別保留自己的病證及來源。此結構不能用來推導個人治療。</p>
      <JinguiConditionStructureMap />
      <EntityGrid entities={[...conditions, ...syndromes]} />
      <h2>本輪對應方劑</h2><EntityGrid entities={formulas} />
    </>}
    {lesson.id === "lesson:renji:jingui:05" && <>
      <h2>共享身份，分開證據</h2><p>桂枝湯、大承氣湯與小柴胡湯不建立金匱專用副本。每張方仍只有一個穩定 ID；傷寒方證、金匱方證及兩部經典出處各由不同、可查來源的關係保存。</p>
      <CrossClassicFormulaMap />
      <h2>十五張方，只有十二張是新身份</h2><EntityGrid entities={formulas} />
      <h2>三十四味共享藥材</h2><p>其中十六味直接重用傷寒節點，十八味是本輪新增身份；同名藥材沒有按經典複製。</p><EntityGrid entities={herbs} />
    </>}
    <p className="medical-boundary"><strong>研讀與安全邊界：</strong>本頁只呈現《金匱要略》的病類、病證、經典方證與組成關係，不提供個人診斷、劑量、自行購藥、藥材替換或處方調整建議；實際醫療問題應由合格專業人員評估。</p>
    <p><a href={archiveHref}>閱讀對應的典藏課程背景</a></p>
  </article>;
}
