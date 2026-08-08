import type { KnowledgeEntity } from "@/lib/knowledge-schema";
import { localize } from "@/lib/presentation";

export function SixChannelDiagnosticMap() {
  const groups = [
    { label: "三陽", x: 40, channels: [["太陽", "表"], ["陽明", "裡熱實"], ["少陽", "半表半裡"]] },
    { label: "三陰", x: 330, channels: [["太陰", "裡虛寒"], ["少陰", "寒／熱分化"], ["厥陰", "寒熱錯雜"]] },
  ] as const;
  return <figure className="shanghan-visual">
    <svg viewBox="0 0 620 310" role="img" aria-labelledby="six-channel-title six-channel-desc">
      <title id="six-channel-title">傷寒六經分組診斷圖</title>
      <desc id="six-channel-desc">太陽、陽明、少陽歸於三陽；太陰、少陰、厥陰歸於三陰。圖中不使用傳變箭頭。</desc>
      {groups.map((group) => <g key={group.label}>
        <rect className="channel-group" x={group.x} y="20" width="250" height="265" rx="18" />
        <text className="channel-group-title" x={group.x + 125} y="55" textAnchor="middle">{group.label}</text>
        {group.channels.map(([name, note], index) => <g key={name}>
          <rect className="channel-card" x={group.x + 24} y={76 + index * 62} width="202" height="46" rx="10" />
          <text className="channel-name" x={group.x + 44} y={104 + index * 62}>{name}</text>
          <text className="channel-note" x={group.x + 106} y={104 + index * 62}>{note}</text>
        </g>)}
      </g>)}
    </svg>
    <figcaption>這是診斷分類分組，不表示六經必然依單一路線傳變，也不等同於針灸經脈層級。</figcaption>
  </figure>;
}

export function FormulaCompositionDiagram({ formula, herbs }: { formula: KnowledgeEntity; herbs: KnowledgeEntity[] }) {
  const center = { x: 310, y: 170 };
  return <figure className="shanghan-visual">
    <svg viewBox="0 0 620 340" role="img" aria-labelledby="formula-map-title formula-map-desc">
      <title id="formula-map-title">{localize(formula.labels)}藥味組成圖</title>
      <desc id="formula-map-desc">{localize(formula.labels)}透過組成關係連到{herbs.map((herb) => localize(herb.labels)).join("、")}。</desc>
      {herbs.map((herb, index) => {
        const angle = -Math.PI / 2 + index * (2 * Math.PI / herbs.length);
        const x = center.x + Math.cos(angle) * 215;
        const y = center.y + Math.sin(angle) * 115;
        return <g key={herb.id}>
          <line className="formula-link" x1={center.x} y1={center.y} x2={x} y2={y} />
          <circle className="herb-node" cx={x} cy={y} r="38" />
          <text className="herb-label" x={x} y={y + 5} textAnchor="middle">{localize(herb.labels)}</text>
        </g>;
      })}
      <circle className="formula-node" cx={center.x} cy={center.y} r="62" />
      <text className="formula-label" x={center.x} y={center.y + 6} textAnchor="middle">{localize(formula.labels)}</text>
    </svg>
    <figcaption>圖只表達方劑包含哪些藥材身份；不包含劑量、煎服法或個人用藥建議。</figcaption>
  </figure>;
}
