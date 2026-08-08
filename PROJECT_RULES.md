# 專案維護規則

- 維持既有靜態 HTML 架構、網址、導覽方式、繁體中文與「古籍紙本＋硃砂印＋竹青」視覺語言。
- `OPEN_GAPS.md` 只記錄尚未解決、可採取行動的缺口；通過驗證即刪除。
- 完成紀錄只追加到 `AUDIT_LOG.md`；無法可靠完成的項目移至 `BLOCKED.md`。
- 優先順序：P0 BROKEN → P1 MISSING / COVERAGE → P2 STRUCTURE / CONSISTENCY → P3 CONTENT QUALITY → P4 UI CONSISTENCY → P5 COSMETIC。
- 涉及醫療、穴位、藥物、方劑與經典原文，不得為湊足篇幅而杜撰；保留教育用途與就醫提醒。
- 每個內容家族先確立最小模板，再逐項一致完成；驗收後停止無目的擴寫。
- 每批修改後執行 `node tools/validate-site.js`，並再次從檔案系統掃描。

