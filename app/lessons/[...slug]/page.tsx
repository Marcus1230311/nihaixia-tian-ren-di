import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredTianjiLesson } from "@/components/structured-tianji-lesson";
import { entities, lessons, sources } from "@/data/knowledge";
import type { LocalizedText } from "@/lib/knowledge-schema";
import { localize, sourceCategoryLabels } from "@/lib/presentation";
import { readLegacyArticle } from "@/lib/v1-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.route }));
}

function getLesson(slug: string[]) {
  return lessons.find((lesson) => lesson.route.join("/") === slug.join("/"));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  return lesson ? { title: localize(lesson.labels), description: localize(lesson.descriptions) } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const lesson = getLesson((await params).slug);
  if (!lesson) notFound();
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const isStructuredTianjiLesson = lesson.moduleId === "system:bazi" || lesson.moduleId === "system:heluo";
  const article = isStructuredTianjiLesson ? null : readLegacyArticle(lesson.legacyPath);
  const lessonSources = lesson.sourceIds.map((sourceId) => sources.find((source) => source.id === sourceId)).filter((source) => source !== undefined);
  const relatedEntities = lesson.relatedEntityIds.map((entityId) => entities.find((entity) => entity.id === entityId)).filter((entity) => entity !== undefined);
  const moduleLabel = localize(lesson.metadata.module as LocalizedText);
  const moduleOrder = typeof lesson.metadata.order === "number" ? lesson.metadata.order : lesson.order;

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "天紀" }, { label: moduleLabel }, { label: localize(lesson.labels) }]} />
      <header className="lesson-header"><p className="kicker">{moduleLabel} · 第 {moduleOrder} 講</p><h1>{localize(lesson.labels)}</h1><p>{localize(lesson.descriptions)}</p></header>
      <aside className="provenance-note"><strong>內容來源</strong>{lessonSources.map((source) => `${localize(source.title)}（${localize(sourceCategoryLabels[source.category])}）`).join("；")}。{isStructuredTianjiLesson ? "本頁以導讀、結構化條目與可重用圖解建立學習路徑；典藏課程頁保留較完整背景。" : "正文依既有課程內容編排，古典引文與導讀文字各自標示。"}</aside>
      {article ? <article className="classic migrated-content" dangerouslySetInnerHTML={{ __html: article }} /> : <StructuredTianjiLesson lesson={lesson} relatedEntities={relatedEntities} />}
      <nav className="lesson-nav" aria-label="課程前後篇">
        {previous ? <Link href={`/lessons/${previous.route.join("/")}/`}><span>← 上一講</span>{localize(previous.labels)}</Link> : <Link href="/"><span>← 返回</span>知識研讀首頁</Link>}
        {next ? <Link className="next" href={`/lessons/${next.route.join("/")}/`}><span>下一講 →</span>{localize(next.labels)}</Link> : <Link className="next" href="/"><span>回到易經導覽 →</span>知識研讀首頁</Link>}
      </nav>
    </div>
  );
}
