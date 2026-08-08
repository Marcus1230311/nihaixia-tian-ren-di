import Link from "next/link";
import { SearchPanel } from "@/components/search-panel";
import { entities, lessons } from "@/data/knowledge";

export default function HomePage() {
  const trigrams = entities.filter((entity) => entity.type === "trigram");
  return (
    <>
      <section className="hero-shell">
        <p className="kicker">V2 · 代表性遷移批次</p>
        <h1>把課程頁變成<br />可以查找與連結的知識</h1>
        <p>目前先遷移易經五講，保留 V1 正文、來源和安全邊界，同時建立課程、經典、八卦實體與關係模型。</p>
        <div className="hero-actions"><Link href={`/lessons/${lessons[0].slug.join("/")}/`}>開始研讀易經</Link><a href="/v1/index.html">查看 V1 原站</a></div>
      </section>
      <SearchPanel />
      <section className="platform-grid" aria-labelledby="model-title">
        <div><p className="kicker">知識模型</p><h2 id="model-title">先有穩定資料，再做圖譜</h2><p>首批資料包含 {lessons.length} 篇課程、1 部經典與 {trigrams.length} 個八卦實體。每個實體都有來源、別名、描述與明確關係。</p></div>
        <div className="metric"><strong>{lessons.length}</strong><span>已遷移課程</span></div>
        <div className="metric"><strong>{entities.length}</strong><span>結構化實體</span></div>
      </section>
    </>
  );
}
