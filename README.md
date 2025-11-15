# Algorithmia Sanctuary - 演算法聖殿

歡迎來到演算法聖殿！一個神秘的演算法學習之旅。

Welcome to Algorithmia Sanctuary! A mystical journey through algorithmic wisdom.

---

## 🌟 專案簡介 | Project Overview

**Algorithmia Sanctuary** 是一個沉浸式的演算法學習平台，以古老神殿為主題，將演算法知識融入七大領域（七座聖殿），提供視覺化、互動式的學習體驗。

**Algorithmia Sanctuary** is an immersive algorithmic learning platform themed around ancient temples. It integrates algorithmic knowledge into seven realms (seven temples), providing a visual and interactive learning experience.

### ✨ 核心特色 | Key Features

- 🏛️ **七座神聖聖殿** - 七個演算法領域的沉浸式探索
- 🎨 **精美視覺設計** - 古埃及風格的 UI/UX 設計
- ⚡ **流暢動畫效果** - 使用 Framer Motion 打造絲滑體驗
- 🎯 **響應式設計** - 完美適配所有裝置尺寸
- 🌙 **深色主題** - 神秘優雅的暗色調界面

---

## 🚀 快速開始 | Quick Start

### 前置需求 | Prerequisites

確保您已安裝以下工具：
- **Node.js** (v16 或更高版本) - [使用 nvm 安裝](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** 或 **bun** 套件管理器

Make sure you have installed:
- **Node.js** (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager

### 安裝步驟 | Installation Steps

```bash
# 步驟 1: 克隆專案 | Clone the repository
git clone <YOUR_GIT_URL>

# 步驟 2: 進入專案目錄 | Navigate to project directory
cd algorithmia-sanctuary

# 步驟 3: 安裝依賴套件 | Install dependencies
npm install
# 或使用 bun | or use bun
bun install

# 步驟 4: 啟動開發伺服器 | Start development server
npm run dev
# 或使用 bun | or use bun
bun dev
```

開發伺服器將在 `http://localhost:5173` 啟動

Development server will start at `http://localhost:5173`

---

## 📁 專案結構 | Project Structure

```
algorithmia-sanctuary/
├── src/
│   ├── components/          # React 元件
│   │   ├── Hero.tsx        # 首頁英雄區塊
│   │   ├── Realms.tsx      # 七大聖殿輪播
│   │   ├── About.tsx       # 關於頁面
│   │   ├── Navbar.tsx      # 導航列
│   │   ├── ScrollNav.tsx   # 滾動導航指示器
│   │   └── ui/             # shadcn/ui 元件庫
│   ├── pages/              # 頁面元件
│   │   ├── Index.tsx       # 主頁面
│   │   └── NotFound.tsx    # 404 頁面
│   ├── lib/                # 工具函式庫
│   ├── hooks/              # 自訂 React Hooks
│   ├── App.tsx             # 主應用程式元件
│   └── main.tsx            # 應用程式入口點
├── public/                 # 靜態資源
├── index.html              # HTML 模板
└── package.json            # 專案依賴配置
```

---

## 🛠️ 可用指令 | Available Scripts

| 指令 | 說明 | Command | Description |
|------|------|---------|-------------|
| `npm run dev` | 啟動開發伺服器 | `npm run dev` | Start development server |
| `npm run build` | 建置生產版本 | `npm run build` | Build for production |
| `npm run build:dev` | 建置開發版本 | `npm run build:dev` | Build development version |
| `npm run preview` | 預覽生產建置 | `npm run preview` | Preview production build |
| `npm run lint` | 執行 ESLint 檢查 | `npm run lint` | Run ESLint checks |

---

## 🎨 技術堆疊 | Tech Stack

### 核心技術 | Core Technologies
- ⚛️ **React 18** - UI 框架
- 📘 **TypeScript** - 型別安全的 JavaScript
- ⚡ **Vite** - 快速建置工具
- 🎭 **Framer Motion** - 動畫庫

### UI/UX 框架 | UI/UX Frameworks
- 🎨 **Tailwind CSS** - 實用優先的 CSS 框架
- 🧩 **shadcn/ui** - 可重用的 UI 元件
- 🎯 **Radix UI** - 無樣式的可訪問元件
- 🌙 **next-themes** - 主題切換支援

### 狀態管理與路由 | State Management & Routing
- 🔄 **TanStack Query** - 資料獲取與快取
- 🗺️ **React Router** - 客戶端路由
- 📋 **React Hook Form** - 表單管理
- ✅ **Zod** - 模式驗證

### 圖示與字體 | Icons & Fonts
- 🎯 **Lucide React** - 圖示庫
- ✍️ **Cinzel** - 標題字體（古典風格）
- 📝 **Inter** - 內文字體（現代易讀）

---

## 🏛️ 七大聖殿領域 | Seven Sacred Realms

1. **🔍 搜尋聖殿** - Search Temple
   - 探索各種搜尋演算法的奧秘

2. **📊 排序聖殿** - Sorting Temple
   - 掌握資料排序的藝術

3. **🌳 樹狀聖殿** - Tree Temple
   - 深入樹狀結構的智慧

4. **🔗 圖論聖殿** - Graph Temple
   - 解鎖圖論演算法的力量

5. **⚡ 動態規劃聖殿** - Dynamic Programming Temple
   - 領悟最佳化問題的精髓

6. **🎯 貪婪聖殿** - Greedy Temple
   - 學習局部最優的策略

7. **🔙 回溯聖殿** - Backtracking Temple
   - 探索窮舉搜尋的技巧

---

## 🎯 使用指南 | User Guide

### 導航方式 | Navigation Methods

1. **滾輪滾動** | Scroll Wheel
   - 使用滑鼠滾輪自然滾動瀏覽各個區塊

2. **鍵盤快捷鍵** | Keyboard Shortcuts
   - `↓` 或 `Space` - 下一個區塊
   - `↑` - 上一個區塊

3. **側邊導航指示器** | Side Navigation Indicator
   - 點擊右側的導航點快速跳轉

4. **頂部導航列** | Top Navigation Bar
   - 點擊導航列項目直接前往指定區塊

### 頁面區塊 | Page Sections

- **Introduction** - 首頁英雄區塊，展示專案主題
- **Realms** - 七大聖殿輪播展示
- **About** - 關於專案的詳細資訊

---

## 🔧 開發指南 | Development Guide

### 編輯方式 | Editing Options

#### 1️⃣ 使用 Lovable 平台 | Using Lovable Platform
直接訪問 [Lovable 專案](https://lovable.dev/projects/5af35f9b-db77-4dd6-b062-f2e3ecc00db4) 並開始提示編輯。

Simply visit the [Lovable Project](https://lovable.dev/projects/5af35f9b-db77-4dd6-b062-f2e3ecc00db4) and start prompting.

#### 2️⃣ 本地 IDE 開發 | Local IDE Development
使用您喜愛的 IDE（如 VS Code）進行本地開發，推送更改會自動同步到 Lovable。

Use your preferred IDE (like VS Code) for local development. Pushed changes will sync to Lovable automatically.

#### 3️⃣ GitHub 直接編輯 | Direct GitHub Editing
在 GitHub 上直接編輯文件，適合快速修改。

Edit files directly on GitHub for quick changes.

#### 4️⃣ GitHub Codespaces
使用雲端開發環境，無需本地設定。

Use cloud development environment without local setup.

### 新增元件 | Adding Components

使用 shadcn/ui CLI 新增 UI 元件：

```bash
npx shadcn-ui@latest add [component-name]
```

### 自訂樣式 | Custom Styling

專案使用自訂的主題顏色，定義在 `src/index.css`：

```css
--temple-gold: 43 74% 53%     /* 神殿金色 */
--papyrus: 45 25% 88%          /* 莎草紙色 */
--lapis: 221 83% 53%           /* 青金石藍 */
--terracotta: 14 77% 62%       /* 陶土橘 */
--jade: 142 71% 45%            /* 翡翠綠 */
```

---

## 📦 部署 | Deployment

### 使用 Lovable 部署 | Deploy with Lovable

1. 打開 [Lovable 專案](https://lovable.dev/projects/5af35f9b-db77-4dd6-b062-f2e3ecc00db4)
2. 點擊 **Share** → **Publish**
3. 完成！您的網站已發布

### 自訂網域 | Custom Domain

要連接自訂網域：
1. 前往 **Project** > **Settings** > **Domains**
2. 點擊 **Connect Domain**
3. 按照指示完成設定

詳細資訊：[設定自訂網域](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🎨 設計理念 | Design Philosophy

### 視覺風格 | Visual Style
- **古埃及神殿主題** - 以神秘的古文明為靈感
- **金色調配色** - 使用金色作為主要強調色
- **深色背景** - 營造神秘莊嚴的氛圍
- **幾何裝飾** - 圓形、三角形等幾何元素點綴

### 互動體驗 | Interactive Experience
- **流暢動畫** - 細膩的頁面過渡效果
- **視覺回饋** - Hover 狀態與互動提示
- **無障礙設計** - 鍵盤導航與螢幕閱讀器支援

---

## 🤝 貢獻 | Contributing

歡迎貢獻！請遵循以下步驟：

Contributions are welcome! Please follow these steps:

1. Fork 此專案 | Fork the project
2. 建立功能分支 | Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 提交更改 | Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 | Push to the branch (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request | Open a Pull Request

---

## 📄 授權 | License

本專案採用 MIT 授權條款。

This project is licensed under the MIT License.

---

## 🔗 相關連結 | Related Links

- **專案網址** | Project URL: [https://lovable.dev/projects/5af35f9b-db77-4dd6-b062-f2e3ecc00db4](https://lovable.dev/projects/5af35f9b-db77-4dd6-b062-f2e3ecc00db4)
- **文檔** | Documentation: [Lovable Docs](https://docs.lovable.dev)
- **Vite 文檔** | Vite Docs: [https://vitejs.dev](https://vitejs.dev)
- **React 文檔** | React Docs: [https://react.dev](https://react.dev)
- **shadcn/ui** | shadcn/ui: [https://ui.shadcn.com](https://ui.shadcn.com)

---

## 📞 支援 | Support

如有問題或建議，請透過以下方式聯繫：

For questions or suggestions, please contact:

- 開啟 GitHub Issue | Open a GitHub Issue
- 訪問 Lovable 專案頁面 | Visit the Lovable Project Page

---

## 🙏 致謝 | Acknowledgments

感謝所有開源專案的貢獻者，讓這個專案得以實現。

Thanks to all open-source contributors who made this project possible.

- Lovable 平台 | Lovable Platform
- React 社群 | React Community
- shadcn/ui 專案 | shadcn/ui Project
- Tailwind CSS 團隊 | Tailwind CSS Team

---

<div align="center">
  
**✨ 開始您的演算法探索之旅 ✨**

**Start Your Algorithmic Expedition**

Made with ❤️ by the Algorithmia Team

</div>