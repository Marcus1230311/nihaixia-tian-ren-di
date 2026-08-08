const meridianGroups = [
  ["手太陰肺經", "手陽明大腸經", "金"], ["足陽明胃經", "足太陰脾經", "土"],
  ["手少陰心經", "手太陽小腸經", "火"], ["足太陽膀胱經", "足少陰腎經", "水"],
  ["手厥陰心包經", "手少陽三焦經", "火"], ["足少陽膽經", "足厥陰肝經", "木"],
] as const;

export function MeridianOverview() {
  return <figure className="knowledge-visual acupuncture-visual">
    <svg viewBox="0 0 900 520" role="img" aria-labelledby="meridian-title meridian-desc">
      <title id="meridian-title">十二正經高層組織圖</title>
      <desc id="meridian-desc">十二正經依流注次序排成六組，顯示陰陽配對、對應臟腑與共享五行。</desc>
      <defs><marker id="meridian-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#8b6d3b" /></marker></defs>
      {meridianGroups.map(([left, right, element], index) => {
        const row = Math.floor(index / 2); const column = index % 2; const x = 35 + column * 445; const y = 35 + row * 158;
        return <g key={left}>
          <rect x={x} y={y} width="390" height="122" rx="12" fill="#fffaf0" stroke="#c9b98f" />
          <text x={x + 195} y={y + 24} textAnchor="middle" fontSize="14" fill="#8b6d3b">流注配對 · 五行 {element}</text>
          <rect x={x + 18} y={y + 42} width="160" height="54" rx="9" fill="#e8f1e8" stroke="#51755b" />
          <rect x={x + 212} y={y + 42} width="160" height="54" rx="9" fill="#f4e9df" stroke="#9b654d" />
          <text x={x + 98} y={y + 74} textAnchor="middle" fontSize="16" fill="#203528">{left}</text>
          <text x={x + 292} y={y + 74} textAnchor="middle" fontSize="16" fill="#4a2d22">{right}</text>
          <path d={`M${x + 180} ${y + 69}H${x + 207}`} stroke="#8b6d3b" strokeWidth="2" markerEnd="url(#meridian-arrow)" />
        </g>;
      })}
    </svg>
    <figcaption>由肺經起，依既有課程的十二經流注次序閱讀；卡片只呈現結構，不代表解剖路徑。</figcaption>
  </figure>;
}

export function FiveShuDiagram() {
  const stages = ["井", "滎", "輸", "經", "合"];
  const yin = ["木", "火", "土", "金", "水"];
  const yang = ["金", "水", "木", "火", "土"];
  return <figure className="knowledge-visual acupuncture-visual">
    <svg viewBox="0 0 900 330" role="img" aria-labelledby="five-shu-title five-shu-desc">
      <title id="five-shu-title">陰陽經五輸穴與五行配屬</title>
      <desc id="five-shu-desc">五輸穴依井、滎、輸、經、合排列，陰經與陽經使用不同的五行起點。</desc>
      {stages.map((stage, index) => {
        const x = 155 + index * 142;
        return <g key={stage}>
          <circle cx={x} cy="80" r="32" fill="#f2ead7" stroke="#8b6d3b" />
          <text x={x} y="87" textAnchor="middle" fontSize="22" fill="#33291d">{stage}</text>
          {index < 4 && <path d={`M${x + 36} 80H${x + 102}`} stroke="#8b6d3b" strokeWidth="2" />}
          <rect x={x - 48} y="130" width="96" height="52" rx="8" fill="#e8f1e8" stroke="#51755b" />
          <text x={x} y="151" textAnchor="middle" fontSize="13" fill="#51755b">陰經</text><text x={x} y="173" textAnchor="middle" fontSize="20">{yin[index]}</text>
          <rect x={x - 48} y="210" width="96" height="52" rx="8" fill="#f4e9df" stroke="#9b654d" />
          <text x={x} y="231" textAnchor="middle" fontSize="13" fill="#9b654d">陽經</text><text x={x} y="253" textAnchor="middle" fontSize="20">{yang[index]}</text>
        </g>;
      })}
      <text x="52" y="160" fontSize="18" fill="#51755b">陰經</text><text x="52" y="240" fontSize="18" fill="#9b654d">陽經</text>
      <text x="450" y="305" textAnchor="middle" fontSize="14" fill="#6d6255">分類、穴位身份、經脈隸屬與五行關係分開保存</text>
    </svg>
    <figcaption>同一個穴位可同時具備五輸與原穴等多重分類；圖中配屬用於知識結構研讀。</figcaption>
  </figure>;
}
