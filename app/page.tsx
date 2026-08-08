import Link from "next/link";
import { SearchPanel } from "@/components/search-panel";
import { entities, lessons } from "@/data/knowledge";

export default function HomePage() {
  const trigrams = entities.filter((entity) => entity.type === "trigram");
  const hexagrams = entities.filter((entity) => entity.type === "hexagram");
  const stems = entities.filter((entity) => entity.type === "heavenly_stem");
  const branches = entities.filter((entity) => entity.type === "earthly_branch");
  const meridians = entities.filter((entity) => entity.type === "meridian");
  const acupoints = entities.filter((entity) => entity.type === "acupoint");
  const shanghanChannels = entities.filter((entity) => entity.type === "shanghan_channel");
  const formulas = entities.filter((entity) => entity.type === "formula");
  return (
    <>
      <section className="hero-shell">
        <p className="kicker">天人地三紀 · 知識研讀</p>
        <h1>從經典與課程出發<br />找到知識之間的連結</h1>
        <p>沿著《易經》、八字、河洛、人紀針灸與《傷寒論》的引導路徑研讀，也可從卦象、干支、經脈、穴位、六經、病證、方劑與藥物交叉查找。每一筆整理都保留來源與清楚的內容界線。</p>
        <div className="hero-actions"><Link href={`/lessons/${lessons[0].route.join("/")}/`}>從易經開始</Link><Link href="/lessons/tianji/bazi/01-tiangan-dizhi/">進入八字基礎</Link><Link href="/lessons/tianji/heluo/01-hetu-luoshu/">認識河圖洛書</Link><Link href="/lessons/renji/acupuncture/01-meridians/">認識十二正經</Link><Link href="/lessons/renji/shanghan/01-overview/">進入傷寒六經</Link></div>
      </section>
      <SearchPanel />
      <section className="platform-grid" aria-labelledby="model-title">
        <div><p className="kicker">研讀架構</p><h2 id="model-title">從天紀走向人紀的共享知識</h2><p>目前有 {lessons.length} 篇引導課程、{trigrams.length} 個八卦、{hexagrams.length} 個六十四卦、{stems.length} 個天干、{branches.length} 個地支、{meridians.length} 條正經與 {acupoints.length} 個標準穴位，以及 {shanghanChannels.length} 個傷寒診斷六經與 {formulas.length} 張代表方。五行、陰陽與藥材身份可跨模組重用。</p></div>
        <div className="metric"><strong>{lessons.length}</strong><span>研讀課程</span></div>
        <div className="metric"><strong>{entities.length}</strong><span>知識條目</span></div>
      </section>
    </>
  );
}
