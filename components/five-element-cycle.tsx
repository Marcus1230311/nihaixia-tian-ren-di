const positions = [
  { id: "wood", label: "木", x: 250, y: 58 },
  { id: "fire", label: "火", x: 414, y: 177 },
  { id: "earth", label: "土", x: 351, y: 370 },
  { id: "metal", label: "金", x: 149, y: 370 },
  { id: "water", label: "水", x: 86, y: 177 },
] as const;

const generating = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] as const;
const controlling = [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]] as const;

function endpoints(fromIndex: number, toIndex: number, radius = 37) {
  const from = positions[fromIndex];
  const to = positions[toIndex];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  return { x1: from.x + dx / length * radius, y1: from.y + dy / length * radius, x2: to.x - dx / length * (radius + 5), y2: to.y - dy / length * (radius + 5) };
}

export function FiveElementCycle() {
  return (
    <figure className="knowledge-visual five-element-visual">
      <svg viewBox="0 0 500 440" role="img" aria-labelledby="five-elements-title five-elements-desc">
        <title id="five-elements-title">五行相生與相剋關係</title>
        <desc id="five-elements-desc">實線外環依木火土金水表示相生；虛線內部依木剋土、土剋水、水剋火、火剋金、金剋木表示相剋。</desc>
        <defs>
          <marker id="element-generate-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" /></marker>
          <marker id="element-control-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" /></marker>
        </defs>
        <g className="element-generating" aria-label="相生關係">
          {generating.map(([from, to]) => <line key={`${from}-${to}`} {...endpoints(from, to)} markerEnd="url(#element-generate-arrow)" aria-label={`${positions[from].label}生${positions[to].label}`} />)}
        </g>
        <g className="element-controlling" aria-label="相剋關係">
          {controlling.map(([from, to]) => <line key={`${from}-${to}`} {...endpoints(from, to)} markerEnd="url(#element-control-arrow)" aria-label={`${positions[from].label}剋${positions[to].label}`} />)}
        </g>
        {positions.map((item) => <g key={item.id} className={`element-node element-${item.id}`} transform={`translate(${item.x} ${item.y})`}><circle r="37" /><text textAnchor="middle" dy="9">{item.label}</text></g>)}
        <g className="element-legend" transform="translate(152 425)"><line x1="0" x2="38" /><text x="47" y="5">實線：相生</text><line className="control" x1="130" x2="168" /><text x="177" y="5">虛線：相剋</text></g>
      </svg>
      <figcaption>先辨認木、火、土、金、水的相生外環，再比較相剋的內部路徑。</figcaption>
    </figure>
  );
}
