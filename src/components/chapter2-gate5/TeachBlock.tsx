import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, TrendingUp, Layers } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    id: "problem",
    title: "問題：重疊計算",
    icon: Layers,
    description: "當我們需要計算每個連續 k 個元素的總和時，暴力法會重複計算大量重疊的元素，導致 O(n × k) 的時間複雜度。",
    code: `// 暴力法：每次都重新計算整個視窗
for (let i = 0; i <= n - k; i++) {
  let sum = 0;
  for (let j = i; j < i + k; j++) {  // 每次都要加 k 個數
    sum += arr[j];
  }
  maxSum = Math.max(maxSum, sum);
}
// 時間複雜度：O(n × k) 😰`
  },
  {
    id: "insight",
    title: "洞察：增量更新",
    icon: TrendingUp,
    description: "相鄰兩個視窗只有兩個元素不同：一個離開（最左），一個進入（最右）。我們只需更新這兩個元素的差異！",
    code: `// 視窗 [0,1,2,3] 總和 = 10
// 視窗 [1,2,3,4] 總和 = ?

// 不需要重新計算！只需：
// 新總和 = 舊總和 - arr[0] + arr[4]
//        = 10 - arr[0] + arr[4]

// 這就是「滑動視窗」的精髓！`
  },
  {
    id: "formula",
    title: "公式：O(1) 更新",
    icon: Zap,
    description: "滑動視窗的核心公式：CurrentSum = PreviousSum - arr[i-k] + arr[i]。每次更新只需 O(1) 時間，整體達到 O(n)！",
    code: `// 滑動視窗法
let windowSum = 0;

// 1. 計算第一個視窗的總和
for (let i = 0; i < k; i++) {
  windowSum += arr[i];
}

// 2. 滑動視窗：減去離去者，加上進入者
for (let i = k; i < n; i++) {
  windowSum = windowSum - arr[i - k] + arr[i];
  maxSum = Math.max(maxSum, windowSum);
}
// 時間複雜度：O(n) 🚀`
  }
];

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [viewedConcepts, setViewedConcepts] = useState<Set<string>>(new Set());
  const [selectedConcept, setSelectedConcept] = useState(concepts[0]);

  const handleConceptClick = (concept: typeof concepts[0]) => {
    setSelectedConcept(concept);
    const newViewed = new Set(viewedConcepts);
    newViewed.add(concept.id);
    setViewedConcepts(newViewed);
  };

  const allViewed = viewedConcepts.size === concepts.length;

  return (
    <div className="space-y-6">
      {/* Concept Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          const isViewed = viewedConcepts.has(concept.id);
          const isSelected = selectedConcept.id === concept.id;

          return (
            <motion.button
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleConceptClick(concept)}
              className={`p-4 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "border-border hover:border-primary/50 bg-card/40"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${isSelected ? "bg-primary/30" : "bg-muted"}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="font-semibold text-foreground">{concept.title}</span>
                {isViewed && <Check className="w-4 h-4 text-green-500 ml-auto" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Concept Detail */}
      <motion.div
        key={selectedConcept.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-card/60 rounded-lg border border-primary/30"
      >
        <h4 className="text-xl font-semibold text-primary mb-3">{selectedConcept.title}</h4>
        <p className="text-muted-foreground mb-4">{selectedConcept.description}</p>
        <pre className="bg-background/80 p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground border border-border">
          {selectedConcept.code}
        </pre>
      </motion.div>

      {/* Complexity Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
          <p className="text-red-400 font-semibold">暴力法</p>
          <p className="text-2xl font-mono text-red-300">O(n × k)</p>
        </div>
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <p className="text-green-400 font-semibold">滑動視窗</p>
          <p className="text-2xl font-mono text-green-300">O(n)</p>
        </div>
      </div>

      {/* Progress & Complete */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          已學習 {viewedConcepts.size} / {concepts.length} 個概念
        </span>
        <Button onClick={onComplete} disabled={!allViewed} className="gap-2">
          {allViewed ? <Check className="w-4 h-4" /> : null}
          {allViewed ? "概念學習完成" : "請瀏覽所有概念"}
        </Button>
      </div>
    </div>
  );
};

export default TeachBlock;
