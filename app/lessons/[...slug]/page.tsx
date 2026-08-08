import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { lessons, sources } from "@/data/knowledge";
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
  const article = readLegacyArticle(lesson.legacyPath);
  const lessonSources = lesson.sourceIds.map((sourceId) => sources.find((source) => source.id === sourceId)).filter((source) => source !== undefined);

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "天紀" }, { label: "易經" }, { label: localize(lesson.labels) }]} />
      <header className="lesson-header"><p className="kicker">易經 · 第 {lesson.order} 講</p><h1>{localize(lesson.labels)}</h1><p>{localize(lesson.descriptions)}</p></header>
      <aside className="provenance-note"><strong>內容來源</strong>{lessonSources.map((source) => `${localize(source.title)}（${localize(sourceCategoryLabels[source.category])}）`).join("；")}。正文依既有課程內容編排，古典引文與導讀文字各自標示。</aside>
      <article className="classic migrated-content" dangerouslySetInnerHTML={{ __html: article }} />
      <nav className="lesson-nav" aria-label="課程前後篇">
        {previous ? <Link href={`/lessons/${previous.route.join("/")}/`}><span>← 上一講</span>{localize(previous.labels)}</Link> : <Link href="/"><span>← 返回</span>知識研讀首頁</Link>}
        {next ? <Link className="next" href={`/lessons/${next.route.join("/")}/`}><span>下一講 →</span>{localize(next.labels)}</Link> : <Link className="next" href="/"><span>回到易經導覽 →</span>知識研讀首頁</Link>}
      </nav>
    </div>
  );
}
