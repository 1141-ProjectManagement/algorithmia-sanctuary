import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  type: "code_fix" | "path_predict";
  title: string;
  description: string;
  buggyCode?: string[];
  correctCode?: string[];
  bugLine?: number;
  tree: { value: number; left?: number; right?: number }[];
  target?: number;
  correctAnswer: string;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: "code_fix",
    title: "修復比較邏輯",
    description: "導航咒語的比較符號被反轉了！請找出錯誤並選擇正確的修復方式。",
    buggyCode: [
      "function search(node, target) {",
      "  if (target === node.value) return node;",
      "  if (target > node.value) {  // ❌ 錯誤！",
      "    return search(node.left, target);",
      "  } else {",
      "    return search(node.right, target);",
      "  }",
      "}",
    ],
    bugLine: 2,
    tree: [
      { value: 50 },
      { value: 30 },
      { value: 70 },
    ],
    correctAnswer: "change_operator",
    hint: "想想看：當目標比當前節點大時，應該往哪邊找？BST 的規則是「左小右大」。",
  },
  {
    id: 2,
    type: "path_predict",
    title: "預測搜尋路徑",
    description: "在這棵 BST 中搜尋數字 25，第一步應該往哪個方向？",
    tree: [
      { value: 50, left: 30, right: 70 },
      { value: 30, left: 20, right: 40 },
      { value: 70, left: 60, right: 80 },
    ],
    target: 25,
    correctAnswer: "left",
    hint: "25 和根節點 50 比較，25 < 50，所以應該往...",
  },
  {
    id: 3,
    type: "path_predict",
    title: "計算搜尋步數",
    description: "在這棵 BST 中搜尋數字 60，需要幾步才能找到？",
    tree: [
      { value: 50, left: 30, right: 70 },
      { value: 30, left: 20, right: 40 },
      { value: 70, left: 60, right: 80 },
    ],
    target: 60,
    correctAnswer: "3",
    hint: "路徑是：50 → 70 → 60，數一數經過了幾個節點。",
  },
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<"success" | "fail" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const options = useMemo(() => {
    if (challenge.type === "code_fix") {
      return [
        { id: "change_operator", label: "將 > 改成 <", description: "修正比較運算符" },
        { id: "swap_branches", label: "交換 left 和 right", description: "修正遞迴方向" },
        { id: "both", label: "兩個都要改", description: "運算符和方向都錯了" },
      ];
    } else if (challenge.correctAnswer === "left" || challenge.correctAnswer === "right") {
      return [
        { id: "left", label: "往左走 ◀", description: `因為 ${challenge.target} < 根節點` },
        { id: "right", label: "往右走 ▶", description: `因為 ${challenge.target} > 根節點` },
      ];
    } else {
      return [
        { id: "2", label: "2 步", description: "很快就找到了" },
        { id: "3", label: "3 步", description: "需要經過三個節點" },
        { id: "4", label: "4 步", description: "要走到很深的地方" },
      ];
    }
  }, [challenge]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === challenge.correctAnswer;
    setShowResult(isCorrect ? "success" : "fail");

    if (isCorrect) {
      toast({
        title: "✨ 正確！",
        description: challenge.type === "code_fix" 
          ? "你成功修復了導航咒語！"
          : "你準確預測了搜尋路徑！",
      });

      const newCompleted = [...completedChallenges, challenge.id];
      setCompletedChallenges(newCompleted);

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
          setShowResult(null);
          setShowHint(false);
        } else {
          onComplete();
          toast({
            title: "🎉 恭喜通關！",
            description: "你已掌握二元搜尋樹的搜尋邏輯！",
          });
        }
      }, 1500);
    } else {
      toast({
        title: "答錯了",
        description: "再想想 BST 的核心規則：左小右大",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(null);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-center gap-2">
        {challenges.map((c, index) => (
          <div
            key={c.id}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              completedChallenges.includes(c.id)
                ? "bg-primary border-primary text-primary-foreground"
                : index === currentChallenge
                ? "border-primary text-primary"
                : "border-muted text-muted-foreground"
            }`}
          >
            {completedChallenges.includes(c.id) ? <CheckCircle className="w-5 h-5" /> : index + 1}
          </div>
        ))}
      </div>

      {/* Challenge Card */}
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/60 border border-primary/20 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-primary mb-2">{challenge.title}</h4>
        <p className="text-muted-foreground mb-4">{challenge.description}</p>

        {/* Tree Visualization */}
        <div className="bg-card/40 border border-border/50 rounded-lg p-4 mb-4">
          <svg viewBox="0 0 200 100" className="w-full max-w-sm mx-auto h-auto">
            {/* Edges */}
            <line x1="100" y1="20" x2="50" y2="55" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="100" y1="20" x2="150" y2="55" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="55" x2="25" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="55" x2="75" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="55" x2="125" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="55" x2="175" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
            
            {/* Nodes */}
            <circle cx="100" cy="20" r="14" fill="hsl(var(--primary))" />
            <text x="100" y="25" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="11" fontWeight="bold">50</text>
            
            <circle cx="50" cy="55" r="12" fill="#22d3ee" opacity="0.8" />
            <text x="50" y="59" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">30</text>
            
            <circle cx="150" cy="55" r="12" fill="#fbbf24" opacity="0.8" />
            <text x="150" y="59" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">70</text>
            
            <circle cx="25" cy="85" r="10" fill="#22d3ee" opacity="0.6" />
            <text x="25" y="89" textAnchor="middle" fill="black" fontSize="9" fontWeight="bold">20</text>
            
            <circle cx="75" cy="85" r="10" fill="#22d3ee" opacity="0.6" />
            <text x="75" y="89" textAnchor="middle" fill="black" fontSize="9" fontWeight="bold">40</text>
            
            <circle cx="125" cy="85" r="10" fill="#fbbf24" opacity="0.6" />
            <text x="125" y="89" textAnchor="middle" fill="black" fontSize="9" fontWeight="bold">60</text>
            
            <circle cx="175" cy="85" r="10" fill="#fbbf24" opacity="0.6" />
            <text x="175" y="89" textAnchor="middle" fill="black" fontSize="9" fontWeight="bold">80</text>
          </svg>
          
          {challenge.target && (
            <p className="text-center text-sm text-primary mt-2">
              🎯 搜尋目標：<span className="font-bold">{challenge.target}</span>
            </p>
          )}
        </div>

        {/* Buggy Code Display */}
        {challenge.buggyCode && (
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm mb-4">
            {challenge.buggyCode.map((line, index) => (
              <div
                key={index}
                className={`py-0.5 ${
                  index === challenge.bugLine ? "bg-destructive/20 border-l-2 border-destructive" : ""
                }`}
              >
                <span className={index === challenge.bugLine ? "text-destructive" : "text-muted-foreground"}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="grid gap-3">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={selectedAnswer === option.id ? "default" : "outline"}
              className={`h-auto py-3 justify-start text-left ${
                showResult && selectedAnswer === option.id
                  ? showResult === "success"
                    ? "bg-emerald-500/20 border-emerald-500"
                    : "bg-destructive/20 border-destructive"
                  : ""
              }`}
              onClick={() => !showResult && setSelectedAnswer(option.id)}
              disabled={!!showResult}
            >
              <div className="flex items-center gap-3 w-full">
                {option.id === "left" && <ArrowLeft className="w-5 h-5 text-cyan-400" />}
                {option.id === "right" && <ArrowRight className="w-5 h-5 text-amber-400" />}
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                {showResult && selectedAnswer === option.id && (
                  <div className="ml-auto">
                    {showResult === "success" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Result Animation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`p-4 rounded-lg text-center ${
              showResult === "success"
                ? "bg-emerald-500/20 border border-emerald-500/40"
                : "bg-destructive/20 border border-destructive/40"
            }`}
          >
            {showResult === "success" ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">正確！導航系統已修復！</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-destructive">
                <XCircle className="w-6 h-6" />
                <span className="font-semibold">再想想 BST 的核心規則</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">{challenge.hint}</p>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer || !!showResult}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          確認答案
        </Button>

        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </Button>

        {!showHint && showResult === "fail" && (
          <Button
            variant="ghost"
            onClick={() => setShowHint(true)}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            需要提示？
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestBlock;
