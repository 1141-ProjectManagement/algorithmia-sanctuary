import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, GitBranch, AlertTriangle, Layers } from "lucide-react";
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
      icon: <GitBranch className="w-6 h-6" />,
      title: "有向無環圖 (DAG)",
      description: "拓撲排序只能在 DAG 上進行。有向表示依賴有方向性，無環表示不存在循環依賴。",
      code: `// DAG: 任務 A → B → C
// 非 DAG: A → B → C → A (有環！)`
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "入度 (Indegree)",
      description: "入度是指向某節點的邊數量。入度為 0 表示該任務沒有前置條件，可以立即執行。",
      code: `// 計算入度
for (const [from, to] of edges) {
  indegree[to]++;
}
// 入度為 0 的節點先加入佇列
queue = nodes.filter(n => indegree[n] === 0);`
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Kahn 演算法",
      description: "不斷取出入度為 0 的節點，移除其出邊，更新鄰居的入度。若最終有節點未處理，則存在環。",
      code: `while (queue.length > 0) {
  const node = queue.shift();
  result.push(node);
  for (const neighbor of adj[node]) {
    indegree[neighbor]--;
    if (indegree[neighbor] === 0) {
      queue.push(neighbor);
    }
  }
}`
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-4">
          拓撲排序的核心概念
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          在軟體編譯、課程規劃、任務調度中，我們常需要決定「先做什麼」。
          拓撲排序能幫助我們找到一個合法的執行順序，確保每個任務的前置條件都已完成。
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-card/40 border border-primary/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary">{concept.icon}</div>
              <h4 className="font-['Cinzel'] text-lg text-foreground">{concept.title}</h4>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{concept.description}</p>
            <pre className="bg-black/30 p-3 rounded text-xs font-mono text-primary/90 overflow-x-auto">
              {concept.code}
            </pre>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card/40 border border-primary/30 rounded-lg p-6"
      >
        <h4 className="font-['Cinzel'] text-lg text-foreground mb-4">應用場景</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span><strong>編譯系統：</strong>決定原始碼檔案的編譯順序</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span><strong>課程選修：</strong>規劃滿足先修課程的修課順序</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span><strong>套件管理：</strong>npm/pip 安裝依賴的順序</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">▸</span>
            <span><strong>工作流程：</strong>CI/CD 管線中任務的執行順序</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleComplete}
          disabled={completed}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
        >
          {completed ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
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
