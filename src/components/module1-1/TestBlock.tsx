import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import hourglassCrystal from "@/assets/hourglass-crystal.png";
import bigOBadge from "@/assets/big-o-badge.png";

interface CodeSnippet {
  id: string;
  code: string;
  description: string;
  correctAnswer: string;
}

const challenges: CodeSnippet[] = [
  {
    id: "c1",
    code: "function getFirst(arr) {\n  return arr[0];\n}",
    description: "取得陣列第一個元素",
    correctAnswer: "O(1)"
  },
  {
    id: "c2",
    code: "function findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}",
    description: "找出陣列中的最大值",
    correctAnswer: "O(n)"
  },
  {
    id: "c3",
    code: "function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n}",
    description: "氣泡排序演算法",
    correctAnswer: "O(n²)"
  }
];

const complexities = ["O(1)", "O(n)", "O(n²)"];

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number>(0);
  const [showBadge, setShowBadge] = useState(false);
  const { toast } = useToast();

  const currentChallengeData = challenges[currentChallenge];

  const handleAnswerSelect = (complexity: string) => {
    setSelectedAnswer(complexity);
    const correct = complexity === currentChallengeData.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      // Confetti effect
      toast({
        title: "✨ 正確！",
        description: "沙漏以正確的速度流動，古老的機關認可了你的智慧！",
      });

      const newCompleted = completedChallenges + 1;
      setCompletedChallenges(newCompleted);

      // Move to next challenge or complete
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
        } else {
          // All challenges completed
          setShowBadge(true);
          onComplete();
          toast({
            title: "🎉 恭喜通關！",
            description: "你已完成所有挑戰！",
          });
        }
      }, 2000);
    } else {
      toast({
        title: "❌ 答錯了",
        description: "沙漏的流速不對勁...再仔細思考一下吧！",
        variant: "destructive",
      });
    }
  };

  const getHint = () => {
    const hints = {
      "O(1)": "提示：這個操作無論陣列多大，都只需要固定時間完成",
      "O(n)": "提示：這個操作需要檢查陣列中的每一個元素",
      "O(n²)": "提示：注意程式碼中有兩層迴圈，每層都遍歷整個陣列"
    };
    return hints[currentChallengeData.correctAnswer as keyof typeof hints];
  };

  if (showBadge) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-6"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <img 
            src={bigOBadge} 
            alt="Big O 光芒徽章"
            className="w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.9)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Award className="w-8 h-8 text-primary" />
            <h3 className="text-3xl font-['Cinzel'] text-primary">通關成功！</h3>
            <Sparkles className="w-8 h-8 text-amber-glow" />
          </div>
          
          <p className="text-lg text-foreground/90 max-w-md">
            你已掌握效率之尺的奧秘，獲得了 <strong className="text-primary">Big O 光芒徽章</strong>！
            這將是你探索更深層神殿的通行證。
          </p>

          <div className="pt-4 space-y-3">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm text-foreground/80">
                🏆 完成度：{completedChallenges}/{challenges.length} 挑戰全部完成
              </p>
            </div>
            
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
              onClick={() => window.location.href = "/"}
            >
              返回探索地圖
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h3 className="text-2xl font-['Cinzel'] text-primary">
          挑戰 {currentChallenge + 1} / {challenges.length}
        </h3>
        <p className="text-muted-foreground">
          將程式碼片段拖曳到對應的時間複雜度沙漏上
        </p>
        <div className="flex justify-center gap-2 pt-2">
          {challenges.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < completedChallenges
                  ? "bg-primary shadow-glow-gold"
                  : index === currentChallenge
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Code Snippet */}
      <motion.div
        key={currentChallenge}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-card rounded-lg border-2 border-primary/30"
      >
        <p className="text-sm text-muted-foreground mb-3">
          {currentChallengeData.description}
        </p>
        <pre className="text-sm font-mono bg-black/40 p-4 rounded overflow-x-auto">
          {currentChallengeData.code}
        </pre>
      </motion.div>

      {/* Hourglass Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {complexities.map((complexity) => (
          <motion.div
            key={complexity}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (isCorrect !== true) && handleAnswerSelect(complexity)}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAnswer === complexity
                ? isCorrect
                  ? "border-primary bg-primary/10 shadow-glow-gold"
                  : "border-destructive bg-destructive/10"
                : "border-border bg-card/40 hover:border-primary/50"
            } ${selectedAnswer && selectedAnswer !== complexity ? "opacity-50" : ""}`}
          >
            <div className="flex flex-col items-center gap-4">
              <img 
                src={hourglassCrystal} 
                alt={complexity}
                className="w-24 h-24 object-contain"
              />
              <span className="text-xl font-['Cinzel'] text-primary">
                {complexity}
              </span>
              
              {selectedAnswer === complexity && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  ) : (
                    <XCircle className="w-8 h-8 text-destructive" />
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hint Button */}
      <AnimatePresence>
        {!selectedAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              {showHint ? "隱藏提示" : "需要提示？"}
            </Button>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-amber-glow/10 rounded-lg border border-amber-glow/30 max-w-md"
              >
                <p className="text-sm text-foreground/90">
                  {getHint()}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestBlock;
