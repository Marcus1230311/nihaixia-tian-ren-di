import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">倪海廈醫道傳習網 <small>知識研讀</small></Link>
      <nav aria-label="主要導覽">
        <Link href="/">首頁</Link>
        <Link href="/lessons/tianji/yijing/01-yinyang-bagua/">天紀課程</Link>
        <Link href="/entities/trigram-qian/">知識條目</Link>
        <a href="/v1/index.html">典藏課程頁</a>
      </nav>
    </header>
  );
}
