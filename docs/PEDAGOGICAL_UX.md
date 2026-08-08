# Pedagogical UX：三條 Golden Journey 原型

本輪在 Knowledge Model 1.5.0 上增加可獨立移除的靜態 Teaching Layer。它只為三條 Golden Journey 的相關頁面提供導讀；不改 graph、不增加內容節點，也不把研讀順序偽裝成知識關係。

## Journey A：木 → 肝 → 足厥陰肝經 → 太衝 LR3

- **Learner state**：認得五行或穴位名稱，但容易把分類、臟腑、經脈與穴位壓成同一層。
- **Objective**：辨認四個概念層次，並理解 `element_of`、`corresponds_to`、`belongs_to` 各自回答的問題。
- **Prerequisites**：五行是分類框架；名稱相連不等於身份相同。
- **Progression**：抽象分類 → 人體臟腑 → 經脈系統 → 具體標準穴位。
- **Relationship explanation**：只解釋肝與木、肝經與肝、太衝與肝經三條既有關係。
- **Confusion risk**：把「木＝肝＝肝經＝太衝」理解成同義詞鏈。
- **Takeaway**：同一路徑連接四種身份；太衝還能有多重穴位分類。
- **Next / reason**：抵達 LR3 後轉入五輸穴導讀，用相同分類方法比較其他經脈。

## Journey B：傷寒六經 → 太陽 → 太陽中風 → 桂枝湯 → 桂枝

- **Learner state**：看過六經、方名或藥名，但不清楚框架、病證、方劑與組成的層級。
- **Objective**：沿有來源的經典語境閱讀一條代表性路徑，同時保持醫療安全邊界。
- **Prerequisites**：這是經典知識導讀，不是自我診斷或處方流程。
- **Progression**：辨證框架 → 六經分類 → 病證 → 經典方劑 → 組成藥材。
- **Relationship explanation**：只說明太陽所屬經典、太陽中風的分類、桂枝湯的方證關聯與桂枝組成。
- **Confusion resolver**：同頁比較針灸命名層級的「太陽」與傷寒六經的「太陽」；顯示系統與知識角色，不暴露 enum。
- **Takeaway**：每一層有獨立身份；方證關聯不等於對讀者的治療建議。
- **Next / reason**：從桂枝湯進入桂枝，以單一 Herb identity 觀察跨語境重用。

## Journey C：桂枝跨本草、方劑、傷寒、金匱與來源

- **Learner state**：可能從藥材、方劑或經典任一入口到達桂枝，容易以為不同頁面各有一味桂枝。
- **Objective**：用 identity hub 理解本草屬性、方劑組成與多經典語境如何匯聚到同一 Herb。
- **Prerequisites**：藥材與方劑是不同身份；來源類別不等於作者歸屬。
- **Progression**：本草性味 → 桂枝 → 桂枝湯 →《傷寒論》／《金匱要略》語境。
- **Relationship explanation**：性味歸經資料與方劑組成分開解釋；經典語境透過既有方劑及來源呈現。
- **Confusion risk**：從不同經典進入便建立桂枝副本，或把所有 editorial 資料說成倪海廈專屬主張。
- **Takeaway**：同一桂枝身份可被多種有來源關係引用；沒有直接依據時不建立跨時代藥物身份主張。
- **Next / reason**：回看桂枝湯，帶著單一藥材身份比較兩部經典的分開 provenance。

## UI 結構與漸進揭露

每個受控頁面只放一個低密度導讀區：學習目標、Knowledge Context、必要先備、2–4 個重點與下一步保持可見（CORE）；關係推理與容易誤讀的細節按內容需要出現；延伸說明與來源清單使用原生 `details` 收納為 DEEPER／SOURCE。完整條目資料、local graph、關係清單與內容來源仍保留在原位置。

「建議下一個研讀概念」明示理由，與課程頁既有「下一講」內容順序分開；它只代表教學方向，不代表 graph edge，更不代表治療建議。

## 七項教學品質與效率評估

| 維度 | 原型回應 |
| --- | --- |
| ORIENTATION | 每頁先回答目前位於哪條 Journey、這一頁為何值得看。 |
| DIRECTION | 顯示下一個研讀概念及理由，不只提供相鄰連結。 |
| STRUCTURE | Knowledge Context 標示完整路徑與目前節點。 |
| RELATIONSHIP | 僅為選定 Golden Journey 的真實關係提供人類可讀解釋。 |
| PRIORITY | CORE 只保留 2–4 個 takeaways；深入與依據延後展開。 |
| TRANSFER | LR3 導向五輸穴比較；桂枝導回跨經典方劑語境。 |
| EVIDENCE | 古典、編輯、外部參考、衍生整理與可追溯的倪海廈資料分級顯示。 |
| EFFICIENCY | 一個可重用 server component 加靜態 typed map；只掛載九個相關頁面，沒有全站 rollout。 |

## 明確邊界

本原型不加入帳號、進度、測驗、AI、資料庫、CMS、全域圖譜或大量新內容；不調整 Knowledge Model schema、enum 或資料基線。任何診斷、劑量、替換、自行購藥或治療建議均不在此 Teaching Layer 範圍。
