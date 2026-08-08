import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">倪海廈醫道傳習網 <small>V2 知識平台</small></Link>
      <nav aria-label="主要導覽">
        <Link href="/">首頁</Link>
        <Link href="/lessons/tianji/yijing/01-yinyang-bagua/">易經課程</Link>
        <Link href="/entities/trigram-qian/">知識實體</Link>
        <a href="/v1/index.html">V1 原站</a>
      </nav>
    </header>
  );
}
