import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  code?: string;
  options: {
    label: string;
    value: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "哪種資料結構適合「頻繁透過索引存取元素」的場景？",
    options: [
      { label: "陣列 (Array)", value: "array", isCorrect: true },
      { label: "鏈結串列 (Linked List)", value: "linked", isCorrect: false },
      { label: "兩者皆可", value: "both", isCorrect: false },
    ],
    explanation: "陣列透過索引可以 O(1) 直接存取任意元素，而鏈結串列需要 O(n) 遍歷。",
  },
  {
    id: 2,
    question: "在「頻繁在開頭插入元素」的場景中，哪種結構更高效？",
    options: [
      { label: "陣列 (Array)", value: "array", isCorrect: false },
      { label: "鏈結串列 (Linked List)", value: "linked", isCorrect: true },
      { label: "兩者相同", value: "same", isCorrect: false },
    ],
    explanation: "鏈結串列在開頭插入只需 O(1) 調整指標，陣列則需 O(n) 移動所有元素。",
  },
  {
    id: 3,
    question: "下列哪個說法是正確的？",
    options: [
      { label: "陣列佔用的記憶體空間總是比鏈結串列少", value: "less", isCorrect: false },
      { label: "鏈結串列需要額外儲存指標資訊", value: "pointer", isCorrect: true },
      { label: "陣列無法動態調整大小", value: "fixed", isCorrect: false },
    ],
    explanation: "鏈結串列的每個節點都需要額外儲存指向下一個節點的指標，增加記憶體開銷。",
  },
];

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (value: string) => {
    const option = currentQuestion.options.find((opt) => opt.value === value);
    if (!option) return;

    setSelectedAnswer(value);
    setIsCorrect(option.isCorrect);
    setShowExplanation(true);

    if (option.isCorrect) {
      toast({
        title: "✅ 答對了！",
        description: "你對資料結構有深入的理解",
      });

      if (!completedQuestions.includes(currentQuestion.id)) {
        setCompletedQuestions([...completedQuestions, currentQuestion.id]);
      }

      setTimeout(() => {
        if (isLastQuestion) {
          setAllCompleted(true);
          onComplete();
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          resetQuestion();
        }
      }, 2000);
    } else {
      toast({
        title: "❌ 再想想",
        description: "提示：思考兩種結構的操作複雜度",
        variant: "destructive",
      });
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  if (allCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-16 h-16 text-primary" />
        </motion.div>
        
        <h2 className="font-['Cinzel'] text-4xl text-primary mb-4 text-center drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]">
          🎉 挑戰完成！
        </h2>
        
        <p className="text-xl text-foreground/80 mb-8 text-center max-w-md">
          你已完全掌握陣列與鏈結串列的核心概念！
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary/10 p-6 rounded-lg border border-primary/30 max-w-lg"
        >
          <p className="text-foreground/80 text-center">
            記住：沒有絕對完美的資料結構，只有最適合特定場景的選擇。<br/>
            在實際開發中，要根據操作頻率來決定使用哪種結構。
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          容器試煉
        </h2>
        <p className="text-foreground/70">測試你對資料結構的理解</p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-2"
      >
        {questions.map((q, index) => (
          <div
            key={q.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              completedQuestions.includes(q.id)
                ? "bg-primary"
                : index === currentQuestionIndex
                ? "bg-primary/50"
                : "bg-primary/20"
            }`}
          />
        ))}
      </motion.div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
            {currentQuestionIndex + 1}
          </div>
          <p className="text-lg text-foreground/90 leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {currentQuestion.code && (
          <pre className="bg-background/50 p-4 rounded-lg mb-6 overflow-x-auto text-sm">
            <code>{currentQuestion.code}</code>
          </pre>
        )}

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={selectedAnswer !== null}
              whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
              whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedAnswer === option.value
                  ? option.isCorrect
                    ? "border-green-500 bg-green-500/20"
                    : "border-destructive bg-destructive/20"
                  : "border-border hover:border-primary/50 bg-card/30"
              } ${selectedAnswer !== null && "cursor-not-allowed opacity-60"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground/90">{option.label}</span>
                {selectedAnswer === option.value && (
                  <span>
                    {option.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-primary mb-1">解析</p>
                <p className="text-sm text-foreground/80">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TestBlock;
