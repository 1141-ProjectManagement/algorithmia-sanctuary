import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Binary, GitMerge, Sparkles, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    icon: Sparkles,
    title: "貪婪策略 (Greedy)",
    description: "每次都選擇頻率最小的兩個節點合併。這個「局部最優」的決策，最終會導向「全局最優」的編碼方案。",
    code: `// 貪婪選擇
while (queue.length > 1) {
  const left = queue.popMin();  // 最小
  const right = queue.popMin(); // 次小
  const parent = merge(left, right);
  queue.push(parent);
}`,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: GitMerge,
    title: "自底向上建樹",
    description: "從葉節點（字符）開始，不斷合併形成父節點，最終匯聚成一棵完整的二元樹。根節點的頻率等於所有字符頻率之和。",
    code: `// 合併節點
function merge(left, right) {
  return {
    freq: left.freq + right.freq,
    left: left,
    right: right,
    char: null  // 內部節點無字符
  };
}`,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Binary,
    title: "編碼規則",
    description: "從根到葉的路徑決定編碼：向左走記 0，向右走記 1。頻率越高的字符，路徑越短，編碼越短。",
    code: `// 產生編碼
function encode(node, code = '') {
  if (node.char) {
    result[node.char] = code || '0';
    return;
  }
  encode(node.left, code + '0');
  encode(node.right, code + '1');
}`,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: FileCode,
    title: "前綴碼特性",
    description: "霍夫曼編碼是前綴碼：沒有任何編碼是另一個編碼的前綴。這確保了解碼時不會有歧義，可以唯一確定原始字符。",
    code: `// 前綴碼範例
// A: 0, B: 10, C: 11
// 解碼 "01011" → A B C
// 絕不會誤讀：因為 0 不是 10 或 11 的前綴

// 非前綴碼（錯誤）
// A: 0, B: 01 ← 0 是 01 的前綴！
// "01" = A+? 或 B? 歧義！`,
    color: "from-green-500/20 to-emerald-500/20",
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
          霍夫曼編碼的奧秘
        </h3>
        <p className="text-muted-foreground">
          用最少的位元表示最常見的字符 — 資料壓縮的經典演算法
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

      {/* Compression Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl border border-primary/30 bg-card/40"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">壓縮效果範例</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <h5 className="font-semibold text-red-400 mb-2">固定長度編碼</h5>
            <p className="text-sm text-muted-foreground mb-2">6 個字符，每個 3 bits</p>
            <div className="font-mono text-xs text-red-300">
              A=000, B=001, C=010, D=011, E=100, F=101
            </div>
            <div className="mt-2 text-sm">總位元數: <span className="text-red-400 font-bold">300 bits</span></div>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <h5 className="font-semibold text-green-400 mb-2">霍夫曼編碼</h5>
            <p className="text-sm text-muted-foreground mb-2">依頻率分配長度</p>
            <div className="font-mono text-xs text-green-300">
              F=0, C=100, D=101, A=1100, B=1101, E=111
            </div>
            <div className="mt-2 text-sm">總位元數: <span className="text-green-400 font-bold">224 bits</span> (節省 25%)</div>
          </div>
        </div>
      </motion.div>

      {/* Time Complexity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl border border-primary/30 bg-card/40"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">時間複雜度</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(n log n)</div>
            <div className="text-sm text-muted-foreground">建樹（使用 Heap）</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(n)</div>
            <div className="text-sm text-muted-foreground">產生編碼表</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">O(m)</div>
            <div className="text-sm text-muted-foreground">編碼/解碼訊息</div>
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
