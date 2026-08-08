# 知識平台建置紀錄

## 架構決策

知識研讀介面採 Next.js App Router、TypeScript、Zod 與靜態導出。原有 54 個 HTML 保留在專案根目錄作為不可變內容基線；建置時由 `scripts/sync-v1-public.ts` 複製至 `/v1/`，供典藏閱讀與內容核對。

課程正文不重新生成。`lib/v1-content.ts` 在建置階段讀取既有 `<article class="classic">`，新的公開路由提供搜尋、麵包屑、前後篇、來源說明和知識條目入口。

## Schema Freeze 1.0.0

Entity、Relation、Source／Provenance 與 i18n 合約已凍結為 1.0.0。詳細欄位、展示對照、圖譜／搜尋條件及版本規則見 [`KNOWLEDGE_MODEL.md`](KNOWLEDGE_MODEL.md)。後續匯入和引導研讀要求見 [`CONTENT_GUIDELINES.md`](CONTENT_GUIDELINES.md)。

目前資料範圍刻意維持《易經》樣本：5 篇研讀課程、天紀課程主線、周易經典、8 個八卦條目、14 條關係與 3 筆獨立來源。沒有在本里程碑擴充其他大型模組或全量卦象。

## 品質門檻

- `node tools/validate-site.js`：典藏基線 54 頁、0 errors、0 warnings。
- `npm run validate:data`：schema、穩定 ID、來源引用、關係端點與課程引用通過。
- `npm run build`：搜尋索引及所有靜態公開路由建置成功。
- 公開頁關係、類型、屬性與來源分類均使用本地化展示名稱，不輸出 enum 或內部進度文字。
- `zh-Hant` 為預設，缺少可選 `zh-Hans` 時安全回退；加入簡體欄位不改變 ID 或路由。
- 桌面與 390×844 行動視口檢查單一 H1、無頁面橫向溢出、無壞連結及無控制台錯誤。

## 延後事項

新增大型內容批次、完整六十四卦資料、其他學科 entity 類型，以及需要改動 V1 詞彙的關係，皆留待獨立評估。開始任何一項之前，必須按內容規範先完成來源盤點與小樣本驗證；不得在本次凍結提交中順帶擴量。
