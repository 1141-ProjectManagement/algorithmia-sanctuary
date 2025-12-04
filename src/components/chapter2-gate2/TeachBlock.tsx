import { motion } from "framer-motion";
import { GitBranch, Merge, Zap, Clock } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const concepts = [
    {
      icon: GitBranch,
      title: "分 (Divide)",
      description: "將大問題拆解為小問題。如同光束被稜鏡分裂，陣列從中間切開，直到無法再分。",
      code: "mid = len(arr) // 2\nleft = arr[:mid]\nright = arr[mid:]"
    },
    {
      icon: Merge,
      title: "治 (Conquer)",
      description: "解決最小子問題後，將結果合併。已排序的小陣列透過比較逐一合併成大陣列。",
      code: "while left and right:\n  if left[0] < right[0]:\n    result.append(left.pop(0))"
    },
    {
      icon: Zap,
      title: "Quick Sort 的 Pivot",
      description: "選擇一個基準值，比它小的放左邊，大的放右邊。遞迴處理兩側直到完成。",
      code: "pivot = arr[-1]\nless = [x for x in arr if x < pivot]\ngreater = [x for x in arr if x > pivot]"
    },
    {
      icon: Clock,
      title: "O(n log n) 效率",
      description: "每次對半分割需要 log n 層，每層處理 n 個元素，因此總複雜度為 O(n log n)。",
      code: "# 比 O(n²) 快得多！\n# n=1000 時\n# O(n²) = 1,000,000\n# O(n log n) ≈ 10,000"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-2">
          分而治之的奧義
        </h3>
        <p className="text-muted-foreground">
          將複雜問題拆解、征服、再合併的智慧
        </p>
      </motion.div>

      {/* Visual Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="p-4 bg-card/40 rounded-lg border border-blue-500/30">
          <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
            <Merge className="w-4 h-4" /> Merge Sort
          </h4>
          <p className="text-sm text-muted-foreground mb-2">
            「先分到底，再逐層合併」
          </p>
          <div className="text-xs font-mono bg-black/30 p-2 rounded">
            [38,27,43,3] → [38,27] [43,3]<br/>
            → [38] [27] [43] [3]<br/>
            → [27,38] [3,43]<br/>
            → [3,27,38,43] ✓
          </div>
        </div>
        <div className="p-4 bg-card/40 rounded-lg border border-amber-500/30">
          <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Quick Sort
          </h4>
          <p className="text-sm text-muted-foreground mb-2">
            「選基準、分左右、再遞迴」
          </p>
          <div className="text-xs font-mono bg-black/30 p-2 rounded">
            [38,27,43,3] pivot=3<br/>
            → [] [3] [38,27,43]<br/>
            → [3] + sort([38,27,43])<br/>
            → [3,27,38,43] ✓
          </div>
        </div>
      </motion.div>

      {/* Concept Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 bg-card/40 rounded-lg border border-primary/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <concept.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">{concept.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {concept.description}
            </p>
            <pre className="text-xs font-mono bg-black/30 p-2 rounded text-primary/80 overflow-x-auto">
              {concept.code}
            </pre>
          </motion.div>
        ))}
      </div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-4"
      >
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
        >
          我理解了，開始探索！
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
