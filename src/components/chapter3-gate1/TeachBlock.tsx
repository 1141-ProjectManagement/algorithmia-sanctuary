import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, TreeDeciduous, ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const traversalTypes = [
  {
    name: "前序遍歷 Pre-order",
    order: "根 → 左 → 右",
    code: `traverse(node) {
  process(node)    // 先處理根
  traverse(left)   // 再走左
  traverse(right)  // 最後走右
}`,
    example: "1, 2, 4, 5, 3, 6, 7",
    analogy: "先插旗（訪問根），再探索左路，最後探索右路",
    color: "text-amber-400",
  },
  {
    name: "中序遍歷 In-order",
    order: "左 → 根 → 右",
    code: `traverse(node) {
  traverse(left)   // 先走左到底
  process(node)    // 回來處理根
  traverse(right)  // 最後走右
}`,
    example: "4, 2, 5, 1, 6, 3, 7",
    analogy: "先走左路到底，回來插旗，再走右路",
    color: "text-emerald-400",
  },
  {
    name: "後序遍歷 Post-order",
    order: "左 → 右 → 根",
    code: `traverse(node) {
  traverse(left)   // 先走左
  traverse(right)  // 再走右
  process(node)    // 最後處理根
}`,
    example: "4, 5, 2, 6, 7, 3, 1",
    analogy: "先走完左右兩條路，最後回來插旗",
    color: "text-cyan-400",
  },
];

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [completed, setCompleted] = useState(false);
  const [activeType, setActiveType] = useState(0);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="space-y-8">
      {/* Tree Structure Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
          <TreeDeciduous className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-4">
          什麼是樹的遍歷？
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          樹的遍歷是系統性地訪問樹中每個節點的過程。就像探險家在樹林中行走，
          <span className="text-primary">不同的行走順序會產生不同的訪問序列</span>。
          深度優先搜尋（DFS）有三種主要變體，它們的區別在於「何時處理當前節點」。
        </p>
      </motion.div>

      {/* Visual Tree Diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card/60 border border-primary/20 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-primary mb-4 text-center">範例二元樹</h4>
        <div className="flex justify-center">
          <svg viewBox="0 0 200 140" className="w-full max-w-md h-auto">
            {/* Edges */}
            <line x1="100" y1="20" x2="50" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="100" y1="20" x2="150" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="60" x2="25" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="60" x2="75" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="60" x2="125" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="60" x2="175" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            
            {/* Nodes */}
            <circle cx="100" cy="20" r="15" fill="hsl(var(--primary))" />
            <text x="100" y="25" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">1</text>
            
            <circle cx="50" cy="60" r="15" fill="hsl(var(--primary))" opacity="0.8" />
            <text x="50" y="65" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">2</text>
            
            <circle cx="150" cy="60" r="15" fill="hsl(var(--primary))" opacity="0.8" />
            <text x="150" y="65" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">3</text>
            
            <circle cx="25" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.6" />
            <text x="25" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">4</text>
            
            <circle cx="75" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.6" />
            <text x="75" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">5</text>
            
            <circle cx="125" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.6" />
            <text x="125" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">6</text>
            
            <circle cx="175" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.6" />
            <text x="175" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">7</text>
            
            {/* Labels */}
            <text x="100" y="135" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">根節點 (Root)</text>
          </svg>
        </div>
      </motion.div>

      {/* Three Traversal Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-lg font-semibold text-primary mb-4 text-center">三種遍歷方式</h4>
        
        {/* Tab Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {traversalTypes.map((type, index) => (
            <Button
              key={index}
              variant={activeType === index ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(index)}
              className="text-xs"
            >
              {type.name.split(" ")[0]}
            </Button>
          ))}
        </div>

        {/* Active Traversal Detail */}
        <motion.div
          key={activeType}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card/60 border border-primary/20 rounded-lg p-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className={`text-xl font-semibold ${traversalTypes[activeType].color} mb-2`}>
                {traversalTypes[activeType].name}
              </h5>
              <p className="text-sm text-muted-foreground mb-4">
                順序：<span className="text-foreground font-mono">{traversalTypes[activeType].order}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {traversalTypes[activeType].analogy}
              </p>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">輸出序列：</p>
                <p className={`font-mono text-lg ${traversalTypes[activeType].color}`}>
                  [{traversalTypes[activeType].example}]
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">程式碼結構：</p>
              <pre className="bg-black/50 rounded-lg p-4 text-sm font-mono text-emerald-300 overflow-x-auto">
                {traversalTypes[activeType].code}
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-primary/10 border border-primary/30 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <ArrowDown className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h5 className="font-semibold text-primary mb-2">核心洞察：遞迴的力量</h5>
            <p className="text-sm text-muted-foreground">
              三種遍歷方式的程式碼幾乎相同，唯一的差異是 <code className="text-primary">process(node)</code> 這行的位置。
              這展示了遞迴的優雅之處——同樣的「深入再回溯」模式，只需改變處理時機，就能產生完全不同的結果序列。
            </p>
          </div>
        </div>
      </motion.div>

      {/* Time Complexity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-card/40 border border-border/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">時間複雜度</p>
          <p className="text-2xl font-mono text-primary">O(n)</p>
          <p className="text-xs text-muted-foreground">每個節點訪問一次</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">空間複雜度</p>
          <p className="text-2xl font-mono text-primary">O(h)</p>
          <p className="text-xs text-muted-foreground">h = 樹的高度（遞迴堆疊）</p>
        </div>
      </motion.div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleComplete}
          size="lg"
          className="gap-2"
          disabled={completed}
        >
          {completed ? (
            <>
              <CheckCircle className="w-5 h-5" />
              已完成學習
            </>
          ) : (
            "我理解了，開始探索"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
