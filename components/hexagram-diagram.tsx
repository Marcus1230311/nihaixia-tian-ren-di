export function HexagramDiagram({ name, lines }: { name: string; lines: string }) {
  const bits = [...lines];
  const lineNames = bits.map((bit) => bit === "1" ? "陽" : "陰").join("、");

  return (
    <figure className="line-figure hexagram-figure">
      <svg viewBox="0 0 180 250" role="img" aria-label={`${name}卦六爻圖：由下向上為${lineNames}`}>
        {bits.map((bit, index) => {
          const y = 202 - index * 34;
          return bit === "1" ? (
            <rect key={index} x="20" y={y} width="140" height="14" rx="2" />
          ) : (
            <g key={index}>
              <rect x="20" y={y} width="60" height="14" rx="2" />
              <rect x="100" y={y} width="60" height="14" rx="2" />
            </g>
          );
        })}
      </svg>
      <figcaption>{name}卦 · 六爻由下向上讀取</figcaption>
    </figure>
  );
}
