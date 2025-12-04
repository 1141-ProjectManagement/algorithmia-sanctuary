import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Database, Zap, Layers } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set(["concept"]));

  const handleTabChange = (value: string) => {
    const newViewed = new Set(viewedTabs);
    newViewed.add(value);
    setViewedTabs(newViewed);

    if (newViewed.size >= 4) {
      onComplete();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Database className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">動態規劃核心概念</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          動態規劃就像為水晶充能——計算過的子問題會被「記憶」下來，
          避免重複計算，以空間換取時間。
        </p>
      </motion.div>

      <Tabs defaultValue="concept" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/60">
          <TabsTrigger value="concept" className="data-[state=active]:bg-primary/20">
            核心思想
            {viewedTabs.has("concept") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="knapsack" className="data-[state=active]:bg-primary/20">
            背包問題
            {viewedTabs.has("knapsack") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="transition" className="data-[state=active]:bg-primary/20">
            狀態轉移
            {viewedTabs.has("transition") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="complexity" className="data-[state=active]:bg-primary/20">
            複雜度分析
            {viewedTabs.has("complexity") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concept" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">什麼是動態規劃？</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  動態規劃 (DP) 是一種將複雜問題分解為
                  <span className="text-primary font-semibold">重疊子問題</span>
                  的演算法設計技術。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">兩大核心特性：</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Layers className="w-4 h-4 text-primary mt-0.5" />
                      <span><strong>重疊子問題：</strong>同一子問題會被多次求解</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary mt-0.5" />
                      <span><strong>最優子結構：</strong>最優解包含子問題的最優解</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">比喻：記憶水晶</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-purple-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">
                    💎
                  </div>
                  <div>
                    <p className="font-medium">水晶矩陣</p>
                    <p className="text-sm text-muted-foreground">DP 表格，每格存儲子問題答案</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-cyan-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                  <div>
                    <p className="font-medium">充能過程</p>
                    <p className="text-sm text-muted-foreground">計算並記憶子問題結果</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-amber-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-2xl">
                    🔗
                  </div>
                  <div>
                    <p className="font-medium">能量光束</p>
                    <p className="text-sm text-muted-foreground">狀態轉移的依賴關係</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="knapsack" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">0/1 背包問題</h3>
              <p className="text-foreground/80 mb-4">
                給定 N 個物品，每個有重量 w 和價值 v。背包容量為 W，求能裝入的最大價值。
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-black/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">範例輸入：</p>
                  <p className="font-mono text-sm">物品: [{`{w:2,v:3}, {w:3,v:4}, {w:4,v:5}`}]</p>
                  <p className="font-mono text-sm">容量: W = 5</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">最優解：</p>
                  <p className="font-mono text-sm">選擇物品 1 + 2</p>
                  <p className="font-mono text-sm">總重: 2+3=5, 總價值: 3+4=7</p>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                <pre className="text-green-400">{`// 動態規劃解法
function knapsack(items, capacity) {
  const n = items.length;
  const dp = Array(n+1).fill(null)
    .map(() => Array(capacity+1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (items[i-1].weight <= w) {
        dp[i][w] = Math.max(
          dp[i-1][w],  // 不選
          dp[i-1][w-items[i-1].weight] + items[i-1].value  // 選
        );
      } else {
        dp[i][w] = dp[i-1][w];  // 放不下
      }
    }
  }
  return dp[n][capacity];
}`}</pre>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="transition" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">狀態轉移方程</h3>
              
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <p className="font-mono text-lg text-center">
                  dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-medium text-red-400 mb-2">不選第 i 個物品</h4>
                  <p className="text-sm font-mono">dp[i][w] = dp[i-1][w]</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    繼承上一行的結果，容量不變
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">選第 i 個物品</h4>
                  <p className="text-sm font-mono">dp[i-1][w-weight] + value</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    扣除重量後的最優解 + 當前價值
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">視覺化理解：</p>
                <p className="text-sm">
                  每個水晶 dp[i][w] 從兩個「前置水晶」汲取能量：
                  <br/>• 正上方 dp[i-1][w]（不選當前物品）
                  <br/>• 左上方 dp[i-1][w-weight]（選當前物品）
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="complexity" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">複雜度分析</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-card/60 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-1">O(N × W)</p>
                  <p className="text-sm text-muted-foreground">時間複雜度</p>
                  <p className="text-xs mt-1">N 個物品，W 容量</p>
                </div>
                <div className="text-center p-4 bg-card/60 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-1">O(N × W)</p>
                  <p className="text-sm text-muted-foreground">空間複雜度</p>
                  <p className="text-xs mt-1">DP 表格大小</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
                <h4 className="font-medium text-yellow-400 mb-2">⚠️ 偽多項式時間</h4>
                <p className="text-sm text-foreground/80">
                  注意：O(N × W) 看起來是多項式，但 W 的大小取決於輸入數值，
                  而非輸入長度。若 W 非常大，DP 可能很慢！
                </p>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-medium text-green-400 mb-2">空間優化：滾動陣列</h4>
                <p className="text-sm font-mono mb-2">O(W) 空間</p>
                <p className="text-sm text-foreground/80">
                  由於 dp[i] 只依賴 dp[i-1]，可以只保留一行，從右往左更新。
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Progress indicator */}
      <div className="text-center text-sm text-muted-foreground">
        已瀏覽 {viewedTabs.size} / 4 個知識點
        {viewedTabs.size >= 4 && (
          <span className="text-green-500 ml-2">✓ 知識學習完成</span>
        )}
      </div>
    </div>
  );
};

export default TeachBlock;
