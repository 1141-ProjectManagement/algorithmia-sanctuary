import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Pyramid, ArrowUp, ArrowDown, Binary } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    icon: Binary,
    title: "完全二元樹的陣列表示",
    description: "Heap 使用陣列儲存完全二元樹。對於索引 i 的節點：父節點 = (i-1)/2，左子 = 2i+1，右子 = 2i+2",
    code: `// 陣列表示法
arr = [50, 30, 40, 10, 20]

// 對應的樹結構
//       50 [0]
//      /    \\
//   30[1]  40[2]
//   /  \\
// 10[3] 20[4]`,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Pyramid,
    title: "Max Heap 性質",
    description: "在 Max Heap 中，父節點的值永遠大於或等於其子節點。這確保了最大值永遠在根節點（陣列的第一個位置）。",
    code: `// Max Heap Property
parent >= leftChild
parent >= rightChild

// 最大值總在 heap[0]
max = heap[0]`,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: ArrowUp,
    title: "Sift Up（上浮）",
    description: "當插入新元素時，將它放在陣列末端，然後與父節點比較。如果違反 Heap 性質，就交換並繼續向上檢查。",
    code: `function siftUp(index) {
  while (index > 0) {
    let parent = Math.floor((index-1)/2);
    if (heap[index] > heap[parent]) {
      swap(index, parent);
      index = parent;
    } else break;
  }
}`,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: ArrowDown,
    title: "Sift Down（下沉）",
    description: "當提取最大值後，將末端元素移至根節點，然後與較大的子節點比較並下沉，直到滿足 Heap 性質。",
    code: `function siftDown(index) {
  while (2*index+1 < heapSize) {
    let largest = index;
    let left = 2*index + 1;
    let right = 2*index + 2;
    
    if (heap[left] > heap[largest])
      largest = left;
    if (right < heapSize && 
        heap[right] > heap[largest])
      largest = right;
    
    if (largest !== index) {
      swap(index, largest);
      index = largest;
    } else break;
  }
}`,
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
          堆積的核心概念
        </h3>
        <p className="text-muted-foreground">
          理解 Heap 的結構與操作，時間複雜度 O(log n)
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

      {/* Time Complexity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl border border-primary/30 bg-card/40"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">時間複雜度分析</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(log n)</div>
            <div className="text-sm text-muted-foreground">Insert (push)</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(log n)</div>
            <div className="text-sm text-muted-foreground">Extract (pop)</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(1)</div>
            <div className="text-sm text-muted-foreground">Peek Max</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(n)</div>
            <div className="text-sm text-muted-foreground">Build Heap</div>
          </div>
        </div>
      </motion.div>

      {/* Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl border border-primary/30 bg-card/40"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">實際應用場景</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "優先隊列 (Priority Queue) - 任務排程",
            "堆排序 (Heap Sort) - O(n log n) 排序",
            "找第 K 大/小元素 - Top-K 問題",
            "圖演算法 - Dijkstra, Prim 最短路徑",
          ].map((app, i) => (
            <li key={i} className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {app}
            </li>
          ))}
        </ul>
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
