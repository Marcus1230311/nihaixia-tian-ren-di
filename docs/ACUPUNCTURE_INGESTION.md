# 針灸結構化資料匯入

V2.5B-1 建立一條與公開 Knowledge Entity Schema 1.2.0 分離的確定性資料邊界。它處理重複轉錄、正規化、引用解析、規則驗證與例外報告；人工或模型只審核語義模糊、別名衝突、來源解讀與關係判斷。現有 29 穴是回歸 fixture，不代表已匯入完整穴位庫。

## 目錄與資料流

`data/import/acupuncture/` 保存人工核准或抽取器輸出的 canonical record；`tools/acupuncture/` 執行 Load → Normalize → Resolve → Validate → Transform → Compare → Report；`data/generated/acupuncture/` 保存通過 Schema 1.2.0 的候選 Entity／Relation；`reports/` 保存 JSON 與 Markdown 例外報告。產生器不改寫 `data/renji-acupuncture.ts`，所以 dry-run 與 generate 都不會發布新公開內容。

接受 `.json`、`.csv`、`.tsv`。JSON 可為記錄陣列，或 `{ "formatVersion": "1.0", "defaults": {}, "records": [] }`。CSV／TSV 的陣列欄用 `|` 分隔；`locationSummary`、`relationSourceIds`、`sourceLocator` 使用 JSON cell。引號、逗號及雙引號跳脫由內建 parser 處理。格式故意保持小而穩定，未來可加 Markdown 轉換器，但 Markdown 不是驗證合約。

## Canonical import record

必填核心欄：`sourceKey`、`canonicalNameHant`、`canonicalNameHans`、`standardCode`、`meridianId`、`sequenceNumber`、`relatedLessonIds`、`sourceIds`、`relationSourceIds`、`sourceLocator`。陣列欄 `aliasesHant`、`aliasesHans`、`pointCategories` 可空；`elementId`、雙語 `locationSummary`、`notes` 可省略；`status` 為 `draft | review | accepted | blocked`。

`relationSourceIds` 分為 `membership`、`category`、`fiveShu`。這是匯入層的證據用途表：WHO 可支持代碼／命名與經脈 membership，專案來源可支持課程放置，五輸參考可支持分類與五行；它不會變成 public Entity 欄位。`sourceLocator` 可保存 source ID/title、page、chapter、section、heading、URL、local file、note。定位不完整可以通過，例如 source ID + section；不得猜頁碼。

```json
{
  "sourceKey": "pilot:lr-03",
  "canonicalNameHant": "太衝",
  "canonicalNameHans": "太冲",
  "standardCode": "LR3",
  "meridianId": "肝经",
  "aliasesHant": ["LR3"],
  "aliasesHans": ["LR3"],
  "sequenceNumber": 3,
  "pointCategories": ["輸穴", "原穴"],
  "elementId": "土",
  "relatedLessonIds": ["lesson:renji:acupuncture:02"],
  "sourceIds": ["source:project:renji-acupuncture-notes"],
  "relationSourceIds": { "membership": ["source:project:renji-acupuncture-notes"], "category": ["source:project:renji-acupuncture-notes"], "fiveShu": ["source:reference:bucm-five-shu"] },
  "sourceLocator": [{ "sourceId": "source:project:renji-acupuncture-notes", "section": "renji/zhenjiu/01–03" }],
  "status": "accepted"
}
```

## 正規化與驗證

所有文字做 Unicode NFKC、空白收斂與 trim；代碼移除空格／連字號／底線並大寫，例如 ` lr-3 ` → `LR3`。代碼產生固定 ID，例如 `LR3` → `acupoint:lr-03`。十二經 alias map 同時接受穩定 ID、繁簡全名及常用短名。分類與五行只經明列 alias map 解析，不做模糊猜測。`輸穴／输穴／腧穴` 解析為 stream；`背俞／俞穴` 解析為 back-shu，兩者刻意不合併。每一條實際轉換都寫入記錄的 `normalizations`。

ERROR 會阻止產生：格式錯誤、代碼語法或序號不符、代碼前綴與經脈不符、未知／非唯一經脈、未知分類／五行／lesson／source、blocked 記錄、重複 ID／代碼、名稱衝突、五輸多重分類、五輸缺少五行或參考來源，以及陰陽經五輸五行配屬矛盾。輸出 Entity／Relation 另由公開 Zod schema 驗證，端點則在完整 build 的 graph validator 再驗證。

WARNING 不阻止 dry-run：非 accepted 工作流狀態、source locator 不完整或未使用、本地來源不存在、缺少 reference 級來源、alias collision。真重複、名稱衝突與可能別名不會被靜默合併。報告摘要分開計數 valid、invalid、duplicate、conflict、unresolved source／meridian／category、source quality 與 normalization。

Compare 階段把候選 Entity 的 ID、標籤、別名、描述、metadata、source、lesson，以及穴位相關 `contains`／`belongs_to`／`classified_as`／`element_of` 關係逐字對照 production。現有 29 點必須 29/29 equivalent 才能 generate 或 CI validate。

## 指令與確定性

- `npm run acupuncture:dry-run`：讀取、正規化、驗證、對帳並只更新報告；預設 bulk workflow。
- `npm run acupuncture:generate`：零 ERROR 且 pilot 全等時，明確寫入候選 JSON 與報告；仍不發布到 production。
- `npm run acupuncture:validate`：重算後比對已提交的 generated JSON／兩份報告；任何 stale artifact、錯誤或對帳差異均失敗。

排序固定為經脈順序，再依穴位序號／代碼；relation 依 ID；輸出無時間戳。相同 input 連跑 generate 必須產生 byte-identical 檔案且 `git diff` 為空。GitHub Actions 在 build 前執行 validate，完整 build 也再次執行。

## 來源、授權與未來邊界

來源優先採已確認專案內容、可實際追溯的課程材料、古典／權威參考、WHO／機構標準、editorial、derived。WHO 只作標準化證據，不代表倪海廈特定解讀。只保存完成身分與關係所需的最小事實資料及 attribution；不整批複製受版權保護的表格，也不把 PDF 放進公開 repository，除非權利與專案政策已確認。

未來 PDF 流程只能是 `PDF → extractor/OCR → canonical acupuncture import records → 本 pipeline`。OCR 信心、頁面裁切等 extraction 訊息可以留在 locator／notes 或 extractor sidecar，不得直接耦合、繞過或改寫 Knowledge Schema。

解剖視覺資料另建 linked submodel，而不是塞入 Entity 1.2.0。建議 key 為 `acupointId + diagramVersion + bodyView + region + laterality`，值包含 0–1 normalized `x/y`、可選 `svgPath`／path position、座標系與證據 locator。diagram version 必須固定底圖、方向、裁切與授權；未知座標不可猜測。本里程碑只設計，不填坐標。

## 模型 token 原則

模型 token 不應用於重複、確定性的逐筆轉錄。大批量工作使用程式抽取 + 正規化 + 驗證；LLM review 只留給章節邊界模糊、未解析別名、來源衝突、關係語義判斷與教育摘要。V2.5B-2 可擴大 primary-meridian records，但仍須先交付結構化來源與例外審核，不得直接啟動完整語料匯入。
