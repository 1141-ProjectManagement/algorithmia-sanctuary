import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Search, Zap, AlertTriangle } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    id: "prerequisite",
    title: "先決條件：已排序",
    icon: AlertTriangle,
    description: "二分搜尋只能在已排序的資料上運作。如同星圖中的星球必須按能量值排列，才能用折半術快速定位。",
    code: `// 陣列必須已排序！
const sortedArr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
// ✓ 可以使用 Binary Search

const unsortedArr = [38, 5, 72, 12, 91, 2, 8, 56, 16, 23];
// ✗ 必須先排序才能搜尋`
  },
  {
    id: "pointers",
    title: "三指針：Low, Mid, High",
    icon: Search,
    description: "使用 low（左邊界）、high（右邊界）與 mid（中點）三個指針來追蹤當前搜尋範圍。每次比較後，範圍減半。",
    code: `let low = 0;
let high = arr.length - 1;

while (low <= high) {
  const mid = Math.floor((low + high) / 2);
  
  if (arr[mid] === target) return mid;      // 找到了！
  else if (arr[mid] < target) low = mid + 1; // 目標在右半邊
  else high = mid - 1;                       // 目標在左半邊
}`
  },
  {
    id: "efficiency",
    title: "效率：O(log n)",
    icon: Zap,
    description: "每次迭代都將搜尋範圍減半。對於 10 億個元素，最多只需約 30 次比較！這就是對數時間複雜度的威力。",
    code: `// 線性搜尋 vs 二分搜尋
// n = 1,000,000,000 (十億)

// O(n) 線性搜尋：最差需要 10 億次比較
// O(log n) 二分搜尋：最多只需 30 次比較！

// log₂(1,000,000,000) ≈ 30`
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

      {/* Progress & Complete */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          已學習 {viewedConcepts.size} / {concepts.length} 個概念
        </span>
        <Button
          onClick={onComplete}
          disabled={!allViewed}
          className="gap-2"
        >
          {allViewed ? <Check className="w-4 h-4" /> : null}
          {allViewed ? "概念學習完成" : "請瀏覽所有概念"}
        </Button>
      </div>
    </div>
  );
};

export default TeachBlock;
