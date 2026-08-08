# Knowledge Model V1 Freeze Candidate

狀態：**V1 Freeze Candidate**  
對應資料合約：`schemaVersion 1.5.0`  
候選基線：641 個 entity、1,933 條 relation、23 筆 source

本文件凍結的是知識層的語義合約，不是把目前內容量視為永久上限。候選基線用來做回歸檢查；未來仍可依既有 schema、詞彙與來源規則增加可追溯內容。

## 1. 凍結範圍

V1 Knowledge Model 由三種一級記錄組成：

- **Entity**：以穩定、與顯示語言分離的 ID 表示概念、經典、課程、臟腑、經脈、穴位、方劑、藥材等身份。
- **Relation**：以有方向的 edge 連接兩個既存 entity；relation type 有受控語義，並保留自己的來源。
- **Source**：以 `classical`、`editorial`、`reference`、`derived` 或可直接追溯的 `nihaixia` 分類記錄 provenance。

以下合約進入凍結候選狀態：

- Entity、Relation、Source 的欄位結構、必填條件與驗證行為。
- entity type、relation type、source category 等受控列舉及其既有語義。
- 穩定 ID、公開 slug、語言回退、來源引用與 relation 端點規則。
- 同名但不同系統的概念必須保留不同身份；例如針灸命名層級的「太陽」與《傷寒論》六經的「太陽」不得合併。
- 公開 UI 不直接顯示內部 enum；所有名稱均經 presentation／i18n 層轉成人可讀文字。

完整欄位與詞彙仍以 `lib/knowledge-schema.ts` 及 `docs/KNOWLEDGE_MODEL.md` 為準。本文件記錄治理邊界，不複製第二份可執行 schema。

## 2. 允許的延伸

下列變更使用既有合約即可，不需要啟動 schema review：

- 使用既有 entity type、relation type 與 source category 增加可追溯內容。
- 補齊簡體標籤、別名、描述、來源定位或既有 metadata 的顯示名稱。
- 修正文案、翻譯、標點、排序、搜尋權重、路由導覽與無障礙呈現。
- 加入不改寫 graph 事實的教學目標、先備概念、摘要、關係解釋、常見混淆與下一步研讀建議。
- 調整頁面版面、漸進揭露、local graph 呈現或其他唯讀 adapter。

內容新增仍須通過唯一 ID／slug、來源、端點、公開路由與既有專項驗證。候選基線的數量變動本身不是 schema review 理由，但必須是經明確審核的內容變更，不能由教學介面暗中產生。

## 3. 必須啟動 review 的情況

以下任一情況需要明確的 Knowledge Model review，並視影響決定新版本、遷移說明與回歸 fixture：

- 新增、刪除或改變 Entity、Relation、Source 欄位。
- 新增列舉值，或改變既有 entity／relation／source 類別的語義。
- 改變穩定 ID、slug 身份規則、i18n 回退、來源模型或驗證不變量。
- 把原本的 presentation／teaching 推論提升為 graph 事實。
- 合併原本不同身份的節點，或拆分既有 canonical identity。
- 需要資料遷移、會使既有公開連結失效，或會改變外部 consumer 對 V1 的解讀。

Review 必須回答：為何既有詞彙不足、哪些 consumer 受影響、如何遷移、如何驗證，以及舊資料如何保持可追溯。

## 4. 不構成 review trigger 的情況

以下事項不應被誤判為 Knowledge Model 變更：

- 教學內容的先後順序與「推薦下一步」。
- 對已存在 relation 的人類可讀解釋。
- CORE／DEEPER／SOURCE 的顯示層級。
- Knowledge Context、比較提示、頁面摘要與學習收穫。
- CSS、響應式、元件拆分、搜尋 UI 或視覺圖表調整。
- 某個頁面選擇不顯示 graph 中的全部關係；完整關係仍須可在既有資料與關係區查到。

## 5. Knowledge Model 與 Teaching Layer

兩層的責任必須分開：

| Knowledge Model | Teaching Layer |
| --- | --- |
| 記錄「有哪些身份、事實關係與來源」 | 回答「學習者此刻為何看它、先懂什麼、接著看什麼」 |
| 是可驗證、可查詢的 canonical graph | 是靜態、型別化、可編輯的教學編排 |
| relation 是具來源的知識主張 | 關係解釋是對既有主張的導讀，不是新 edge |
| local graph 顯示實際鄰接 | Knowledge Context 顯示教學路徑，不宣稱路徑每一步都是 graph relation |
| source category 表示 provenance 類型 | SOURCE 層選取相關依據並以讀者可懂的類別呈現 |

Teaching Layer 可以有學習目標、先備概念、2–4 個重點、為何相連、常見混淆、建議下一步與理由、深讀內容及來源選取；它不得新增虛構 relation、改寫 entity identity、提供個人診斷／治療建議，或成為第二套知識資料庫。

## 6. Freeze Candidate 驗收

V1 Freeze Candidate 在教學原型完成後仍須滿足：

- schema 版本維持 1.5.0，Entity／Relation／Source schema 與 enums 無差異。
- 641 個 entity、1,933 條 relation 與既有 source、課程、方劑組成、309 穴資料保持不變。
- 搜尋、公開 entity／lesson 路由、local graph 與所有既有驗證持續通過。
- Teaching Layer 可獨立移除而不改變 knowledge data，也不影響 graph consumer。

通過以上回歸後，本候選可升格為正式 Knowledge Model V1 freeze；任何後續破壞性變更依第 3 節治理。
