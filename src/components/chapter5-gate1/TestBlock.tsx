import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Lightbulb, AlertTriangle } from "lucide-react";

interface Challenge {
  id: number;
  type: "activity" | "coin-success" | "coin-trap";
  question: string;
  scenario?: string;
  options: { value: string; label: string; correct: boolean }[];
  explanation: string;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: "activity",
    question: "活動選擇問題中，貪婪策略應該按什麼排序？",
    scenario: "給定活動 A(1-4), B(3-5), C(0-6), D(5-7)，目標是選擇最多不重疊的活動。",
    options: [
      { value: "start", label: "按開始時間排序", correct: false },
      { value: "duration", label: "按持續時間排序", correct: false },
      { value: "end", label: "按結束時間排序", correct: true },
      { value: "random", label: "隨機選擇", correct: false },
    ],
    explanation: "按結束時間排序能確保每次選擇後，剩餘時間最多，為後續活動留下最大空間。",
    hint: "想想哪種排序能為後續活動留下最多時間？",
  },
  {
    id: 2,
    type: "coin-success",
    question: "使用幣值 [1, 5, 10, 25]，貪婪法找零 41 分需要幾枚硬幣？",
    scenario: "貪婪策略：每次選擇不超過剩餘金額的最大面額硬幣。",
    options: [
      { value: "3", label: "3 枚", correct: false },
      { value: "4", label: "4 枚", correct: true },
      { value: "5", label: "5 枚", correct: false },
      { value: "6", label: "6 枚", correct: false },
    ],
    explanation: "貪婪法：25 + 10 + 5 + 1 = 41，共 4 枚硬幣。這也是最優解！",
    hint: "從最大面額開始，25 + 10 + ? + ? = 41",
  },
  {
    id: 3,
    type: "coin-trap",
    question: "使用幣值 [1, 3, 4]，貪婪法找零 6 分會用幾枚硬幣？",
    scenario: "這是一個經典的貪婪演算法陷阱案例！",
    options: [
      { value: "2", label: "2 枚", correct: false },
      { value: "3", label: "3 枚", correct: true },
      { value: "4", label: "4 枚", correct: false },
      { value: "5", label: "5 枚", correct: false },
    ],
    explanation: "貪婪法會選 4 + 1 + 1 = 3 枚，但最優解是 3 + 3 = 2 枚！這說明貪婪不總是正確的。",
    hint: "貪婪會先選最大的 4，然後...",
  },
  {
    id: 4,
    type: "coin-trap",
    question: "承上題，使用 [1, 3, 4] 找零 6 分的真正最優解是？",
    scenario: "貪婪法給出 3 枚，但存在更好的解法。",
    options: [
      { value: "4+1+1", label: "4 + 1 + 1 = 3 枚", correct: false },
      { value: "3+3", label: "3 + 3 = 2 枚", correct: true },
      { value: "1+1+1+1+1+1", label: "1×6 = 6 枚", correct: false },
      { value: "4+2", label: "4 + 2 = 無法湊成", correct: false },
    ],
    explanation: "3 + 3 = 2 枚才是全域最優解！這證明貪婪策略在某些幣值組合下會失效。",
    hint: "不要從最大面額開始，試試其他組合...",
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
  const [showTrapWarning, setShowTrapWarning] = useState(false);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const handleAnswer = (value: string) => {
    const option = challenge.options.find((o) => o.value === value);
    if (!option) return;

    setSelectedAnswer(value);
    setIsCorrect(option.correct);

    if (option.correct) {
      toast({
        title: "✨ 正確！",
        description: challenge.explanation,
      });

      // Show trap warning for coin-trap type
      if (challenge.type === "coin-trap" && challenge.id === 3) {
        setShowTrapWarning(true);
      }

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
          setShowTrapWarning(false);
        } else {
          onComplete();
          toast({
            title: "🎉 恭喜通關！",
            description: "你已掌握貪婪演算法的精髓，也理解了它的局限性。",
          });
        }
      }, 2500);
    } else {
      toast({
        title: "❌ 再想想",
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
                  ? "bg-green-500"
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
            challenge.type === "activity"
              ? "bg-blue-500/20 text-blue-400"
              : challenge.type === "coin-success"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {challenge.type === "activity"
            ? "活動選擇"
            : challenge.type === "coin-success"
            ? "找零（成功案例）"
            : "找零（陷阱案例）"}
        </span>
      </div>

      {/* Scenario */}
      {challenge.scenario && (
        <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">{challenge.scenario}</p>
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
                  ? "border-green-500 bg-green-500/10"
                  : "border-red-500 bg-red-500/10"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleAnswer(option.value)}
            disabled={isCorrect === true}
          >
            <span className="flex-1">{option.label}</span>
            {selectedAnswer === option.value && (
              isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )
            )}
          </Button>
        ))}
      </div>

      {/* Trap Warning */}
      <AnimatePresence>
        {showTrapWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-400 mb-1">陷阱觸發！</h4>
                <p className="text-sm text-foreground/80">
                  貪婪法得出 3 枚硬幣，但這不是最優解！
                  下一題將揭示真正的最優解。
                </p>
                <p className="text-sm text-primary mt-2 italic">
                  「貪婪是捷徑，但不總是真理」
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="p-4 bg-primary/10 rounded-lg border border-primary/30"
          >
            <p className="text-sm flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
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
            className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <p className="text-sm text-foreground/90">{challenge.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestBlock;
