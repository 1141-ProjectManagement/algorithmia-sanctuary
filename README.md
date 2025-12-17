# 🏛️ Algorithmia Expedition - 演算法遠征

> 踏入演算法的神秘殿堂，探索古老文明遺留的智慧碎片

**Algorithmia Expedition** 是一個以古代神殿探險為主題的遊戲化演算法學習平台。使用者扮演「探索者」角色，透過互動式挑戰穿越六個神秘領域，解鎖演算法的奧秘。

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.181-000000?style=flat-square&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-2.87-3ECF8E?style=flat-square&logo=supabase)

---

## ✨ 核心特色 | Key Features

### 🎮 遊戲化學習體驗

- **沉浸式敘事**：每個章節都有獨特的古文明故事背景，將抽象概念具象化。
- **漸進式解鎖**：完成關卡解鎖下一個挑戰，建立成就感。
- **視覺化回饋**：3D 動畫即時呈現演算法執行過程，讓邏輯可視化。

### 📚 結構化課程設計

每個關卡遵循 **四階段學習流程**：

1. **故事卷軸** - 情境引入，建立學習動機
2. **知識卷軸** - 核心概念與複雜度分析教學
3. **互動演示** - 3D 視覺化操作探索，親手實驗演算法
4. **實戰挑戰** - 程式碼修復與邏輯驗證，鞏固所學

### 🌟 3D 互動視覺化

- 使用 Three.js (R3F) 打造沉浸式 3D 場景
- 演算法操作直接映射為視覺效果（如：排序時的元素交換、圖論中的節點連接）
- 即時程式碼編輯器同步視覺變化

---

## � 快速開始 | Getting Started

### 環境需求 | Prerequisites

- Node.js 16+
- **Bun** (本專案使用 Bun 作為套件管理器)

### 1. 安裝與設置 | Installation

```bash
# 複製專案
git clone <YOUR_GIT_URL>
cd algorithmia-expedition

# 安裝依賴
bun install
```

### 2. 環境變數 | Environment Setup

請在專案根目錄建立 `.env.local` 檔案，並填入以下 Supabase 配置：

```env
VITE_SUPABASE_URL=https://uslkpijmsudubulkuxve.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
```

> 若無 Supabase 金鑰，部分後端功能（登入、進度存檔）將無法使用，但仍可瀏覽前端頁面。

### 3. 啟動應用 | Run Application

```bash
# 啟動開發伺服器
bun run dev
```

開發伺服器將在 `http://localhost:5173` 啟動。

### 常用指令 | Available Scripts

| 指令              | 說明             |
| ----------------- | ---------------- |
| `bun run dev`     | 啟動開發伺服器   |
| `bun run build`   | 建構生產版本     |
| `bun run preview` | 預覽生產版本     |
| `bun run lint`    | 執行 ESLint 檢查 |

---

## �🗺️ 章節地圖 | Chapter Map

本課程共分為六大章節，總計 28 個關卡。

### 第一章：起源聖殿 (Origins)

> 基礎資料結構與複雜度分析

- **Gate 1**: 時間量測 (Big-O)
- **Gate 2**: 容器之道 (Array & Linked List)
- **Gate 3**: 堆疊之塔 (Stack)
- **Gate 4**: 佇列之門 (Queue)
- **Gate 5**: 線性搜尋 (Linear Search)

### 第二章：秩序神殿 (Order)

> 排序與搜尋演算法

- **Gate 1**: 泡泡與交換之池 (Bubble/Insertion Sort)
- **Gate 2**: 分治殿堂 (Merge/Quick Sort)
- **Gate 3**: 折半星圖 (Binary Search)
- **Gate 4**: 映射密室 (Hash Table)
- **Gate 5**: 滑動之窗 (Sliding Window)

### 第三章：迴聲神殿 (Echoes)

> 樹狀結構與遞迴

- **Gate 1**: 遍歷之森 (Tree Traversal)
- **Gate 2**: 搜尋聖樹 (Binary Search Tree)
- **Gate 3**: 堆積神壇 (Heap)
- **Gate 4**: 霍夫曼密碼 (Huffman Coding)
- **Gate 5**: 雙指針之道 (Two Pointers)

### 第四章：織徑神殿 (Paths)

> 圖論演算法

- **Gate 1**: 圖之基石 (Graph Basics)
- **Gate 2**: 連接之橋 (DFS/BFS & MST)
- **Gate 3**: 最短捷徑 (Dijkstra)
- **Gate 4**: 任務排序 (Topological Sort)
- **Gate 5**: 全域路網 (Floyd-Warshall)

### 第五章：抉擇神殿 (Choices)

> 進階演算法策略

- **Gate 1**: 貪婪試煉 (Greedy Algorithm)
- **Gate 2**: 水晶矩陣 (Dynamic Programming)
- **Gate 3**: 回溯迷宮 (Backtracking)
- **Gate 4**: 分治戰場 (Divide & Conquer)

### 第六章：整合神殿 (Unity)

> 綜合應用與挑戰

- **Gate 1**: 群組聖約 (Union-Find)
- **Gate 2**: 位元聖典 (Bit Manipulation)
- **Gate 3**: 命運骰子 (Randomized Algorithms)
- **Gate 4**: 終極審判 (Boss Challenge)

---

## 🛠️ 技術堆疊 | Tech Stack

### 核心框架 (Core)

- **React 18.3** + **Vite**
- **TypeScript 5.0**
- **React Router 6**

### 視覺體驗 (Visuals)

- **Three.js** (via React Three Fiber)
- **Framer Motion 12**
- **Tailwind CSS 3.4**
- **shadcn/ui** & **Radix UI**

### 資料與狀態 (Data & State)

- **Zustand 5** (全域狀態)
- **TanStack Query 5** (非同步資料)
- **Supabase** (Auth & Database)

---

## 📁 專案結構 | Project Structure

```
src/
├── assets/              # 靜態資源 (Images, Icons)
├── components/
│   ├── ui/              # shadcn/ui 基礎組件
│   ├── gate/            # 關卡通用框架 (Story, Teach, Section)
│   ├── chapterX-gateY/  # 各關卡專屬邏輯與視圖
│   ├── About.tsx        # 關於頁面
│   ├── Hero.tsx         # 首頁與著陸頁
│   └── ...
├── config/              # 全域配置 (Themes, Constants)
├── hooks/               # Custom Hooks (Auth, Progress, Toast)
├── integrations/        # 外部服務 (Supabase Client)
├── lib/                 # 工具函式 (Utils, Formatters)
├── pages/               # 路由頁面 (Hubs, Gates, Dashboard)
└── stores/              # Zustand Stores (各演算法邏輯狀態)
```

---

## 開發文檔 | Documentation

更多詳細的開發與整合資訊，請參考 `/docs` 目錄：

| 文檔                                                                  | 說明                             |
| --------------------------------------------------------------------- | -------------------------------- |
| **[SUPABASE_QUICK_REFERENCE.md](./docs/SUPABASE_QUICK_REFERENCE.md)** | API 速查、表結構、常用 Hook 索引 |
| **[SUPABASE_INTEGRATION.md](./docs/SUPABASE_INTEGRATION.md)**         | 完整的後端整合技術指南           |
| **[HOOKS_AND_SUPABASE.md](./docs/HOOKS_AND_SUPABASE.md)**             | React Hook 使用範例與最佳實踐    |

---

## 🔐 系統機制 | System Mechanics

### 使用者系統

- 支援 Email 與 Google OAuth 登入
- **開發者密技**：輸入 `ABAB` 密鑰可直接解鎖所有關卡。

### 古籍碎片 (Lore System)

- 每個關卡包含 **初次通關** 與 **二周目** 兩套劇情文本。
- 只有完成所有挑戰的探索者，才能拼湊出演算法文明衰落的完整真相。

---

## 🤝 貢獻指南 | Contributing

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 授權 | License

Project released under the [MIT License](LICENSE).

<div align="center">
  <br />
  <p><b>🏛️ 願演算法的智慧與你同在 | May the Wisdom of Algorithms Be With You</b></p>
  <p>Made with ❤️ by the Algorithmia Team</p>
</div>
