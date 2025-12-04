import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, SplitSquareVertical, Merge, Zap } from "lucide-react";

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
          <SplitSquareVertical className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">分治法核心概念</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          分治法將大問題分解成小問題，各個擊破後再合併——
          這是將 O(n²) 優化至 O(n log n) 的關鍵策略。
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
          <TabsTrigger value="mergesort" className="data-[state=active]:bg-primary/20">
            合併排序
            {viewedTabs.has("mergesort") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
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
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">什麼是分治法？</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  分治法 (Divide and Conquer) 是一種將複雜問題
                  <span className="text-primary font-semibold">分解</span>成
                  較小子問題的演算法設計範式。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">經典應用：</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Merge Sort 合併排序</li>
                    <li>• Quick Sort 快速排序</li>
                    <li>• Binary Search 二元搜尋</li>
                    <li>• Strassen 矩陣乘法</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">比喻：能量水晶淨化</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-red-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-2xl">
                    💎
                  </div>
                  <div>
                    <p className="font-medium">巨大能量球</p>
                    <p className="text-sm text-muted-foreground">太大無法直接處理</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-blue-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div>
                    <p className="font-medium">分裂成碎片</p>
                    <p className="text-sm text-muted-foreground">直到每片可單獨處理</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                    🌟
                  </div>
                  <div>
                    <p className="font-medium">有序融合</p>
                    <p className="text-sm text-muted-foreground">合併成完美的金色能量球</p>
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
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">分治三步驟</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                  <div className="text-3xl mb-2">1️⃣</div>
                  <h4 className="font-medium text-blue-400 mb-1">Divide 分解</h4>
                  <p className="text-sm">將問題分成子問題</p>
                  <code className="text-xs bg-black/30 px-2 py-1 rounded mt-2 block">
                    mid = (left + right) / 2
                  </code>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <div className="text-3xl mb-2">2️⃣</div>
                  <h4 className="font-medium text-green-400 mb-1">Conquer 解決</h4>
                  <p className="text-sm">遞迴解決子問題</p>
                  <code className="text-xs bg-black/30 px-2 py-1 rounded mt-2 block">
                    sort(left) + sort(right)
                  </code>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
                  <div className="text-3xl mb-2">3️⃣</div>
                  <h4 className="font-medium text-primary mb-1">Combine 合併</h4>
                  <p className="text-sm">合併子問題的解</p>
                  <code className="text-xs bg-black/30 px-2 py-1 rounded mt-2 block">
                    merge(left, right)
                  </code>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                <pre className="text-green-400">{`function divideAndConquer(problem) {
  // Base Case: 問題夠小，直接解決
  if (problem.size <= 1) return solve(problem);
  
  // Divide: 分解
  const [left, right] = split(problem);
  
  // Conquer: 遞迴解決
  const leftResult = divideAndConquer(left);
  const rightResult = divideAndConquer(right);
  
  // Combine: 合併結果 ⭐
  return merge(leftResult, rightResult);
}`}</pre>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="mergesort" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4 flex items-center gap-2">
                <Merge className="w-5 h-5" />
                Merge Sort 合併排序
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-card/60 rounded-lg">
                  <h4 className="font-medium mb-2">執行流程</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">1.</span>
                      <span>將陣列從中間切成兩半</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">2.</span>
                      <span>遞迴排序左半部和右半部</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">3.</span>
                      <span>將兩個已排序的陣列合併</span>
                    </li>
                  </ol>
                </div>
                <div className="p-4 bg-card/60 rounded-lg">
                  <h4 className="font-medium mb-2">合併的關鍵</h4>
                  <p className="text-sm text-foreground/80 mb-2">
                    兩個已排序的陣列，只需比較各自的<span className="text-primary">最小元素</span>，
                    取較小者放入結果陣列。
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-500/20 rounded">[1,3,5]</span>
                    <span className="px-2 py-1 bg-green-500/20 rounded">[2,4,6]</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-2 py-1 bg-primary/20 rounded">[1,2,3,4,5,6]</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                <pre className="text-yellow-400">{`function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {  // ⭐ 關鍵比較
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  // 處理剩餘元素
  return [...result, ...left.slice(i), ...right.slice(j)];
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
                <Zap className="w-5 h-5" />
                時間複雜度分析
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-card/60 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-1">O(n log n)</p>
                  <p className="text-sm text-muted-foreground">Merge Sort</p>
                  <p className="text-xs mt-1">log n 層 × 每層 n 次操作</p>
                </div>
                <div className="text-center p-4 bg-card/60 rounded-lg">
                  <p className="text-3xl font-bold text-red-400 mb-1">O(n²)</p>
                  <p className="text-sm text-muted-foreground">Bubble Sort</p>
                  <p className="text-xs mt-1">n 輪 × 每輪最多 n 次比較</p>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                <h4 className="font-medium text-green-400 mb-2">為何分治更快？</h4>
                <ul className="text-sm space-y-2 text-foreground/80">
                  <li>
                    <span className="text-green-400">✓</span> 每次分割問題規模減半 → 只需 <code className="bg-black/30 px-1 rounded">log₂n</code> 層
                  </li>
                  <li>
                    <span className="text-green-400">✓</span> 每層處理總共 n 個元素
                  </li>
                  <li>
                    <span className="text-green-400">✓</span> 總運算：<code className="bg-black/30 px-1 rounded">n × log n</code>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-card/60 rounded-lg">
                <h4 className="font-medium mb-2">數據對比 (n = 1,000,000)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">O(n²):</p>
                    <p className="text-red-400 font-bold">1,000,000,000,000 次</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">O(n log n):</p>
                    <p className="text-green-400 font-bold">≈ 20,000,000 次</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  分治法快了約 50,000 倍！
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
