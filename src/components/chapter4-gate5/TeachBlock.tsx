import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const concepts = [
    {
      icon: Eye,
      title: "全知之眼",
      description: "Floyd-Warshall 計算所有節點對之間的最短路徑，一次解決所有問題",
      detail: "不像 Dijkstra 只處理單源最短路徑，Floyd-Warshall 輸出一個完整的距離矩陣"
    },
    {
      icon: Layers,
      title: "中轉站思維",
      description: "核心思想：嘗試每個節點作為中間跳板，看看能否縮短任意兩點距離",
      detail: "D[i][j] = min(D[i][j], D[i][k] + D[k][j])"
    },
    {
      icon: Clock,
      title: "O(V³) 代價",
      description: "三重迴圈的威力與代價——k、i、j 各遍歷所有節點",
      detail: "適合稠密圖和需要全部路徑的場景，大規模圖請三思"
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Core Formula */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/30"
      >
        <h3 className="text-xl font-['Cinzel'] text-primary mb-4">狀態轉移方程式</h3>
        <div className="font-mono text-lg md:text-xl text-foreground bg-black/30 p-4 rounded-lg">
          D[i][j] = min( D[i][j], D[i][k] + D[k][j] )
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          對於每個中間節點 k，檢查從 i 經過 k 到 j 是否比直接走更短
        </p>
      </motion.div>

      {/* Concept Cards */}
      <div className="grid gap-4">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <concept.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{concept.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{concept.description}</p>
                <code className="text-xs bg-black/30 px-2 py-1 rounded text-primary">
                  {concept.detail}
                </code>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Algorithm Pseudocode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/40 rounded-lg p-4 border border-border"
      >
        <h4 className="text-sm font-semibold text-primary mb-3">演算法結構</h4>
        <pre className="text-xs md:text-sm font-mono text-muted-foreground overflow-x-auto">
{`for k from 0 to V-1:        // 嘗試每個中轉站
  for i from 0 to V-1:      // 遍歷所有起點
    for j from 0 to V-1:    // 遍歷所有終點
      if D[i][k] + D[k][j] < D[i][j]:
        D[i][j] = D[i][k] + D[k][j]  // 鬆弛`}
        </pre>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
      >
        <h4 className="text-sm font-semibold text-amber-400 mb-2">💡 動態規劃的精髓</h4>
        <p className="text-sm text-muted-foreground">
          Floyd-Warshall 是動態規劃的經典應用。每一層 k 的結果都基於上一層計算的最優解，
          逐步構建出全局最優解。這就是「全知之眼」能看透一切的原因。
        </p>
      </motion.div>

      {/* Comparison with Dijkstra */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 gap-4 text-center"
      >
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-sm font-semibold text-blue-400">Dijkstra</div>
          <div className="text-xs text-muted-foreground mt-1">單源最短路徑</div>
          <div className="text-xs text-muted-foreground">O(V² log V)</div>
          <div className="text-xs text-muted-foreground">無法處理負權重</div>
        </div>
        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="text-sm font-semibold text-primary">Floyd-Warshall</div>
          <div className="text-xs text-muted-foreground mt-1">全對最短路徑</div>
          <div className="text-xs text-muted-foreground">O(V³)</div>
          <div className="text-xs text-muted-foreground">可處理負權重（無負環）</div>
        </div>
      </motion.div>

      <Button
        onClick={handleComplete}
        className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
      >
        {completed ? <Check className="w-4 h-4 mr-2" /> : null}
        {completed ? "已完成" : "我理解了，開始挑戰"}
      </Button>
    </div>
  );
};

export default TeachBlock;
