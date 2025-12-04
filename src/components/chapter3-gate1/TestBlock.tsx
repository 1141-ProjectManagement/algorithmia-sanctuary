import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  treeDescription: string;
  targetSequence: number[];
  correctOrder: TraversalType;
  hint: string;
}

type TraversalType = "preorder" | "inorder" | "postorder";

const challenges: Challenge[] = [
  {
    id: 1,
    treeDescription: "標準完美二元樹 (1-2-3-4-5-6-7)",
    targetSequence: [4, 2, 5, 1, 6, 3, 7],
    correctOrder: "inorder",
    hint: "觀察：4和5在2的兩邊，6和7在3的兩邊。這像是「左-根-右」的模式。",
  },
  {
    id: 2,
    treeDescription: "標準完美二元樹 (1-2-3-4-5-6-7)",
    targetSequence: [1, 2, 4, 5, 3, 6, 7],
    correctOrder: "preorder",
    hint: "注意：根節點1最先出現，然後是整棵左子樹，最後是右子樹。",
  },
  {
    id: 3,
    treeDescription: "標準完美二元樹 (1-2-3-4-5-6-7)",
    targetSequence: [4, 5, 2, 6, 7, 3, 1],
    correctOrder: "postorder",
    hint: "根節點1最後才出現，這是「左-右-根」的特徵。",
  },
];

const codeTemplates = {
  preorder: ["process", "left", "right"],
  inorder: ["left", "process", "right"],
  postorder: ["left", "right", "process"],
};

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<[string, string, string]>(["process", "left", "right"]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState<"success" | "fail" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const codeLines = {
    process: "process(node.value)",
    left: "traverse(node.left)",
    right: "traverse(node.right)",
  };

  const moveCodeLine = (from: number, to: number) => {
    if (to < 0 || to > 2) return;
    const newOrder = [...selectedOrder] as [string, string, string];
    const [removed] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, removed);
    setSelectedOrder(newOrder);
    setShowResult(null);
  };

  const determineTraversalType = (order: string[]): TraversalType | null => {
    const orderStr = order.join("-");
    if (orderStr === "process-left-right") return "preorder";
    if (orderStr === "left-process-right") return "inorder";
    if (orderStr === "left-right-process") return "postorder";
    return null;
  };

  const handleRun = () => {
    setIsAnimating(true);
    setShowResult(null);

    setTimeout(() => {
      const selectedType = determineTraversalType(selectedOrder);
      const isCorrect = selectedType === challenge.correctOrder;

      setShowResult(isCorrect ? "success" : "fail");
      setIsAnimating(false);

      if (isCorrect) {
        toast({
          title: "✨ 正確！石碑發出金光！",
          description: `你成功識別了${
            challenge.correctOrder === "preorder" ? "前序" :
            challenge.correctOrder === "inorder" ? "中序" : "後序"
          }遍歷！`,
        });

        const newCompleted = [...completedChallenges, challenge.id];
        setCompletedChallenges(newCompleted);

        setTimeout(() => {
          if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge(currentChallenge + 1);
            setSelectedOrder(["process", "left", "right"]);
            setShowResult(null);
            setShowHint(false);
          } else {
            onComplete();
            toast({
              title: "🎉 恭喜通關！",
              description: "你已掌握樹的三種遍歷方式！",
            });
          }
        }, 1500);
      } else {
        toast({
          title: "光靈消散了...",
          description: "序列不匹配，請重新調整程式碼順序。",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const handleReset = () => {
    setSelectedOrder(["process", "left", "right"]);
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

      {/* Challenge Description */}
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/60 border border-primary/20 rounded-lg p-6 text-center"
      >
        <h4 className="text-lg font-semibold text-primary mb-2">挑戰 {currentChallenge + 1}</h4>
        <p className="text-muted-foreground mb-4">
          樹結構：{challenge.treeDescription}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          石碑上刻著的密碼序列是：
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {challenge.targetSequence.map((num, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-mono font-bold border border-primary/40"
            >
              {num}
            </motion.span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          請調整遍歷順序以產生相同的序列
        </p>
      </motion.div>

      {/* Tree Visualization */}
      <div className="bg-card/40 border border-border/50 rounded-lg p-4">
        <svg viewBox="0 0 200 120" className="w-full max-w-sm mx-auto h-auto">
          {/* Edges */}
          <line x1="100" y1="20" x2="50" y2="50" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
          <line x1="100" y1="20" x2="150" y2="50" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
          <line x1="50" y1="50" x2="25" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
          <line x1="50" y1="50" x2="75" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
          <line x1="150" y1="50" x2="125" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
          <line x1="150" y1="50" x2="175" y2="85" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
          
          {/* Nodes */}
          {[
            { cx: 100, cy: 20, val: 1 },
            { cx: 50, cy: 50, val: 2 },
            { cx: 150, cy: 50, val: 3 },
            { cx: 25, cy: 85, val: 4 },
            { cx: 75, cy: 85, val: 5 },
            { cx: 125, cy: 85, val: 6 },
            { cx: 175, cy: 85, val: 7 },
          ].map((node, i) => (
            <g key={i}>
              <circle cx={node.cx} cy={node.cy} r="12" fill="hsl(var(--primary))" opacity={0.8} />
              <text x={node.cx} y={node.cy + 4} textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="10" fontWeight="bold">
                {node.val}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Code Editor */}
      <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
        <div className="text-muted-foreground text-xs mb-2">
          {"function traverse(node) {"}
        </div>
        <div className="text-muted-foreground text-xs pl-4 mb-2">
          {"if (!node) return;"}
        </div>
        
        {selectedOrder.map((line, index) => (
          <motion.div
            key={`${line}-${index}`}
            layout
            className="flex items-center gap-2 pl-4 py-1"
          >
            <span className={
              line === "process" ? "text-amber-400" :
              line === "left" ? "text-emerald-400" :
              "text-cyan-400"
            }>
              {codeLines[line as keyof typeof codeLines]}
            </span>
            <div className="flex gap-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => moveCodeLine(index, index - 1)}
                disabled={index === 0 || isAnimating}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => moveCodeLine(index, index + 1)}
                disabled={index === 2 || isAnimating}
              >
                ↓
              </Button>
            </div>
          </motion.div>
        ))}
        
        <div className="text-muted-foreground text-xs">{"}"}</div>
      </div>

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
                <span className="font-semibold">石碑發出金光！序列匹配成功！</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-destructive">
                <XCircle className="w-6 h-6" />
                <span className="font-semibold">光靈消散了，序列不匹配</span>
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
          onClick={handleRun}
          disabled={isAnimating}
          className="gap-2"
        >
          {isAnimating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.div>
              詠唱中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              詠唱 (Run)
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isAnimating}
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
