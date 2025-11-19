import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
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
    question: "依序執行 Enqueue(A), Enqueue(B), Dequeue(), Enqueue(C), Dequeue()，最後佇列中剩下哪些元素？",
    options: [
      { label: "A, B", value: "ab", isCorrect: false },
      { label: "C", value: "c", isCorrect: true },
      { label: "B, C", value: "bc", isCorrect: false },
      { label: "空佇列", value: "empty", isCorrect: false },
    ],
    explanation: "A先進先出，B也先出，最後只剩下C",
  },
  {
    id: 2,
    question: "哪種演算法通常使用佇列 (Queue) 來實作？",
    options: [
      { label: "深度優先搜尋 (DFS)", value: "dfs", isCorrect: false },
      { label: "廣度優先搜尋 (BFS)", value: "bfs", isCorrect: true },
      { label: "快速排序 (Quick Sort)", value: "quick", isCorrect: false },
    ],
    explanation: "BFS 需要按層級順序探索，符合佇列的 FIFO 特性",
  },
  {
    id: 3,
    question: "在印表機列印佇列中，如果文件按 1→2→3 的順序提交，哪個文件會最先被列印？",
    options: [
      { label: "文件 3", value: "3", isCorrect: false },
      { label: "文件 1", value: "1", isCorrect: true },
      { label: "隨機選擇", value: "random", isCorrect: false },
    ],
    explanation: "佇列遵循 FIFO 原則，先提交的文件 1 會最先被列印",
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
        description: "你對佇列有深入的理解",
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
        description: "提示：思考 FIFO 的順序",
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
          你已完全掌握佇列的 FIFO 原則與應用！
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary/10 p-6 rounded-lg border border-primary/30 max-w-lg"
        >
          <p className="text-foreground/80 text-center">
            佇列在現實世界中無處不在，從作業系統到網路傳輸，<br/>
            公平且有序的 FIFO 原則是其核心價值！
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          佇列試煉
        </h2>
        <p className="text-foreground/70">測試你對佇列運作的理解</p>
      </motion.div>

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
