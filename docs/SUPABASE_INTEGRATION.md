# Supabase 整合指南

> 完整的技術參考文檔 - AI Agent 友好版本

**快速跳轉**: [快速參考](./SUPABASE_QUICK_REFERENCE.md) | [Hook 實戰指南](./HOOKS_AND_SUPABASE.md)

---

## 核心概述

**Supabase** 提供：
- 🔐 Google OAuth 認證
- 👤 使用者資料管理 (profiles 表)
- 📊 進度追蹤 (progress 表)
- 🔓 密鑰解鎖系統 (master_keys 表)
- 🔐 RLS 行級安全保護

**Project ID**: `uslkpijmsudubulkuxve`

---

## 認證系統

### Google OAuth 登入
```typescript
import { signInWithGoogle, signOut, getSession } from "@/lib/auth";

// 登入
const { error } = await signInWithGoogle();

// 登出
await signOut();

// 取得會話
const session = await getSession();
```

### 會話管理
- **自動持久化**: Session 儲存在 `localStorage`
- **自動刷新**: Token 過期時自動更新
- **即時監聽**: 通過 `onAuthStateChange` 偵測狀態變化

---

## 資料表結構

### profiles (使用者資料)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**API**:
```typescript
import { getProfile, updateProfileNickname } from "@/lib/auth";

// 取得使用者資料
const profile = await getProfile(userId);

// 更新暱稱
await updateProfileNickname(userId, "新暱稱");
```

---

### progress (進度追蹤)
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  chapter_id TEXT NOT NULL,
  gate_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  teach_completed BOOLEAN DEFAULT FALSE,
  demo_completed BOOLEAN DEFAULT FALSE,
  test_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, chapter_id, gate_id)
);

CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_chapter ON progress(chapter_id);
```

**主要欄位**:
- `chapter_id` / `gate_id`: 關卡位置
- `completed`: 整個關卡是否完成
- `teach_completed`: 知識卷軸是否完成
- `demo_completed`: 互動演示是否完成
- `test_completed`: 實戰挑戰是否完成

**API**:
```typescript
import { 
  saveProgress, 
  saveSectionProgress, 
  getProgress 
} from "@/lib/auth";

// 儲存分項進度
await saveSectionProgress(userId, "chapter1", "gate1", "teach");
await saveSectionProgress(userId, "chapter1", "gate1", "demo");
await saveSectionProgress(userId, "chapter1", "gate1", "test");

// 儲存整體進度
await saveProgress(userId, "chapter1", "gate1", true);

// 查詢進度
const chapterProgress = await getProgress(userId, "chapter1");
```

---

### master_keys (密鑰解鎖)
```sql
CREATE TABLE master_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  key_code TEXT NOT NULL,
  unlocked_all BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);
```

**密鑰系統**:
- 主密鑰: `ABAB`
- 功能: 一次解鎖所有 28 個關卡
- 使用流程: 登入前輸入 → 登入後驗證

**API**:
```typescript
import { 
  setMasterKeyPending, 
  getPendingMasterKey, 
  unlockAllGates 
} from "@/lib/auth";

// 登入前: 儲存待驗證的密鑰
setMasterKeyPending("ABAB");

// 登入後: useAuth Hook 自動呼叫 getPendingMasterKey()
// 如果密鑰正確，自動呼叫 unlockAllGates()

// 手動解鎖
await unlockAllGates(userId);
```

---

## useAuth() Hook

**主要認證管理 Hook**:

```typescript
import { useAuth } from "@/hooks/useAuth";

const {
  user,              // Supabase User 物件
  session,           // 當前會話
  profile,           // 使用者資料
  isLoading,         // 初始化是否完成
  isAuthenticated,   // 是否已登入
  logout             // 登出函數
} = useAuth();
```

**特點**:
- 監聽 Supabase 認證狀態變化
- 自動取得並更新使用者資料
- 處理通關密鑰 (OAuth 後自動驗證)
- 提供統一的認證接口

---

## useChapterProgress() Hook

**進度管理 Hook**:

```typescript
import { useChapterProgress } from "@/hooks/useChapterProgress";

const {
  progress,              // 當前章節所有進度
  updateGateProgress,    // 更新整體進度
  updateSectionProgress, // 更新分項進度
  isLoading,            // 是否正在載入
  error                 // 錯誤訊息
} = useChapterProgress("chapter1");

// 使用範例
await updateSectionProgress("gate1", "teach");
await updateGateProgress("gate1", true);
```

**運作機制**:
1. 已登入 → 從 Supabase 讀取
2. 未登入 → 從 localStorage 讀取
3. 自動同步更新

---

## 環境配置

### .env.local
```bash
VITE_SUPABASE_URL=https://uslkpijmsudubulkuxve.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
```

### 客戶端初始化
```typescript
// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

---

## 常見查詢模式

### 查詢使用者所有進度
```typescript
const { data } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### 查詢特定關卡
```typescript
const { data } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .eq('chapter_id', 'chapter1')
  .eq('gate_id', 'gate1')
  .single();
```

### 統計已完成關卡
```typescript
const { data } = await supabase
  .from('progress')
  .select('id', { count: 'exact' })
  .eq('user_id', userId)
  .eq('completed', true);

const completedCount = data?.length ?? 0;
const percentage = (completedCount / 28) * 100;
```

### 查詢未完成的關卡
```typescript
const { data } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .eq('completed', false);
```

---

## 安全性

### RLS 政策
```sql
-- 使用者只能讀取自己的資料
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

-- 使用者只能插入/更新自己的資料
CREATE POLICY "Users can manage own progress"
  ON progress FOR INSERT, UPDATE
  WITH CHECK (auth.uid() = user_id);
```

### 最佳實踐
- ✅ 只在環境變數中儲存 API 金鑰
- ✅ 使用 Publishable Key (Public 金鑰)
- ✅ 保護 Service Role Key
- ✅ 啟用 RLS 保護資料
- ✅ 驗證使用者身份再操作

---

## 故障排除

| 問題 | 原因 | 解決方案 |
|------|------|---------|
| 無法登入 | API 金鑰錯誤 | 檢查 .env.local 配置 |
| 進度未儲存 | RLS 限制 | 確認 user_id 匹配 |
| Session 丟失 | Token 過期 | 清除 localStorage 重新登入 |
| 查詢返回空 | 使用者不存在 | 確認 user_id 正確 |
| 密鑰無效 | 密鑰格式錯誤 | 確認是 `ABAB` (區分大小寫) |

---

## 支援的章節和關卡

```typescript
// 總計 28 個關卡
const ALL_GATES = [
  { chapter: "chapter1", gates: 5 },  // gate1-5
  { chapter: "chapter2", gates: 5 },  // gate1-5
  { chapter: "chapter3", gates: 5 },  // gate1-5
  { chapter: "chapter4", gates: 5 },  // gate1-5
  { chapter: "chapter5", gates: 4 },  // gate1-4
  { chapter: "chapter6", gates: 4 },  // gate1-4
];
```

---

## 相關資源

- **[快速參考](./SUPABASE_QUICK_REFERENCE.md)** - 快速查找和索引
- **[Hook 實戰指南](./HOOKS_AND_SUPABASE.md)** - 詳細的 Hook 用法
- **[Supabase 官方文檔](https://supabase.com/docs)** - 完整參考
- **[Supabase JS 客戶端](https://supabase.com/docs/reference/javascript)** - API 文檔

---

**版本**: 1.0 | **更新**: 2025-12-11

