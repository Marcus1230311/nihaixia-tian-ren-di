# 知識平台建置紀錄

## 架構決策

知識研讀介面採 Next.js App Router、TypeScript、Zod 與靜態導出。原有 54 個 HTML 保留在專案根目錄作為不可變內容基線；建置時由 `scripts/sync-v1-public.ts` 複製至 `/v1/`，供典藏閱讀與內容核對。

課程正文不重新生成。`lib/v1-content.ts` 在建置階段讀取既有 `<article class="classic">`，新的公開路由提供搜尋、麵包屑、前後篇、來源說明和知識條目入口。

## Schema Freeze 1.5.0

Entity、Relation、Source／Provenance 與 i18n 合約目前為 1.5.0。既有 ID 與資料保持不變；本版增加本草藥性、藥味、品級三種通用 entity 及 `has_nature`、`has_flavor`、`has_tropism`，relation-level `sourceIds` 繼續保存每條主張證據。詳細決策見 [`KNOWLEDGE_MODEL.md`](KNOWLEDGE_MODEL.md) 與 [`BENCAO_MODEL.md`](BENCAO_MODEL.md)。

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

全域知識圖譜、八字排盤與個人解讀、曆法換算、藏干／合沖刑害等進階關係、河洛流派延伸、完整針灸擴量與其他人紀模組、地紀結構化、資料庫、身份驗證、AI、CMS、完整簡體網站、PDF 批次匯入與經典全文重製均刻意延後。開始任何一項之前，必須按內容規範先完成來源盤點與小樣本驗證。

## V2.7A 本草藥材知識模型

新增 5 篇引導研讀、1 個《神農本草經》經典身份、5 藥性、5 藥味與 3 品級，共使用 24 味既有 Herb，沒有新增 Herb。全圖為 641 節點、1,933 關係、23 來源，搜尋索引 641 筆。藥材頁彙整性味、歸經、古典、方劑、課程、局部圖與逐條證據；兩個程式化 SVG 說明藥材屬性模型與穴位—經脈—臟腑—藥材—方劑路徑。

完整本草文本、功效／主治 ontology、炮製、物種、藥用部位、毒性、交互作用、劑量與批次匯入管線仍延後。中間麵包屑可點擊、最終導覽與視覺一致性仍列為全站 UX 收尾，不在本輪處理。

## V2.4 天紀八字與河洛結構化擴充

新增 3 篇最小導讀頁：天干地支、十神、河圖洛書。頁面不複製長篇典藏正文，而以學習順序、第一級條目、可重用圖解與典藏深讀入口組成。新增 65 個可搜尋節點（62 個非 lesson entity + 3 lessons）：10 天干、12 地支、5 共用五行、2 共用陰陽、10 十神、9 共用方位、10 個河洛語意數字、河圖、洛書及八字／河洛兩個系統節點。總計 144 個節點、386 條關係、8 筆來源，搜尋索引 144 筆。

新增 `FiveElementCycle` 與 `HeluoDiagrams` 兩個無客戶端 JavaScript 的程式化 SVG。前者只呈現五行相生／相剋，後者分開呈現河圖五方生成數與北方朝上的洛書九宮。來源採既有天紀頁的 editorial 邊界，再以 derived source 記錄表格到穩定 ID／關係的轉換；沒有把廣泛傳統對應標成倪海廈逐字講授。

Schema 由 1.0.0 升至向後相容的 1.1.0：新增 6 個 entity enum 與 `generates`、`controls` 兩個 generic relation enum，未新增欄位、source category 或 domain-specific relation。五行、陰陽、方位與八卦均重用單一身份；河洛 1–10 以 namespaced `concept` 區別於普通數值。

## V2.5A 人紀針灸知識模型試點

來源盤點先覆核 V1 針灸 01–03 課的十二經流注、手足經穴位表及原／絡／郄／募／背俞／五輸分類；它們維持 editorial 身份，不宣稱為倪海廈逐字稿。WHO 標準只核對穴名／代碼，北京中醫藥大學參考頁只核對五輸次序與陰陽經五行配屬，另以 derived source 記錄結構化轉換。沒有新增 `nihaixia` 或 `classical` 來源。

新增 2 篇最小導讀與 74 個非 lesson entity：12 正經、12 臟腑／系統、29 代表穴位、12 穴位分類、6 經脈層級、人紀課程、針灸系統與五輸穴概念。全圖目前為 220 節點、604 關係、12 來源，搜尋索引 220 筆。兩個無額外 client JavaScript 的 SVG 分別呈現十二正經高層組織及陰／陽經五輸五行次序；既有五行生剋圖在臟腑段落直接重用。

29 穴位為：中府、尺澤、孔最、列缺、太淵、少商、商陽、合谷、曲池、足三里、豐隆、公孫、三陰交、陰陵泉、神門、後溪、肺俞、委中、崑崙、湧泉、太谿、內關、外關、陽陵泉、大敦、行間、太衝、中封、曲泉。此組覆蓋十二正經，並完整保留肝經五輸作為結構驗證樣本，不代表完整穴位庫。

穴位分類採 entity + `classified_as`，Schema 升至 1.2.0；沒有新增欄位或 source category。六個經脈層級建為共享 entity 並連到既有陰陽，但不等同或推導《傷寒論》六經辨證。解剖座標、經脈 SVG path 與人體 marker 需求已記錄，待未來視覺子模型成熟後再提案。

課程尾端導覽已改為模組內前後篇及模組名稱，不再把非易經課程送回「易經導覽」。中間麵包屑可點擊性仍列為最後的全站 UX／navigation 清理項，本里程碑不重設整套 breadcrumb。

## V2.5B-1 針灸結構化資料匯入

新增 JSON／CSV／TSV canonical import boundary、明列繁簡／經脈／分類／五行 alias maps、Zod 格式驗證、引用解析、標準代碼／經脈／五輸五行規則、重複與衝突檢查、Entity／Relation 轉換、production compare 及 JSON／Markdown exception reports。

現有 29 點作為完整 regression fixture；候選輸出全等才可生成，且不會自動替換 production。Schema 維持 1.2.0；公開內容仍是 220 nodes、604 relations、12 sources、29 acupoints。

CI 新增 `acupuncture:validate`，而 `dry-run` 是未來 bulk import 預設模式。PDF/OCR、完整主經穴擴量及 anatomy coordinate population 均未在本里程碑啟動。

## V2.5B-2 十二正經穴位擴量

依 WHO 標準代碼與十二正經範圍、GB/T 12346-2021 狀態頁、本站既有手足經穴位表及繁簡交叉快照，六批納入 LU 11、LI 20、ST 45、SP 21、HT 9、SI 19、BL 67、KI 27、PC 9、TE 23、GB 44、LR 14，共 309 穴。每批均有零錯誤／零警告報告及 SHA-256 checkpoint；全量涵蓋 60 個五輸身份，以及有來源支持的 12 原穴、12 絡穴、12 郄穴、6 募穴、12 背俞穴、8 八脈交會穴與 1 個既有交會分類。

Production 改為讀取確定性 generated aggregate，29 個既有條目的編輯描述保留為 overlay。十二條經脈頁按標準代碼列出完整穴位，搜尋可由穴名、代碼或所屬經脈命中。全圖現為 500 節點、1,292 關係、12 來源；奇經、解剖座標與臨床功能仍不在本輪範圍。

## V2.6A 人紀傷寒知識模型試點

來源先覆核 V1 傷寒 01–07 與本草 05：六經、十二個代表病證、十一方及二十九味組成均能回到本站 editorial 內容、《傷寒論》classical 身份或廣西中醫藥大學 reference 校正頁。沒有新增 `nihaixia` 歸屬，也未重製全文、劑量、煎服法或診療建議。

Schema 升至 1.3.0：新增 `shanghan_channel`、`syndrome` 與 `classically_associated_with` enum，未新增欄位或 source category。傷寒六經使用獨立 `shanghan-channel:*`，不與同名 `meridian-level:*` 合併；方劑以既有 `contains_herb` 指向共享藥材，以新關係指向病證。全圖為 564 節點、1,431 關係、16 來源，搜尋 564 筆。

新增五篇導讀、六經三陽／三陰分組 SVG 與桂枝湯五味組成 SVG。完整傷寒方庫、條文全文、劑量資料、推薦系統、金匱／內經／本草擴量、方劑匯入管線與全域圖均延後；中間麵包屑可點擊性仍保留為最後的全站 UX 清理項。

## V2.6B 人紀金匱跨經典知識模型試點

來源盤點覆核 V1 金匱 01–06 與《金匱要略》古典原文。新增 7 個 `condition`、15 個 `syndrome`、12 個新方劑、18 味新藥材與 5 篇導讀；桂枝湯、大承氣湯、小柴胡湯及 16 味既有藥材直接重用，沒有經典專用副本。全圖為 622 節點、1,649 關係、19 來源，搜尋 622 筆。

Schema 升至 1.4.0，只新增通用 `condition` entity type。`belongs_to`、`appears_in`、`contains_herb`、`classically_associated_with` 及 relation `sourceIds` 已能表達病類分層、跨經典出處、唯一組成及逐條主張證據，所以沒有新增關係、欄位或來源分類。新增病類→病證→方劑與跨經典方劑身份兩個 SVG；完整金匱語料、全文、劑量、推薦、方藥 bulk ingestion 與麵包屑全站清理仍延後。
