# V2 遷移紀錄

## 架構決策

V2 採 Next.js App Router、TypeScript、Zod 與靜態導出。V1 的 54 個 HTML 仍保留在專案根目錄作為不可變的內容基線；建置時由 `scripts/sync-v1-public.ts` 複製到 `/v1/`，方便逐頁對帳及回退。

遷移頁面不重新生成教育正文。`lib/v1-content.ts` 在建置階段讀取已驗收 V1 的 `<article class="classic">`，由 V2 路由提供新的搜尋、麵包屑、前後篇和知識實體入口。

## 知識模型 1.0

`lib/knowledge-schema.ts` 定義以下實體：

- course、lesson、classic
- meridian、acupoint、organ、formula、herb、syndrome
- hexagram、trigram、element、heavenly_stem、earthly_branch、direction

關係類型：part_of、belongs_to、contains、appears_in、sourced_from、contains_herb、related_formula、corresponds_to、element_of、upper_trigram、lower_trigram、related_to。

所有實體和關係必須有穩定 ID；關係兩端必須指向已存在實體。`npm run validate:data` 會檢查結構、重複 ID、孤立關係及 V1 來源檔案。

## 首批代表性遷移

- 易經五講：5 個靜態課程路由。
- 天紀課程、周易經典與八卦：10 個結構化實體。
- 已發布關係：14 條。
- 搜尋索引：15 筆，覆蓋課程正文與結構化實體。
- 視覺元件：由八卦三爻資料生成的 SVG，含語義化替代說明。
- V1 對照入口：54 頁原站在 `/v1/` 保持可用。

## 品質門檻

- `node tools/validate-site.js`：V1 54 頁、0 errors、0 warnings。
- `npm run validate:data`：模型、關係與來源路徑通過。
- `npm run build`：18 個 Next.js 靜態輸出路由建置成功。
- 17 個公開檢查路由在 390×844 視口無頁面級橫向溢出、每頁單一 H1、控制台 0 errors／warnings。
- 搜尋「乾」可同時找到相關課程與乾卦實體。

## 下一批次

1. 從易經頁面抽取並驗證 64 個 hexagram 實體及上下卦關係。
2. 遷移八字命理與河洛頁面，建立天干、地支、五行及方位關係。
3. 依醫療安全優先順序遷移人紀；先建立經絡／穴位與方劑／藥物 schema 對應，再公開交叉引用。
4. 全量遷移完成後對帳 V1 54 頁覆蓋、搜尋、行動端與來源邊界，再建立 PR；不直接合併到 `main`。
