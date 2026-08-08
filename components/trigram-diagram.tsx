export function TrigramDiagram({ name, lines }: { name: string; lines: string }) {
  const bits = [...lines].reverse();
  return (
    <figure className="trigram-figure">
      <svg viewBox="0 0 180 130" role="img" aria-label={`${name}卦三爻圖：由下向上為 ${lines}`}>
        {bits.map((bit, index) => {
          const y = 92 - index * 34;
          return bit === "1" ? (
            <rect key={index} x="20" y={y} width="140" height="14" rx="2" />
          ) : (
            <g key={index}><rect x="20" y={y} width="60" height="14" rx="2" /><rect x="100" y={y} width="60" height="14" rx="2" /></g>
          );
        })}
      </svg>
      <figcaption>{name}卦 · 三爻由下向上讀取</figcaption>
    </figure>
  );
}
