"use client";

import { useEffect, useMemo, useState } from "react";

type SearchRecord = { id: string; type: string; title: string; summary: string; href: string; keywords: string[] };

export function SearchPanel() {
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/search-index.json").then((response) => response.json()).then(setRecords).catch(() => setRecords([]));
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-Hant");
    if (!normalized) return records.slice(0, 8);
    return records.filter((record) => [record.title, record.summary, ...record.keywords].join(" ").toLocaleLowerCase("zh-Hant").includes(normalized)).slice(0, 12);
  }, [query, records]);

  return (
    <section className="search-panel" aria-labelledby="search-title">
      <div><p className="kicker">首批功能</p><h2 id="search-title">搜尋課程與知識實體</h2></div>
      <label><span className="sr-only">搜尋</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="試試：乾、八卦、筮法、中醫" /></label>
      <div className="search-results" aria-live="polite">
        {results.map((record) => <a key={record.id} href={record.href}><span>{record.type}</span><strong>{record.title}</strong><small>{record.summary}</small></a>)}
        {query && results.length === 0 && <p>目前首批索引中沒有相符結果。</p>}
      </div>
    </section>
  );
}
