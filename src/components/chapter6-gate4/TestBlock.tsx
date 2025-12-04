import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Brain, CheckCircle, XCircle, Lightbulb, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBossStore } from "@/stores/bossStore";
import BossScene from "./BossScene";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  phase: number;
  title: string;
  icon: typeof Swords;
  color: string;
  description: string;
  codeTemplate: string;
  correctAnswers: string[];
  hint: string;
}

const challenges: Challenge[] = [
  {
    phase: 1,
    title: "秩序打擊",
    icon: Swords,
    color: "#ef4444",
    description: "修復 Binary Search 的中點計算，避免整數溢出",
    codeTemplate: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    // 修復這行代碼，避免 (left + right) 整數溢出
    let mid = _________;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    correctAnswers: [
      "left + Math.floor((right - left) / 2)",
      "Math.floor(left + (right - left) / 2)",
      "left + ((right - left) >> 1)",
    ],
    hint: "使用 left + (right - left) / 2 可以避免 left + right 的溢出風險",
  },
  {
    phase: 2,
    title: "路徑連結",
    icon: Shield,
    color: "#3b82f6",
    description: "完成 Dijkstra 演算法的鬆弛（Relaxation）操作",
    codeTemplate: `function dijkstra(graph, start) {
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const pq = new PriorityQueue();
  pq.push([0, start]);
  
  while (!pq.isEmpty()) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;
    
    for (const [v, w] of graph[u]) {
      const newDist = dist[u] + w;
      // 完成鬆弛操作
      if (_________) {
        dist[v] = newDist;
        pq.push([newDist, v]);
      }
    }
  }
  return dist;
}`,
    correctAnswers: [
      "newDist < dist[v]",
      "dist[v] > newDist",
    ],
    hint: "鬆弛的條件是：新路徑比已知路徑更短",
  },
  {
    phase: 3,
    title: "終極優化",
    icon: Brain,
    color: "#d4af37",
    description: "完成 0/1 背包問題的狀態轉移方程式",
    codeTemplate: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        // 完成狀態轉移：選或不選第 i 個物品
        dp[i][w] = _________;
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][capacity];
}`,
    correctAnswers: [
      "Math.max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])",
      "Math.max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])",
    ],
    hint: "狀態轉移：max(不選當前物品, 選當前物品的價值 + 剩餘容量的最優解)",
  },
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const { 
    currentPhase, 
    completePhase, 
    failPhase, 
    hintsEnabled, 
    showVictory,
    initBattle,
    playerHP,
    damagePlayer,
    setSRank,
  } = useBossStore();
  
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [perfectRun, setPerfectRun] = useState(true);

  const currentChallenge = challenges[currentPhase];

  useEffect(() => {
    initBattle();
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeout();
    }
  }, [timeLeft, timerActive]);

  const handleTimeout = () => {
    setTimerActive(false);
    damagePlayer(20);
    failPhase();
    setPerfectRun(false);
    toast({
      title: "⏰ 時間耗盡！",
      description: "護盾反彈了你的攻擊",
      variant: "destructive",
    });
  };

  const startChallenge = () => {
    setTimerActive(true);
    setTimeLeft(60);
    setUserAnswer("");
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleSubmit = () => {
    const trimmedAnswer = userAnswer.trim();
    const isAnswerCorrect = currentChallenge.correctAnswers.some(
      (ans) => trimmedAnswer.includes(ans.replace(/\s/g, "").toLowerCase()) ||
               ans.replace(/\s/g, "").toLowerCase().includes(trimmedAnswer.replace(/\s/g, "").toLowerCase())
    );

    setIsCorrect(isAnswerCorrect);
    setTimerActive(false);

    if (isAnswerCorrect) {
      const shieldTypes: Array<'sorting' | 'graph' | 'dp'> = ['sorting', 'graph', 'dp'];
      completePhase(shieldTypes[currentPhase]);
      
      toast({
        title: "✨ 護盾破碎！",
        description: `第 ${currentPhase + 1} 階段完成`,
      });

      if (currentPhase === 2) {
        if (perfectRun) {
          setSRank(true);
          toast({
            title: "🏆 S 級達成！",
            description: "完美通關，觸發真理結局",
          });
        }
        setTimeout(() => onComplete(), 2000);
      }
    } else {
      damagePlayer(15);
      failPhase();
      setPerfectRun(false);
      toast({
        title: "❌ 代碼錯誤",
        description: "護盾反彈了攻擊！請重試",
        variant: "destructive",
      });
    }
  };

  if (showVictory) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <Trophy className="w-20 h-20 text-primary mx-auto mb-6" />
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-4">
          守護者已被淨化！
        </h2>
        <p className="text-muted-foreground mb-6">
          你成功整合了所有演算法知識，完成了終極審判
        </p>
        <BossScene />
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-card/60 border border-border rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">玩家 HP：</span>
            <span className={playerHP < 30 ? "text-red-500" : "text-primary"}>
              {playerHP}%
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">階段：</span>
            <span className="text-primary">{currentPhase + 1}/3</span>
          </div>
        </div>
        {timerActive && (
          <div className={`text-lg font-mono ${timeLeft < 15 ? "text-red-500" : "text-primary"}`}>
            ⏱️ {timeLeft}s
          </div>
        )}
      </div>

      <BossScene />

      {/* Challenge Card */}
      <motion.div
        key={currentPhase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/60 border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${currentChallenge.color}20` }}
          >
            <currentChallenge.icon 
              className="w-6 h-6" 
              style={{ color: currentChallenge.color }}
            />
          </div>
          <div>
            <h3 className="font-['Cinzel'] text-xl" style={{ color: currentChallenge.color }}>
              階段 {currentChallenge.phase}：{currentChallenge.title}
            </h3>
            <p className="text-sm text-muted-foreground">{currentChallenge.description}</p>
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto">
          <pre className="text-foreground/90 whitespace-pre-wrap">
            {currentChallenge.codeTemplate}
          </pre>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              填寫 _________ 處的代碼：
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="輸入你的答案..."
              className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none"
              disabled={!timerActive}
            />
          </div>

          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {isCorrect ? "正確！護盾已破碎" : "錯誤！請重試"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint */}
          {(hintsEnabled || showHint) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg"
            >
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm text-primary">{currentChallenge.hint}</p>
            </motion.div>
          )}

          <div className="flex gap-3">
            {!timerActive ? (
              <Button
                onClick={startChallenge}
                className="flex-1 bg-gradient-to-r from-primary to-amber-500"
              >
                <Swords className="w-4 h-4 mr-2" />
                開始挑戰
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="flex-1 bg-gradient-to-r from-primary to-amber-500"
                >
                  施放咒語
                </Button>
                {!hintsEnabled && !showHint && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowHint(true);
                      setPerfectRun(false);
                    }}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestBlock;
