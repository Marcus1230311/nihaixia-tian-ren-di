import Link from "next/link";
import { SearchPanel } from "@/components/search-panel";
import { entities, lessons } from "@/data/knowledge";

export default function HomePage() {
  const trigrams = entities.filter((entity) => entity.type === "trigram");
  const hexagrams = entities.filter((entity) => entity.type === "hexagram");
  const stems = entities.filter((entity) => entity.type === "heavenly_stem");
  const branches = entities.filter((entity) => entity.type === "earthly_branch");
  return (
    <>
      <section className="hero-shell">
        <p className="kicker">天人地三紀 · 知識研讀</p>
        <h1>從經典與課程出發<br />找到知識之間的連結</h1>
        <p>沿著《易經》、八字與河洛的引導路徑研讀，也可從卦象、干支、五行、十神、數字與方位交叉查找。每一筆整理都保留來源與清楚的內容界線。</p>
        <div className="hero-actions"><Link href={`/lessons/${lessons[0].route.join("/")}/`}>從易經開始</Link><Link href="/lessons/tianji/bazi/01-tiangan-dizhi/">進入八字基礎</Link><Link href="/lessons/tianji/heluo/01-hetu-luoshu/">認識河圖洛書</Link></div>
      </section>
      <SearchPanel />
      <section className="platform-grid" aria-labelledby="model-title">
        <div><p className="kicker">研讀架構</p><h2 id="model-title">從卦象走向干支與河洛</h2><p>目前有 {lessons.length} 篇引導課程、{trigrams.length} 個八卦、{hexagrams.length} 個六十四卦、{stems.length} 個天干與 {branches.length} 個地支。五行、陰陽和方位採共用條目，避免各模組各自複製一套。</p></div>
        <div className="metric"><strong>{lessons.length}</strong><span>研讀課程</span></div>
        <div className="metric"><strong>{entities.length}</strong><span>知識條目</span></div>
      </section>
    </>
  );
}
