import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredTianjiLesson } from "@/components/structured-tianji-lesson";
import { StructuredRenjiLesson } from "@/components/structured-renji-lesson";
import { StructuredShanghanLesson } from "@/components/structured-shanghan-lesson";
import { StructuredJinguiLesson } from "@/components/structured-jingui-lesson";
import { StructuredBencaoLesson } from "@/components/structured-bencao-lesson";
import { entities, lessons, relations, sources } from "@/data/knowledge";
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
  const moduleLessons = lessons.filter((item) => item.moduleId === lesson.moduleId).sort((left, right) => left.order - right.order);
  const index = moduleLessons.findIndex((item) => item.id === lesson.id);
  const previous = moduleLessons[index - 1];
  const next = moduleLessons[index + 1];
  const isStructuredTianjiLesson = lesson.moduleId === "system:bazi" || lesson.moduleId === "system:heluo";
  const isStructuredRenjiLesson = lesson.moduleId === "system:acupuncture";
  const isStructuredShanghanLesson = lesson.moduleId === "classic:shanghan-lun";
  const isStructuredJinguiLesson = lesson.moduleId === "classic:jingui-yaolue";
  const isStructuredBencaoLesson = lesson.moduleId === "classic:shennong-bencao-jing";
  const isStructuredLesson = isStructuredTianjiLesson || isStructuredRenjiLesson || isStructuredShanghanLesson || isStructuredJinguiLesson || isStructuredBencaoLesson;
  const article = isStructuredLesson ? null : readLegacyArticle(lesson.legacyPath);
  const lessonSources = lesson.sourceIds.map((sourceId) => sources.find((source) => source.id === sourceId)).filter((source) => source !== undefined);
  const relatedEntities = lesson.relatedEntityIds.map((entityId) => entities.find((entity) => entity.id === entityId)).filter((entity) => entity !== undefined);
  const moduleLabel = localize(lesson.metadata.module as LocalizedText);
  const moduleOrder = typeof lesson.metadata.order === "number" ? lesson.metadata.order : lesson.order;
  const course = entities.find((entity) => entity.id === lesson.courseId);
  const courseLabel = course ? localize(course.labels) : "知識研讀";

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: courseLabel }, { label: moduleLabel }, { label: localize(lesson.labels) }]} />
      <header className="lesson-header"><p className="kicker">{moduleLabel} · 第 {moduleOrder} 講</p><h1>{localize(lesson.labels)}</h1><p>{localize(lesson.descriptions)}</p></header>
      <aside className="provenance-note"><strong>內容來源</strong>{lessonSources.map((source) => `${localize(source.title)}（${localize(sourceCategoryLabels[source.category])}）`).join("；")}。{isStructuredLesson ? "本頁以導讀、結構化條目與可重用圖解建立學習路徑；典藏課程頁保留較完整背景。" : "正文依既有課程內容編排，古典引文與導讀文字各自標示。"}</aside>
      {article ? <article className="classic migrated-content" dangerouslySetInnerHTML={{ __html: article }} /> : isStructuredRenjiLesson ? <StructuredRenjiLesson lesson={lesson} relatedEntities={relatedEntities} /> : isStructuredShanghanLesson ? <StructuredShanghanLesson lesson={lesson} relatedEntities={relatedEntities} relations={relations} /> : isStructuredJinguiLesson ? <StructuredJinguiLesson lesson={lesson} relatedEntities={relatedEntities} /> : isStructuredBencaoLesson ? <StructuredBencaoLesson lesson={lesson} relatedEntities={relatedEntities} /> : <StructuredTianjiLesson lesson={lesson} relatedEntities={relatedEntities} />}
      <nav className="lesson-nav" aria-label="課程前後篇">
        {previous ? <Link href={`/lessons/${previous.route.join("/")}/`}><span>← 上一講</span>{localize(previous.labels)}</Link> : <Link href="/"><span>← 返回</span>知識研讀首頁</Link>}
        {next ? <Link className="next" href={`/lessons/${next.route.join("/")}/`}><span>下一講 →</span>{localize(next.labels)}</Link> : <Link className="next" href="/"><span>回到{moduleLabel}導覽 →</span>知識研讀首頁</Link>}
      </nav>
    </div>
  );
}
