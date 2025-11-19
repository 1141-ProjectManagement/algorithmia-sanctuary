import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

const challenges = [
  { 
    input: "()", 
    isValid: true, 
    explanation: "一對括號正確閉合" 
  },
  { 
    input: "({[]})", 
    isValid: true, 
    explanation: "多層巢狀括號，由內而外依序閉合" 
  },
  { 
    input: "({[}])", 
    isValid: false, 
    explanation: "{ 與 } 之間插入了 [，違反 LIFO 順序" 
  },
  { 
    input: "(()", 
    isValid: false, 
    explanation: "有未閉合的左括號" 
  },
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);

  const currentChallenge = challenges[currentIndex];

  const checkBrackets = (input: string): boolean => {
    const stack: string[] = [];
    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };

    for (const char of input) {
      if (char in pairs) {
        stack.push(char);
      } else if (Object.values(pairs).includes(char)) {
        if (stack.length === 0 || pairs[stack[stack.length - 1]] !== char) {
          return false;
        }
        stack.pop();
      }
    }

    return stack.length === 0;
  };

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === currentChallenge.isValid;

    if (isCorrect) {
      toast({
        title: "✅ 答對了！",
        description: currentChallenge.explanation,
      });

      if (!completedChallenges.includes(currentIndex)) {
        setCompletedChallenges([...completedChallenges, currentIndex]);
      }

      setTimeout(() => {
        if (currentIndex === challenges.length - 1) {
          setAllCompleted(true);
          onComplete();
        } else {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
        }
      }, 2000);
    } else {
      toast({
        title: "❌ 再想想",
        description: "提示：用堆疊模擬括號配對過程",
        variant: "destructive",
      });
      setSelectedAnswer(null);
    }
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
          你已完全掌握堆疊結構與括號匹配演算法！
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary/10 p-6 rounded-lg border border-primary/30 max-w-lg"
        >
          <p className="text-foreground/80 text-center">
            堆疊的 LIFO 特性讓它成為處理配對問題的最佳工具。<br />
            從編譯器到瀏覽器，堆疊無處不在！
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
          括號匹配挑戰
        </h2>
        <p className="text-foreground/70">判斷括號序列是否正確配對</p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-2"
      >
        {challenges.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              completedChallenges.includes(index)
                ? "bg-primary"
                : index === currentIndex
                ? "bg-primary/50"
                : "bg-primary/20"
            }`}
          />
        ))}
      </motion.div>

      {/* Challenge Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card/40 p-8 rounded-lg border border-primary/20"
      >
        <div className="text-center mb-8">
          <p className="text-sm text-foreground/60 mb-4">
            挑戰 {currentIndex + 1} / {challenges.length}
          </p>
          <div className="bg-background/50 p-6 rounded-lg inline-block">
            <code className="text-4xl font-bold text-primary font-mono">
              {currentChallenge.input}
            </code>
          </div>
        </div>

        <p className="text-center text-lg text-foreground/80 mb-8">
          這個括號序列是否正確配對？
        </p>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={() => handleAnswer(true)}
            disabled={selectedAnswer !== null}
            whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
            whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedAnswer === true
                ? currentChallenge.isValid
                  ? "bg-green-500/20 border-green-500"
                  : "bg-destructive/20 border-destructive"
                : "bg-card/50 border-primary/30 hover:border-primary"
            } ${selectedAnswer !== null && "cursor-not-allowed opacity-60"}`}
          >
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <span className="text-lg font-semibold">正確配對</span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleAnswer(false)}
            disabled={selectedAnswer !== null}
            whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
            whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedAnswer === false
                ? !currentChallenge.isValid
                  ? "bg-green-500/20 border-green-500"
                  : "bg-destructive/20 border-destructive"
                : "bg-card/50 border-primary/30 hover:border-primary"
            } ${selectedAnswer !== null && "cursor-not-allowed opacity-60"}`}
          >
            <div className="flex flex-col items-center gap-2">
              <XCircle className="w-12 h-12 text-destructive" />
              <span className="text-lg font-semibold">配對錯誤</span>
            </div>
          </motion.button>
        </div>

        {/* Hint */}
        <div className="mt-8 bg-primary/10 p-4 rounded-lg border border-primary/30">
          <p className="text-sm text-foreground/70 text-center">
            💡 提示：遇到左括號 push，遇到右括號 pop 並檢查是否匹配
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TestBlock;
