import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Network, GitBranch, Scissors } from "lucide-react";

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
          <Network className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">最小生成樹核心概念</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          如何用最少的成本將所有島嶼連接起來？這就是最小生成樹要解決的問題。
        </p>
      </motion.div>

      <Tabs defaultValue="concept" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/60">
          <TabsTrigger value="concept" className="data-[state=active]:bg-primary/20">
            MST 概念
            {viewedTabs.has("concept") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="kruskal" className="data-[state=active]:bg-primary/20">
            Kruskal
            {viewedTabs.has("kruskal") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="prim" className="data-[state=active]:bg-primary/20">
            Prim
            {viewedTabs.has("prim") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="compare" className="data-[state=active]:bg-primary/20">
            比較應用
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
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">什麼是最小生成樹？</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <span className="text-primary font-semibold">生成樹 (Spanning Tree)</span>：
                  一個連通圖的子圖，包含所有頂點，但只有 <code className="px-1 bg-black/30 rounded">V-1</code> 條邊，且無環。
                </p>
                <p>
                  <span className="text-primary font-semibold">最小生成樹 (MST)</span>：
                  所有生成樹中，邊的權重總和最小的那一棵。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">核心約束：</p>
                  <ul className="space-y-1 text-sm">
                    <li>• 連通所有節點 ✓</li>
                    <li>• 恰好 V-1 條邊 ✓</li>
                    <li>• 無環 (Cycle-free) ✓</li>
                    <li>• 總權重最小 ✓</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">比喻：造橋連島</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
                    🏝️
                  </div>
                  <div>
                    <p className="font-medium">島嶼 = 節點</p>
                    <p className="text-sm text-muted-foreground">需要連接的地點</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-amber-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-2xl">
                    🌉
                  </div>
                  <div>
                    <p className="font-medium">橋樑 = 邊</p>
                    <p className="text-sm text-muted-foreground">連接兩個島嶼的通道</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div>
                    <p className="font-medium">造價 = 權重</p>
                    <p className="text-sm text-muted-foreground">建造橋樑的成本</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="kruskal" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-emerald-500/30 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-emerald-400 mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Kruskal 演算法
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-foreground/80">
                    <span className="text-emerald-400 font-semibold">貪心策略</span>：
                    從全圖最便宜的邊開始，只要不形成環就選取。
                  </p>
                  
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <p className="text-sm font-medium text-emerald-400 mb-2">核心步驟：</p>
                    <ol className="space-y-1 text-sm">
                      <li>1. 將所有邊按權重排序</li>
                      <li>2. 從最小邊開始遍歷</li>
                      <li>3. 用 Union-Find 檢測是否成環</li>
                      <li>4. 不成環則加入 MST</li>
                      <li>5. 直到選取 V-1 條邊</li>
                    </ol>
                  </div>
                  
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <p className="text-sm font-medium text-purple-400 mb-1">Union-Find</p>
                    <p className="text-xs text-muted-foreground">
                      用於快速判斷兩個節點是否已連通（同一集合）。
                      若 find(u) == find(v)，則加入邊 (u,v) 會形成環。
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-emerald-400">{`function kruskal(graph) {
  // 1. 邊按權重排序
  edges.sort((a,b) => a.weight - b.weight);
  
  let mst = [];
  for (let edge of edges) {
    // 2. Union-Find 檢測環
    if (find(edge.u) !== find(edge.v)) {
      mst.push(edge);
      union(edge.u, edge.v);
    }
    // 3. 收集滿 V-1 條邊即結束
    if (mst.length === V - 1) break;
  }
  return mst;
}`}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="prim" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-cyan-400 mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Prim 演算法
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-foreground/80">
                    <span className="text-cyan-400 font-semibold">切分性質</span>：
                    從一個起點開始，像黴菌擴散一樣，總是選擇連向「未訪問區域」中最便宜的邊。
                  </p>
                  
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <p className="text-sm font-medium text-cyan-400 mb-2">核心步驟：</p>
                    <ol className="space-y-1 text-sm">
                      <li>1. 選擇任意起點，標記為已訪問</li>
                      <li>2. 找出所有「切分邊」(Cut Edges)</li>
                      <li>3. 選擇最小權重的切分邊</li>
                      <li>4. 將新節點納入已訪問集合</li>
                      <li>5. 重複直到所有節點被訪問</li>
                    </ol>
                  </div>
                  
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <p className="text-sm font-medium text-yellow-400 mb-1">切分邊 (Cut Edge)</p>
                    <p className="text-xs text-muted-foreground">
                      連接「已訪問節點」與「未訪問節點」的邊。
                      只有切分邊才是有效的候選邊。
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-cyan-400">{`function prim(graph, start) {
  let visited = new Set([start]);
  let mst = [];
  let pq = new PriorityQueue();
  
  // 初始化：加入起點的所有邊
  for (let edge of getEdges(start)) {
    pq.add(edge);
  }
  
  while (visited.size < V) {
    let minEdge = pq.extractMin();
    let newNode = getOtherEnd(minEdge, visited);
    
    if (!visited.has(newNode)) {
      visited.add(newNode);
      mst.push(minEdge);
      // 加入新節點的邊
      for (let edge of getEdges(newNode)) {
        pq.add(edge);
      }
    }
  }
  return mst;
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
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">Kruskal vs Prim</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="py-2 px-4 text-left">特性</th>
                      <th className="py-2 px-4 text-left text-emerald-400">Kruskal</th>
                      <th className="py-2 px-4 text-left text-cyan-400">Prim</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">策略</td>
                      <td className="py-2 px-4">全局最小邊</td>
                      <td className="py-2 px-4">局部最小切分邊</td>
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">資料結構</td>
                      <td className="py-2 px-4">Union-Find</td>
                      <td className="py-2 px-4">Priority Queue</td>
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">複雜度</td>
                      <td className="py-2 px-4">O(E log E)</td>
                      <td className="py-2 px-4">O(E log V)</td>
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="py-2 px-4">適用場景</td>
                      <td className="py-2 px-4 text-green-400">稀疏圖 (E ≈ V)</td>
                      <td className="py-2 px-4 text-green-400">稠密圖 (E ≈ V²)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">生長方式</td>
                      <td className="py-2 px-4">多棵小樹合併</td>
                      <td className="py-2 px-4">單棵樹擴張</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-sm text-emerald-400 font-medium">Kruskal 適合：</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    邊數較少的稀疏圖，或需要處理已排序邊列表的場景。
                  </p>
                </div>
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-sm text-cyan-400 font-medium">Prim 適合：</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    邊數較多的稠密圖，或使用鄰接矩陣表示的圖。
                  </p>
                </div>
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
