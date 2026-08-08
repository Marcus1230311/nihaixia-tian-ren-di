import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HexagramDiagram } from "@/components/hexagram-diagram";
import { LocalKnowledgeGraph } from "@/components/local-knowledge-graph";
import { TrigramDiagram } from "@/components/trigram-diagram";
import { entities, lessons, relations, sources } from "@/data/knowledge";
import { buildLocalGraph } from "@/lib/local-graph";
import { displayMetadata, entityTypeLabels, localize, metadataLabels, relationTypeLabels, sourceCategoryLabels } from "@/lib/presentation";

export const dynamicParams = false;

export function generateStaticParams() {
  return entities.map((entity) => ({ id: entity.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entity = entities.find((item) => item.slug === id);
  return entity ? { title: localize(entity.labels), description: localize(entity.descriptions) } : {};
}

export default async function EntityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entity = entities.find((item) => item.slug === id);
  if (!entity) notFound();
  const outgoing = relations.filter((relation) => relation.from === entity.id);
  const incoming = relations.filter((relation) => relation.to === entity.id);
  const displayOutgoing = outgoing.filter((relation) => relation.type !== "upper_trigram" && relation.type !== "lower_trigram");
  const allNodes = [...entities, ...lessons];
  const lines = typeof entity.metadata.linePattern === "string" ? entity.metadata.linePattern : null;
  const upperTrigram = entities.find((item) => item.id === outgoing.find((relation) => relation.type === "upper_trigram")?.to);
  const lowerTrigram = entities.find((item) => item.id === outgoing.find((relation) => relation.type === "lower_trigram")?.to);
  const publicMetadata = Object.entries(entity.metadata).filter(([key]) => key !== "upperTrigramId" && key !== "lowerTrigramId");
  const entitySources = entity.sourceIds.map((sourceId) => sources.find((source) => source.id === sourceId)).filter((source) => source !== undefined);
  const relatedLessons = entity.relatedLessonIds.map((lessonId) => lessons.find((lesson) => lesson.id === lessonId)).filter((lesson) => lesson !== undefined);
  const localGraph = buildLocalGraph({ centerId: entity.id, nodes: allNodes, relations });
  const meridianPoints = entity.type === "meridian"
    ? relations.filter((relation) => relation.type === "belongs_to" && relation.to === entity.id)
      .map((relation) => entities.find((candidate) => candidate.id === relation.from))
      .filter((candidate): candidate is NonNullable<typeof candidate> => candidate?.type === "acupoint")
      .sort((a, b) => Number(String(a.metadata.standardCode).match(/\d+$/)?.[0]) - Number(String(b.metadata.standardCode).match(/\d+$/)?.[0]))
    : [];
  const formulaIngredients = entity.type === "formula" ? outgoing.filter((relation) => relation.type === "contains_herb").map((relation) => entities.find((candidate) => candidate.id === relation.to)).filter((candidate): candidate is NonNullable<typeof candidate> => candidate?.type === "herb") : [];
  const formulaSyndromes = entity.type === "formula" ? outgoing.filter((relation) => relation.type === "classically_associated_with").map((relation) => entities.find((candidate) => candidate.id === relation.to)).filter((candidate): candidate is NonNullable<typeof candidate> => candidate?.type === "syndrome") : [];
  const formulaClassics = entity.type === "formula" ? outgoing.filter((relation) => relation.type === "appears_in").map((relation) => entities.find((candidate) => candidate.id === relation.to)).filter((candidate): candidate is NonNullable<typeof candidate> => candidate?.type === "classic") : [];
  const evidenceTitles = (sourceIds: string[]) => sourceIds.map((sourceId) => sources.find((source) => source.id === sourceId)).filter((source) => source !== undefined).map((source) => localize(source.title)).join("、");

  return (
    <div className="page-shell entity-page">
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "知識條目" }, { label: localize(entity.labels) }]} />
      <header className="lesson-header"><p className="kicker">{entity.type === "hexagram" ? `第 ${entity.metadata.hexagramNumber} 卦 · ${localize(entityTypeLabels.hexagram)}` : localize(entityTypeLabels[entity.type])}</p><h1>{localize(entity.labels)}</h1><p>{localize(entity.descriptions)}</p></header>
      {entity.type === "trigram" && lines && <TrigramDiagram name={localize(entity.labels)} lines={lines} />}
      {entity.type === "hexagram" && lines && <HexagramDiagram name={localize(entity.labels)} lines={lines} />}
      {entity.type === "hexagram" && upperTrigram && lowerTrigram && <section className="entity-details"><h2>卦象構成</h2><div className="trigram-composition">
        <Link href={`/entities/${upperTrigram.slug}/`}><span>上卦</span><strong>{localize(upperTrigram.labels)}</strong><small>{localize(upperTrigram.descriptions)}</small></Link>
        <Link href={`/entities/${lowerTrigram.slug}/`}><span>下卦</span><strong>{localize(lowerTrigram.labels)}</strong><small>{localize(lowerTrigram.descriptions)}</small></Link>
      </div></section>}
      <section className="entity-details"><h2>條目資料</h2><dl>{publicMetadata.map(([key, value]) => <div key={key}><dt>{localize(metadataLabels[key] ?? { "zh-Hant": key })}</dt><dd>{displayMetadata(value)}</dd></div>)}</dl></section>
      {entity.type === "formula" && <section className="entity-details formula-context-section"><h2>方劑組成與經典語境</h2>
        <div className="formula-context-summary"><div><span>藥材組成</span><strong>{formulaIngredients.length}</strong></div><div><span>相關病證</span><strong>{formulaSyndromes.length}</strong></div><div><span>相關經典</span><strong>{formulaClassics.length}</strong></div></div>
        <div className="formula-context-links">
          {formulaClassics.map((classic) => <Link key={classic.id} href={`/entities/${classic.slug}/`}><span>經典</span><strong>{localize(classic.labels)}</strong></Link>)}
          {formulaSyndromes.map((syndrome) => <Link key={syndrome.id} href={`/entities/${syndrome.slug}/`}><span>病證</span><strong>{localize(syndrome.labels)}</strong></Link>)}
          {formulaIngredients.map((herb) => <Link key={herb.id} href={`/entities/${herb.slug}/`}><span>藥材</span><strong>{localize(herb.labels)}</strong></Link>)}
        </div>
        <p className="medical-boundary"><strong>研讀與安全邊界：</strong>本頁呈現經典方劑身份、文獻關係與藥味組成，不提供個人診斷、劑量、藥材替換、自行購藥或處方調整建議。</p>
      </section>}
      {meridianPoints.length > 0 && <section className="entity-details meridian-point-section"><h2>本經標準穴位</h2><p>共 {meridianPoints.length} 穴，依標準代碼順序排列。</p><ol className="meridian-point-list">{meridianPoints.map((point) => <li key={point.id}><Link href={`/entities/${point.slug}/`}><span>{String(point.metadata.standardCode)}</span><strong>{localize(point.labels)}</strong></Link></li>)}</ol></section>}
      <section className="entity-details local-graph-section" aria-labelledby="local-graph-title">
        <h2 id="local-graph-title">知識連結圖</h2>
        <p>以本條目為中心，呈現一層直接關係；箭頭表示資料中的關係方向。</p>
        <LocalKnowledgeGraph graph={localGraph} />
        {localGraph.omittedNodeCount > 0 && <p className="graph-limit-note">本條目共有 {localGraph.directNeighborCount} 個直接相鄰條目；為維持可讀性，圖中顯示前 {localGraph.nodes.length - 1} 個。完整關係仍列於下方。</p>}
      </section>
      <section className="entity-details"><h2>知識關係</h2>{displayOutgoing.length || incoming.length ? <ul className="relation-list">
        {displayOutgoing.map((relation) => { const target = allNodes.find((item) => item.id === relation.to); if (!target) return null; const href = target.type === "lesson" ? `/lessons/${target.route.join("/")}/` : `/entities/${target.slug}/`; return <li key={relation.id}><span>{localize(relationTypeLabels[relation.type])}</span><Link href={href}>{localize(target.labels)}</Link>{relation.sourceIds.length > 0 && <small>證據：{evidenceTitles(relation.sourceIds)}</small>}</li>; })}
        {incoming.map((relation) => { const target = allNodes.find((item) => item.id === relation.from); if (!target) return null; const href = target.type === "lesson" ? `/lessons/${target.route.join("/")}/` : `/entities/${target.slug}/`; return <li key={relation.id}><Link href={href}>{localize(target.labels)}</Link><span>{localize(relationTypeLabels[relation.type])}本條目</span>{relation.sourceIds.length > 0 && <small>證據：{evidenceTitles(relation.sourceIds)}</small>}</li>; })}
      </ul> : <p>目前沒有可顯示的知識關係。</p>}</section>
      {relatedLessons.length > 0 && <section className="entity-details"><h2>延伸研讀</h2><ul>{relatedLessons.map((lesson) => <li key={lesson.id}><Link href={`/lessons/${lesson.route.join("/")}/`}>{localize(lesson.labels)}</Link></li>)}</ul></section>}
      <section className="entity-details"><h2>內容來源</h2><ul>{entitySources.map((source) => <li key={source.id}><strong>{source.url ? <a href={source.url}>{localize(source.title)}</a> : localize(source.title)}</strong><small>{localize(sourceCategoryLabels[source.category])}</small>{source.note && <p>{localize(source.note)}</p>}</li>)}</ul></section>
    </div>
  );
}
