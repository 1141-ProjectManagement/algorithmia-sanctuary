專案開發報告：Algorithmia Expedition (演算法遠征)

1. 專案提案 (Project Proposal)
   名稱：Algorithmia Expedition - 演算法遠征 標語：踏入演算法的神秘殿堂，探索古老文明遺留的智慧碎片。

本專案旨在解決傳統演算法學習枯燥、抽象且缺乏動力的問題。透過將演算法概念轉化為沈浸式的冒險遊戲，使用者在探索古文明遺跡的過程中，自然而然地理解並掌握複雜的計算邏輯。平台結合了互動式 3D 視覺化教學、即時程式碼演練與遊戲化進度系統，打造前所未有的學習體驗。

2. 專案創意 (Project Creativity)
   概念具象化：將抽象的演算法（如排序、搜尋、圖論）比喻為古代機關與魔法。例如，「泡沫排序」是如同氣泡般浮升的元素，「二元搜尋」是精準定位星圖的技藝。
   互動式視覺與 3D 體驗：由 React Three Fiber 驅動的 3D 場景，讓使用者不只是閱讀文字或看影片，而是親手「操作」演算法。
   雙重敘事線：設有「初次通關」與「二周目」劇情，鼓勵重複遊玩與深入理解，模擬像《黑帝斯》或《尼爾》般的敘事深度。
   四階段學習法：獨創 Story (情境) -> Knowledge (知識) -> Demo (演示) -> Practice (實戰) 的關卡結構，確保學習成效。
3. 專案故事 (Project Story)
   使用者扮演一名「探索者 (Explorer)」，來到一個因「計算失衡」而殞落的高科技古文明——Algorithmia。這個文明曾經利用演算法的力量建立了輝煌的數位烏托邦，但最終因為過度優化與邏輯崩潰而毀滅。

探索者必須穿越六大神殿（章節）：

起源聖殿 (Origins)：理解時間與空間的基礎（複雜度）。
秩序神殿 (Order)：重整混亂的萬物（排序與搜尋）。
迴聲神殿 (Echoes)：探索遞迴與樹狀結構的奧秘。
織徑神殿 (Paths)：連結孤立的節點（圖論）。
抉擇神殿 (Choices)：在無數可能性中做出最優解（動態規劃、貪婪）。
整合神殿 (Unity)：面對最終的系統整合挑戰。
只有解開所有謎題，修復失落的邏輯，才能揭開文明毀滅的真相，或許...避免現代世界重蹈覆徹。

4. 專案商業模式 (Business Model)
   本專案採用 Freemium (免費增值) 訂閱模式，旨在降低入門門檻同時維持高品質內容的開發。

方案名稱 價格 (月付/年付) 目標客群 包含權益
探索者 (Explorer) 免費 初學者、觀望用戶 • 解鎖第 1 章 (起源聖殿)
• 基礎 3D 視覺化體驗
• 社群討論區存取權
冒險家 (Adventurer) NT$ 399 / 月 進階學習者、轉職者 • 解鎖全章節 (1-6 章)
• 進階互動式練習題
• 學習進度追蹤儀表板
• 獲得「資深冒險家」數位徽章
演算法大師 (Master) NT$ 3,990 / 終身 專業開發者、教育機構 • 終身存取權 (含未來更新)
• 優先體驗新功能
• 專屬 Code Review 服務 (AI 輔助)
• 企業級面試題庫解鎖
• 下載離線學習教材
註：價格為範例估算，實際依市場策略調整。

5. 專案設計系統 (Design System)
   本專案採用現代與古典融合的 "Mystic Sci-Fi" 風格，結合 shadcn/ui 的簡潔與自定義的魔法特效。

色彩計畫 (Color Palette)：
主色調 (Primary): hsl(var(--primary)) - 神祕的深藍/紫色系，象徵深奧的知識。
強調色 (Accent): 金色/琥珀色 - 象徵解鎖的智慧與寶藏 (如 Pricing 卡片的金色光影)。
背景色 (Background): 深沈的黑曜石色與羊皮紙質感，適應長時間閱讀的 Dark/Light Mode。
字體系統 (Typography)：
標題：使用襯線體 (Cinzel) 營造史詩感與古典氣息。
內文/程式碼：使用高易讀性的無襯線體 (Inter) 與等寬字體，確保學習體驗。
UI 組件庫：基於 shadcn/ui 與 Radix UI，確保無障礙 (Accessibility) 與高度可客製化。大量的 Glassmorphism (毛玻璃) 效果，營造高科技與魔法交織的氛圍。
動效設計：使用 Framer Motion 製作流暢的過場與微互動 (Micro-interactions)，Three.js 負責核心算法的可視化演繹。6. 專案軟體架構 (Software Architecture)
採用現代化前端單頁應用 (SPA) 架構，強調效能與可維護性。

目錄結構：
src/stores: 全域狀態管理 (Global State)。
src/components/gate: 關卡核心邏輯模組，實現高內聚低耦合。
src/pages: 路由頁面，對應各章節與功能區。
src/config: 全域設定與主題配置。
核心模組與設計模式：
Store Pattern (Zustand): 管理跨組件狀態 (如使用者當前關卡、已解鎖成就)。
Custom Hooks: 抽離業務邏輯 (如 useGateProgress, useCodeExecution)。
Render Props / Compound Components: 在 UI 組件中提供高度靈活性。7. 前後端技術介紹 (Tech Stack)
前端 (Frontend)
框架: React 18.3 + Vite (極速開發體驗與構建)。
語言: TypeScript 5.0 (強型別保證程式碼品質)。
樣式: Tailwind CSS 3.4 (Utility-first CSS) + Tailwindcss-animate。
3D 與動畫:
React Three Fiber (Three.js): 處理 3D 場景與粒子效果。
Framer Motion: 處理 UI 轉場與豐富的互動動畫。
狀態管理: Zustand (輕量級 Redux 替代方案)。
資料獲取: TanStack Query (React Query) (Server state 管理與快取)。
路由: React Router 6。
後端與雲端 (Backend & Cloud)
BaaS 平台: Supabase (開源 Firebase 替代品)。
Database: PostgreSQL (強大的關聯式資料庫)。
Auth: 整合 Google OAuth 與 Email 登入。
Realtime: 支援即時數據更新 (如排行榜、多人協作，未來規劃)。
部署: Vercel (前端) + Supabase Cloud (後端)。
開發工具
套件管理: Bun (高效能 JavaScript Runtime & Package Manager)。
代碼規範: ESLint, Prettier。
版本控制: Git。8. 專案製作費用 (Estimated Development Costs)
以下估算基於台灣軟體開發市場行情，假設由一支 3-4 人的小型敏捷團隊進行為期 4-6 個月的開發 MVP (最小可行性產品)。

項目 內容描述 預估工時 預估費用 (NTD)
PM 與企劃 需求分析、遊戲腳本設計、關卡流程規劃 160 hrs $150,000 - $250,000
UI/UX 設計 介面設計、3D 模型與材質、Design System 240 hrs $250,000 - $400,000
前端開發 React 架構、互動邏輯、3D 整合、RWD 480 hrs $500,000 - $800,000
後端開發 資料庫設計、API 串接、Auth、金流串接 160 hrs $150,000 - $300,000
測試與部署 QA 測試、效能優化、CI/CD 架設 80 hrs $80,000 - $150,000
總計 約 4-6 個月 $1,130,000 - $1,900,000
註：實際費用視團隊資歷、外包或自建、以及具體功能細節而定。伺服器營運成本 (Supabase/Vercel) 另計，初期約 $1,000 - $3,000 NTD/月。

9. 專案後續發展 (Future Roadmap)
   階段一：社群與競賽 (Q3)
   建置「演算法競技場 (Arena)」，讓玩家即時 PK 演算法效率。
   全球排行榜系統。
   階段二：內容擴充 (Q4)
   新增「量子神殿 (Quantum Temple)」探討量子演算法入門。
   支援多語言程式碼 (Python, C++, Java) 切換。
   階段三：行動裝置適配 (Next Year Q1)
   開發 PWA 或 React Native 版本，讓學習隨身帶著走。
   階段四：職涯接軌 (Next Year Q2)
   與科技公司合作，推出「企業認證關卡」，通過即可獲得面試機會 (Recruitment integration)。
