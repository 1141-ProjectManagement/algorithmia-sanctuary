import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, HelpCircle, Code, Key } from "lucide-react";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  scenario: string;
  codeTemplate?: string;
  blankPlaceholder?: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  hint: string;
  explanation: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "計算雜湊值",
    description: "使用簡單模運算 (key % 8) 計算鑰匙 37 應該存入哪個寶箱？",
    scenario: "鑰匙：37，寶箱數量：8",
    options: [
      { label: "#3", value: "3" },
      { label: "#4", value: "4" },
      { label: "#5", value: "5" },
      { label: "#6", value: "6" }
    ],
    correctAnswer: "5",
    hint: "37 除以 8 的餘數是多少？",
    explanation: "37 % 8 = 5（37 = 8 × 4 + 5），所以鑰匙 37 應存入寶箱 #5"
  },
  {
    id: 2,
    title: "預測碰撞",
    description: "寶箱 #4 已存放「龍之淚」(key=12)。現在要存入 key=20 的「鳳凰羽」，會發生什麼？",
    scenario: "已佔用：#4 (key=12)\n新鑰匙：20",
    options: [
      { label: "直接存入 #4", value: "direct" },
      { label: "發生碰撞，需要處理", value: "collision" },
      { label: "存入 #2", value: "2" },
      { label: "無法存入", value: "fail" }
    ],
    correctAnswer: "collision",
    hint: "計算 20 % 8 的結果，然後看看那個位置是否已被佔用",
    explanation: "20 % 8 = 4，但 #4 已被佔用，所以會發生碰撞！需要使用碰撞處理策略（如線性探測）"
  },
  {
    id: 3,
    title: "線性探測",
    description: "碰撞發生在 #4。使用線性探測法，「鳳凰羽」最終會存入哪個寶箱？（假設 #5 是空的）",
    scenario: "碰撞位置：#4\n線性探測：檢查 #5, #6, #7...",
    codeTemplate: `// 線性探測碰撞處理
let index = 20 % 8;  // = 4 (碰撞！)

while (buckets[index] !== null) {
  index = (index + 1) % 8;
}
// 最終 index = ?`,
    options: [
      { label: "#4", value: "4" },
      { label: "#5", value: "5" },
      { label: "#6", value: "6" },
      { label: "#0", value: "0" }
    ],
    correctAnswer: "5",
    hint: "從碰撞位置往後找第一個空位",
    explanation: "線性探測從 #4 開始，檢查 #5 發現為空，所以存入 #5"
  },
  {
    id: 4,
    title: "補全碰撞處理代碼",
    description: "完成線性探測的迴圈條件，讓程式能找到空位。",
    scenario: "目標：當位置被佔用時，繼續尋找下一個空位",
    codeTemplate: `function insert(key, value) {
  let index = key % size;
  
  while (_________) {
    index = (index + 1) % size;
  }
  
  buckets[index] = { key, value };
}`,
    blankPlaceholder: "_________",
    options: [
      { label: "buckets[index] !== null", value: "buckets[index] !== null" },
      { label: "buckets[index] === null", value: "buckets[index] === null" },
      { label: "index < size", value: "index < size" },
      { label: "true", value: "true" }
    ],
    correctAnswer: "buckets[index] !== null",
    hint: "我們要在位置「不為空」時繼續尋找",
    explanation: "while (buckets[index] !== null) 表示：當位置被佔用時，繼續往下找。找到空位（null）時迴圈結束"
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
        description: "雜湊邏輯完美！",
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
            description: "你已完全掌握雜湊表的運作原理！",
          });
        }
      }, 2500);
    } else {
      toast({
        title: "❌ 再想想",
        description: "仔細計算雜湊值或思考碰撞處理邏輯",
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
          {challenge.codeTemplate ? (
            <Code className="w-5 h-5 text-primary" />
          ) : (
            <Key className="w-5 h-5 text-primary" />
          )}
          <h4 className="text-lg font-semibold text-primary">{challenge.title}</h4>
        </div>

        <p className="text-foreground mb-4">{challenge.description}</p>

        {/* Scenario */}
        <div className="p-4 bg-background/60 rounded-lg mb-4 font-mono text-sm">
          <pre className="text-muted-foreground whitespace-pre-wrap">{challenge.scenario}</pre>
        </div>

        {/* Code Template */}
        {challenge.codeTemplate && (
          <pre className="p-4 bg-background/80 rounded-lg font-mono text-sm mb-4 border border-border overflow-x-auto">
            <code className="text-foreground">{challenge.codeTemplate}</code>
          </pre>
        )}

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
            <Check className="w-4 h-4 text-green-400" />
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
            你已掌握雜湊表的核心：雜湊函數、O(1) 查找、碰撞處理
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
