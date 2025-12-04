import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, Code, GitBranch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  type: 'prediction' | 'code';
  question: string;
  scenario?: string;
  code?: string;
  options: { label: string; value: string; }[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: 'prediction',
    question: "Merge Sort 分割 [8, 3, 7, 1] 後的第一層是什麼？",
    scenario: "光束進入殿堂，準備被第一道稜鏡分割...",
    options: [
      { label: "[8, 3] 和 [7, 1]", value: "a" },
      { label: "[8] 和 [3, 7, 1]", value: "b" },
      { label: "[8, 3, 7] 和 [1]", value: "c" },
      { label: "[3, 8] 和 [1, 7]", value: "d" },
    ],
    correctAnswer: "a",
    explanation: "Merge Sort 從中間切分，所以 [8, 3, 7, 1] 分為 [8, 3] 和 [7, 1]",
    hint: "記住：Merge Sort 總是從中間點切分陣列"
  },
  {
    id: 2,
    type: 'code',
    question: "填入正確的比較條件完成 merge 函數",
    code: `function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] ___ right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return [...result, ...left, ...right];
}`,
    options: [
      { label: "<", value: "<" },
      { label: ">", value: ">" },
      { label: "<=", value: "<=" },
      { label: "===", value: "===" },
    ],
    correctAnswer: "<=",
    explanation: "使用 <= 可以保持穩定排序（相等元素維持原順序）",
    hint: "想想：如果兩邊數值相等，應該先放哪一邊才能保持穩定性？"
  },
  {
    id: 3,
    type: 'prediction',
    question: "Quick Sort 以最後一個元素為 Pivot，[5, 2, 8, 1, 9] 分區後的結果？",
    scenario: "Pivot 是 9，較小的元素將被彈射到左側...",
    options: [
      { label: "[5, 2, 8, 1] | 9 | []", value: "a" },
      { label: "[2, 1] | 9 | [5, 8]", value: "b" },
      { label: "[] | 9 | [5, 2, 8, 1]", value: "c" },
      { label: "[1, 2, 5, 8] | 9 | []", value: "d" },
    ],
    correctAnswer: "a",
    explanation: "Pivot=9，所有其他元素 (5,2,8,1) 都比 9 小，所以全部在左邊",
    hint: "Pivot 是 9，比較其他所有元素和 9 的大小關係"
  },
  {
    id: 4,
    type: 'prediction',
    question: "合併 [2, 5] 和 [1, 8] 時，第一個被放入結果的元素是？",
    scenario: "兩道光流準備匯聚，比較最前端的粒子...",
    options: [
      { label: "2", value: "2" },
      { label: "5", value: "5" },
      { label: "1", value: "1" },
      { label: "8", value: "8" },
    ],
    correctAnswer: "1",
    explanation: "合併時比較兩個陣列的第一個元素，1 < 2，所以 1 先進入結果",
    hint: "merge 時總是比較兩邊「最前面」的元素"
  },
  {
    id: 5,
    type: 'code',
    question: "Quick Sort 的時間複雜度在最壞情況下是？",
    scenario: "當每次選到的 Pivot 都是最大或最小值時...",
    options: [
      { label: "O(n)", value: "n" },
      { label: "O(n log n)", value: "nlogn" },
      { label: "O(n²)", value: "n2" },
      { label: "O(log n)", value: "logn" },
    ],
    correctAnswer: "n2",
    explanation: "最壞情況：每次 Pivot 都是極值，導致分區極度不平衡，退化為 O(n²)",
    hint: "如果陣列已經排序好，每次選最後一個作為 Pivot 會發生什麼？"
  }
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const handleAnswerSelect = (value: string) => {
    if (isCorrect !== null) return;
    
    setSelectedAnswer(value);
    const correct = value === challenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      
      toast({
        title: "✨ 正確！",
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
            title: "🎉 恭喜通關！",
            description: "你已掌握分而治之的精髓！",
          });
        }
      }, 2000);
    } else {
      toast({
        title: "❌ 再想想",
        description: "點擊提示按鈕獲取幫助",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          挑戰 {currentChallenge + 1} / {challenges.length}
        </span>
        <div className="flex gap-1">
          {challenges.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx < completedCount
                  ? 'bg-primary'
                  : idx === currentChallenge
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-6 bg-card/40 rounded-lg border border-primary/30"
        >
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            {challenge.type === 'code' ? (
              <Code className="w-4 h-4 text-amber-400" />
            ) : (
              <GitBranch className="w-4 h-4 text-blue-400" />
            )}
            <span className={`text-xs px-2 py-1 rounded ${
              challenge.type === 'code' 
                ? 'bg-amber-500/20 text-amber-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {challenge.type === 'code' ? '程式修復' : '邏輯預測'}
            </span>
          </div>

          {/* Scenario */}
          {challenge.scenario && (
            <p className="text-sm text-muted-foreground italic mb-4">
              "{challenge.scenario}"
            </p>
          )}

          {/* Question */}
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {challenge.question}
          </h4>

          {/* Code Block */}
          {challenge.code && (
            <pre className="p-4 bg-black/40 rounded-lg text-sm font-mono text-primary/90 mb-4 overflow-x-auto">
              {challenge.code}
            </pre>
          )}

          {/* Options */}
          <div className="grid gap-3">
            {challenge.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => handleAnswerSelect(option.value)}
                disabled={isCorrect !== null}
                className={`h-auto py-3 px-4 justify-start text-left ${
                  selectedAnswer === option.value
                    ? isCorrect
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-red-500 bg-red-500/20'
                    : ''
                }`}
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

          {/* Hint Button */}
          {!showHint && isCorrect === false && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
                className="text-muted-foreground"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                需要提示？
              </Button>
            </motion.div>
          )}

          {/* Hint Display */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
            >
              <p className="text-sm text-amber-400">
                💡 {challenge.hint}
              </p>
            </motion.div>
          )}

          {/* Explanation on correct answer */}
          {isCorrect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <p className="text-sm text-green-400">
                ✓ {challenge.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Retry Button */}
      {isCorrect === false && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedAnswer(null);
              setIsCorrect(null);
            }}
          >
            再試一次
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestBlock;
