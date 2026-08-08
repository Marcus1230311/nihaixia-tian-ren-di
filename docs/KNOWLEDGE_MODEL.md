# 知識模型 V1.2（已凍結）

本文件記錄 1.2.0 知識資料合約。凍結表示既有欄位語意、ID 與關係名稱不得在一般內容匯入中改動；新增或破壞性變更必須另開 schema 版本並提供遷移說明。1.2.0 在 1.1.0 上加入人紀針灸試點所需 enum 與一個通用分類關係，沒有移除欄位或改變既有 ID。現有資料涵蓋天紀結構化內容及小規模針灸模型試點，不代表完整人紀已建模。

## Entity Schema V1

所有可進入知識圖譜的項目都是 entity，包含課程 lesson。共同欄位如下：

- `id`：語言無關、具命名空間的穩定識別碼，例如 `trigram:qian`。顯示名稱變更時不得更換 ID。
- `slug`：Windows 與網址皆安全的 kebab-case 路徑片段；與 ID 分離。
- `type`：`course | classic | lesson | trigram | hexagram | heavenly_stem | earthly_branch | element | yin_yang | ten_god | direction | meridian | meridian_level | organ | acupoint | point_category | concept | formula | herb`。
- `labels`、`descriptions`：本地化文字物件；`zh-Hant` 必填，`zh-Hans` 可選。
- `aliases`：按語系分組的別名陣列。
- `metadata`：小型結構化屬性；鍵名必須先有展示名稱對照，禁止把內部鍵直接顯示給讀者。
- `sourceIds`：至少一筆來源 ID。
- `relatedLessonIds`：可供延伸研讀的 lesson ID。

lesson 另有 `courseId`、`moduleId`、`order`、`route`、`legacyPath` 與 `relatedEntityIds`。`route` 是課程公開路徑，`legacyPath` 只指向專案內已驗收正文。

## Relation Schema V1

關係是有方向的 edge，固定欄位為 `id`、`type`、`from`、`to`、`sourceIds`，並可選擇加入本地化 `notes` 與 `confidence`。端點必須存在，關係不得指向自身，ID 不得重複。

V1.2 詞彙為：`part_of`、`belongs_to`、`contains`、`appears_in`、`sourced_from`、`contains_herb`、`related_formula`、`corresponds_to`、`element_of`、`upper_trigram`、`lower_trigram`、`related_to`、`generates`、`controls`、`classified_as`。`classified_as` 表達條目與可查詢分類的通用關係，不只適用於針灸；穴位隸屬經脈仍使用 `belongs_to`，不得以分類關係取代。

公開介面一律使用 `lib/presentation.ts` 的繁簡展示對照，例如 `part_of` 顯示「屬於／属于」、`appears_in` 顯示「見於／见于」；不可直接輸出 enum 值。

## Source / Provenance Schema V1

來源是 graph 頂層的第一級記錄，entity 與 relation 只保存 `sourceIds`。分類固定為：

- `nihaixia`：可直接追溯的倪海廈講授資料；沒有足夠追溯資訊時不得使用。
- `classical`：古典原文。
- `editorial`：本站編輯、重排或導讀。
- `reference`：外部參考資料。
- `derived`：由已知資料轉成的結構化欄位。

來源可記錄本地化 `title`、`work`、`author`、`note`，以及 `page`、`section`、`chapter`、`url`。不可猜測作者、頁碼或講課歸屬。現有課程整理明示為 editorial，不宣稱是講課逐字稿。

## i18n 合約

預設公開語系為 `zh-Hant`。`zh-Hans` 欄位可逐步補齊，缺少時由 `localize()` 回退至繁體。ID、slug、enum、來源引用與關係端點不得含顯示語言，因此增加簡體資料不會改變連結或圖譜身份。

## 圖譜與搜尋就緒條件

`knowledgeGraph.entities` 是節點集合，`relations` 是邊集合，`sources` 是可獨立查詢的證據集合。`knowledgeGraphSchema` 驗證唯一 ID／slug、端點、來源引用、課程父節點與延伸研讀引用，讓後續圖譜儲存不必重新解釋現有資料。

搜尋索引保存雙語 `labels`、`descriptions`、`keywords`、雙語類型展示名與公開 `href`。索引只依公開 slug 產生連結；穩定 ID 保留給合併、去重與未來資料交換。

## 六十四卦擴量驗證

Schema V1 已用完整 8 個八卦與 64 個六十四卦進行擴量驗證，未新增 entity 欄位、relation type、source category 或特例 schema。六十四卦沿用一般 `hexagram` entity：

- `id` 使用語言無關的通行卦序，例如 `hexagram:01`；slug 與顯示名稱分離。
- `metadata` 保存 `hexagramNumber`、`unicodeSymbol`、上下卦穩定 ID 與自下而上的六爻 `linePattern`；公開頁只透過展示層輸出人可讀欄位。
- 每卦各有一條 `upper_trigram` 與 `lower_trigram` 關係，因此圖譜不必解析 metadata 才能建立邊。
- 六爻結構由下卦三爻接上上卦三爻程式化生成，驗證器會反向核對兩個八卦引用。

結論：V1 在本次 64 卦擴量中沒有出現顯著特殊案例。上下卦 ID 同時存在 metadata 與 relation，是為了滿足條目自描述與圖譜直接取邊兩種用途，語意一致性由確定性驗證保證。

## 本地圖譜 Adapter 合約

`lib/local-graph.ts` 是 Schema V1 上方的唯讀呈現 adapter，不是新 schema。它接受中心 ID、完整節點與關係陣列，只輸出深度 1 的直接鄰接圖；排序固定、預設最多 18 個鄰居、所有顯示文字經 i18n 對照、所有可導航節點使用既有公開路由。同方向同端點的關係可聚合顯示，但輸出保留全部 relation IDs。adapter 不讀 `metadata` 推導邊，也不把 `relatedLessonIds` 轉為關係。

其決定性、端點錯誤、hub 上限、公開標籤與代表性乾／坤／泰／否／坎／離／周易結果由 `npm run validate:graph` 獨立驗證。

## V1 變更規則

允許：補齊 `zh-Hans`、修正文案、增加符合既有詞彙的 entity／relation／source、補充來源定位欄位。禁止：重用 ID 表示不同事物、依名稱改 ID、刪改 enum 語意、把來源內嵌回 entity、讓無來源資料通過驗證。需要禁止事項時，建立下一版本並提供可重現的資料遷移。

## V1.1 八字／河洛壓力測試

本次新增 6 種 entity type：`heavenly_stem`、`earthly_branch`、`element`、`yin_yang`、`ten_god`、`direction`。河圖、洛書、八字／河洛系統節點與帶有特定河洛語意的 1–10 使用既有 `concept`；沒有建立一般整數型別。資料欄位不需新增，所有新條目仍使用 labels、descriptions、aliases、metadata、sourceIds 與 relatedLessonIds。

五行與陰陽各只有一組穩定 ID，易經課程、天干地支、河洛數字、方位與八卦透過同一批節點交叉連結。十神被建模為相對日主的分類概念，未固定綁到某一天干或地支。藏干、五合、六合、三合、三會、沖、刑、害、破及十神推導均刻意延後；現有來源雖提及部分術語，但不足以在同一里程碑建立一致而不誤導的完整關係集。

結論：Schema V1 的共同欄位、來源、i18n、ID 與 generic relation 架構仍可承載第二領域；摩擦集中在 enum 擴充，而非 domain-specific 欄位。以 1.1.0 記錄新增 enum 後，模型仍適合作為人紀小樣本的起點，但人紀開始前仍須先做來源盤點，不能把本次五行對應直接外推為醫療關係。

## V1.2 人紀針灸壓力測試

新增 `meridian`、`meridian_level`、`organ`、`acupoint`、`point_category` 五種 entity type，以及通用 `classified_as` relation。未新增 schema 欄位、metadata value 類型或 source category。穴位分類採第一級 entity 加顯式關係：它能直接回答原穴清單、單穴多重分類、某經五輸穴及與五行相關的穴位；若只存 metadata，圖譜、反向查詢與分類來源都會變弱。

十二臟腑使用 `organ:liver` 等跨模組穩定身份，經脈以 `corresponds_to` 連到臟腑；臟腑再以 `element_of` 連到既有五行。穴位只直接 `belongs_to` 經脈，不為了深度 1 畫面重複連到臟腑或五行（五輸穴本身具有獨立五行分類意義時除外）。因此能形成太衝 → 足厥陰肝經 → 肝 → 木的可追溯多步路徑。

太陰、少陰、厥陰、陽明、太陽、少陽建為 `meridian_level`，各自連到既有陰／陽。這些身份具有搜尋與跨模組重用價值，但目前描述明示它們只是十二正經命名層級；不得由此自動推導《傷寒論》六經辨證。五行與陰陽继续各保持 5／2 個共享身份，没有建立 `tcm:*` 或针灸副本。

醫療領域摩擦有三點：穴位可同時屬多個分類；五輸五行規則取決於陰／陽經；未來解剖視覺需要座標與經脈路徑。前兩者由第一級分類、顯式關係及決定性驗證處理；第三者目前只記錄「尚未加入座標」的呈現狀態，不把未成熟 coordinate 欄位塞入 Entity Schema。結論是 Schema 1.2.0 適合擴大至完整針灸語料，但擴量前仍須建立來源匯入流程、標準化穴位定位資料及視覺座標子模型。

## V2.5B-1 匯入層與 Schema freeze

`tools/acupuncture/` 的 canonical import record、source locator、workflow status、relation-level source purpose 與未來 extractor 訊息全屬匯入層，不是 Entity／Relation／Source 欄位。29 點對帳證明 Schema 1.2.0 可原樣承接候選輸出，因此本里程碑沒有 schema 變更。

未來 anatomy marker／path 亦採 linked spatial submodel；不得為方便 OCR 或繪圖而解除 freeze。完整合約見 [`ACUPUNCTURE_INGESTION.md`](ACUPUNCTURE_INGESTION.md)。
