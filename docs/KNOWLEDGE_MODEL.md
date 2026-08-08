# 知識模型 V1（已凍結）

本文件記錄 1.0.0 知識資料合約。凍結表示既有欄位語意、ID 與關係名稱不得在一般內容匯入中改動；新增或破壞性變更必須另開 schema 版本並提供遷移說明。現有資料涵蓋《易經》5 篇研讀課程、8 個八卦與 64 個六十四卦條目，不代表其他模組已完成建模。

## Entity Schema V1

所有可進入知識圖譜的項目都是 entity，包含課程 lesson。共同欄位如下：

- `id`：語言無關、具命名空間的穩定識別碼，例如 `trigram:qian`。顯示名稱變更時不得更換 ID。
- `slug`：Windows 與網址皆安全的 kebab-case 路徑片段；與 ID 分離。
- `type`：`course | classic | lesson | trigram | hexagram | concept | formula | herb`。
- `labels`、`descriptions`：本地化文字物件；`zh-Hant` 必填，`zh-Hans` 可選。
- `aliases`：按語系分組的別名陣列。
- `metadata`：小型結構化屬性；鍵名必須先有展示名稱對照，禁止把內部鍵直接顯示給讀者。
- `sourceIds`：至少一筆來源 ID。
- `relatedLessonIds`：可供延伸研讀的 lesson ID。

lesson 另有 `courseId`、`moduleId`、`order`、`route`、`legacyPath` 與 `relatedEntityIds`。`route` 是課程公開路徑，`legacyPath` 只指向專案內已驗收正文。

## Relation Schema V1

關係是有方向的 edge，固定欄位為 `id`、`type`、`from`、`to`、`sourceIds`，並可選擇加入本地化 `notes` 與 `confidence`。端點必須存在，關係不得指向自身，ID 不得重複。

V1 詞彙固定為：`part_of`、`belongs_to`、`contains`、`appears_in`、`sourced_from`、`contains_herb`、`related_formula`、`corresponds_to`、`element_of`、`upper_trigram`、`lower_trigram`、`related_to`。

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
