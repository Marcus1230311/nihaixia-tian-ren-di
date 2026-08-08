import Link from "next/link";
import type { Source } from "@/lib/knowledge-schema";
import { sourceCategoryLabels, localize } from "@/lib/presentation";
import type { TeachingPageGuide } from "@/data/teaching";

export function GuidedLearning({ guide, sources }: { guide: TeachingPageGuide; sources: Source[] }) {
  const evidenceIds = [...new Set(guide.relationships.flatMap((item) => item.sourceIds))];
  const evidence = evidenceIds.map((id) => sources.find((source) => source.id === id)).filter((source): source is Source => Boolean(source));

  return <section className="guided-learning" aria-labelledby="guided-learning-title">
    <p className="guided-label">{guide.journeyLabel}</p>
    <h2 id="guided-learning-title">這一頁在學什麼</h2>
    <p className="guided-objective">{guide.objective}</p>
    <nav className="knowledge-context" aria-label="Knowledge Context">
      <span>Knowledge Context</span>
      <ol>{guide.context.map((step) => <li key={`${step.href}-${step.label}`} className={step.current ? "is-current" : undefined}>{step.current ? <span aria-current="step">{step.label}</span> : <Link href={step.href}>{step.label}</Link>}</li>)}</ol>
    </nav>

    <div className="guided-core">
      <div><h3>為什麼先看這裡</h3><p>{guide.orientation}</p></div>
      <div><h3>開始前先知道</h3><ul>{guide.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div>
    <div className="guided-takeaways"><h3>讀完帶走</h3><ul>{guide.takeaways.map((item) => <li key={item}>{item}</li>)}</ul></div>

    {guide.relationships.length > 0 && <div className="guided-relations"><h3>為什麼相連</h3>{guide.relationships.map((item) => <article key={item.label}><h4>{item.label}</h4><p>{item.explanation}</p></article>)}</div>}

    {guide.comparison && <aside className="concept-comparison"><h3>{guide.comparison.question}</h3><p>{guide.comparison.answer}</p><div>{guide.comparison.items.map((item) => <Link href={item.href} key={item.href}><strong>{item.label}</strong><span>所屬系統：{item.system}</span><small>知識角色：{item.role}</small></Link>)}</div></aside>}

    {guide.deeper && <details className="guided-details"><summary>深入理解</summary>{guide.deeper.map((item) => <p key={item}>{item}</p>)}</details>}
    {evidence.length > 0 && <details className="guided-details"><summary>查看本段依據</summary><ul>{evidence.map((source) => <li key={source.id}><strong>{localize(source.title)}</strong><span>{localize(sourceCategoryLabels[source.category])}</span></li>)}</ul><p className="evidence-boundary">古典原文、本站編輯整理、外部參考與結構化整理分開標示；只有可直接追溯時才標示為倪海廈講授資料。</p></details>}

    <Link className="guided-next" href={guide.next.href}><span>建議下一個研讀概念</span><strong>{guide.next.label} →</strong><small>理由：{guide.next.reason}</small></Link>
  </section>;
}
