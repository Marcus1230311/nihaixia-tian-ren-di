export function JinguiConditionStructureMap() {
  return <figure className="jingui-visual">
    <svg viewBox="0 0 720 330" role="img" aria-labelledby="jingui-structure-title jingui-structure-desc">
      <title id="jingui-structure-title">金匱病類、病證與方劑分層圖</title>
      <desc id="jingui-structure-desc">婦人病是組織入口，向下分為不同病證，每個病證再連到有來源支持的代表方劑。</desc>
      <defs><marker id="jingui-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" /></marker></defs>
      <rect className="jingui-condition" x="270" y="22" width="180" height="58" rx="14" />
      <text className="jingui-primary-label" x="360" y="58" textAnchor="middle">婦人病（病類）</text>
      {[150, 360, 570].map((x) => <line key={x} className="jingui-flow" x1="360" y1="80" x2={x} y2="134" markerEnd="url(#jingui-arrow)" />)}
      {[[150, "癥病漏下證", "桂枝茯苓丸"], [360, "婦人臟躁證", "甘麥大棗湯"], [570, "肝脾失調腹痛證", "當歸芍藥散"]].map(([x, syndrome, formula]) => <g key={syndrome}>
        <rect className="jingui-syndrome" x={Number(x) - 88} y="140" width="176" height="52" rx="12" />
        <text className="jingui-secondary-label" x={x} y="172" textAnchor="middle">{syndrome}</text>
        <line className="jingui-flow" x1={x} y1="192" x2={x} y2="238" markerEnd="url(#jingui-arrow)" />
        <rect className="jingui-formula" x={Number(x) - 82} y="244" width="164" height="52" rx="26" />
        <text className="jingui-formula-label" x={x} y="276" textAnchor="middle">{formula}</text>
      </g>)}
    </svg>
    <figcaption>病類用來整理章篇與疾病範圍；病證才承接具體方證關係。兩層不能只因名稱相近而合併。</figcaption>
  </figure>;
}

export function CrossClassicFormulaMap() {
  const formulas = [[270, "桂枝湯"], [420, "大承氣湯"], [570, "小柴胡湯"]] as const;
  return <figure className="jingui-visual cross-classic-visual">
    <svg viewBox="0 0 720 350" role="img" aria-labelledby="cross-classic-title cross-classic-desc">
      <title id="cross-classic-title">跨經典方劑單一身份圖</title>
      <desc id="cross-classic-desc">傷寒論和金匱要略各自透過有來源的關係連到同一個桂枝湯、大承氣湯與小柴胡湯方劑節點。</desc>
      <rect className="classic-source-node" x="26" y="62" width="150" height="64" rx="14" />
      <text className="jingui-primary-label" x="101" y="100" textAnchor="middle">傷寒論</text>
      <rect className="classic-source-node" x="26" y="224" width="150" height="64" rx="14" />
      <text className="jingui-primary-label" x="101" y="262" textAnchor="middle">金匱要略</text>
      {formulas.map(([x, label]) => <g key={label}>
        <line className="cross-source-line shanghan" x1="176" y1="94" x2={x - 58} y2="164" />
        <line className="cross-source-line jingui" x1="176" y1="256" x2={x - 58} y2="196" />
        <circle className="shared-formula-node" cx={x} cy="180" r="62" />
        <text className="jingui-formula-label" x={x} y="176" textAnchor="middle">{label}</text>
        <text className="shared-id-label" x={x} y="197" textAnchor="middle">單一 canonical ID</text>
      </g>)}
      <text className="evidence-label" x="205" y="56">每條關係保留自己的來源證據</text>
      <text className="evidence-label" x="360" y="324" textAnchor="middle">方劑身份共享；經典、病證與主張不互相污染</text>
    </svg>
    <figcaption>同一方劑只保留一個頁面與圖譜節點；不同經典的出處和方證關係由 relation sourceIds 分別回答。</figcaption>
  </figure>;
}
