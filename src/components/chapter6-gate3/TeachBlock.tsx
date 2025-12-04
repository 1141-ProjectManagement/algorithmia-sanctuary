import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dices, Zap, AlertTriangle, TrendingUp, Check } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    icon: AlertTriangle,
    title: "確定性的陷阱",
    description: "傳統 QuickSort 固定選第一個元素為 Pivot，遇到已排序數據會退化成 O(n²)。",
    code: `// 固定 Pivot：總是選 arr[low]
function partition(arr, low, high) {
  let pivot = arr[low]; // 危險！
  // 若 arr 已排序，每次分區極度不平衡
  // → 遞迴深度達 n 層
  // → 總比較次數：n + (n-1) + ... + 1 = O(n²)
}`,
    color: "text-red-400"
  },
  {
    icon: Dices,
    title: "隨機的破局",
    description: "透過隨機選取 Pivot，打破數據的規律性，讓期望時間複雜度維持在 O(n log n)。",
    code: `// 隨機 Pivot：擲骰子決定
function partition(arr, low, high) {
  let randomIdx = low + Math.floor(
    Math.random() * (high - low + 1)
  );
  swap(arr, low, randomIdx); // 將隨機元素移到開頭
  let pivot = arr[low];
  // 期望分區平衡 → 遞迴深度 O(log n)
}`,
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "期望值分析",
    description: "雖然最壞情況仍是 O(n²)，但機率極低。期望比較次數約為 1.39n log n。",
    code: `// 為什麼隨機有效？
// 
// 1. 任意元素成為 Pivot 的機率相等
// 2. 期望中，Pivot 將陣列分成兩半
// 3. 惡意數據無法「預測」我們的選擇
//
// 數學期望：
// E[比較次數] ≈ 1.39 × n × log₂(n)
// 
// 對於 n=1000：
// - 最壞情況：500,000 次比較
// - 期望值：約 13,900 次比較`,
    color: "text-green-400"
  },
  {
    icon: Zap,
    title: "隨機數生成",
    description: "正確的範圍隨機是關鍵：Math.random() 產生 [0,1)，需轉換為 [low, high] 整數。",
    code: `// 在 [low, high] 範圍內生成隨機整數
function getRandomIndex(low, high) {
  // Math.random() → [0, 1)
  // × (high - low + 1) → [0, high-low+1)
  // Math.floor() → {0, 1, ..., high-low}
  // + low → {low, low+1, ..., high}
  
  return low + Math.floor(
    Math.random() * (high - low + 1)
  );
}

// 範例：getRandomIndex(2, 5)
// 可能結果：2, 3, 4, 5（各 25% 機率）`,
    color: "text-blue-400"
  }
];

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [viewedConcepts, setViewedConcepts] = useState<Set<number>>(new Set());
  const [selectedConcept, setSelectedConcept] = useState(0);

  const handleConceptClick = (index: number) => {
    setSelectedConcept(index);
    const newViewed = new Set(viewedConcepts);
    newViewed.add(index);
    setViewedConcepts(newViewed);
  };

  const allViewed = viewedConcepts.size === concepts.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          探索隨機化演算法如何以「不確定性」對抗「惡意數據」
        </p>
        <p className="text-sm text-primary mt-2">
          已閱讀 {viewedConcepts.size} / {concepts.length} 個概念
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          const isViewed = viewedConcepts.has(index);
          const isSelected = selectedConcept === index;
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                    : 'border-border/50 hover:border-primary/50'
                } ${isViewed ? 'bg-primary/10' : 'bg-card/40'}`}
                onClick={() => handleConceptClick(index)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${concept.color}`} />
                  <p className="text-sm font-medium">{concept.title}</p>
                  {isViewed && (
                    <Check className="w-4 h-4 text-green-400 mx-auto mt-1" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        key={selectedConcept}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Card className="border-primary/30 bg-card/60">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${concepts[selectedConcept].color}`}>
              {(() => {
                const Icon = concepts[selectedConcept].icon;
                return <Icon className="w-5 h-5" />;
              })()}
              {concepts[selectedConcept].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/90">
              {concepts[selectedConcept].description}
            </p>
            <div className="bg-black/40 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-green-400">
                {concepts[selectedConcept].code}
              </pre>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={onComplete}
          disabled={!allViewed}
          className="gap-2"
          variant={allViewed ? "default" : "outline"}
        >
          {allViewed ? (
            <>
              <Check className="w-4 h-4" />
              開始擲骰子
            </>
          ) : (
            `請閱讀所有概念 (${viewedConcepts.size}/${concepts.length})`
          )}
        </Button>
      </div>
    </div>
  );
};

export default TeachBlock;
