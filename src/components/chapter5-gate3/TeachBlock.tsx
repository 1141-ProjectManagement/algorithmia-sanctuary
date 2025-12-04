import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, RotateCcw, GitBranch, Scissors } from "lucide-react";

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
          <RotateCcw className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">回溯法核心概念</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          回溯法就像走迷宮——當走進死胡同時，回到上一個路口重新選擇，
          直到找到出口或窮盡所有可能。
        </p>
      </motion.div>

      <Tabs defaultValue="concept" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/60">
          <TabsTrigger value="concept" className="data-[state=active]:bg-primary/20">
            核心思想
            {viewedTabs.has("concept") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="steps" className="data-[state=active]:bg-primary/20">
            三步驟
            {viewedTabs.has("steps") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="pruning" className="data-[state=active]:bg-primary/20">
            剪枝優化
            {viewedTabs.has("pruning") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="complexity" className="data-[state=active]:bg-primary/20">
            複雜度
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
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">什麼是回溯法？</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  回溯法 (Backtracking) 是一種系統性搜索所有可能解的演算法。
                  它透過<span className="text-primary font-semibold">遞迴</span>
                  逐步構建候選解，並在發現當前路徑無法得到有效解時，
                  <span className="text-red-400 font-semibold">回退</span>到前一步。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">經典應用場景：</p>
                  <ul className="space-y-1 text-sm">
                    <li>• N 皇后問題</li>
                    <li>• 數獨求解</li>
                    <li>• 迷宮路徑搜尋</li>
                    <li>• 排列組合生成</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">比喻：時光迷宮</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
                    🚶
                  </div>
                  <div>
                    <p className="font-medium">選擇岔路</p>
                    <p className="text-sm text-muted-foreground">在每個節點選擇一條路徑</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-red-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-2xl">
                    🚫
                  </div>
                  <div>
                    <p className="font-medium">撞牆死胡同</p>
                    <p className="text-sm text-muted-foreground">發現約束條件不滿足</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-amber-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-2xl">
                    ⏪
                  </div>
                  <div>
                    <p className="font-medium">時間倒流</p>
                    <p className="text-sm text-muted-foreground">回退到上一個選擇點重試</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="steps" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">回溯三步驟</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                  <div className="text-3xl mb-2">1️⃣</div>
                  <h4 className="font-medium text-blue-400 mb-1">Choose 選擇</h4>
                  <p className="text-sm">做出一個選擇</p>
                  <code className="text-xs bg-black/30 px-2 py-1 rounded mt-2 block">
                    board[row][col] = 'Q'
                  </code>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <div className="text-3xl mb-2">2️⃣</div>
                  <h4 className="font-medium text-green-400 mb-1">Explore 探索</h4>
                  <p className="text-sm">遞迴探索下一層</p>
                  <code className="text-xs bg-black/30 px-2 py-1 rounded mt-2 block">
                    backtrack(row + 1)
                  </code>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                  <div className="text-3xl mb-2">3️⃣</div>
                  <h4 className="font-medium text-amber-400 mb-1">Un-choose 撤銷</h4>
                  <p className="text-sm">恢復狀態重試</p>
                  <code className="text-xs bg-black/30 px-2 py-1 rounded mt-2 block">
                    board[row][col] = '.'
                  </code>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                <pre className="text-green-400">{`function backtrack(state) {
  if (isGoal(state)) {
    recordSolution();
    return;
  }
  
  for (choice of getChoices(state)) {
    if (isValid(choice)) {
      make(choice);        // 1. Choose
      backtrack(newState); // 2. Explore
      undo(choice);        // 3. Un-choose ⭐
    }
  }
}`}</pre>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="pruning" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                剪枝 (Pruning)
              </h3>
              
              <p className="text-foreground/80 mb-4">
                剪枝是優化回溯的關鍵——當發現當前路徑<span className="text-red-400">必定無解</span>時，
                立即停止探索，不再浪費時間深入。
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-medium text-red-400 mb-2">❌ 無剪枝</h4>
                  <p className="text-sm">盲目搜索所有路徑</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    即使已經違反約束，仍繼續探索子節點
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">✓ 有剪枝</h4>
                  <p className="text-sm">提前終止無效分支</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    一旦違反約束，立即回溯不再深入
                  </p>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                <pre className="text-yellow-400">{`// N 皇后的剪枝：檢查是否安全
function isValid(board, row, col) {
  // 檢查同一列
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 'Q') return false;
  }
  
  // 檢查對角線 ← 關鍵剪枝條件！
  for (let i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 'Q') return false;
  }
  for (let i = row-1, j = col+1; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 'Q') return false;
  }
  
  return true;
}`}</pre>
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
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                時間複雜度
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-card/60 rounded-lg">
                  <p className="text-3xl font-bold text-red-400 mb-1">O(b^d)</p>
                  <p className="text-sm text-muted-foreground">最壞情況</p>
                  <p className="text-xs mt-1">b=分支因子, d=深度</p>
                </div>
                <div className="text-center p-4 bg-card/60 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-1">O(n!)</p>
                  <p className="text-sm text-muted-foreground">N 皇后問題</p>
                  <p className="text-xs mt-1">n! 種排列方式</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
                <h4 className="font-medium text-yellow-400 mb-2">⚠️ 指數爆炸</h4>
                <p className="text-sm text-foreground/80">
                  回溯法的複雜度通常是指數級的。N=8 的皇后問題有 92 組解，
                  但演算法可能需要檢查數千萬種狀態！
                </p>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-medium text-green-400 mb-2">剪枝的威力</h4>
                <p className="text-sm text-foreground/80">
                  好的剪枝策略可以將搜索空間從 O(n^n) 降低到 O(n!)，
                  甚至更低。這就是為什麼<span className="text-primary">約束條件</span>如此重要！
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
