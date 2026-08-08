# V4.0 Interactive Frontend Vertical Slice

本輪只實作首頁 hero 與手太陰肺經 LU1–LU11 的互動垂直切片。Knowledge Model、Teaching Layer、V1 典藏與其他十一條經脈保持不變。

## 公開定位與藝術方向

首頁主體改為「中醫／Traditional Chinese Medicine」。倪海廈仍保留在可追溯來源、課程與方法論語境，不再作為首屏主品牌。

視覺採深墨展場、瓷白中性人體載體、極少量舊金光與朱砂以外的克制配色。人體是純程式 SVG 的抽象知識載體：無面孔、頭髮、性別、民族特徵、皮膚細節或顯式解剖；背景噪點、光暈與粒子只屬 atmosphere，沒有承載醫學資料。

## 分層架構

1. **Atmosphere**：CSS 漸層、低密度粒子、細微噪點。
2. **Human base**：抽象瓷白 SVG；不含經脈與穴位。
3. **Medical geometry**：typed capability，目前為 `blocked`，因此不輸出人體路徑或 marker。
4. **Interaction**：獨立 Client Component 管理指標接近、喚醒、聚焦、進入與返回。
5. **Typography**：所有中文、穴名與代碼都是原生 HTML；沒有文字點陣化。
6. **Knowledge navigation**：LU1–LU11 從 canonical entity 產生，點擊鎖定後可進入既有知識條目。

## 醫學幾何審計

倉庫目前可驗證：肺經 canonical identity、LU1–LU11 繁體名稱、標準代碼、次序、經脈隸屬與來源。`meridian:lung.metadata.visualReadiness` 明列「未加入解剖座標／經脈路徑」；`scripts/validate-knowledge.ts` 會拒絕提前加入 `coordinates`、`bodyCoordinates` 或 `meridianPath`。

既有 WHO 出版物是位置與名稱的權威文本來源，但專案沒有把其解剖描述轉成帶座標系、投影規則、人體版本與人工醫學審核的可重現 SVG mapping。因此本輪只在非解剖 sequence rail 呈現 LU1–LU11，不在人體上猜畫任何點或路徑。未來啟用 Layer 2 前至少需要：合法可用的可重現來源、明確座標系／視圖、人體版本、逐點人工醫學審核及版本化 spatial submodel。

## 互動語法與内部状态

可重用語法為 `VISIBLE → PROXIMITY → AWAKEN → FOCUS → ENTER → RETURN`。组件内部保留 anchor（肺經）、explore（目前穴位）及 next（局部下一穴）概念，但公開 UI 不顯示這些工程名稱。

- 指標接近人體時，CSS attention 變數連續改變光場與載體明度。
- 喚醒後，經絡題名、順序線及 11 個身份依次顯現。
- 穴位 hover／focus 會提升當前身份，其餘身份退後。
- 點擊鎖定焦點，原構圖保留並出現最小知識上下文與既有 entity 入口。
- Escape 或「返回經絡」回到上一層。
- 局部 next 使用舊金呼吸亮度與低幅光暈，不顯示推薦文字、分數或指令。

## Touch、鍵盤與動態偏好

Touch 第一次點按只聚焦，第二次點按才鎖定；進入知識條目需再按明確連結，避免意外導航。所有穴位都是原生 button，支援 Tab、Enter／Space、`aria-pressed` 與 Escape。`prefers-reduced-motion: reduce` 會停止粒子、呼吸與過場動畫，同時保留完整狀態與對比。

## 效能邊界

沒有加入圖片、GSAP、Three.js 或 WebGL。人體與氛圍均為單一 SVG／CSS；粒子固定 5 個；pointer move 以 `requestAnimationFrame` 合併，每幀只更新三個 CSS custom properties。狀態與已探索记录只存在当前 session，不持久化。

## 擴展門檻

此視覺語言可擴展到其他經脈及知識系統，但不應直接複製肺經資料。十二經 anatomical rollout 的先決條件是完成上節的 spatial provenance 與人工醫學審核；未滿足前只能重用互動 grammar、藝術層與 typed capability，不能重用或推測人體幾何。
