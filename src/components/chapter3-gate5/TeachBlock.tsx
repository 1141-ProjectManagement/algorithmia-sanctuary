import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeftRight, Gauge, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    icon: ArrowLeftRight,
    title: "對向雙指標",
    description: "在有序陣列中，左指標從起點開始，右指標從終點開始。根據當前和與目標的比較，決定移動哪個指標。",
    code: `// 有序陣列：[1, 2, 4, 6, 8, 9]
let left = 0;           // 從最小開始
let right = arr.length - 1; // 從最大開始

// 左小右大的特性是關鍵！`,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Target,
    title: "移動策略",
    description: "當前和太小？左指標右移讓和變大。當前和太大？右指標左移讓和變小。精準控制，逐步逼近目標。",
    code: `while (left < right) {
  let sum = arr[left] + arr[right];
  
  if (sum === target) return [left, right];
  else if (sum < target) left++;  // 和太小，增大
  else right--;                   // 和太大，減小
}`,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Gauge,
    title: "複雜度優勢",
    description: "暴力法需要 O(n²) 的雙重迴圈。雙指標利用有序特性，每次移動都排除一個元素，只需 O(n) 時間！",
    code: `// 暴力法：O(n²)
for (i = 0; i < n; i++)
  for (j = i+1; j < n; j++)
    if (arr[i] + arr[j] === target) ✓

// 雙指標：O(n) 🚀
while (left < right) {
  // 每次迴圈至少排除一個候選
}`,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Zap,
    title: "搜尋空間縮減",
    description: "每次移動都在「排除」不可能的組合。左移 right 意味著放棄所有 (?, right) 組合；右移 left 意味著放棄所有 (left, ?) 組合。",
    code: `// 視覺化搜尋空間
//   j→  0  1  2  3  4
// i↓   [1, 2, 4, 6, 8]
//  0    x  ✓  ✓  ✓  ✓  ← left=0 時的候選
//  1       x  ✓  ✓  ✓
//  2          x  ✓  ✓
// 每次移動消除一整行或一整列！`,
    color: "from-purple-500/20 to-pink-500/20",
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-primary font-['Cinzel'] mb-2">
          雙指標的精髓
        </h3>
        <p className="text-muted-foreground">
          兩個探險家的默契配合 — 從 O(n²) 到 O(n) 的優雅躍進
        </p>
      </motion.div>

      {/* Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border border-primary/30 bg-gradient-to-br ${concept.color} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <concept.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                {concept.title}
              </h4>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {concept.description}
            </p>
            <pre className="bg-black/40 p-4 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
              {concept.code}
            </pre>
          </motion.div>
        ))}
      </div>

      {/* Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl border border-primary/30 bg-card/40"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">經典應用場景</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Two Sum (Sorted)", desc: "在有序陣列中找兩數之和" },
            { name: "Container With Most Water", desc: "找最大容器面積" },
            { name: "3Sum / 4Sum", desc: "固定一個後用雙指標" },
            { name: "Remove Duplicates", desc: "原地去重（快慢指標）" },
            { name: "Palindrome Check", desc: "從兩端向中間比較" },
            { name: "Merge Sorted Arrays", desc: "歸併兩個有序陣列" },
          ].map((app, i) => (
            <div key={i} className="p-3 bg-primary/10 rounded-lg">
              <div className="font-semibold text-foreground text-sm">{app.name}</div>
              <div className="text-xs text-muted-foreground">{app.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Variants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl border border-primary/30 bg-card/40"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">雙指標變體</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="text-2xl mb-2">← →</div>
            <div className="font-semibold text-blue-400">對向移動</div>
            <div className="text-xs text-muted-foreground">Two Sum, Container</div>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="text-2xl mb-2">→ →</div>
            <div className="font-semibold text-green-400">同向移動</div>
            <div className="text-xs text-muted-foreground">Remove Duplicates</div>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="text-2xl mb-2">🐢 🐇</div>
            <div className="font-semibold text-purple-400">快慢指標</div>
            <div className="text-xs text-muted-foreground">Cycle Detection</div>
          </div>
        </div>
      </motion.div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleComplete}
          disabled={completed}
          className="px-8 py-3 text-lg"
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              已完成學習
            </>
          ) : (
            "我理解了"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
