import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Swords, Shield, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    icon: Swords,
    title: "階段一：秩序打擊",
    subtitle: "Sorting & Searching",
    description: "面對混亂的數據碎片，需要使用排序與搜尋演算法。Merge Sort 的合併邏輯、Binary Search 的中點計算是關鍵。",
    algorithms: ["Merge Sort", "Quick Sort", "Binary Search"],
    complexity: "O(n log n) / O(log n)",
  },
  {
    icon: Shield,
    title: "階段二：路徑連結",
    subtitle: "Graph Theory",
    description: "能量節點散落，需要使用圖論演算法重建連結。掌握 Dijkstra 的鬆弛操作與 Prim 的貪婪選擇。",
    algorithms: ["Dijkstra", "Prim's MST", "BFS/DFS"],
    complexity: "O(E log V)",
  },
  {
    icon: Brain,
    title: "階段三：終極優化",
    subtitle: "Dynamic Programming",
    description: "面對最終考驗，需要動態規劃思維。定義狀態、找出轉移方程式、優化空間複雜度是致勝關鍵。",
    algorithms: ["0/1 Knapsack", "LCS", "DP Optimization"],
    complexity: "O(n×W) / O(n²)",
  },
];

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">終極審判：三階段 Boss 戰</span>
        </div>
        <h2 className="font-['Cinzel'] text-2xl text-primary mb-2">綜合演算法應用</h2>
        <p className="text-muted-foreground">
          整合所有學習的演算法知識，面對最終挑戰
        </p>
      </motion.div>

      <div className="grid gap-6">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-card/60 border border-primary/30 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: index === 0 ? 'rgba(239,68,68,0.2)' : 
                                   index === 1 ? 'rgba(59,130,246,0.2)' : 
                                   'rgba(212,175,55,0.2)' 
                }}
              >
                <concept.icon 
                  className="w-6 h-6" 
                  style={{ 
                    color: index === 0 ? '#ef4444' : 
                           index === 1 ? '#3b82f6' : 
                           '#d4af37' 
                  }} 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-['Cinzel'] text-lg text-foreground">{concept.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                    {concept.subtitle}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{concept.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {concept.algorithms.map((algo) => (
                    <span 
                      key={algo}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  時間複雜度：<code className="text-primary">{concept.complexity}</code>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-primary/20 to-amber-500/20 border border-primary/30 rounded-lg p-6"
      >
        <h3 className="font-['Cinzel'] text-lg text-primary mb-3">戰鬥策略</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span>根據數據特徵選擇最適合的演算法，錯誤選擇會導致攻擊反彈</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span>每個階段有限時挑戰，需要在時間內完成代碼修補</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span>失敗超過 2 次將解鎖智者提示，但會影響最終評價</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span>達成最優時間複雜度可觸發 S 級結局</span>
          </li>
        </ul>
      </motion.div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleComplete}
          disabled={completed}
          className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
        >
          {completed ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              準備完成
            </>
          ) : (
            "準備迎戰"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TeachBlock;
