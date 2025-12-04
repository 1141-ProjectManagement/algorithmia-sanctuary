import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Lightbulb, Code } from "lucide-react";

interface Challenge {
  id: number;
  type: "concept" | "formula" | "code";
  question: string;
  scenario?: string;
  codeSnippet?: string;
  options: { value: string; label: string; correct: boolean }[];
  explanation: string;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: "concept",
    question: "動態規劃解決問題的兩個核心特性是什麼？",
    scenario: "理解 DP 適用條件",
    options: [
      { value: "a", label: "貪婪選擇 + 局部最優", correct: false },
      { value: "b", label: "重疊子問題 + 最優子結構", correct: true },
      { value: "c", label: "分治策略 + 合併結果", correct: false },
      { value: "d", label: "回溯搜索 + 剪枝優化", correct: false },
    ],
    explanation: "DP 適用於：1) 重疊子問題（同一子問題被多次求解）2) 最優子結構（最優解包含子問題最優解）",
    hint: "想想為什麼需要「記憶」計算結果？",
  },
  {
    id: 2,
    type: "formula",
    question: "0/1 背包問題中，dp[3][5] 代表什麼意思？",
    scenario: "dp[i][w] 表示考慮前 i 個物品，背包容量為 w 時的最大價值",
    options: [
      { value: "a", label: "選擇第 3 個物品，價值為 5", correct: false },
      { value: "b", label: "前 3 個物品，容量 5 的最大價值", correct: true },
      { value: "c", label: "第 3 個物品重量為 5", correct: false },
      { value: "d", label: "總共 3 個物品，總重 5", correct: false },
    ],
    explanation: "dp[i][w] 定義為：考慮前 i 個物品，在背包容量為 w 的限制下，能獲得的最大價值。",
    hint: "DP 表格的行代表物品，列代表容量",
  },
  {
    id: 3,
    type: "code",
    question: "完成狀態轉移方程：dp[i][w] = ?",
    scenario: "當物品 i 的重量 ≤ 當前容量 w 時",
    codeSnippet: `if (items[i-1].weight <= w) {
  dp[i][w] = _______;
}`,
    options: [
      { value: "a", label: "dp[i-1][w] + items[i-1].value", correct: false },
      { value: "b", label: "Math.max(dp[i-1][w], dp[i-1][w-weight] + value)", correct: true },
      { value: "c", label: "dp[i][w-1] + items[i-1].value", correct: false },
      { value: "d", label: "Math.min(dp[i-1][w], dp[i-1][w-weight] + value)", correct: false },
    ],
    explanation: "比較「不選」(dp[i-1][w]) 和「選」(dp[i-1][w-weight] + value) 兩種情況，取最大值！",
    hint: "要比較「選」和「不選」兩種情況",
  },
  {
    id: 4,
    type: "formula",
    question: "若物品重量 [2,3,4]，價值 [3,4,5]，容量 5，最大價值是？",
    scenario: "手動計算 DP 結果",
    options: [
      { value: "a", label: "5", correct: false },
      { value: "b", label: "7", correct: true },
      { value: "c", label: "8", correct: false },
      { value: "d", label: "12", correct: false },
    ],
    explanation: "選擇物品 1 (重量2,價值3) + 物品 2 (重量3,價值4) = 總重 5，總價值 7",
    hint: "試著選擇重量和為 5 的組合",
  },
  {
    id: 5,
    type: "concept",
    question: "0/1 背包的時間複雜度 O(N×W) 為什麼叫「偽多項式時間」？",
    scenario: "理解複雜度的本質",
    options: [
      { value: "a", label: "因為實際運行很快", correct: false },
      { value: "b", label: "因為 W 是數值大小，不是輸入長度", correct: true },
      { value: "c", label: "因為空間可以優化到 O(W)", correct: false },
      { value: "d", label: "因為可以並行計算", correct: false },
    ],
    explanation: "W 是數值大小而非輸入位數。若 W=2^n，則 O(N×W) = O(N×2^n)，相對於輸入是指數級！",
    hint: "想想如果 W 是一個很大的數字會怎樣？",
  },
];

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const handleAnswer = (value: string) => {
    const option = challenge.options.find((o) => o.value === value);
    if (!option) return;

    setSelectedAnswer(value);
    setIsCorrect(option.correct);

    if (option.correct) {
      toast({
        title: "✨ 水晶充能成功！",
        description: challenge.explanation,
      });

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
        } else {
          onComplete();
          toast({
            title: "🎉 記憶水晶矩陣完成！",
            description: "你已掌握動態規劃的核心思想",
          });
        }
      }, 2000);
    } else {
      toast({
        title: "❌ 能量不匹配",
        description: "點擊「提示」獲取幫助",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          挑戰 {currentChallenge + 1} / {challenges.length}
        </span>
        <div className="flex gap-1">
          {challenges.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx < currentChallenge
                  ? "bg-purple-500"
                  : idx === currentChallenge
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Challenge type badge */}
      <div className="flex justify-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            challenge.type === "concept"
              ? "bg-blue-500/20 text-blue-400"
              : challenge.type === "formula"
              ? "bg-purple-500/20 text-purple-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {challenge.type === "concept"
            ? "概念理解"
            : challenge.type === "formula"
            ? "公式應用"
            : "程式碼補全"}
        </span>
      </div>

      {/* Scenario */}
      {challenge.scenario && (
        <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">{challenge.scenario}</p>
        </div>
      )}

      {/* Code snippet */}
      {challenge.codeSnippet && (
        <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Code className="w-4 h-4" />
            <span>修復以下程式碼</span>
          </div>
          <pre className="text-yellow-400">{challenge.codeSnippet}</pre>
        </div>
      )}

      {/* Question */}
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-medium text-foreground">{challenge.question}</h3>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {challenge.options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`h-auto py-4 px-6 text-left justify-start ${
              selectedAnswer === option.value
                ? isCorrect
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-red-500 bg-red-500/10"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleAnswer(option.value)}
            disabled={isCorrect === true}
          >
            <span className="flex-1 font-mono text-sm">{option.label}</span>
            {selectedAnswer === option.value && (
              isCorrect ? (
                <CheckCircle className="w-5 h-5 text-purple-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )
            )}
          </Button>
        ))}
      </div>

      {/* Hint */}
      {!showHint && isCorrect === false && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(true)}
            className="text-muted-foreground"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            需要提示？
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30"
          >
            <p className="text-sm flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400 mt-0.5" />
              {challenge.hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation on correct */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
          >
            <p className="text-sm text-foreground/90">{challenge.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestBlock;
