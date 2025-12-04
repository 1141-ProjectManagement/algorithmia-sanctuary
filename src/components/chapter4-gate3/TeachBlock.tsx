import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Navigation, Zap, AlertTriangle } from "lucide-react";

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
          <Navigation className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">Dijkstra 演算法</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          如何找到星際航行的最短路線？Dijkstra 演算法用貪婪策略逐步確定每個星球的最短距離。
        </p>
      </motion.div>

      <Tabs defaultValue="concept" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/60">
          <TabsTrigger value="concept" className="data-[state=active]:bg-primary/20">
            核心概念
            {viewedTabs.has("concept") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="algorithm" className="data-[state=active]:bg-primary/20">
            演算法步驟
            {viewedTabs.has("algorithm") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="relaxation" className="data-[state=active]:bg-primary/20">
            鬆弛操作
            {viewedTabs.has("relaxation") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="limitation" className="data-[state=active]:bg-primary/20">
            限制與應用
            {viewedTabs.has("limitation") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concept" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">單源最短路徑</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <span className="text-primary font-semibold">Dijkstra 演算法</span>
                  解決的問題是：從一個起點出發，找到到達所有其他節點的最短路徑。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">核心思想：</p>
                  <ul className="space-y-1 text-sm">
                    <li>• 維護一個「已確定最短距離」的集合</li>
                    <li>• 每次從未確定的節點中選距離最小的</li>
                    <li>• 透過該節點更新其鄰居的距離</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">比喻：星際導航</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
                    🌟
                  </div>
                  <div>
                    <p className="font-medium">星球 = 節點</p>
                    <p className="text-sm text-muted-foreground">每個目的地</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-purple-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">
                    🛸
                  </div>
                  <div>
                    <p className="font-medium">航線 = 邊</p>
                    <p className="text-sm text-muted-foreground">連接兩個星球的路徑</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-amber-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-2xl">
                    ⏱️
                  </div>
                  <div>
                    <p className="font-medium">航行時間 = 權重</p>
                    <p className="text-sm text-muted-foreground">穿越該航線的代價</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="algorithm" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">演算法流程</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <p className="font-medium">初始化距離</p>
                        <p className="text-sm text-muted-foreground">起點距離 = 0，其他 = ∞</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <p className="font-medium">取出最小距離節點</p>
                        <p className="text-sm text-muted-foreground">從優先佇列中取出</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <p className="font-medium">鬆弛鄰居節點</p>
                        <p className="text-sm text-muted-foreground">嘗試更新更短的路徑</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <div>
                        <p className="font-medium">標記為已確定</p>
                        <p className="text-sm text-muted-foreground">該節點最短距離已鎖定</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                      <div>
                        <p className="font-medium">重複直到完成</p>
                        <p className="text-sm text-muted-foreground">直到所有節點都確定</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-primary">{`function dijkstra(graph, source) {
  // 1. 初始化
  distances[source] = 0;
  pq.add(source, 0);
  
  while (!pq.isEmpty()) {
    // 2. 取最小
    let u = pq.extractMin();
    
    if (visited[u]) continue;
    visited[u] = true;
    
    // 3. 鬆弛鄰居
    for (let [v, weight] of graph[u]) {
      let newDist = distances[u] + weight;
      if (newDist < distances[v]) {
        distances[v] = newDist;
        pq.add(v, newDist);
      }
    }
  }
}`}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="relaxation" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-amber-500/30 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-amber-400 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                鬆弛操作 (Relaxation)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-foreground/80">
                    鬆弛是 Dijkstra 的核心操作：檢查經過中轉點是否能找到更短的路徑。
                  </p>
                  
                  <div className="p-4 bg-amber-500/10 rounded-lg">
                    <p className="font-medium text-amber-400 mb-2">鬆弛公式</p>
                    <code className="text-lg">
                      if (dist[u] + w(u,v) &lt; dist[v])
                    </code>
                    <p className="text-sm text-muted-foreground mt-2">
                      如果經過 u 到達 v 的距離比目前記錄的更短，就更新它！
                    </p>
                  </div>

                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-green-400 font-medium">比喻：發現捷徑</p>
                    <p className="text-xs text-muted-foreground">
                      原本從 A 直飛到 C 要 10 小時，但發現經過 B 中轉只要 7 小時，
                      那就更新 C 的最短距離為 7！
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-amber-400">{`// 鬆弛操作
function relax(u, v, weight) {
  // u: 當前節點
  // v: 鄰居節點  
  // weight: 邊的權重
  
  let newDistance = distances[u] + weight;
  
  // ⭐ 核心判斷：新路徑更短嗎？
  if (newDistance < distances[v]) {
    distances[v] = newDistance;
    previous[v] = u;  // 記錄前驅
    pq.enqueue(v, newDistance);
  }
}`}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="limitation" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">限制與複雜度</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="font-medium text-red-400">重要限制</span>
                  </div>
                  <p className="text-sm">
                    Dijkstra <strong>不能處理負權重邊</strong>！
                    因為貪婪選擇假設「已確定的節點不會再被更新」，
                    但負權重會打破這個假設。
                  </p>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-400">時間複雜度</span>
                  </div>
                  <p className="text-sm">
                    使用優先佇列：<strong>O((V + E) log V)</strong><br/>
                    使用簡單陣列：O(V²)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-primary">常見應用</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["GPS 導航", "網路路由", "遊戲 AI 尋路", "社交網絡"].map(app => (
                    <div key={app} className="p-2 bg-card/60 rounded text-center text-sm">
                      {app}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                <p className="text-sm text-purple-400 font-medium">延伸學習</p>
                <p className="text-xs text-muted-foreground">
                  對於負權重邊，可以使用 <strong>Bellman-Ford</strong> 演算法。
                  對於所有節點對之間的最短路徑，可以使用 <strong>Floyd-Warshall</strong>。
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
