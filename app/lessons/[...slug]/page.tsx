import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { lessons } from "@/data/knowledge";
import { readLegacyArticle } from "@/lib/v1-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

function getLesson(slug: string[]) {
  return lessons.find((lesson) => lesson.slug.join("/") === slug.join("/"));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  return lesson ? { title: lesson.title, description: lesson.summary } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const lesson = getLesson((await params).slug);
  if (!lesson) notFound();
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const article = readLegacyArticle(lesson.legacyPath);

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "天紀" }, { label: "易經" }, { label: lesson.title }]} />
      <header className="lesson-header"><p className="kicker">易經 · 第 {lesson.order} 講</p><h1>{lesson.title}</h1><p>{lesson.summary}</p></header>
      <aside className="migration-note"><strong>V2 內容對帳</strong>本頁正文直接取自已驗收的 V1 檔案，沒有重新生成。來源標示、經典原文與安全邊界均原樣保留。</aside>
      <article className="classic migrated-content" dangerouslySetInnerHTML={{ __html: article }} />
      <nav className="lesson-nav" aria-label="課程前後篇">
        {previous ? <Link href={`/lessons/${previous.slug.join("/")}/`}><span>← 上一講</span>{previous.title}</Link> : <Link href="/"><span>← 返回</span>知識平台首頁</Link>}
        {next ? <Link className="next" href={`/lessons/${next.slug.join("/")}/`}><span>下一講 →</span>{next.title}</Link> : <Link className="next" href="/"><span>完成本批次 →</span>返回知識平台首頁</Link>}
      </nav>
    </div>
  );
}
