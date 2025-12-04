import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, HelpCircle, Code, Play } from "lucide-react";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  codeTemplate: string;
  blankPlaceholder: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  hint: string;
  explanation: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "補全滑動邏輯",
    description: "視窗從位置 i-1 滑動到位置 i 時，需要減去離開視窗的元素。請填入正確的陣列索引。",
    codeTemplate: `// 視窗大小為 k，當前索引為 i
// 需要減去離開視窗的元素（最左側）

windowSum = windowSum - _________ + arr[i];`,
    blankPlaceholder: "_________",
    options: [
      { label: "arr[i - k]", value: "arr[i - k]" },
      { label: "arr[i - 1]", value: "arr[i - 1]" },
      { label: "arr[i + k]", value: "arr[i + k]" },
      { label: "arr[k]", value: "arr[k]" }
    ],
    correctAnswer: "arr[i - k]",
    hint: "想想看：當視窗右邊界在 i 時，左邊界在哪裡？視窗大小是 k...",
    explanation: "當視窗右邊界移動到 i 時，左邊界是 i - k + 1，所以離開的元素是 arr[i - k]（原本左邊界 i - k 的元素）"
  },
  {
    id: 2,
    title: "初始化視窗",
    description: "在開始滑動之前，我們需要先計算第一個視窗的總和。迴圈應該遍歷哪些索引？",
    codeTemplate: `// 計算第一個視窗 [0, k-1] 的總和
let windowSum = 0;

for (let i = 0; i < _________; i++) {
  windowSum += arr[i];
}`,
    blankPlaceholder: "_________",
    options: [
      { label: "k", value: "k" },
      { label: "k - 1", value: "k - 1" },
      { label: "n", value: "n" },
      { label: "n - k", value: "n - k" }
    ],
    correctAnswer: "k",
    hint: "第一個視窗包含索引 0 到 k-1，共 k 個元素",
    explanation: "for (let i = 0; i < k; i++) 會遍歷索引 0, 1, 2, ..., k-1，正好是前 k 個元素"
  },
  {
    id: 3,
    title: "滑動起點",
    description: "計算完第一個視窗後，滑動迴圈應該從哪個索引開始？",
    codeTemplate: `// 第一個視窗已計算完成
// 開始滑動視窗

for (let i = _________; i < n; i++) {
  windowSum = windowSum - arr[i - k] + arr[i];
  maxSum = Math.max(maxSum, windowSum);
}`,
    blankPlaceholder: "_________",
    options: [
      { label: "k", value: "k" },
      { label: "0", value: "0" },
      { label: "k - 1", value: "k - 1" },
      { label: "1", value: "1" }
    ],
    correctAnswer: "k",
    hint: "第一個視窗的右邊界是 k-1，下一個視窗的右邊界是...?",
    explanation: "第一個視窗 [0, k-1] 已處理，第二個視窗的右邊界是 k，所以從 i = k 開始滑動"
  },
  {
    id: 4,
    title: "完整實現",
    description: "最後一步：當找到更大的總和時，我們要更新最大值。請選擇正確的比較方式。",
    codeTemplate: `for (let i = k; i < n; i++) {
  windowSum = windowSum - arr[i - k] + arr[i];
  
  if (_________) {
    maxSum = windowSum;
  }
}`,
    blankPlaceholder: "_________",
    options: [
      { label: "windowSum > maxSum", value: "windowSum > maxSum" },
      { label: "windowSum >= maxSum", value: "windowSum >= maxSum" },
      { label: "windowSum < maxSum", value: "windowSum < maxSum" },
      { label: "windowSum == maxSum", value: "windowSum == maxSum" }
    ],
    correctAnswer: "windowSum > maxSum",
    hint: "我們想要找到「最大」的總和，什麼時候需要更新？",
    explanation: "只有當當前視窗的總和嚴格大於目前的最大值時，才需要更新 maxSum"
  }
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const handleAnswerSelect = (value: string) => {
    if (isCorrect !== null) return;
    
    setSelectedAnswer(value);
    const correct = value === challenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setShowExplanation(true);
      toast({
        title: "✨ 正確！",
        description: "代碼邏輯完美！",
      });

      setTimeout(() => {
        const nextCompleted = completedChallenges + 1;
        setCompletedChallenges(nextCompleted);
        
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
          setShowExplanation(false);
        } else {
          onComplete();
          toast({
            title: "🎉 恭喜通關！",
            description: "你已完全掌握滑動視窗技巧！",
          });
        }
      }, 2500);
    } else {
      toast({
        title: "❌ 再想想",
        description: "仔細思考視窗滑動時的索引變化",
        variant: "destructive",
      });
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const filledCode = selectedAnswer 
    ? challenge.codeTemplate.replace(challenge.blankPlaceholder, selectedAnswer)
    : challenge.codeTemplate;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          挑戰 {currentChallenge + 1} / {challenges.length}
        </span>
        <div className="flex gap-2">
          {challenges.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx < completedChallenges
                  ? "bg-green-500"
                  : idx === currentChallenge
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-card/60 rounded-lg border border-primary/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-primary">{challenge.title}</h4>
        </div>

        <p className="text-foreground mb-4">{challenge.description}</p>

        {/* Code Template */}
        <pre className="p-4 bg-background/80 rounded-lg font-mono text-sm mb-4 border border-border overflow-x-auto">
          <code className={isCorrect ? "text-green-400" : "text-foreground"}>
            {filledCode}
          </code>
        </pre>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {challenge.options.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={`justify-center h-auto py-3 px-4 font-mono ${
                selectedAnswer === option.value
                  ? isCorrect
                    ? "border-green-500 bg-green-500/20"
                    : "border-red-500 bg-red-500/20"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={isCorrect !== null}
            >
              <span className="flex-1">{option.label}</span>
              {selectedAnswer === option.value && (
                isCorrect ? (
                  <Check className="w-5 h-5 text-green-500 ml-2" />
                ) : (
                  <X className="w-5 h-5 text-red-500 ml-2" />
                )
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Explanation */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">解析</span>
          </div>
          <p className="text-sm text-green-300">{challenge.explanation}</p>
        </motion.div>
      )}

      {/* Hint */}
      {!showHint && isCorrect === null && (
        <Button
          variant="ghost"
          onClick={() => setShowHint(true)}
          className="w-full gap-2"
        >
          <HelpCircle className="w-4 h-4" /> 需要提示？
        </Button>
      )}

      {showHint && !showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
        >
          <p className="text-sm text-blue-400">💡 提示：{challenge.hint}</p>
        </motion.div>
      )}

      {/* Completion */}
      {completedChallenges === challenges.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-primary/20 rounded-lg border border-primary/40"
        >
          <h3 className="text-xl font-semibold text-primary mb-2">🎊 挑戰完成！</h3>
          <p className="text-muted-foreground">
            你已掌握滑動視窗的核心邏輯：增量更新、邊界處理、最值追蹤
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
