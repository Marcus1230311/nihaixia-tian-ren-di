# 知識平台建置紀錄

## 架構決策

知識研讀介面採 Next.js App Router、TypeScript、Zod 與靜態導出。原有 54 個 HTML 保留在專案根目錄作為不可變內容基線；建置時由 `scripts/sync-v1-public.ts` 複製至 `/v1/`，供典藏閱讀與內容核對。

課程正文不重新生成。`lib/v1-content.ts` 在建置階段讀取既有 `<article class="classic">`，新的公開路由提供搜尋、麵包屑、前後篇、來源說明和知識條目入口。

## Schema Freeze 1.1.0

Entity、Relation、Source／Provenance 與 i18n 合約目前為 1.1.0。1.0.0 的易經資料與 ID 保持不變；小版本只增加八字／河洛所需 entity type 及兩個通用關係。詳細欄位、展示對照、圖譜／搜尋條件及版本規則見 [`KNOWLEDGE_MODEL.md`](KNOWLEDGE_MODEL.md)。後續匯入和引導研讀要求見 [`CONTENT_GUIDELINES.md`](CONTENT_GUIDELINES.md)。

《易經》結構化層目前包含：5 篇研讀課程、天紀課程主線、周易經典、8 個八卦、64 個六十四卦、206 條關係與 4 筆獨立來源。搜尋索引共有 79 筆（5 lessons + 74 non-lesson entities）。本次只擴充卦象結構，沒有開始八字、河洛、人紀、地紀或全域圖譜。

六十四卦使用 `hexagram:01` 至 `hexagram:64` 的語言無關 ID，每卦由一條上卦與一條下卦關係連至既有八卦。六爻圖由同一個資料驅動 SVG 元件依自下而上的 `linePattern` 繪製，沒有建立 64 份圖片檔。

## 品質門檻

- `node tools/validate-site.js`：典藏基線 54 頁、0 errors、0 warnings。
- `npm run validate:data`：schema、穩定 ID、來源引用、關係端點與課程引用通過。
- 易經資料檢查：8 個八卦、64 個六十四卦、卦序 1–64、三／六爻合法值、上下卦解析、爻形組合與關係唯一性全部通過。
- `npm run build`：搜尋索引及所有靜態公開路由建置成功。
- 公開頁關係、類型、屬性與來源分類均使用本地化展示名稱，不輸出 enum 或內部進度文字。
- `zh-Hant` 為預設，缺少可選 `zh-Hans` 時安全回退；加入簡體欄位不改變 ID 或路由。
- 桌面與 390×844 行動視口檢查單一 H1、無頁面橫向溢出、無壞連結及無控制台錯誤。

## V2.3 本地知識連結圖

條目頁新增一層直接關係 SVG，資料仍為 79 個節點、206 條關係與 4 筆來源，沒有 schema 或內容擴張。Server Component 建立已本地化、設有 18 個鄰居上限的局部圖；小型 Client Component 僅處理穩定雙環佈局、平移、縮放、節點聚焦與導航。沒有加入圖譜套件，文字關係清單也完整保留。設計、關係品質與全域圖延後理由見 [`GRAPH_DESIGN.md`](GRAPH_DESIGN.md)。

品質閘門新增 `npm run validate:graph`，並由靜態公開頁驗證確認所有 74 個 entity 路由都有深度 1 圖、文字關係區與有效連結。建置前後的實際 JavaScript 位元組比較及兩輪完整建置結果記錄於本次驗收日誌。

以泰卦靜態頁實際引用的 JavaScript 檔案計算，接受基線為 572,560 bytes，加入圖譜後為 577,649 bytes，增加 5,089 bytes（未壓縮）；全部靜態 chunk 由 595,329 增至 603,750 bytes。圖譜沒有新增 npm 依賴。

## 延後事項

全域知識圖譜、八字排盤與個人解讀、曆法換算、藏干／合沖刑害等進階關係、河洛流派延伸、人紀、地紀、資料庫、身份驗證、AI、CMS、完整簡體網站、PDF 批次匯入與經典全文重製均刻意延後。開始任何一項之前，必須按內容規範先完成來源盤點與小樣本驗證。

## V2.4 天紀八字與河洛結構化擴充

新增 3 篇最小導讀頁：天干地支、十神、河圖洛書。頁面不複製長篇典藏正文，而以學習順序、第一級條目、可重用圖解與典藏深讀入口組成。新增 65 個可搜尋節點（62 個非 lesson entity + 3 lessons）：10 天干、12 地支、5 共用五行、2 共用陰陽、10 十神、9 共用方位、10 個河洛語意數字、河圖、洛書及八字／河洛兩個系統節點。總計 144 個節點、386 條關係、8 筆來源，搜尋索引 144 筆。

新增 `FiveElementCycle` 與 `HeluoDiagrams` 兩個無客戶端 JavaScript 的程式化 SVG。前者只呈現五行相生／相剋，後者分開呈現河圖五方生成數與北方朝上的洛書九宮。來源採既有天紀頁的 editorial 邊界，再以 derived source 記錄表格到穩定 ID／關係的轉換；沒有把廣泛傳統對應標成倪海廈逐字講授。

Schema 由 1.0.0 升至向後相容的 1.1.0：新增 6 個 entity enum 與 `generates`、`controls` 兩個 generic relation enum，未新增欄位、source category 或 domain-specific relation。五行、陰陽、方位與八卦均重用單一身份；河洛 1–10 以 namespaced `concept` 區別於普通數值。
