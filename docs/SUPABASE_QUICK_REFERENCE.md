# Supabase 快速參考 | Quick Reference

> 適合 AI Agent 快速索引的簡潔文檔

## 🎯 核心資料表結構

### profiles (使用者資料)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  nickname TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### progress (進度追蹤)
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  chapter_id INTEGER,
  gate_id INTEGER,
  completed BOOLEAN,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, chapter_id, gate_id)
);
```

### master_keys (密鑰系統)
```sql
CREATE TABLE master_keys (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  key_code TEXT,
  unlocked_all BOOLEAN,
  created_at TIMESTAMP
);
```

---

## 🔐 認證系統

### 使用者登入流程
1. Google OAuth 登入 → Supabase Auth
2. 自動建立/取得 Profile
3. 初始化使用者狀態
4. 重定向至首頁

### 關鍵 API
```typescript
// 認證函數
import { signInWithGoogle, signOut, getSession, getProfile } from "@/lib/auth";

// 登入
await signInWithGoogle();

// 登出
await signOut();

// 取得會話
const session = await getSession();

// 取得個人資料
const profile = await getProfile(userId);
```

---

## 📊 進度追蹤

### 儲存進度
```typescript
import { saveProgress } from "@/lib/auth";

await saveProgress(userId, chapterId, gateId);
// 建立/更新 progress 記錄
```

### 查詢進度
```typescript
// 查詢特定章節進度
const chapterProgress = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .eq('chapter_id', chapterId);

// 查詢完成的所有關卡
const completedGates = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .eq('completed', true);
```

### 進度計算
```typescript
// 計算完成百分比
const completed = completedGates.length;
const total = 28; // 總關卡數
const percentage = (completed / total) * 100;
```

---

## 🔓 密鑰系統

### 主密鑰
- **密鑰代碼**: `ABAB`
- **功能**: 一次解鎖所有 28 個關卡
- **儲存**: master_keys 表格

### 解鎖流程
```typescript
import { unlockWithMasterKey } from "@/lib/auth";

const result = await unlockWithMasterKey(userId, keyCode);
if (result.success) {
  // 為該使用者創建所有 28 個進度記錄
  // 設置 unlocked_all = true
}
```

### 檢查是否已解鎖
```typescript
const masterKey = await supabase
  .from('master_keys')
  .select('unlocked_all')
  .eq('user_id', userId)
  .single();

if (masterKey.data?.unlocked_all) {
  // 顯示所有關卡
}
```

---

## 📁 Hook 快速索引

| Hook | 功能 | 傳回值 |
|------|------|--------|
| `useAuth()` | 認證狀態管理 | `{ user, session, loading }` |
| `useChapterProgress()` | 進度追蹤 | `{ progress, saveProgress, loading }` |
| `useGateNavigation()` | 導航邏輯 | `{ canAccess, nextGate, prevGate }` |
| `use-mobile()` | 設備偵測 | `isMobile: boolean` |
| `use-toast()` | 通知系統 | `toast({ title, description })` |

### 使用範例

```typescript
// 認證 Hook
const { user, session } = useAuth();
if (!user) {
  return <AuthModal />;
}

// 進度 Hook
const { progress, saveProgress } = useChapterProgress();
const handleGateComplete = async () => {
  await saveProgress(chapterId, gateId);
};

// 導航 Hook
const { canAccess } = useGateNavigation();
if (!canAccess(chapterId, gateId)) {
  return <LockedGate />;
}
```

---

## ⚙️ 環境配置

在 `.env.local` 中設置：

```bash
VITE_SUPABASE_URL=https://uslkpijmsudubulkuxve.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
```

### 初始化客戶端
```typescript
// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 🔍 常見查詢

### 查詢使用者的所有進度
```typescript
const { data: allProgress } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### 查詢特定關卡的完成狀態
```typescript
const { data: gateProgress } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .eq('chapter_id', chapterId)
  .eq('gate_id', gateId)
  .single();

const isCompleted = gateProgress?.completed ?? false;
```

### 統計已完成關卡數
```typescript
const { data: completed } = await supabase
  .from('progress')
  .select('id', { count: 'exact' })
  .eq('user_id', userId)
  .eq('completed', true);

const count = completed?.length ?? 0;
```

### 查詢未完成的關卡
```typescript
const { data: incomplete } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId)
  .eq('completed', false)
  .order('chapter_id', { ascending: true });
```

---

## 🛡️ 安全性檢查清單

- ✅ 使用 RLS (Row Level Security) 保護資料
- ✅ 環境變數存儲敏感資訊
- ✅ 驗證使用者身份再進行操作
- ✅ 使用 Supabase 內置認證而非自行實現
- ✅ 定期更新 Supabase 客戶端庫

---

## 🚨 常見問題排查

| 問題 | 原因 | 解決方案 |
|------|------|---------|
| 無法登入 | API 金鑰錯誤或過期 | 檢查 .env.local 配置 |
| 進度未儲存 | RLS 政策限制 | 確認 user_id 匹配 |
| Session 丟失 | Token 過期 | 清除 localStorage 重新登入 |
| 查詢返回空 | 使用者不存在 | 確認 user_id 正確 |

---

## 📖 詳細文檔

- **SUPABASE_INTEGRATION.md** - 完整技術參考
- **HOOKS_AND_SUPABASE.md** - Hook 實戰指南
- **README.md** - 專案總覽

---

**版本**: 1.0 | **更新**: 2025-12-11

