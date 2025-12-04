import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Network, Zap, TrendingUp, GitMerge } from "lucide-react";
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
      icon: Network,
      title: "互斥集 (Disjoint Set)",
      description: "用陣列 parent[i] 表示每個元素的父節點。若 parent[i] = i，則 i 為該集合的根節點（首領）。",
      code: `// 初始化：每個元素都是自己的首領
parent = [0, 1, 2, 3, 4]
// parent[i] = i 表示 i 是根節點`,
    },
    {
      icon: Zap,
      title: "Find 操作",
      description: "沿著父節點指針向上追溯，直到找到根節點。這就像詢問「你的最終首領是誰？」",
      code: `function find(x) {
  if (parent[x] === x) return x;
  return find(parent[x]);
}`,
    },
    {
      icon: GitMerge,
      title: "Union 操作",
      description: "合併兩個集合，將其中一個根節點指向另一個。使用「按秩合併」可保持樹的平衡。",
      code: `function union(a, b) {
  let rootA = find(a);
  let rootB = find(b);
  if (rootA !== rootB) {
    parent[rootA] = rootB; // A 臣服於 B
  }
}`,
    },
    {
      icon: TrendingUp,
      title: "路徑壓縮",
      description: "在 find 過程中，將沿途所有節點直接連到根節點，將時間複雜度優化至近乎 O(1)。",
      code: `function find(x) {
  if (parent[x] === x) return x;
  // 路徑壓縮：直接指向根節點
  parent[x] = find(parent[x]);
  return parent[x];
}`,
    },
  ];

  const applications = [
    "判斷圖的連通性",
    "最小生成樹 (Kruskal)",
    "社交網路朋友圈",
    "圖片分割區域",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-2">
          併查集的核心概念
        </h3>
        <p className="text-muted-foreground">
          Union-Find 是一種高效處理「集合合併」與「元素查詢」的資料結構
        </p>
      </motion.div>

      {/* Core Question */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/10 border border-primary/30 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-primary mb-3">❓ 核心問題</h4>
        <p className="text-foreground">
          給定多個元素和一系列「合併」操作，如何快速判斷任意兩個元素是否屬於同一集合？
        </p>
        <div className="mt-4 p-4 bg-black/20 rounded font-mono text-sm">
          <p className="text-muted-foreground">// 範例：社交網路</p>
          <p>union(Alice, Bob)   <span className="text-muted-foreground">// Alice 和 Bob 成為朋友</span></p>
          <p>union(Bob, Charlie) <span className="text-muted-foreground">// Bob 和 Charlie 成為朋友</span></p>
          <p>find(Alice) === find(Charlie)? <span className="text-green-400">// true!</span></p>
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
            className="bg-card/40 border border-primary/20 rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <concept.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">{concept.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {concept.description}
            </p>
            <pre className="bg-black/30 p-3 rounded text-xs overflow-x-auto">
              <code className="text-green-400">{concept.code}</code>
            </pre>
          </motion.div>
        ))}
      </div>

      {/* Time Complexity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">⏱️ 時間複雜度分析</h4>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-2xl font-bold text-red-400">O(n)</p>
            <p className="text-sm text-muted-foreground">無優化（最壞情況）</p>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-400">O(log n)</p>
            <p className="text-sm text-muted-foreground">僅按秩合併</p>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-2xl font-bold text-green-400">O(α(n)) ≈ O(1)</p>
            <p className="text-sm text-muted-foreground">路徑壓縮 + 按秩合併</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          α(n) 是反阿克曼函數，對於所有實際輸入，其值不超過 4
        </p>
      </motion.div>

      {/* Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card/40 border border-primary/20 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-primary mb-4">🎯 實際應用</h4>
        <div className="flex flex-wrap gap-2">
          {applications.map((app) => (
            <span
              key={app}
              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
            >
              {app}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleComplete}
          disabled={completed}
          className="px-8 py-3"
          variant={completed ? "secondary" : "default"}
        >
          {completed ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
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
