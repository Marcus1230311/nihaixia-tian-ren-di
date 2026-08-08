"use client";

import { useEffect, useMemo, useState } from "react";
import type { SearchRecord } from "@/lib/knowledge-schema";

export function SearchPanel() {
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/search-index.json").then((response) => response.json()).then(setRecords).catch(() => setRecords([]));
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-Hant");
    if (!normalized) return records.slice(0, 8);
    return records.filter((record) => [
      record.labels["zh-Hant"], record.labels["zh-Hans"],
      record.descriptions["zh-Hant"], record.descriptions["zh-Hans"],
      ...record.keywords["zh-Hant"], ...(record.keywords["zh-Hans"] ?? []),
    ].filter(Boolean).join(" ").toLocaleLowerCase("zh-Hant").includes(normalized)).slice(0, 12);
  }, [query, records]);

  return (
    <section className="search-panel" aria-labelledby="search-title">
      <div><p className="kicker">站內索引</p><h2 id="search-title">搜尋課程與知識條目</h2></div>
      <label><span className="sr-only">搜尋</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="試試：乾、甲、十神、河圖、北方" /></label>
      <div className="search-results" aria-live="polite">
        {results.map((record) => <a key={record.id} href={record.href}><span>{record.typeLabels["zh-Hant"]}</span><strong>{record.labels["zh-Hant"]}</strong><small>{record.descriptions["zh-Hant"]}</small></a>)}
        {query && results.length === 0 && <p>索引中沒有相符結果，請換一個關鍵詞。</p>}
      </div>
    </section>
  );
}
