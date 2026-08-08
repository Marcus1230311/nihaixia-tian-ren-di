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
    const ranked = records.map((record, index) => {
      const labels = [record.labels["zh-Hant"], record.labels["zh-Hans"]].filter(Boolean).map((value) => value!.toLocaleLowerCase("zh-Hant"));
      const aliases = [...record.keywords["zh-Hant"], ...(record.keywords["zh-Hans"] ?? [])].map((value) => value.toLocaleLowerCase("zh-Hant"));
      const descriptions = [record.descriptions["zh-Hant"], record.descriptions["zh-Hans"]].filter(Boolean).map((value) => value!.toLocaleLowerCase("zh-Hant"));
      const score = labels.includes(normalized) ? 0
        : aliases.includes(normalized) ? 1
          : labels.some((value) => value.startsWith(normalized)) ? 2
            : labels.some((value) => value.includes(normalized)) ? 3
              : aliases.some((value) => value.includes(normalized)) ? 4
                : descriptions.some((value) => value.includes(normalized)) ? 5
                  : null;
      return { record, index, score };
    }).filter((item): item is { record: SearchRecord; index: number; score: number } => item.score !== null);
    return ranked.sort((left, right) => left.score - right.score || left.index - right.index).slice(0, 12).map((item) => item.record);
  }, [query, records]);

  return (
    <section className="search-panel" aria-labelledby="search-title">
      <div><p className="kicker">站內索引</p><h2 id="search-title">搜尋課程與知識條目</h2></div>
      <label><span className="sr-only">搜尋</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="試試：乾、甲、肝經、太衝、少陰、桂枝湯" /></label>
      <div className="search-results" aria-live="polite">
        {results.map((record) => <a key={record.id} href={record.href}><span>{record.typeLabels["zh-Hant"]}</span><strong>{record.labels["zh-Hant"]}</strong><small>{record.descriptions["zh-Hant"]}</small></a>)}
        {query && results.length === 0 && <p>索引中沒有相符結果，請換一個關鍵詞。</p>}
      </div>
    </section>
  );
}
