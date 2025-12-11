# Hooks 和 Supabase 整合指南

> React Hooks 實戰開發指南 - AI Agent 友好版本

**快速跳轉**: [快速參考](./SUPABASE_QUICK_REFERENCE.md) | [整合指南](./SUPABASE_INTEGRATION.md)

---

## useAuth() Hook

**認證管理的主要 Hook**

```typescript
import { useAuth } from "@/hooks/useAuth";

const {
  user,              // Supabase User 物件 | null
  session,           // 當前會話 | null
  profile,           // 使用者資料 | null
  isLoading,         // 初始化是否完成
  isAuthenticated,   // 是否已登入
  logout             // 登出函數
} = useAuth();
```

### 使用範例

```typescript
// 檢查登入狀態
function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <AuthModal />;

  return <GameContent />;
}

// 顯示使用者資訊
function UserProfile() {
  const { profile } = useAuth();

  return (
    <div>
      <h1>歡迎, {profile?.nickname}!</h1>
      <p>郵箱: {profile?.email}</p>
    </div>
  );
}

// 登出
function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      登出
    </button>
  );
}
```

### 特點

- ✅ 監聽 Supabase 認證狀態變化
- ✅ 自動取得使用者資料 (profiles)
- ✅ 處理通關密鑰 (OAuth 後自動驗證)
- ✅ Session 自動持久化和刷新
- ✅ 提供統一的認證接口

---

## useChapterProgress() Hook

**章節進度管理**

```typescript
import { useChapterProgress } from "@/hooks/useChapterProgress";

const {
  progress,              // 當前章節的所有關卡進度陣列
  updateGateProgress,    // (gateId, completed) => Promise
  updateSectionProgress, // (gateId, section) => Promise
  isLoading,            // 是否正在載入
  error                 // 錯誤訊息
} = useChapterProgress("chapter1");
```

### 使用範例

```typescript
// 儲存分項進度 (教學/演示/測試)
function TeachSection() {
  const { updateSectionProgress } = useChapterProgress("chapter1");

  const handleTeachComplete = async () => {
    await updateSectionProgress("gate1", "teach");
    toast.success("教學完成！");
  };

  return <button onClick={handleTeachComplete}>完成教學</button>;
}

// 儲存整體進度
function GateComplete() {
  const { updateGateProgress } = useChapterProgress("chapter1");

  const handleGateComplete = async () => {
    await updateGateProgress("gate1", true);
    toast.success("關卡完成！");
  };

  return <button onClick={handleGateComplete}>完成關卡</button>;
}

// 查詢進度
function ProgressDisplay() {
  const { progress } = useChapterProgress("chapter1");

  return (
    <div>
      {progress.map((gate) => (
        <div key={gate.gate_id}>
          <h3>{gate.gate_id}</h3>
          <p>已完成: {gate.completed ? "✓" : "✗"}</p>
          <p>教學: {gate.teach_completed ? "✓" : "✗"}</p>
          <p>演示: {gate.demo_completed ? "✓" : "✗"}</p>
          <p>測試: {gate.test_completed ? "✓" : "✗"}</p>
        </div>
      ))}
    </div>
  );
}
```

### 特點

- ✅ 自動區分登入/未登入狀態
- ✅ 登入: 從 Supabase 讀取
- ✅ 未登入: 從 localStorage 讀取
- ✅ 自動同步更新
- ✅ 分項進度追蹤 (teach/demo/test)

---

## useGateNavigation() Hook

**關卡導航和解鎖邏輯**

```typescript
import { useGateNavigation } from "@/hooks/useGateNavigation";

const {
  canAccess,         // (chapterId, gateId) => boolean
  nextGate,          // { chapter, gate } | null
  prevGate,          // { chapter, gate } | null
  isUnlocked,        // 是否已解鎖 (密鑰系統)
  progress           // 進度資訊
} = useGateNavigation();
```

### 使用範例

```typescript
// 檢查是否可以進入關卡
function GateCard({ chapterId, gateId }) {
  const { canAccess } = useGateNavigation();

  if (!canAccess(chapterId, gateId)) {
    return <LockedGateCard />;
  }

  return <UnlockedGateCard />;
}

// 導航到下一個關卡
function NextGateButton() {
  const { nextGate } = useGateNavigation();

  if (!nextGate) return null;

  return (
    <Link to={`/chapter${nextGate.chapter}/gate${nextGate.gate}`}>
      下一個關卡
    </Link>
  );
}

// 檢查密鑰解鎖狀態
function UnlockedAllGates() {
  const { isUnlocked } = useGateNavigation();

  if (isUnlocked) {
    return <p>✓ 所有關卡已解鎖</p>;
  }

  return <p>輸入密鑰來解鎖</p>;
}
```

---

## 其他 Hooks

### use-mobile.tsx
```typescript
import { useIsMobile } from "@/hooks/use-mobile";

const isMobile = useIsMobile();

// 根據設備調整 UI
if (isMobile) {
  return <MobileLayout />;
}
return <DesktopLayout />;
```

### use-toast.ts
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

// 顯示通知
toast({
  title: "成功",
  description: "進度已保存",
  variant: "default"
});

// 顯示錯誤
toast({
  title: "錯誤",
  description: "保存失敗，請重試",
  variant: "destructive"
});
```

---

## 常見使用模式

### 模式 1: 完成關卡後自動導航
```typescript
async function handleGateComplete() {
  const { updateGateProgress } = useChapterProgress(chapterId);
  const { nextGate } = useGateNavigation();

  // 儲存進度
  await updateGateProgress(gateId, true);
  
  // 顯示成功訊息
  toast.success("關卡完成！");

  // 延遲後導航
  setTimeout(() => {
    if (nextGate) {
      navigate(`/chapter${nextGate.chapter}/gate${nextGate.gate}`);
    }
  }, 1500);
}
```

### 模式 2: 需要登入才能保存進度
```typescript
async function saveSectionProgress(section: "teach" | "demo" | "test") {
  const { isAuthenticated } = useAuth();
  const { updateSectionProgress } = useChapterProgress(chapterId);

  if (!isAuthenticated) {
    toast({
      title: "請先登入",
      description: "登入後才能保存進度",
      variant: "default"
    });
    return;
  }

  try {
    await updateSectionProgress(gateId, section);
    toast.success("進度已保存");
  } catch (error) {
    toast({
      title: "錯誤",
      description: "保存進度失敗",
      variant: "destructive"
    });
  }
}
```

### 模式 3: 導航前檢查解鎖狀態
```typescript
function NavigateToGate({ chapterId, gateId }) {
  const { canAccess } = useGateNavigation();

  const handleNavigate = () => {
    if (!canAccess(chapterId, gateId)) {
      toast({
        title: "此關卡已鎖定",
        description: "請先完成前面的關卡",
        variant: "default"
      });
      return;
    }

    navigate(`/chapter${chapterId}/gate${gateId}`);
  };

  return <button onClick={handleNavigate}>進入</button>;
}
```

---

## 最佳實踐

### ✅ DO

```typescript
// 1. 在頂層組件使用 useAuth
function App() {
  const { isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return <MainApp />;
}

// 2. 正確使用進度 Hook
function Chapter() {
  const { progress, updateGateProgress } = useChapterProgress("chapter1");
  
  const handleComplete = async () => {
    await updateGateProgress("gate1", true);
  };

  return <GateList progress={progress} onComplete={handleComplete} />;
}

// 3. 在導航前檢查權限
function GateRoute() {
  const { canAccess } = useGateNavigation();
  
  if (!canAccess(chapter, gate)) {
    return <Redirect to="/home" />;
  }
  
  return <GateContent />;
}
```

### ❌ DON'T

```typescript
// 1. 避免在每個組件重複初始化 useAuth
function BadComponent1() {
  const { user } = useAuth(); // ❌ 重複
}

function BadComponent2() {
  const { user } = useAuth(); // ❌ 重複
}

// 2. 避免在迴圈中使用 Hook
function BadProgress() {
  {progress.map(() => {
    const { updateGateProgress } = useChapterProgress(chapter); // ❌ 錯誤
  })}
}

// 3. 避免忘記檢查 isLoading
function BadAuth() {
  const { user } = useAuth();
  return <div>{user.name}</div>; // ❌ user 可能是 null
}
```

---

## 實戰流程

### 完整的關卡完成流程

```typescript
function GatePage({ chapterId, gateId }) {
  // 1. 認證檢查
  const { isAuthenticated, profile } = useAuth();
  
  // 2. 進度管理
  const { progress, updateSectionProgress, updateGateProgress } = 
    useChapterProgress(chapterId);
  
  // 3. 導航邏輯
  const { canAccess, nextGate } = useGateNavigation();
  
  // 4. 檢查權限
  if (!canAccess(chapterId, gateId)) {
    return <LockedGate />;
  }

  // 5. 獲取當前進度
  const gateProgress = progress.find(p => p.gate_id === gateId);

  // 6. 完成教學
  const handleTeachComplete = async () => {
    if (isAuthenticated) {
      await updateSectionProgress(gateId, "teach");
    }
    setTeachCompleted(true);
  };

  // 7. 完成演示
  const handleDemoComplete = async () => {
    if (isAuthenticated) {
      await updateSectionProgress(gateId, "demo");
    }
    setDemoCompleted(true);
  };

  // 8. 完成測試
  const handleTestComplete = async () => {
    if (isAuthenticated) {
      await updateGateProgress(gateId, true);
    }
    setTestCompleted(true);
    
    // 9. 導航到下一個關卡
    if (nextGate) {
      setTimeout(() => {
        navigate(`/chapter${nextGate.chapter}/gate${nextGate.gate}`);
      }, 1500);
    }
  };

  return (
    <GateContainer>
      <StorySection />
      <TeachSection onComplete={handleTeachComplete} />
      <DemoSection onComplete={handleDemoComplete} />
      <TestSection onComplete={handleTestComplete} />
      {nextGate && <NextGateButton nextGate={nextGate} />}
    </GateContainer>
  );
}
```

---

## 相關資源

- **[快速參考](./SUPABASE_QUICK_REFERENCE.md)** - API 快速查詢
- **[整合指南](./SUPABASE_INTEGRATION.md)** - 技術細節
- **[README.md](../README.md)** - 專案總覽

---

**版本**: 1.0 | **更新**: 2025-12-11

