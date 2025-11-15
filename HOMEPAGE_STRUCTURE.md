# 首頁結構文檔 | Homepage Structure Documentation

**版本更新註釋：**

- v1.6 (2024): 優化了 ScrollNav 導航的滾動流暢度，消除了切換區塊時的卡頓感。
- v1.5 (2024): 修復了使用 ScrollNav 導航時因 snap scrolling 衝突導致區塊卡在中間無法完整定位的問題。
- v1.4 (2024): 修復了從 Realms 導航到 Hero 時因固定 Navbar 遮擋導致定位不完整的問題。
- v1.3 (2024): 精簡文檔內容，僅保留開發必要資訊以減少 token 使用。
- v1.2 (2024): 修復了通知系統 section 元素被誤認為頁面區塊導致空白畫面的問題。
- v1.1 (2024): 修復了導航系統動態效果與頁面區塊的同步問題，改用 Intersection Observer API 實現精確追蹤。
- v1.0 (2024): 修復了導航系統（Navbar/ScrollNav/Keyboard）與頁面區塊標籤不同步的問題。

---

## 🏗️ 整體架構

### 頁面結構

```
Index.tsx
├── Navbar (currentSection, onNavigate)
├── ScrollNav (sections, currentSection, onNavigate)
└── main
    ├── Hero (#hero-section)
    ├── Realms (#realms-section)
    └── About (#about-section)
```

### 區塊索引

```javascript
const sections = ["Introduction", "Realms", "About"];
// 0: Hero (#hero-section)
// 1: Realms (#realms-section)
// 2: About (#about-section)
```

---

## 🧭 導航系統

### Navbar 配置

```tsx
const navItems = [
  { label: "Introduction", section: 0, ariaLabel: "Navigate to hero introduction" },
  { label: "Realms", section: 1, ariaLabel: "Navigate to seven temples" },
  { label: "About", section: 2, ariaLabel: "Navigate to about section" },
];
```

### 鍵盤快捷鍵

- `↓` / `Space`: 下一個區塊
- `↑`: 上一個區塊

### 滾動追蹤（Intersection Observer）

```tsx
// 只追蹤真實頁面區塊，排除通知系統
const allSections = document.querySelectorAll(
  "section#hero-section, section#realms-section, section#about-section"
);

// Observer 配置
const observerOptions = {
  root: null,
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0,
};
```

---

## 📄 頁面區塊

### Hero (#hero-section)

- **主標題**: ALGORITHMIA EXPEDITION
- **副標題**: 探索演算法的古老智慧，穿越七座神聖聖殿，解鎖計算思維的奧秘
- **CTA**: 開始探索之旅 (scrollToRealms)

### Realms (#realms-section)

七大聖殿輪播：

1. Search Temple - 搜尋聖殿
2. Sorting Temple - 排序聖殿
3. Tree Temple - 樹狀聖殿
4. Graph Temple - 圖論聖殿
5. Dynamic Programming Temple - 動態規劃聖殿
6. Greedy Temple - 貪婪聖殿
7. Backtracking Temple - 回溯聖殿

### About (#about-section)

專案介紹與團隊資訊

---

## 🎨 設計系統

### 色彩變數

```css
--temple-gold: 43 74% 53%;      /* 主要強調色 */
--background: 0 0% 4%;           /* 深黑背景 */
--foreground: 45 25% 90%;        /* 文字顏色 */
--lapis-blue: 236 63% 48%;       /* 次要色 */
--jade-green: 153 100% 33%;      /* 成功色 */
```

### 字體

- **Cinzel**: 標題、按鈕 (400, 600, 700)
- **Inter**: 內文、導航 (300, 400, 500, 600)

### 斷點

```css
sm: 640px    md: 768px    lg: 1024px    xl: 1280px    2xl: 1536px
```

---

## ⚙️ 技術實作

### 狀態管理

```tsx
const [currentSection, setCurrentSection] = useState(0);
const sections = ["Introduction", "Realms", "About"];
```

### 路由配置

```tsx
<QueryClientProvider>
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
    <Sonner />
  </TooltipProvider>
</QueryClientProvider>
```

### 全域組件 CSS（防止佔用空間）

```css
.toaster,
[data-sonner-toaster],
section[aria-label*="Notifications"],
section[aria-live="polite"] {
    position: fixed !important;
    pointer-events: none;
    z-index: 9999;
    display: none !important;
}
```

---

## 🎭 互動機制

### Snap Scrolling

```tsx
<main className="snap-y snap-mandatory overflow-y-scroll">
  <section className="snap-start snap-stop min-h-screen" />
</main>
```

### Smooth Scrolling

```tsx
element?.scrollIntoView({ behavior: "smooth", block: "start" });
```

### 動畫配置

```tsx
// Framer Motion
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, delay: 0.3 }}
```

---

## ⚡ 性能優化

### 程式碼分割

```tsx
const Hero = lazy(() => import("@/components/Hero"));
const Realms = lazy(() => import("@/components/Realms"));
const About = lazy(() => import("@/components/About"));
```

### 滾動優化

```tsx
const debouncedHandleScroll = () => {
  requestAnimationFrame(handleScroll);
};
window.addEventListener("scroll", debouncedHandleScroll, { passive: true });
```

---

## 🔍 關鍵注意事項

### ⚠️ 必須使用 ID 選擇器

所有 `querySelectorAll("section")` 必須改為：

```tsx
document.querySelectorAll(
  "section#hero-section, section#realms-section, section#about-section"
)
```

**原因**: 避免選到通知系統的 `<section aria-label="Notifications">`

### ⚠️ Intersection Observer 配置

```tsx
rootMargin: "-50% 0px -50% 0px"  // 確保區塊中央時才觸發
threshold: 0                      // 立即檢測
```

### ⚠️ 區塊同步

- Navbar labels 必須匹配 `sections` 陣列
- ScrollNav 使用 `sections` prop
- Keyboard Navigation 使用 `currentSection` 索引
- 所有導航函數使用相同的 ID 選擇器

---

## 📝 快速參考

### 新增區塊步驟

1. 在 `src/components/` 建立新元件
2. 添加唯一 `id` 屬性（如 `#new-section`）
3. 更新 `sections` 陣列
4. 更新 `navItems` 配置
5. 更新所有 `querySelectorAll` 選擇器
6. 在 `Index.tsx` 渲染元件

### 常見問題

- **導航不同步**: 檢查 `sections` 陣列與 `navItems` 是否一致
- **空白畫面**: 檢查是否誤選通知系統的 section
- **滾動不精確**: 確認使用 Intersection Observer 而非計算滾動位置
- **通知佔空間**: 確認 CSS 有 `position: fixed !important`

---

**文檔版本**: v1.6.0
**最後更新**: 2024  
**維護者**: Algorithmia Team
