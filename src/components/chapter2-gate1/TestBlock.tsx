import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Lock, Check, X, Lightbulb, RotateCcw } from "lucide-react";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  type: "predict" | "fix";
  array: number[];
  comparingIndex: number;
  correctAnswer: "swap" | "keep";
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: "predict",
    array: [64, 34, 25, 12, 22],
    comparingIndex: 0,
    correctAnswer: "swap",
    hint: "比較 64 和 34，哪個數字更大？升序排列時，大的應該在後面。",
  },
  {
    id: 2,
    type: "predict",
    array: [34, 64, 25, 12, 22],
    comparingIndex: 0,
    correctAnswer: "keep",
    hint: "比較 34 和 64，34 < 64，升序排列時順序已經正確了。",
  },
  {
    id: 3,
    type: "predict",
    array: [25, 34, 12, 22, 64],
    comparingIndex: 1,
    correctAnswer: "swap",
    hint: "比較 arr[1]=34 和 arr[2]=12，34 > 12 需要交換嗎？",
  },
  {
    id: 4,
    type: "predict",
    array: [12, 22, 25, 34, 64],
    comparingIndex: 2,
    correctAnswer: "keep",
    hint: "陣列幾乎排好了！比較 25 和 34，順序對嗎？",
  },
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"swap" | "keep" | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const challenge = challenges[currentChallenge];
  const { comparingIndex } = challenge;

  const handleAnswer = useCallback((answer: "swap" | "keep") => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === challenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      toast({
        title: "✨ 正確！",
        description: challenge.correctAnswer === "swap" 
          ? "沒錯！這兩個元素需要交換位置" 
          : "很好！它們的順序已經正確了",
      });

      setCompletedCount((prev) => prev + 1);

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge((prev) => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
        } else {
          toast({
            title: "🎉 恭喜通關！",
            description: "你已經掌握了 Bubble Sort 的核心邏輯",
          });
          onComplete();
        }
      }, 1500);
    } else {
      toast({
        title: "❌ 再想想",
        description: "仔細比較兩個數字的大小關係",
        variant: "destructive",
      });
      setShakeIndex(comparingIndex);
      setTimeout(() => {
        setShakeIndex(null);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    }
  }, [selectedAnswer, challenge, currentChallenge, toast, onComplete, comparingIndex]);

  const resetChallenge = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
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
                  ? "bg-primary"
                  : idx === currentChallenge
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Challenge Title */}
      <div className="text-center">
        <h3 className="text-xl font-['Cinzel'] text-primary mb-2">
          預判交換
        </h3>
        <p className="text-muted-foreground">
          觀察高亮的兩個寶石，它們需要交換位置嗎？（升序排列）
        </p>
      </div>

      {/* Array Visualization */}
      <div className="flex justify-center gap-2 md:gap-4 flex-wrap py-6">
        {challenge.array.map((value, index) => {
          const isComparing = index === comparingIndex || index === comparingIndex + 1;
          const isShaking = shakeIndex !== null && isComparing;

          return (
            <motion.div
              key={index}
              animate={isShaking ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col items-center`}
            >
              <motion.div
                animate={isComparing ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-lg font-bold border-2 ${
                  isComparing
                    ? "bg-primary/30 border-primary text-primary shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    : "bg-card/40 border-border text-foreground"
                }`}
              >
                {value}
              </motion.div>
              <span className="text-xs text-muted-foreground mt-1">[{index}]</span>
              
              {/* Comparison arrows */}
              {index === comparingIndex && (
                <div className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2">
                  <ArrowRightLeft className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Info */}
      <div className="text-center p-4 bg-card/40 rounded-lg border border-primary/20">
        <p className="text-foreground">
          比較 <span className="text-primary font-bold">arr[{comparingIndex}] = {challenge.array[comparingIndex]}</span>
          {" "}和{" "}
          <span className="text-primary font-bold">arr[{comparingIndex + 1}] = {challenge.array[comparingIndex + 1]}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {challenge.array[comparingIndex]} {">"} {challenge.array[comparingIndex + 1]} ?
        </p>
      </div>

      {/* Answer Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          variant={selectedAnswer === "swap" ? (isCorrect ? "default" : "destructive") : "outline"}
          onClick={() => handleAnswer("swap")}
          disabled={selectedAnswer !== null && isCorrect === true}
          className="px-8"
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          交換
          {selectedAnswer === "swap" && (
            isCorrect ? <Check className="ml-2 h-4 w-4" /> : <X className="ml-2 h-4 w-4" />
          )}
        </Button>
        <Button
          size="lg"
          variant={selectedAnswer === "keep" ? (isCorrect ? "default" : "destructive") : "outline"}
          onClick={() => handleAnswer("keep")}
          disabled={selectedAnswer !== null && isCorrect === true}
          className="px-8"
        >
          <Lock className="mr-2 h-4 w-4" />
          保持
          {selectedAnswer === "keep" && (
            isCorrect ? <Check className="ml-2 h-4 w-4" /> : <X className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Hint Section */}
      <AnimatePresence>
        {!isCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            {!showHint ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                需要提示？
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center max-w-md"
              >
                <p className="text-foreground/80">{challenge.hint}</p>
              </motion.div>
            )}

            {selectedAnswer !== null && !isCorrect && (
              <Button variant="outline" size="sm" onClick={resetChallenge}>
                <RotateCcw className="mr-2 h-4 w-4" />
                重試
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Message */}
      {completedCount === challenges.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-primary/20 rounded-lg border border-primary/40"
        >
          <p className="text-xl text-primary font-['Cinzel'] mb-2">
            🎉 關卡完成！
          </p>
          <p className="text-foreground/80">
            你已經掌握了 Bubble Sort 的核心判斷邏輯
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
