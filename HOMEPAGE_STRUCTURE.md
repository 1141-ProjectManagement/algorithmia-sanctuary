# 首頁結構文檔 | Homepage Structure Documentation

**版本更新註釋：**
- v1.2 (2024): 修復了通知系統 section 元素被誤認為頁面區塊導致空白畫面的問題。
- v1.1 (2024): 修復了導航系統動態效果與頁面區塊的同步問題，改用 Intersection Observer API 實現精確追蹤。
- v1.0 (2024): 修復了導航系統（Navbar/ScrollNav/Keyboard）與頁面區塊標籤不同步的問題。

本文檔詳細說明 Algorithmia Sanctuary 首頁的完整結構、設計規範與技術實作細節。

This document details the complete structure, design specifications, and technical implementation of the Algorithmia Sanctuary homepage.

---

## 📋 目錄 | Table of Contents

1. [整體架構](#整體架構--overall-architecture)
2. [導航系統](#導航系統--navigation-system)
3. [頁面區塊](#頁面區塊--page-sections)
4. [視覺設計系統](#視覺設計系統--visual-design-system)
5. [互動機制](#互動機制--interaction-mechanisms)
6. [響應式設計](#響應式設計--responsive-design)
7. [技術實作](#技術實作--technical-implementation)
8. [性能優化](#性能優化--performance-optimization)

---

## 🏗️ 整體架構 | Overall Architecture

### 頁面層級結構 | Page Hierarchy

```
Index.tsx (主頁面容器)
├── Navbar (頂部導航列)
├── ScrollNav (側邊滾動指示器)
└── main (主內容區域)
    ├── Section 1: Hero (英雄區塊)
    ├── Section 2: Realms (七大聖殿)
    └── Section 3: About (關於頁面)

App.tsx (應用程式根容器)
├── QueryClientProvider (狀態管理)
├── TooltipProvider (提示工具 Context)
├── BrowserRouter (路由系統)
│   └── Routes (頁面路由)
└── Global Fixed Components (不佔頁面空間)
    ├── Toaster (通知系統 - fixed 定位)
    └── Sonner (Toast 通知 - fixed 定位)
```

**重要說明** | Important Note:
全域通知組件（Toaster、Sonner）使用 `position: fixed` 定位，不會佔用頁面流的空間。它們被放置在路由之外，確保在所有頁面上都可用且不影響佈局。

Global notification components (Toaster, Sonner) use `position: fixed` and don't occupy page flow space. They're placed outside the router to ensure availability across all pages without affecting layout.
```

### 技術堆疊架構 | Tech Stack Architecture

```
React 18
├── Vite (建置工具)
├── TypeScript (型別系統)
├── React Router (路由管理)
├── TanStack Query (狀態管理)
├── Framer Motion (動畫系統)
└── Tailwind CSS + shadcn/ui (樣式框架)
```

---

## 🧭 導航系統 | Navigation System

### 1. 頂部導航列 (Navbar)

**位置** | Position: 固定於頁面頂部 (Fixed top)

**元件** | Component: `Navbar.tsx`

**功能** | Features:
- 固定定位，始終可見
- 顯示當前所在區塊
- 點擊導航項目平滑滾動至目標區塊
- 半透明背景與毛玻璃效果
- 響應式漢堡選單（行動裝置）

**結構** | Structure:
```tsx
<header className="fixed top-0 left-0 right-0 z-50">
  <nav>
    <Logo />
    <NavLinks>
      - Introduction (Section 0: Hero)
      - Realms (Section 1: Seven Temples)
      - About (Section 2: About Page)
    </NavLinks>
  </nav>
</header>
```

**導航配置** | Navigation Config:
```tsx
const navItems = [
  { label: "Introduction", section: 0, ariaLabel: "Navigate to hero introduction" },
  { label: "Realms", section: 1, ariaLabel: "Navigate to seven temples" },
  { label: "About", section: 2, ariaLabel: "Navigate to about section" },
];
```

**樣式特點** | Styling:
- 背景: `backdrop-blur-md` + 半透明黑色
- 高度: `h-16` (64px)
- 陰影: 底部金色光暈
- 字體: Cinzel (標題), Inter (連結)

---

### 2. 側邊滾動指示器 (ScrollNav)

**位置** | Position: 固定於右側中央 (Fixed right center)

**元件** | Component: `ScrollNav.tsx`

**功能** | Features:
- 顯示當前瀏覽進度
- 三個導航點對應三個區塊：
  - Dot 0: Introduction (Hero 區塊)
  - Dot 1: Realms (七大聖殿)
  - Dot 2: About (關於頁面)
- 點擊快速跳轉
- 當前區塊高亮顯示
- 滑鼠懸停顯示區塊名稱

**結構** | Structure:
```tsx
<aside className="fixed right-8 top-1/2 -translate-y-1/2 z-40">
  <nav>
    {sections.map((section, index) => (
      <NavDot
        active={currentSection === index}
        label={section}
        onClick={() => navigateToSection(index)}
      />
    ))}
  </nav>
</aside>
```

**樣式特點** | Styling:
- 導航點: 圓形，金色邊框
- 活動狀態: 填充金色 + 光暈效果
- 間距: `gap-4` (16px)
- 過渡: 0.3s ease

---

### 3. 鍵盤導航 (Keyboard Navigation)

**快捷鍵** | Shortcuts:
- `↓ ArrowDown`: 下一個區塊 (Introduction → Realms → About)
- `↑ ArrowUp`: 上一個區塊 (About → Realms → Introduction)
- `Space`: 下一個區塊 (與 ArrowDown 相同)

**區塊索引** | Section Indices:
- 0: Introduction (Hero)
- 1: Realms (Seven Temples)
- 2: About

**實作細節** | Implementation:
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
      e.preventDefault();
      // 滾動至目標區塊
    }
  };
  window.addEventListener("keydown", handleKeyDown);
}, [currentSection]);
```

---

## 📄 頁面區塊 | Page Sections

**區塊索引對照表** | Section Index Reference:
```
Index 0: Introduction → Hero (英雄區塊)
Index 1: Realms → Seven Temples (七大聖殿)
Index 2: About → About Page (關於頁面)
```

### Section 0: Introduction - Hero (英雄區塊)

**元件** | Component: `Hero.tsx`

**區塊 ID** | Section ID: `hero-section`

**尺寸** | Dimensions: `h-screen` (100vh)

**用途** | Purpose: 首頁歡迎區塊，展示專案主題與品牌識別

#### 🎨 視覺元素 | Visual Elements

1. **背景層** | Background Layer
   - 徑向漸層: 從深棕色到深黑色
   - 程式碼: `radial-gradient(ellipse at center, hsl(30, 20%, 8%) 0%, hsl(0, 0%, 4%) 100%)`

2. **裝飾元素** | Decorative Elements
   - 左右兩側神殿柱: 垂直金色漸層線
   - 幾何圖形: 圓形、三角形裝飾
   - 頂部光球: 金色光暈效果

3. **主要內容** | Main Content
   ```
   ┌─────────────────────────────────┐
   │     [頂部光球效果]              │
   │                                 │
   │     ALGORITHMIA                 │
   │     EXPEDITION                  │
   │     ─ ● ─                       │
   │     副標題文字                  │
   │     [CTA 按鈕]                  │
   │                                 │
   └─────────────────────────────────┘
   ```

#### 📝 文字內容 | Text Content

- **主標題** | Main Title: "ALGORITHMIA EXPEDITION"
  - 字體: Cinzel, 6xl-8xl (96-128px)
  - 顏色: 金色漸層
  - 效果: 多層陰影光暈

- **副標題** | Subtitle: "探索演算法的古老智慧，穿越七座神聖聖殿，解鎖計算思維的奧秘"
  - 字體: Inter, lg-xl (18-20px)
  - 顏色: 前景色 70% 透明度

- **CTA 按鈕** | CTA Button: "開始探索之旅 | Start Your Expedition"
  - 背景: 金色漸層
  - 圖示: Sparkles (火花)
  - 互動: Hover 光暈效果

#### 🎬 動畫效果 | Animations

1. **淡入縮放** | Fade In Scale
   ```tsx
   initial={{ opacity: 0, scale: 0.95 }}
   animate={{ opacity: 1, scale: 1 }}
   transition={{ duration: 0.8, ease: "easeOut" }}
   ```

2. **由下淡入** | Fade In Up
   ```tsx
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.8, delay: 0.3 }}
   ```

3. **持續動畫** | Continuous Animations
   - 幾何圖形脈動
   - 光球呼吸效果
   - 按鈕懸停光暈

---

### Section 1: Realms (七大聖殿)

**元件** | Component: `Realms.tsx`

**區塊 ID** | Section ID: `realms-section`

**尺寸** | Dimensions: `h-screen` (100vh)

**用途** | Purpose: 展示七個演算法領域的輪播介面

#### 🏛️ 七大聖殿內容 | Seven Realms Content

1. **搜尋聖殿** | Search Temple
   - **圖示**: 🔍 Search
   - **標題**: "搜尋聖殿 | Temple of Search"
   - **描述**: "探索線性搜尋、二元搜尋等基礎搜尋演算法的奧秘"
   - **關鍵字**: Binary Search, Linear Search, Jump Search

2. **排序聖殿** | Sorting Temple
   - **圖示**: 📊 ArrowUpDown
   - **標題**: "排序聖殿 | Temple of Sorting"
   - **描述**: "掌握快速排序、合併排序等經典排序演算法的藝術"
   - **關鍵字**: Quick Sort, Merge Sort, Heap Sort

3. **樹狀聖殿** | Tree Temple
   - **圖示**: 🌳 TreeDeciduous
   - **標題**: "樹狀聖殿 | Temple of Trees"
   - **描述**: "深入二元搜尋樹、AVL 樹等樹狀結構的智慧"
   - **關鍵字**: BST, AVL, Red-Black Tree

4. **圖論聖殿** | Graph Temple
   - **圖示**: 🔗 Network
   - **標題**: "圖論聖殿 | Temple of Graphs"
   - **描述**: "解鎖 Dijkstra、BFS、DFS 等圖論演算法的力量"
   - **關鍵字**: Dijkstra, BFS, DFS, MST

5. **動態規劃聖殿** | Dynamic Programming Temple
   - **圖示**: ⚡ Zap
   - **標題**: "動態規劃聖殿 | Temple of Dynamic Programming"
   - **描述**: "領悟分治法、記憶化等最佳化問題的精髓"
   - **關鍵字**: Memoization, Tabulation, DP

6. **貪婪聖殿** | Greedy Temple
   - **圖示**: 🎯 Target
   - **標題**: "貪婪聖殿 | Temple of Greedy"
   - **描述**: "學習局部最優解策略與貪婪演算法的應用"
   - **關鍵字**: Greedy Choice, Local Optimum

7. **回溯聖殿** | Backtracking Temple
   - **圖示**: 🔙 Undo
   - **標題**: "回溯聖殿 | Temple of Backtracking"
   - **描述**: "探索窮舉搜尋、剪枝等回溯演算法的技巧"
   - **關鍵字**: Backtracking, Pruning, N-Queens

#### 🎠 輪播設計 | Carousel Design

**結構** | Structure:
```tsx
<Carousel>
  <CarouselContent>
    {realms.map(realm => (
      <CarouselItem>
        <Card>
          <Icon />
          <Title />
          <Description />
          <Keywords />
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselNavigation>
    <Previous />
    <Next />
  </CarouselNavigation>
  <CarouselDots />
</Carousel>
```

**互動方式** | Interactions:
- 左右箭頭按鈕切換
- 底部導航點指示
- 滑動手勢支援（行動裝置）
- 鍵盤方向鍵控制（← →）

**卡片樣式** | Card Styling:
- 背景: 深色半透明
- 邊框: 金色光暈
- 圓角: `rounded-xl`
- 陰影: 多層次陰影效果
- Hover: 上升效果 + 增強光暈

---

### Section 2: About (關於頁面)

**元件** | Component: `About.tsx`

**區塊 ID** | Section ID: `about-section`

**尺寸** | Dimensions: `min-h-screen`

**用途** | Purpose: 介紹專案背景、目標與團隊資訊

#### 📖 內容結構 | Content Structure

1. **專案簡介** | Project Introduction
   - 專案願景
   - 核心價值
   - 設計理念

2. **技術亮點** | Technical Highlights
   - 使用的技術堆疊
   - 創新功能
   - 性能優化

3. **團隊資訊** | Team Information
   - 開發團隊
   - 貢獻者
   - 聯繫方式

4. **相關連結** | Related Links
   - GitHub Repository
   - 文檔連結
   - 社群資源

#### 🎨 視覺設計 | Visual Design

- **排版**: 左右對稱式佈局
- **背景**: 深色漸層 + 幾何裝飾
- **圖示**: Lucide React 圖示庫
- **強調色**: 金色點綴

---

## 🎨 視覺設計系統 | Visual Design System

### 色彩系統 | Color System

#### 主色調 | Primary Colors

```css
/* 神殿金色 - 主要強調色 */
--temple-gold: 43 74% 53%;
/* HSL: hsl(43, 74%, 53%) */
/* HEX: #D4AF37 */
/* 使用場景: 標題、按鈕、強調元素 */

/* 莎草紙色 - 次要色 */
--papyrus: 45 25% 88%;
/* 使用場景: 卡片背景、高亮文字 */

/* 青金石藍 - 裝飾色 */
--lapis: 221 83% 53%;
/* 使用場景: 連結、圖示點綴 */

/* 陶土橘 - 警示色 */
--terracotta: 14 77% 62%;
/* 使用場景: 警告、錯誤提示 */

/* 翡翠綠 - 成功色 */
--jade: 142 71% 45%;
/* 使用場景: 成功提示、完成狀態 */
```

#### 中性色 | Neutral Colors

```css
/* 背景色階 */
--background: 0 0% 4%;          /* 深黑色 */
--foreground: 0 0% 98%;         /* 近白色 */

/* 卡片與邊框 */
--card: 0 0% 8%;                /* 深灰色 */
--card-foreground: 0 0% 98%;    /* 卡片文字 */
--border: 0 0% 20%;             /* 邊框色 */

/* 互動狀態 */
--muted: 0 0% 15%;              /* 靜音/禁用 */
--accent: 43 74% 53%;           /* 強調色 */
```

### 字體系統 | Typography System

#### 字體家族 | Font Families

1. **Cinzel** - 襯線標題字體
   - 使用場景: 主標題、區塊標題、按鈕文字
   - 字重: 400 (Regular), 600 (SemiBold), 700 (Bold)
   - 特點: 古典優雅，具有神殿氛圍

2. **Inter** - 無襯線內文字體
   - 使用場景: 內文、說明文字、導航連結
   - 字重: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
   - 特點: 現代易讀，適合長文

#### 字體大小階層 | Font Size Scale

```css
/* Tailwind CSS 字體大小 */
text-xs     → 12px    /* 小型標註 */
text-sm     → 14px    /* 次要文字 */
text-base   → 16px    /* 內文基準 */
text-lg     → 18px    /* 強調內文 */
text-xl     → 20px    /* 小標題 */
text-2xl    → 24px    /* 區塊子標題 */
text-3xl    → 30px    /* 次要標題 */
text-4xl    → 36px    /* 主要標題 */
text-5xl    → 48px    /* 大標題 */
text-6xl    → 60px    /* 超大標題 */
text-7xl    → 72px    /* Hero 標題 (桌面) */
text-8xl    → 96px    /* Hero 標題 (大螢幕) */
```

### 間距系統 | Spacing System

```css
/* Tailwind CSS 間距單位 (1 單位 = 4px) */
1  → 4px      /* 極小間距 */
2  → 8px      /* 微小間距 */
4  → 16px     /* 小間距 */
6  → 24px     /* 中間距 */
8  → 32px     /* 標準間距 */
12 → 48px     /* 大間距 */
16 → 64px     /* 極大間距 */
20 → 80px     /* 區塊間距 */
24 → 96px     /* 超大間距 */
```

### 圓角系統 | Border Radius System

```css
rounded-none    → 0px       /* 無圓角 */
rounded-sm      → 2px       /* 小圓角 */
rounded         → 4px       /* 標準圓角 */
rounded-md      → 6px       /* 中圓角 */
rounded-lg      → 8px       /* 大圓角 */
rounded-xl      → 12px      /* 超大圓角 */
rounded-2xl     → 16px      /* 卡片圓角 */
rounded-full    → 9999px    /* 完全圓形 */
```

### 陰影系統 | Shadow System

#### 標準陰影 | Standard Shadows

```css
/* 小陰影 - 輕微浮起 */
shadow-sm
→ 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* 中陰影 - 明顯浮起 */
shadow-md
→ 0 4px 6px -1px rgba(0, 0, 0, 0.1)

/* 大陰影 - 顯著浮起 */
shadow-lg
→ 0 10px 15px -3px rgba(0, 0, 0, 0.1)

/* 超大陰影 - 強烈浮起 */
shadow-xl
→ 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

#### 自訂光暈陰影 | Custom Glow Shadows

```css
/* 金色光暈 - 用於強調元素 */
box-shadow: 
  0 0 30px rgba(212, 175, 55, 0.4),
  0 10px 30px rgba(0, 0, 0, 0.3);

/* 文字光暈 - 用於標題 */
text-shadow: 
  0 0 10px hsla(45, 100%, 50%, 0.8),
  0 0 20px hsla(45, 100%, 50%, 0.5),
  0 0 40px hsla(45, 100%, 50%, 0.3),
  0 0 60px hsla(45, 100%, 50%, 0.2);
```

---

## 🎭 互動機制 | Interaction Mechanisms

### 滾動行為 | Scroll Behavior

#### Snap Scrolling (吸附滾動)

```tsx
<main className="snap-y snap-mandatory overflow-y-scroll">
  <section className="snap-start snap-stop">
    {/* 區塊內容 */}
  </section>
</main>
```

**特點** | Features:
- 每個區塊自動吸附至視窗頂部
- 流暢的滾動過渡
- 防止中間停留狀態

#### Smooth Scrolling (平滑滾動)

```css
html {
  scroll-behavior: smooth;
}
```

**應用場景** | Use Cases:
- 導航連結點擊
- 鍵盤快捷鍵
- CTA 按鈕跳轉

### 滾動追蹤 | Scroll Tracking

```tsx
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100;
    const windowHeight = window.innerHeight;
    const sectionIndex = Math.round(scrollPosition / windowHeight);
    setCurrentSection(sectionIndex);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**功能** | Functionality:
- 即時追蹤當前區塊
- 更新導航指示器
- 觸發區塊切換動畫

### 鍵盤事件處理 | Keyboard Event Handling

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 檢查是否在輪播區域內
    const target = e.target as HTMLElement;
    if (target.closest('[role="region"]')) return;
    
    if (e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      navigateToNextSection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateToPrevSection();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [currentSection]);
```

**防衝突機制** | Conflict Prevention:
- 偵測 carousel 區域，避免干擾輪播導航
- 防止預設滾動行為
- 維持其他元件的鍵盤功能

### Hover 效果 | Hover Effects

#### 按鈕 Hover

```tsx
<Button className="group">
  {/* 內部光暈動畫 */}
  <div className="opacity-0 group-hover:opacity-100 transition-opacity" />
  {/* 按鈕內容 */}
</Button>
```

**效果** | Effects:
- 透明度漸變
- 光暈顯現
- 輕微縮放 (scale-105)
- 陰影增強

#### 卡片 Hover

```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.5);
}
```

**效果** | Effects:
- 上升 8px
- 金色光暈增強
- 邊框亮度提升

### 動畫時機 | Animation Timing

```tsx
// Framer Motion 動畫配置
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, delay: 0.5 }
  }
};
```

---

## 📱 響應式設計 | Responsive Design

### 斷點系統 | Breakpoint System

```css
/* Tailwind CSS 預設斷點 */
sm  → 640px    /* 小型平板 */
md  → 768px    /* 平板 */
lg  → 1024px   /* 小型桌面 */
xl  → 1280px   /* 桌面 */
2xl → 1536px   /* 大螢幕 */
```

### 響應式佈局策略 | Responsive Layout Strategy

#### 行動裝置 (< 768px)

**導航** | Navigation:
- 漢堡選單取代水平導航
- 側邊滾動指示器縮小
- CTA 按鈕文字簡化

**文字大小** | Typography:
- 主標題: `text-6xl` (60px)
- 副標題: `text-lg` (18px)
- 內文: `text-base` (16px)

**間距調整** | Spacing:
- 容器內距: `px-6` (24px)
- 區塊間距: `py-12` (48px)
- 元素間距減半

**輪播** | Carousel:
- 單欄顯示
- 滑動手勢優先
- 導航點放大

#### 平板裝置 (768px - 1024px)

**導航** | Navigation:
- 水平導航列
- 完整側邊指示器
- 標準 CTA 按鈕

**文字大小** | Typography:
- 主標題: `text-7xl` (72px)
- 副標題: `text-xl` (20px)
- 內文: `text-base` (16px)

**輪播** | Carousel:
- 單欄顯示，卡片較大
- 箭頭導航 + 滑動手勢

#### 桌面裝置 (> 1024px)

**導航** | Navigation:
- 完整導航列
- 側邊指示器帶標籤
- 完整 CTA 按鈕

**文字大小** | Typography:
- 主標題: `text-8xl` (96px)
- 副標題: `text-xl` (20px)
- 內文: `text-lg` (18px)

**輪播** | Carousel:
- 可選多欄顯示（未實作）
- 鍵盤導航強化

### 響應式圖片 | Responsive Images

```tsx
<img 
  srcSet="image-sm.jpg 640w, image-md.jpg 1024w, image-lg.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="描述"
/>
```

### 觸控優化 | Touch Optimization

```css
/* 增大觸控目標 */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* 禁用長按選單 */
.no-touch-callout {
  -webkit-touch-callout: none;
  user-select: none;
}
```

---

## ⚙️ 技術實作 | Technical Implementation

### 狀態管理 | State Management

#### 本地狀態 (useState)

```tsx
const Index = () => {
  // 當前區塊追蹤 (0: Introduction, 1: Realms, 2: About)
  const [currentSection, setCurrentSection] = useState(0);
  
  // 輪播狀態（在 Realms 元件內）
  const [activeSlide, setActiveSlide] = useState(0);
};

// 區塊名稱陣列（與導航系統同步）
const sections = ["Introduction", "Realms", "About"];
```

#### 效果管理 (useEffect)

```tsx
// 滾動監聽
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// 鍵盤監聽
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => { /* ... */ };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [currentSection]);
```

### 路由配置 | Routing Configuration

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* 全域通知組件 - 使用 fixed 定位，不佔頁面空間 */}
      {/* Global notification components - fixed positioning, no layout impact */}
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);
```

**架構說明** | Architecture Notes:
- **TooltipProvider**: Context Provider，無視覺輸出
- **Toaster & Sonner**: 固定定位於視窗邊緣，不影響文檔流
- **放置順序**: 通知組件放在路由外，確保全域可用

### 資料查詢 | Data Fetching

```tsx
// 使用 TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分鐘
      cacheTime: 1000 * 60 * 10, // 10 分鐘
    },
  },
});
```

### 主題系統 | Theme System

```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {children}
</ThemeProvider>
```

### 表單處理 | Form Handling

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("無效的電子郵件"),
  message: z.string().min(10, "訊息至少需要 10 個字元"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(formSchema),
});
```

---

## ⚡ 性能優化 | Performance Optimization

### 程式碼分割 | Code Splitting

```tsx
// 動態匯入
const Hero = lazy(() => import("@/components/Hero"));
const Realms = lazy(() => import("@/components/Realms"));
const About = lazy(() => import("@/components/About"));

<Suspense fallback={<Loading />}>
  <Hero />
</Suspense>
```

### 圖片優化 | Image Optimization

1. **使用 WebP 格式**
   - 減少 25-35% 檔案大小
   - 提供 JPEG/PNG 後備方案

2. **延遲載入**
   ```tsx
   <img loading="lazy" src="image.jpg" alt="描述" />
   ```

3. **響應式圖片**
   - 使用 `srcset` 和 `sizes`
   - 根據裝置載入適當大小

### 動畫優化 | Animation Optimization

1. **使用 CSS Transform**
   - 優先使用 `transform` 和 `opacity`
   - 觸發 GPU 加速

2. **減少重繪**
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

3. **RequestAnimationFrame**
   ```tsx
   const debouncedHandleScroll = () => {
     requestAnimationFrame(handleScroll);
   };
   ```

### 打包優化 | Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-*'],
          'animation': ['framer-motion'],
        },
      },
    },
  },
});
```

### 字體優化 | Font Optimization

```html
<!-- 預連接 Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 優化載入 -->
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 🎯 全域組件配置 | Global Components Configuration

### 通知系統定位 | Notification System Positioning

為確保全域通知組件（Toaster、Sonner）不佔用頁面空間，採用以下配置：

To ensure global notification components (Toaster, Sonner) don't occupy page space, the following configuration is used:

#### CSS 配置 | CSS Configuration

```css
/* src/index.css */

/* 確保全域通知組件不佔據頁面空間 */
/* Ensure global notification components don't take up page space */
.toaster,
[data-sonner-toaster] {
    position: fixed !important;
    pointer-events: none;
    z-index: 9999;
}

.toaster > *,
[data-sonner-toaster] > * {
    pointer-events: auto;
}

/* Toast viewport positioning */
[data-radix-toast-viewport] {
    position: fixed !important;
    z-index: 9999;
    margin: 0 !important;
    padding: 0 !important;
}
```

#### 組件層級 | Component Hierarchy

```tsx
// App.tsx 結構
<QueryClientProvider>
  <TooltipProvider>
    <BrowserRouter>
      {/* 頁面內容路由 */}
    </BrowserRouter>
    {/* 全域固定組件 - 不在路由內 */}
    <Toaster />
    <Sonner />
  </TooltipProvider>
</QueryClientProvider>
```

**關鍵點** | Key Points:
1. ✅ 使用 `position: fixed` 脫離文檔流
2. ✅ `pointer-events: none` 避免阻擋互動（子元素設為 auto）
3. ✅ `z-index: 9999` 確保顯示在最上層
4. ✅ 放置在路由外，所有頁面都可使用
5. ✅ 無 margin/padding，不影響佈局計算

---

## 🔍 無障礙設計 | Accessibility

### ARIA 標籤 | ARIA Labels

```tsx
<section aria-label="Hero introduction">
  <h1>ALGORITHMIA EXPEDITION</h1>
</section>

<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="#introduction">Introduction</a></li>
  </ul>
</nav>

<div role="region" aria-roledescription="carousel">
  {/* Carousel content */}
</div>
```

### 鍵盤導航 | Keyboard Navigation

- **Tab**: 焦點移動
- **Enter**: 啟動連結/按鈕
- **Space**: 啟動按鈕/下一區塊
- **Arrow Keys**: 區塊/輪播導航
- **Escape**: 關閉對話框/選單

### 焦點樣式 | Focus Styles

```css
*:focus-visible {
  outline: 2px solid hsl(43, 74%, 53%);
  outline-offset: 4px;
}
```

### 色彩對比 | Color Contrast

所有文字與背景的對比度符合 WCAG AA 標準：
- 正常文字: 至少 4.5:1
- 大型文字: 至少 3:1
- UI 元件: 至少 3:1

---

## 📊 資料流圖 | Data Flow Diagram

```
User Interaction
       ↓
Event Listeners (scroll, keyboard, click)
       ↓
State Update (currentSection, activeSlide)
       ↓
React Re-render
       ↓
DOM Update
       ↓
CSS Transitions / Framer Motion Animations
       ↓
Visual Feedback
```

---

## 🧪 測試策略 | Testing Strategy

### 單元測試 | Unit Tests
- 元件渲染測試
- 事件處理測試
- 狀態管理測試

### 整合測試 | Integration Tests
- 導航流程測試
- 滾動行為測試
- 輪播互動測試

### E2E 測試 | End-to-End Tests
- 使用者旅程測試
- 跨瀏覽器測試
- 響應式測試

---

## 📈 未來優化方向 | Future Enhancements

### 功能擴充 | Feature Expansion
- [ ] 多語言支援（i18n）
- [ ] 暗/亮模式切換
- [ ] 每個聖殿的獨立頁面
- [ ] 互動式演算法視覺化
- [ ] 學習進度追蹤
- [ ] 使用者帳號系統

### 效能提升 | Performance Improvements
- [ ] Service Worker 離線支援
- [ ] CDN 部署優化
- [ ] 圖片 CDN
- [ ] 預載入關鍵資源

### UX 優化 | UX Improvements
- [ ] 載入動畫
- [ ] 進度指示器
- [ ] 更細緻的微互動
- [ ] 聲音效果（可選）

---

## ⚠️ 常見問題排除 | Troubleshooting

### 問題：全域組件佔用頁面空間 | Issue: Global Components Taking Up Space

**症狀** | Symptoms:
- Toaster 或 Sonner 元件在頁面上留下空白區域
- 頁面佈局被推移或錯位

**解決方案** | Solutions:

1. **檢查 CSS 定位**
   ```css
   /* 確認這些樣式存在於 src/index.css */
   .toaster,
   [data-sonner-toaster] {
       position: fixed !important;
   }
   ```

2. **檢查組件順序**
   ```tsx
   // Toaster 應在 BrowserRouter 外部
   <BrowserRouter>...</BrowserRouter>
   <Toaster />
   <Sonner />
   ```

3. **清除瀏覽器快取**
   - 強制重新整理：Cmd/Ctrl + Shift + R
   - 清除快取並硬性重新載入

4. **檢查開發工具**
   - 使用瀏覽器檢查元素
   - 確認 `position: fixed` 已正確套用
   - 檢查是否有其他 CSS 覆蓋

### 問題：通知不顯示 | Issue: Notifications Not Showing

**檢查項目** | Checklist:
- [ ] TooltipProvider 正確包裹應用程式
- [ ] z-index 設定正確（9999）
- [ ] 沒有父元素設置 `overflow: hidden`

---

## 📝 維護指南 | Maintenance Guide

### 新增區塊 | Adding New Sections

1. 在 `src/components/` 建立新元件
2. 在 `Index.tsx` 匯入元件
3. 加入 `sections` 陣列
4. 更新 `main` 元素內容
5. 測試滾動與導航功能

### 修改樣式 | Modifying Styles

1. 檢查 `src/index.css` 全域變數
2. 優先使用 Tailwind 類別
3. 複雜樣式使用 CSS Modules
4. 維持一致的命名規範

### 更新依賴 | Updating Dependencies

```bash
# 檢查過時套件
npm outdated

# 更新到最新版本
npm update

# 特定套件更新
npm install package-name@latest
```

---

## 🎯 總結 | Summary

Algorithmia Sanctuary 首頁採用模組化、響應式的設計架構，結合古埃及神殿美學與現代 Web 技術，提供流暢、優雅的使用者體驗。透過精心設計的導航系統、視覺效果與互動機制，引導使用者探索七大演算法領域，開啟計算思維的學習之旅。

The Algorithmia Sanctuary homepage employs a modular, responsive design architecture that combines ancient Egyptian temple aesthetics with modern web technologies, delivering a smooth and elegant user experience. Through carefully designed navigation systems, visual effects, and interaction mechanisms, it guides users to explore seven algorithmic realms and embark on a journey of computational thinking.

---

**文檔版本** | Document Version: 1.0.0
**最後更新** | Last Updated: 2024
**維護者** | Maintainer: Algorithmia Team

---