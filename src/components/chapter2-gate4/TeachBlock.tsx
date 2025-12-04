import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Key, Box, Zap, AlertTriangle } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const concepts = [
  {
    id: "hash-function",
    title: "雜湊函數 Hash Function",
    icon: Key,
    description: "雜湊函數將任意輸入（鑰匙）轉換為固定範圍的數字（索引）。就像一個神奇的傳送法術，能瞬間定位寶箱位置。",
    code: `// 最簡單的雜湊函數：模運算
function hash(key, size) {
  return key % size;
}

// 範例：8 個寶箱 (索引 0-7)
hash(12, 8)  // 12 % 8 = 4 → 寶箱 #4
hash(25, 8)  // 25 % 8 = 1 → 寶箱 #1
hash(20, 8)  // 20 % 8 = 4 → 寶箱 #4 (碰撞！)`
  },
  {
    id: "o1-lookup",
    title: "O(1) 極速查找",
    icon: Zap,
    description: "雜湊表的魔力在於：無論存了多少數據，查找時間都是常數 O(1)！不需要遍歷，直接計算位置並跳轉。",
    code: `// 傳統陣列搜尋：O(n) 線性時間
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;  // 逐一檢查
  }
}

// 雜湊表查找：O(1) 常數時間
function hashLookup(key) {
  const index = hash(key, size);  // 直接計算
  return buckets[index];          // 瞬間定位！
}`
  },
  {
    id: "collision",
    title: "碰撞處理 Collision",
    icon: AlertTriangle,
    description: "當兩把不同的鑰匙計算出相同索引時，就發生「碰撞」。常見解法包括：線性探測（找下一個空位）或鏈結法（同位置串聯）。",
    code: `// 線性探測 (Linear Probing)
function insertWithProbing(key, value) {
  let index = hash(key, size);
  
  // 若位置已被佔用，尋找下一個空位
  while (buckets[index] !== null) {
    index = (index + 1) % size;  // 往後移動
  }
  
  buckets[index] = { key, value };
}

// hash(12, 8) = 4 → 存入 #4
// hash(20, 8) = 4 → 碰撞！移到 #5`
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

      {/* Visual Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
          <Box className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-red-400 font-semibold">陣列搜尋</p>
          <p className="text-2xl font-mono text-red-300">O(n)</p>
        </div>
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <Key className="w-8 h-8 mx-auto mb-2 text-green-400" />
          <p className="text-green-400 font-semibold">雜湊查找</p>
          <p className="text-2xl font-mono text-green-300">O(1)</p>
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
