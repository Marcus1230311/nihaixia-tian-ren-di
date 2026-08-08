import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">中醫 <small>TRADITIONAL CHINESE MEDICINE</small></Link>
      <nav aria-label="主要導覽">
        <Link href="/">首頁</Link>
        <Link href="/lessons/tianji/yijing/01-yinyang-bagua/">經典研讀</Link>
        <Link href="/lessons/renji/acupuncture/01-meridians/">經絡</Link>
        <Link href="/entities/trigram-qian/">知識條目</Link>
        <a href="/v1/index.html">典藏課程頁</a>
      </nav>
    </header>
  );
}
