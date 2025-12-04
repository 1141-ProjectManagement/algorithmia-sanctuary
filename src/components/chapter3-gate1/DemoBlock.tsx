import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTreeTraversalStore, TraversalOrder } from "@/stores/treeTraversalStore";
import TreeScene from "./TreeScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const codeLines = {
  process: "process(node.value)  // 處理當前節點",
  left: "traverse(node.left)  // 遞迴左子樹",
  right: "traverse(node.right) // 遞迴右子樹",
};

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    tree,
    steps,
    currentStep,
    isPlaying,
    speed,
    codeOrder,
    visitedNodes,
    processedNodes,
    currentNodeId,
    sequence,
    generateSteps,
    nextStep,
    prevStep,
    reset,
    setPlaying,
    setSpeed,
    setCodeOrder,
  } = useTreeTraversalStore();

  // Generate steps on mount
  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length) {
      setPlaying(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 800 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed, nextStep, setPlaying, onComplete]);

  const handlePresetOrder = (order: TraversalOrder) => {
    const presets: Record<TraversalOrder, [string, string, string]> = {
      preorder: ["process", "left", "right"],
      inorder: ["left", "process", "right"],
      postorder: ["left", "right", "process"],
    };
    setCodeOrder(presets[order]);
    reset();
  };

  const moveCodeLine = useCallback((from: number, to: number) => {
    if (to < 0 || to > 2) return;
    const newOrder = [...codeOrder] as [string, string, string];
    const [removed] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, removed);
    setCodeOrder(newOrder);
    reset();
  }, [codeOrder, setCodeOrder, reset]);

  const currentStepInfo = currentStep > 0 && currentStep <= steps.length 
    ? steps[currentStep - 1] 
    : null;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-muted-foreground">
          拖曳或使用預設按鈕調整程式碼順序，觀察光靈如何遍歷樹林
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card/60 border border-primary/20 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-primary mb-4">程式碼順序</h4>
          
          {/* Preset Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetOrder("preorder")}
              className="text-xs"
            >
              前序
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetOrder("inorder")}
              className="text-xs"
            >
              中序
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetOrder("postorder")}
              className="text-xs"
            >
              後序
            </Button>
          </div>

          {/* Code Lines */}
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-2">
            <div className="text-muted-foreground text-xs mb-2">
              {"function traverse(node) {"}
            </div>
            <div className="text-muted-foreground text-xs pl-4 mb-2">
              {"if (!node) return;"}
            </div>
            
            {codeOrder.map((line, index) => (
              <motion.div
                key={`${line}-${index}`}
                layout
                className={`flex items-center gap-2 pl-4 py-1 rounded ${
                  currentStepInfo?.currentCode === index
                    ? "bg-primary/30 border-l-2 border-primary"
                    : ""
                }`}
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => moveCodeLine(index, index - 1)}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-primary disabled:opacity-30 p-0.5"
                  >
                    <GripVertical className="w-3 h-3" />
                  </button>
                </div>
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
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => moveCodeLine(index, index + 1)}
                    disabled={index === 2}
                  >
                    ↓
                  </Button>
                </div>
              </motion.div>
            ))}
            
            <div className="text-muted-foreground text-xs">{"}"}</div>
          </div>

          {/* Current Step Info */}
          <div className="mt-4 p-3 bg-black/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">當前操作：</p>
            <p className="text-sm text-foreground">
              {currentStepInfo?.description || "等待開始..."}
            </p>
          </div>
        </motion.div>

        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {tree && (
            <TreeScene
              tree={tree}
              visitedNodes={visitedNodes}
              processedNodes={processedNodes}
              currentNodeId={currentNodeId}
            />
          )}
        </motion.div>
      </div>

      {/* Output Sequence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 border border-primary/20 rounded-lg p-4"
      >
        <h4 className="text-sm font-semibold text-primary mb-2">輸出序列</h4>
        <div className="flex items-center gap-2 min-h-[40px] flex-wrap">
          {sequence.length === 0 ? (
            <span className="text-muted-foreground text-sm">尚未開始遍歷...</span>
          ) : (
            sequence.map((value, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-mono font-bold border border-primary/40"
              >
                {value}
              </motion.span>
            ))
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={() => setPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextStep}
            disabled={currentStep >= steps.length}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={reset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">速度:</span>
          <Slider
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            min={0.5}
            max={3}
            step={0.5}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground w-8">{speed}x</span>
        </div>

        <div className="text-sm text-muted-foreground">
          步驟: {currentStep} / {steps.length}
        </div>
      </motion.div>
    </div>
  );
};

export default DemoBlock;
