import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Waves, ArrowDownToLine } from "lucide-react";

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
          <Waves className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">圖論遍歷核心概念</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          探索網絡的兩種方式：像水波層層擴散的 BFS，或像探險家深入迷宮的 DFS。
        </p>
      </motion.div>

      <Tabs defaultValue="concept" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/60">
          <TabsTrigger value="concept" className="data-[state=active]:bg-primary/20">
            核心概念
            {viewedTabs.has("concept") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="bfs" className="data-[state=active]:bg-primary/20">
            BFS 波紋術
            {viewedTabs.has("bfs") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="dfs" className="data-[state=active]:bg-primary/20">
            DFS 深淵術
            {viewedTabs.has("dfs") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="compare" className="data-[state=active]:bg-primary/20">
            對比應用
            {viewedTabs.has("compare") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concept" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">什麼是圖遍歷？</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  圖遍歷 (Graph Traversal) 是系統性地訪問圖中每個節點的過程。
                  就像探索一座城市的所有街道，我們需要策略來確保
                  <span className="text-primary font-semibold">不遺漏、不重複</span>。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">核心問題：</p>
                  <ul className="space-y-1 text-sm">
                    <li>• 從起點出發，如何訪問所有可達節點？</li>
                    <li>• 訪問順序如何影響結果？</li>
                    <li>• 如何避免在有環圖中無限循環？</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">兩種探索策略</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Waves className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-400">BFS 廣度優先</p>
                    <p className="text-sm text-muted-foreground">先探索所有鄰居，再探索鄰居的鄰居</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-red-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <ArrowDownToLine className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-red-400">DFS 深度優先</p>
                    <p className="text-sm text-muted-foreground">選一條路走到底，撞牆再回頭</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="bfs" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-blue-400 mb-4 flex items-center gap-2">
                <Waves className="w-5 h-5" />
                BFS - 廣度優先搜尋
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-foreground/80">
                    BFS 使用 <span className="text-blue-400 font-semibold">Queue (佇列)</span> 來管理待訪問節點。
                    像投石入水的波紋，<span className="text-primary">層層向外擴散</span>。
                  </p>
                  
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-sm font-medium text-blue-400 mb-2">Queue 特性：FIFO (先進先出)</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-blue-500/20 rounded">1</span>
                      <span className="px-2 py-1 bg-blue-500/20 rounded">2</span>
                      <span className="px-2 py-1 bg-blue-500/20 rounded">3</span>
                      <span className="text-muted-foreground">→ 出口</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">適用場景：</p>
                    <ul className="space-y-1">
                      <li>• 最短路徑（無權圖）</li>
                      <li>• 社交網絡好友推薦</li>
                      <li>• 網頁爬蟲層級抓取</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-blue-400">{`function BFS(start) {
  let queue = [start];
  let visited = new Set([start]);
  
  while (queue.length > 0) {
    let node = queue.shift(); // 取隊首
    process(node);
    
    for (let neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // 加入隊尾
      }
    }
  }
}`}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="dfs" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-red-400 mb-4 flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5" />
                DFS - 深度優先搜尋
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-foreground/80">
                    DFS 使用 <span className="text-red-400 font-semibold">Stack (堆疊)</span> 或遞迴來管理路徑。
                    像迷宮探險家，<span className="text-primary">一路走到底再回頭</span>。
                  </p>
                  
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <p className="text-sm font-medium text-red-400 mb-2">Stack 特性：LIFO (後進先出)</p>
                    <div className="flex flex-col items-start gap-1 text-sm">
                      <span className="px-2 py-1 bg-red-500/20 rounded">3 ← 頂部 (先出)</span>
                      <span className="px-2 py-1 bg-red-500/20 rounded">2</span>
                      <span className="px-2 py-1 bg-red-500/20 rounded">1</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">適用場景：</p>
                    <ul className="space-y-1">
                      <li>• 迷宮路徑探索</li>
                      <li>• 拓撲排序</li>
                      <li>• 檢測圖中是否有環</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-red-400">{`function DFS(start) {
  let stack = [start];
  let visited = new Set([start]);
  
  while (stack.length > 0) {
    let node = stack.pop(); // 取棧頂
    process(node);
    
    for (let neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor); // 壓入棧頂
      }
    }
  }
}`}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">BFS vs DFS 對比</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="py-2 px-4 text-left">特性</th>
                      <th className="py-2 px-4 text-left text-blue-400">BFS</th>
                      <th className="py-2 px-4 text-left text-red-400">DFS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">資料結構</td>
                      <td className="py-2 px-4">Queue (FIFO)</td>
                      <td className="py-2 px-4">Stack (LIFO)</td>
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">探索順序</td>
                      <td className="py-2 px-4">層級擴散</td>
                      <td className="py-2 px-4">深入回溯</td>
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">最短路徑</td>
                      <td className="py-2 px-4 text-green-400">✓ 保證最短</td>
                      <td className="py-2 px-4 text-muted-foreground">✗ 不保證</td>
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">記憶體使用</td>
                      <td className="py-2 px-4">較高 (存整層)</td>
                      <td className="py-2 px-4">較低 (存路徑)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">時間複雜度</td>
                      <td className="py-2 px-4">O(V + E)</td>
                      <td className="py-2 px-4">O(V + E)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400 font-medium mb-1">⚠️ 重要提醒</p>
                <p className="text-sm text-foreground/80">
                  兩種演算法都需要 <code className="px-1 bg-black/30 rounded">visited</code> 集合來避免重複訪問，
                  否則在有環圖中會陷入無限循環！
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
