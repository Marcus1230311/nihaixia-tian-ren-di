import Link from "next/link";
import { SearchPanel } from "@/components/search-panel";
import { entities, lessons } from "@/data/knowledge";

export default function HomePage() {
  const trigrams = entities.filter((entity) => entity.type === "trigram");
  const hexagrams = entities.filter((entity) => entity.type === "hexagram");
  return (
    <>
      <section className="hero-shell">
        <p className="kicker">天人地三紀 · 知識研讀</p>
        <h1>從經典與課程出發<br />找到知識之間的連結</h1>
        <p>沿著《易經》研讀路徑閱讀課程正文，也可從經典、八卦與六十四卦交叉查找。每一筆整理都保留來源與清楚的內容界線。</p>
        <div className="hero-actions"><Link href={`/lessons/${lessons[0].route.join("/")}/`}>開始研讀易經</Link><a href="/v1/index.html">瀏覽典藏課程頁</a></div>
      </section>
      <SearchPanel />
      <section className="platform-grid" aria-labelledby="model-title">
        <div><p className="kicker">研讀架構</p><h2 id="model-title">課程、八卦與六十四卦彼此相連</h2><p>可從 {lessons.length} 篇《易經》課程進入，也可查找 {trigrams.length} 個八卦與 {hexagrams.length} 個六十四卦條目。每一卦都標示上下卦、六爻結構、延伸研讀與內容來源。</p></div>
        <div className="metric"><strong>{lessons.length}</strong><span>研讀課程</span></div>
        <div className="metric"><strong>{entities.length}</strong><span>知識條目</span></div>
      </section>
    </>
  );
}
