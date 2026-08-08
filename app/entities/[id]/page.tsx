import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TrigramDiagram } from "@/components/trigram-diagram";
import { entities, relations } from "@/data/knowledge";

export const dynamicParams = false;

export function generateStaticParams() {
  return entities.map((entity) => ({ id: entity.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entity = entities.find((item) => item.id === id);
  return entity ? { title: entity.name, description: entity.description } : {};
}

export default async function EntityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entity = entities.find((item) => item.id === id);
  if (!entity) notFound();
  const outgoing = relations.filter((relation) => relation.from === entity.id);
  const incoming = relations.filter((relation) => relation.to === entity.id);
  const linked = [...outgoing.map((relation) => ({ relation, id: relation.to })), ...incoming.map((relation) => ({ relation, id: relation.from }))];
  const lines = typeof entity.metadata.lines === "string" ? entity.metadata.lines : null;

  return (
    <div className="page-shell entity-page">
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "知識實體" }, { label: entity.name }]} />
      <header className="lesson-header"><p className="kicker">{entity.type}</p><h1>{entity.name}</h1><p>{entity.description}</p></header>
      {entity.type === "trigram" && lines && <TrigramDiagram name={entity.name} lines={lines} />}
      <section className="entity-details"><h2>結構化資料</h2><dl>{Object.entries(entity.metadata).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl></section>
      <section className="entity-details"><h2>關係</h2>{linked.length ? <ul>{linked.map(({ relation, id }) => { const target = entities.find((item) => item.id === id); return <li key={relation.id}><code>{relation.type}</code>{target ? <Link href={`/entities/${target.id}/`}>{target.name}</Link> : id}</li>; })}</ul> : <p>目前沒有已發布的關係。</p>}</section>
      <section className="entity-details"><h2>來源</h2><ul>{entity.sources.map((source) => <li key={source.label}>{source.url ? <a href={source.url}>{source.label}</a> : source.label} <small>({source.kind})</small></li>)}</ul></section>
    </div>
  );
}
