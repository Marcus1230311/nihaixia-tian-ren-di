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
      <section className="entity-details local-graph-section" aria-labelledby="local-graph-title">
        <h2 id="local-graph-title">知識連結圖</h2>
        <p>以本條目為中心，呈現一層直接關係；箭頭表示資料中的關係方向。</p>
        <LocalKnowledgeGraph graph={localGraph} />
        {localGraph.omittedNodeCount > 0 && <p className="graph-limit-note">本條目共有 {localGraph.directNeighborCount} 個直接相鄰條目；為維持可讀性，圖中顯示前 {localGraph.nodes.length - 1} 個。完整關係仍列於下方。</p>}
      </section>
      <section className="entity-details"><h2>知識關係</h2>{displayOutgoing.length || incoming.length ? <ul className="relation-list">
        {displayOutgoing.map((relation) => { const target = allNodes.find((item) => item.id === relation.to); if (!target) return null; const href = target.type === "lesson" ? `/lessons/${target.route.join("/")}/` : `/entities/${target.slug}/`; return <li key={relation.id}><span>{localize(relationTypeLabels[relation.type])}</span><Link href={href}>{localize(target.labels)}</Link></li>; })}
        {incoming.map((relation) => { const target = allNodes.find((item) => item.id === relation.from); if (!target) return null; const href = target.type === "lesson" ? `/lessons/${target.route.join("/")}/` : `/entities/${target.slug}/`; return <li key={relation.id}><Link href={href}>{localize(target.labels)}</Link><span>{localize(relationTypeLabels[relation.type])}本條目</span></li>; })}
      </ul> : <p>目前沒有可顯示的知識關係。</p>}</section>
      {relatedLessons.length > 0 && <section className="entity-details"><h2>延伸研讀</h2><ul>{relatedLessons.map((lesson) => <li key={lesson.id}><Link href={`/lessons/${lesson.route.join("/")}/`}>{localize(lesson.labels)}</Link></li>)}</ul></section>}
      <section className="entity-details"><h2>內容來源</h2><ul>{entitySources.map((source) => <li key={source.id}><strong>{source.url ? <a href={source.url}>{localize(source.title)}</a> : localize(source.title)}</strong><small>{localize(sourceCategoryLabels[source.category])}</small>{source.note && <p>{localize(source.note)}</p>}</li>)}</ul></section>
    </div>
  );
}
