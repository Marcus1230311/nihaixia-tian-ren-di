export function HerbPropertyModel() {
  const branches = [
    [130, 82, "藥性", "寒 · 涼 · 平 · 溫 · 熱"],
    [590, 82, "藥味", "酸 · 苦 · 甘 · 辛 · 鹹"],
    [130, 278, "歸經", "既有臟腑／系統"],
    [590, 278, "方劑", "傷寒 · 金匱"],
  ] as const;
  return <figure className="bencao-visual">
    <svg viewBox="0 0 720 360" role="img" aria-labelledby="herb-property-title herb-property-desc">
      <title id="herb-property-title">藥材性味歸經與方劑關係模型</title>
      <desc id="herb-property-desc">中央單一藥材身份分別連到藥性、藥味、歸經和方劑四類可追溯關係。</desc>
      {branches.map(([x, y]) => <line key={`${x}-${y}`} className="bencao-flow" x1="360" y1="180" x2={x} y2={y} />)}
      {branches.map(([x, y, title, note]) => <g key={title}>
        <rect className="bencao-property-node" x={x - 92} y={y - 42} width="184" height="84" rx="16" />
        <text className="bencao-node-title" x={x} y={y - 3} textAnchor="middle">{title}</text>
        <text className="bencao-node-note" x={x} y={y + 21} textAnchor="middle">{note}</text>
      </g>)}
      <circle className="bencao-herb-node" cx="360" cy="180" r="70" />
      <text className="bencao-herb-title" x="360" y="174" textAnchor="middle">單一藥材身份</text>
      <text className="bencao-node-note" x="360" y="199" textAnchor="middle">跨經典、跨方共用</text>
    </svg>
    <figcaption>性與味是不同分類軸；歸經有自己的關係語意。每條分類關係都能獨立保存來源。</figcaption>
  </figure>;
}

export function HerbCrossDomainPath() {
  const nodes = [[82, "穴位"], [225, "經脈"], [360, "臟腑"], [495, "藥材"], [638, "方劑"]] as const;
  return <figure className="bencao-visual cross-domain-visual">
    <svg viewBox="0 0 720 230" role="img" aria-labelledby="herb-path-title herb-path-desc">
      <title id="herb-path-title">穴位、經脈、臟腑、藥材與方劑的跨域路徑</title>
      <desc id="herb-path-desc">穴位隸屬經脈，經脈對應臟腑；藥材以歸經關係指向同一臟腑，方劑以組成關係指向藥材。</desc>
      <defs><marker id="bencao-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" /></marker></defs>
      <line className="bencao-path-line" x1="124" y1="106" x2="181" y2="106" markerEnd="url(#bencao-arrow)" />
      <line className="bencao-path-line" x1="267" y1="106" x2="316" y2="106" markerEnd="url(#bencao-arrow)" />
      <line className="bencao-path-line reverse" x1="451" y1="106" x2="404" y2="106" markerEnd="url(#bencao-arrow)" />
      <line className="bencao-path-line reverse" x1="594" y1="106" x2="539" y2="106" markerEnd="url(#bencao-arrow)" />
      {nodes.map(([x, label]) => <g key={label}><circle className={label === "藥材" ? "bencao-herb-node" : "bencao-path-node"} cx={x} cy="106" r="42" /><text className="bencao-path-label" x={x} y="112" textAnchor="middle">{label}</text></g>)}
      <text className="bencao-edge-label" x="153" y="82" textAnchor="middle">隸屬</text>
      <text className="bencao-edge-label" x="291" y="82" textAnchor="middle">對應</text>
      <text className="bencao-edge-label" x="428" y="82" textAnchor="middle">歸經</text>
      <text className="bencao-edge-label" x="566" y="82" textAnchor="middle">組成</text>
      <text className="bencao-note" x="360" y="196" textAnchor="middle">共享臟腑節點形成可查路徑，但四種關係不互相替代</text>
    </svg>
    <figcaption>藥材不直接連五行；需要時可沿既有「臟腑 → 五行」關係繼續探索。</figcaption>
  </figure>;
}
