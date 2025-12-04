import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Droplets, ArrowRightLeft, Clock } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    id: "bubble",
    title: "泡泡術 (Bubble Sort)",
    icon: Droplets,
    description: "較重的寶石（數值大）透過不斷與相鄰寶石「推擠」，最終沈澱至池底。每一輪都將最大值「浮」到陣列末端。",
    code: `for (let i = 0; i < n-1; i++) {
  for (let j = 0; j < n-i-1; j++) {
    if (arr[j] > arr[j+1]) {
      swap(arr[j], arr[j+1]);
    }
  }
}`,
  },
  {
    id: "compare",
    title: "相鄰比較機制",
    icon: ArrowRightLeft,
    description: "每次只比較相鄰的兩個元素。如果順序錯誤就交換。這個簡單的動作重複進行，最終達成排序。",
    code: `// 比較 arr[j] 與 arr[j+1]
if (arr[j] > arr[j+1]) {
  // 交換位置
  let temp = arr[j];
  arr[j] = arr[j+1];
  arr[j+1] = temp;
}`,
  },
  {
    id: "complexity",
    title: "時間複雜度 O(n²)",
    icon: Clock,
    description: "巢狀迴圈導致複雜度為 O(n²)。當陣列大小翻倍時，排序時間會變成 4 倍。這就是為什麼 Bubble Sort 只適合小資料集。",
    code: `// 外層迴圈: n-1 次
// 內層迴圈: 平均 n/2 次
// 總計: (n-1) × (n/2) ≈ n²/2
// 時間複雜度: O(n²)`,
  },
];

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [viewedConcepts, setViewedConcepts] = useState<Set<string>>(new Set());

  const handleConceptClick = (conceptId: string) => {
    const newViewed = new Set(viewedConcepts);
    newViewed.add(conceptId);
    setViewedConcepts(newViewed);

    if (newViewed.size === concepts.length) {
      onComplete();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-2">
          泡泡排序的奧秘
        </h3>
        <p className="text-muted-foreground">
          點擊每個概念卡片來學習（{viewedConcepts.size}/{concepts.length}）
        </p>
      </div>

      {/* Why Question */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary/10 rounded-lg border border-primary/30"
      >
        <h4 className="text-lg font-semibold text-primary mb-2">
          為什麼需要排序？
        </h4>
        <p className="text-foreground/80">
          想像你在圖書館找一本書。如果書籍是隨機擺放的，你必須逐本檢查（O(n)）。
          但如果書籍按字母排序，你可以直接跳到正確區域（O(log n)）。
          排序是所有高效搜尋的基礎。
        </p>
      </motion.div>

      {/* Concept Cards */}
      <div className="grid gap-4">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          const isViewed = viewedConcepts.has(concept.id);

          return (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleConceptClick(concept.id)}
              className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                isViewed
                  ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "bg-card/40 border-border hover:border-primary/50 hover:bg-card/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isViewed ? "bg-primary/30" : "bg-muted"}`}>
                  <Icon className={`h-6 w-6 ${isViewed ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-foreground">{concept.title}</h4>
                    {isViewed && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-foreground/70 mb-3">{concept.description}</p>
                  <pre className="bg-background/50 p-3 rounded text-sm font-mono text-primary/80 overflow-x-auto">
                    {concept.code}
                  </pre>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message */}
      {viewedConcepts.size === concepts.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/20 rounded-lg border border-primary/40"
        >
          <p className="text-primary font-semibold">
            ✨ 知識學習完成！你已準備好進入互動演示
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TeachBlock;
