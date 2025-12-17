# 🏯 首頁結構與導航文檔 | Homepage Structure & Navigation Hub

> 本文檔詳述首頁 (`Index.tsx`) 的架構設計、導航邏輯與區塊互動機制。
> This document details the architectural design, navigation logic, and interaction mechanisms of the homepage.

---

## 🏗️ 整體架構 | Overall Architecture

### 頁面組件層級 | Component Hierarchy

```
Index.tsx
├── Navbar (Top Navigation) -> Controls subset of sections
├── AudioControls (Global Sound)
└── main (Scroll Container)
    ├── ScrollNav (Side Indicators) -> Controls ALL sections
    ├── Hero (#hero-section) [Index: 0]
    ├── Realms (#realms-section) [Index: 1]
    ├── About (#about-section) [Index: 2]
    ├── Testimonials (#testimonials-section) [Index: 3]
    └── Pricing (#pricing-section) [Index: 4]
```

### 區塊索引定義 | Section Index

```javascript
const sections = [
  "Introduction", // 0: Hero
  "Realms", // 1: Realms
  "About", // 2: About
  "Testimonials", // 3: Testimonials
  "Pricing", // 4: Pricing
];
```

---

## 🧭 導航系統 | Navigation System

首頁採用雙重導航系統，分別服務不同層級的導航需求。

### 1. 頂部導航列 (Navbar)

_專注於主要內容區塊的快速跳轉_

- **組件位置**: `src/components/Navbar.tsx`
- **覆蓋範圍**: 僅前三章節 (Introduction, Realms, About)
- **互動**: 點擊標題或漢堡選單跳轉

### 2. 側邊滾動導航 (ScrollNav)

_提供完整的頁面進度指示_

- **組件位置**: `src/components/ScrollNav.tsx`
- **覆蓋範圍**: 所有區塊 (含 Testimonials 與 Pricing)
- **樣式**: 右側圓點指示器，Hover 顯示章節名稱
- **狀態**:
  - 啟用狀態: 金色光暈 (`hsl(43, 74%, 53%)`)
  - 縮放動畫: 當前區塊放大 1.4x

### 3. 鍵盤導航 (Keyboard Navigation)

- **支援按鍵**:
  - `↓` / `Space`: 下一個區塊
  - `↑`: 上一個區塊
- **排除條件**: 當焦點在輪播 (Carousel) 組件內時不觸發，避免操作衝突。

### 4. 滾動追蹤 (Tracking)

使用 `Intersection Observer API` 精確追蹤當前視口所在的區塊。

- **Observer Options**: `rootMargin: "-50% 0px -50% 0px"` (確保區塊佔據畫面 50% 時才切換狀態)

---

## 📄 頁面區塊詳情 | Page Sections Detail

### 1. Hero (#hero-section)

- **功能**: 著陸頁核心視覺
- **元素**: "ALGORITHMIA EXPEDITION" 標題、動態粒子背景、開始按鈕
- **特效**: 下方金色分隔線 (Golden Line Divider)

### 2. Realms (#realms-section)

- **功能**: 七大演算法聖殿展示
- **互動**: 3D 輪播卡片 (Carousel)，展示各章節主題 (Search, Sorting, Tree, Graph...)
- **特效**: 下方金色分隔線

### 3. About (#about-section)

- **功能**: 專案理念與團隊介紹
- **內容**: "Restoring the Balance" 敘事文本
- **特效**: 下方金色分隔線

### 4. Testimonials (#testimonials-section)

- **功能**: 使用者見證與回饋
- **樣式**: 卡片式佈局
- **特效**: 下方金色分隔線

### 5. Pricing (#pricing-section)

- **功能**: 訂閱方案選擇
- **主要組件**: `ModernPricingPage`
- **背景特效**: `ShaderCanvas` (WebGL 金色流體動畫)
  - _注意_: 此區塊無 CSS 偽元素分隔線，改用全屏 Shader 背景。
  - **實作細節**: 使用 `useRef` 進行 WebGL 狀態同步，防止動畫閃爍。

---

## 🎨 樣式與設計 | Design & CSS

### 滾動捕捉 (Snap Scrolling)

頁面採用 CSS Scroll Snap 實現全屏切換體驗。

```css
main {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  min-height: 100vh;
}
```

### 關鍵色彩變數

- `--temple-gold`: `43 74% 53%` (核心識別色)
- `--background`: `0 0% 4%` (極致深黑)

### 全域 CSS 注意事項

- **通知系統 (Toaster)**: 強制設為 `position: fixed` 並排除在 Section Flow 之外，防止影響滾動定位。
- **平滑滾動**: HTML 層級啟用 `scroll-behavior: smooth`，但在程式碼控制跳轉時會暫時停用 Snap 以優化流暢度。

---

## ⚡ 技術實作筆記 | Implementation Notes

### 區塊選擇器 (Selectors)

為避免選取到非頁面結構的 `<section>` (如 Radix UI 的通知區塊)，必須使用明確 ID 選擇器：

```typescript
const selector =
  "section#hero-section, section#realms-section, section#about-section, section#testimonials-section, section#pricing-section";
const allSections = document.querySelectorAll(selector);
```

### 效能優化

- **Debounce**: 滾動事件監聽器使用 `requestAnimationFrame` 進行節流。
- **Lazy Loading**: 所有主要區塊組件 (Hero, Realms 等) 建議採用 React Suspense/Lazy 載入 (視專案配置而定)。
- **WebGL**: Pricing 背景在不可見或組件卸載時會自動清理 Context。

---

## 📜 版本紀錄 | Version History

- **v2.0 (2024)**: 新增 Testimonials 與 Pricing 區塊；優化 WebGL 背景效能。
- **v1.8**: 移除 ScrollNav 箭頭按鈕。
- **v1.7**: 優化 Realms 輪播體驗。
- **v1.0-v1.6**: 滾動導航與 Intersection Observer 核心邏輯迭代。
