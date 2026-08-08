const hetu = [
  { direction: "北", numbers: "1 · 6", element: "水", x: 250, y: 56 },
  { direction: "南", numbers: "2 · 7", element: "火", x: 250, y: 344 },
  { direction: "東", numbers: "3 · 8", element: "木", x: 418, y: 200 },
  { direction: "西", numbers: "4 · 9", element: "金", x: 82, y: 200 },
  { direction: "中央", numbers: "5 · 10", element: "土", x: 250, y: 200 },
] as const;

const luoshu = [
  { direction: "西北", number: 6, trigram: "乾", col: 0, row: 0 }, { direction: "北", number: 1, trigram: "坎", col: 1, row: 0 }, { direction: "東北", number: 8, trigram: "艮", col: 2, row: 0 },
  { direction: "西", number: 7, trigram: "兌", col: 0, row: 1 }, { direction: "中央", number: 5, trigram: "居中", col: 1, row: 1 }, { direction: "東", number: 3, trigram: "震", col: 2, row: 1 },
  { direction: "西南", number: 2, trigram: "坤", col: 0, row: 2 }, { direction: "南", number: 9, trigram: "離", col: 1, row: 2 }, { direction: "東南", number: 4, trigram: "巽", col: 2, row: 2 },
] as const;

export function HeluoDiagrams() {
  return (
    <div className="heluo-visuals">
      <figure className="knowledge-visual">
        <svg viewBox="0 0 500 400" role="img" aria-labelledby="hetu-title hetu-desc">
          <title id="hetu-title">河圖五方生成數</title><desc id="hetu-desc">北方一六水、南方二七火、東方三八木、西方四九金、中央五十土。</desc>
          <path className="heluo-axis" d="M250 56V344M82 200H418" />
          {hetu.map((item) => <g key={item.direction} className="heluo-node" transform={`translate(${item.x} ${item.y})`}><circle r="46" /><text className="heluo-number" textAnchor="middle" y="-4">{item.numbers}</text><text textAnchor="middle" y="19">{item.direction} · {item.element}</text></g>)}
        </svg>
        <figcaption>河圖：五方各有一組生數／成數，並對應五行。</figcaption>
      </figure>
      <figure className="knowledge-visual">
        <svg viewBox="0 0 500 400" role="img" aria-labelledby="luoshu-title luoshu-desc">
          <title id="luoshu-title">洛書九宮與後天八卦</title><desc id="luoshu-desc">以北方朝上的九宮排列，顯示一至九、八個方位與後天八卦。</desc>
          {luoshu.map((item) => { const x = 74 + item.col * 119; const y = 22 + item.row * 119; return <g key={item.number} className="luoshu-cell" transform={`translate(${x} ${y})`}><rect width="112" height="112" rx="6" /><text className="heluo-number" x="56" y="45" textAnchor="middle">{item.number}</text><text x="56" y="70" textAnchor="middle">{item.direction}</text><text x="56" y="92" textAnchor="middle">{item.trigram}</text></g>; })}
        </svg>
        <figcaption>洛書：九宮橫、直、斜三數相加皆為十五；中央五不配卦。</figcaption>
      </figure>
    </div>
  );
}
