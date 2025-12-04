import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Shield, Zap, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBossStore } from "@/stores/bossStore";
import BossScene from "./BossScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const algorithmEffects: Record<string, Record<string, { damage: number; message: string }>> = {
  sorting: {
    QuickSort: { damage: 80, message: "⚡ 暴擊！QuickSort 對混亂數據極為有效！" },
    MergeSort: { damage: 70, message: "✨ 有效！MergeSort 穩定地整理了碎片" },
    BubbleSort: { damage: 20, message: "💤 效果不佳，O(n²) 無法應對大規模數據" },
    Dijkstra: { damage: 5, message: "🛡️ 反彈！這不是圖論問題..." },
  },
  graph: {
    Dijkstra: { damage: 80, message: "⚡ 暴擊！最短路徑演算法重建了能量流！" },
    Prim: { damage: 75, message: "✨ 有效！MST 連接了所有節點" },
    BFS: { damage: 50, message: "👍 部分有效，但不是最優解" },
    QuickSort: { damage: 5, message: "🛡️ 反彈！排序無法解決連通性問題..." },
  },
  dp: {
    DP: { damage: 85, message: "⚡ 暴擊！動態規劃找到了最優解！" },
    Greedy: { damage: 40, message: "⚠️ 貪婪法無法保證全域最優" },
    BruteForce: { damage: 15, message: "💥 超時！暴力搜尋無法處理指數級問題" },
    QuickSort: { damage: 5, message: "🛡️ 反彈！這是優化問題，不是排序問題..." },
  },
};

const shieldInfo = {
  sorting: {
    name: "秩序護盾",
    description: "N = 10^5 個無序數據碎片",
    hint: "需要 O(n log n) 的排序演算法",
  },
  graph: {
    name: "連結護盾", 
    description: "V = 1000 節點, E = 5000 邊的稀疏圖",
    hint: "需要圖論演算法處理連通性",
  },
  dp: {
    name: "優化護盾",
    description: "背包容量 W = 1000，物品數量 N = 500",
    hint: "需要動態規劃解決優化問題",
  },
};

const algorithms = [
  { name: "QuickSort", type: "sorting" },
  { name: "MergeSort", type: "sorting" },
  { name: "BubbleSort", type: "sorting" },
  { name: "Dijkstra", type: "graph" },
  { name: "Prim", type: "graph" },
  { name: "BFS", type: "graph" },
  { name: "DP", type: "dp" },
  { name: "Greedy", type: "dp" },
  { name: "BruteForce", type: "dp" },
];

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const { shields, attackShield, damagePlayer, addLog, attackLog, initBattle } = useBossStore();
  const [selectedShield, setSelectedShield] = useState<'sorting' | 'graph' | 'dp'>('sorting');
  const [selectedAlgo, setSelectedAlgo] = useState<string>("");
  const [attackResult, setAttackResult] = useState<string>("");
  const [attackCount, setAttackCount] = useState(0);

  const handleAttack = () => {
    if (!selectedAlgo) return;

    const effect = algorithmEffects[selectedShield][selectedAlgo];
    if (effect) {
      setAttackResult(effect.message);
      addLog(effect.message);
      
      if (effect.damage > 30) {
        attackShield(selectedShield, effect.damage);
      } else {
        damagePlayer(10);
      }
      
      setAttackCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          onComplete();
        }
        return newCount;
      });
    }
  };

  const handleInit = () => {
    initBattle();
    setAttackResult("");
    setSelectedAlgo("");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-muted-foreground mb-4">
          點擊護盾查看屬性，選擇演算法進行攻擊預演
          <span className="text-primary ml-2">({attackCount}/5 次互動)</span>
        </p>
      </motion.div>

      <BossScene />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shield Selection */}
        <div className="bg-card/60 border border-border rounded-lg p-4">
          <h3 className="font-['Cinzel'] text-lg text-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            護盾選擇
          </h3>
          <div className="space-y-2">
            {shields.map((shield) => (
              <button
                key={shield.type}
                onClick={() => setSelectedShield(shield.type)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  selectedShield === shield.type
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: shield.color }}>
                    {shield.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    HP: {shield.health}%
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Shield Info */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-foreground">
                  {shieldInfo[selectedShield].name}
                </div>
                <div className="text-muted-foreground">
                  {shieldInfo[selectedShield].description}
                </div>
                <div className="text-primary mt-1">
                  💡 {shieldInfo[selectedShield].hint}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-card/60 border border-border rounded-lg p-4">
          <h3 className="font-['Cinzel'] text-lg text-primary mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            演算法選擇
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {algorithms.map((algo) => (
              <button
                key={algo.name}
                onClick={() => setSelectedAlgo(algo.name)}
                className={`p-2 rounded text-sm border transition-all ${
                  selectedAlgo === algo.name
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleAttack}
              disabled={!selectedAlgo}
              className="flex-1 bg-gradient-to-r from-primary to-amber-500"
            >
              <Target className="w-4 h-4 mr-2" />
              發動攻擊
            </Button>
            <Button variant="outline" onClick={handleInit}>
              重置
            </Button>
          </div>

          {attackResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-muted/30 rounded-lg text-sm"
            >
              {attackResult}
            </motion.div>
          )}
        </div>
      </div>

      {/* Attack Log */}
      <div className="bg-card/60 border border-border rounded-lg p-4 max-h-40 overflow-y-auto">
        <h4 className="text-sm font-medium text-primary mb-2">戰鬥日誌</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          {attackLog.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoBlock;
