import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, HelpCircle, Code, Target } from "lucide-react";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  type: "predict" | "code";
  title: string;
  description: string;
  array: number[];
  target: number;
  currentState?: { low: number; high: number; mid: number };
  codeTemplate?: string;
  options?: { label: string; value: string }[];
  correctAnswer: string;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: "predict",
    title: "預測下一步",
    description: "目前 mid 指向的值為 23，目標是 38。下一步應該如何更新邊界？",
    array: [5, 12, 18, 23, 31, 38, 45, 52],
    target: 38,
    currentState: { low: 0, high: 7, mid: 3 },
    options: [
      { label: "low = mid + 1 (搜尋右半邊)", value: "right" },
      { label: "high = mid - 1 (搜尋左半邊)", value: "left" },
      { label: "找到了，結束搜尋", value: "found" }
    ],
    correctAnswer: "right",
    hint: "比較 arr[mid]=23 與 target=38 的大小關係"
  },
  {
    id: 2,
    type: "predict",
    title: "預測搜尋方向",
    description: "陣列 [10, 20, 30, 40, 50]，目標是 15。mid=2，arr[mid]=30。應該往哪個方向搜尋？",
    array: [10, 20, 30, 40, 50],
    target: 15,
    currentState: { low: 0, high: 4, mid: 2 },
    options: [
      { label: "往右：low = mid + 1", value: "right" },
      { label: "往左：high = mid - 1", value: "left" },
      { label: "目標不存在", value: "notfound" }
    ],
    correctAnswer: "left",
    hint: "15 比 30 小，所以目標一定在左半邊"
  },
  {
    id: 3,
    type: "code",
    title: "補全邊界更新",
    description: "當 arr[mid] > target 時，目標在左半邊。應該如何更新 high？",
    array: [2, 8, 15, 23, 31, 42],
    target: 8,
    codeTemplate: `if (arr[mid] > target) {
  // 目標在左半邊
  __________;
}`,
    options: [
      { label: "high = mid - 1", value: "high = mid - 1" },
      { label: "high = mid", value: "high = mid" },
      { label: "high = mid + 1", value: "high = mid + 1" },
      { label: "low = mid - 1", value: "low = mid - 1" }
    ],
    correctAnswer: "high = mid - 1",
    hint: "排除 mid（已經比較過了），所以是 mid - 1"
  },
  {
    id: 4,
    type: "code",
    title: "補全搜尋條件",
    description: "當 arr[mid] < target 時，目標在右半邊。應該如何更新 low？",
    array: [5, 12, 19, 27, 35, 43, 51],
    target: 43,
    codeTemplate: `if (arr[mid] < target) {
  // 目標在右半邊
  __________;
}`,
    options: [
      { label: "low = mid + 1", value: "low = mid + 1" },
      { label: "low = mid", value: "low = mid" },
      { label: "low = mid - 1", value: "low = mid - 1" },
      { label: "high = mid + 1", value: "high = mid + 1" }
    ],
    correctAnswer: "low = mid + 1",
    hint: "排除 mid，從 mid+1 開始搜尋右半邊"
  }
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const handleAnswerSelect = (value: string) => {
    if (isCorrect !== null) return;
    
    setSelectedAnswer(value);
    const correct = value === challenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      toast({
        title: "✨ 正確！",
        description: "邏輯判斷精準！",
      });

      setTimeout(() => {
        const nextCompleted = completedChallenges + 1;
        setCompletedChallenges(nextCompleted);
        
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
        } else {
          onComplete();
          toast({
            title: "🎉 恭喜通關！",
            description: "你已掌握二分搜尋的核心邏輯！",
          });
        }
      }, 1500);
    } else {
      toast({
        title: "❌ 再想想",
        description: "仔細思考比較結果與搜尋方向的關係",
        variant: "destructive",
      });
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

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
          {challenge.type === "predict" ? (
            <Target className="w-5 h-5 text-primary" />
          ) : (
            <Code className="w-5 h-5 text-primary" />
          )}
          <h4 className="text-lg font-semibold text-primary">{challenge.title}</h4>
        </div>

        <p className="text-foreground mb-4">{challenge.description}</p>

        {/* Array Visualization */}
        <div className="p-4 bg-background/60 rounded-lg mb-4">
          <div className="text-sm text-muted-foreground mb-2">
            陣列：[{challenge.array.join(", ")}]，目標：{challenge.target}
          </div>
          {challenge.currentState && (
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                Low: {challenge.currentState.low}
              </span>
              <span className="px-2 py-1 bg-primary/20 text-primary rounded">
                Mid: {challenge.currentState.mid} (值={challenge.array[challenge.currentState.mid]})
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                High: {challenge.currentState.high}
              </span>
            </div>
          )}
        </div>

        {/* Code Template */}
        {challenge.codeTemplate && (
          <pre className="p-4 bg-background/80 rounded-lg font-mono text-sm mb-4 border border-border">
            <code className="text-foreground">{challenge.codeTemplate}</code>
          </pre>
        )}

        {/* Options */}
        <div className="grid gap-3">
          {challenge.options?.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={`justify-start h-auto py-3 px-4 text-left ${
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
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Hint */}
      {!showHint && isCorrect === false && (
        <Button
          variant="ghost"
          onClick={() => setShowHint(true)}
          className="w-full gap-2"
        >
          <HelpCircle className="w-4 h-4" /> 需要提示？
        </Button>
      )}

      {showHint && (
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
            你已掌握二分搜尋的核心邏輯：理解如何透過比較 mid 值來縮小搜尋範圍
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
