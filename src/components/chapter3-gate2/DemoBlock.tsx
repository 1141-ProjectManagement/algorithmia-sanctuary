import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBSTStore } from "@/stores/bstStore";
import BSTScene from "./BSTScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const insertCode = [
  { line: 0, code: "function insert(node, value) {" },
  { line: 1, code: "  if (value < node.value) {", highlight: true },
  { line: 2, code: "    // 往左子樹", highlight: true },
  { line: 3, code: "    node.left = insert(node.left, value);" },
  { line: 4, code: "  } else {", highlight: true },
  { line: 5, code: "    // 往右子樹", highlight: true },
  { line: 6, code: "    node.right = insert(node.right, value);" },
  { line: 7, code: "  }" },
  { line: 8, code: "  return node;" },
  { line: 9, code: "}" },
];

const searchCode = [
  { line: 0, code: "function search(node, target) {" },
  { line: 1, code: "  if (target === node.value) {", highlight: true },
  { line: 2, code: "    return node; // 找到了！", highlight: true },
  { line: 3, code: "  }" },
  { line: 4, code: "  if (target < node.value) {", highlight: true },
  { line: 5, code: "    return search(node.left, target);" },
  { line: 6, code: "  } else {" },
  { line: 7, code: "    return search(node.right, target);" },
  { line: 8, code: "  }" },
  { line: 9, code: "}" },
];

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    tree,
    steps,
    currentStep,
    isPlaying,
    speed,
    visitedNodes,
    currentNodeId,
    pathHistory,
    mode,
    generateInsertSteps,
    generateSearchSteps,
    insertValue,
    nextStep,
    prevStep,
    reset,
    setPlaying,
    setSpeed,
    resetTree,
  } = useBSTStore();

  const [inputValue, setInputValue] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length) {
      setPlaying(false);
      if (hasInteracted) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed, nextStep, setPlaying, hasInteracted, onComplete]);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || value < 1 || value > 99) return;
    
    setHasInteracted(true);
    reset();
    generateInsertSteps(value);
    setInputValue("");
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    setHasInteracted(true);
    reset();
    generateSearchSteps(value);
    setInputValue("");
  };

  const handleInsertAndRun = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || value < 1 || value > 99) return;
    
    setHasInteracted(true);
    reset();
    generateInsertSteps(value);
    setInputValue("");
    setTimeout(() => setPlaying(true), 100);
  };

  const handleSearchAndRun = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    setHasInteracted(true);
    reset();
    generateSearchSteps(value);
    setInputValue("");
    setTimeout(() => setPlaying(true), 100);
  };

  const handleAnimationComplete = () => {
    if (mode === "insert" && steps.length > 0 && currentStep >= steps.length) {
      const lastStep = steps[steps.length - 1];
      if (lastStep.action === "insert") {
        const value = parseInt(lastStep.nodeId.replace("n", ""));
        if (!isNaN(value)) {
          insertValue(value);
        }
      }
    }
  };

  useEffect(() => {
    if (currentStep >= steps.length && steps.length > 0) {
      handleAnimationComplete();
    }
  }, [currentStep, steps.length]);

  const currentStepInfo = currentStep > 0 && currentStep <= steps.length 
    ? steps[currentStep - 1] 
    : null;

  const codeToShow = mode === "insert" ? insertCode : searchCode;

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex justify-center">
        <Tabs defaultValue="insert" className="w-auto">
          <TabsList>
            <TabsTrigger value="insert" onClick={() => reset()}>
              <Plus className="w-4 h-4 mr-2" />
              插入模式
            </TabsTrigger>
            <TabsTrigger value="search" onClick={() => reset()}>
              <Search className="w-4 h-4 mr-2" />
              搜尋模式
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-muted-foreground">
          {mode === "insert" 
            ? "輸入數字 (1-99)，觀察能量球如何找到正確位置插入"
            : "輸入目標數字，觀察搜尋路徑如何快速定位"}
        </p>
      </motion.div>

      {/* Input Controls */}
      <div className="flex justify-center gap-2">
        <Input
          type="number"
          placeholder={mode === "insert" ? "輸入數字 (1-99)" : "搜尋目標"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-40"
          min={1}
          max={99}
        />
        {mode === "insert" ? (
          <Button onClick={handleInsertAndRun} disabled={!inputValue}>
            <Plus className="w-4 h-4 mr-2" />
            插入
          </Button>
        ) : (
          <Button onClick={handleSearchAndRun} disabled={!inputValue}>
            <Search className="w-4 h-4 mr-2" />
            搜尋
          </Button>
        )}
        <Button variant="outline" onClick={resetTree}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重置樹
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card/60 border border-primary/20 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-primary mb-4">
            {mode === "insert" ? "Insert 函式" : "Search 函式"}
          </h4>
          
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-1">
            {codeToShow.map((line, index) => (
              <div
                key={index}
                className={`py-0.5 px-2 rounded transition-all ${
                  currentStepInfo?.currentCode === index
                    ? "bg-primary/30 border-l-2 border-primary"
                    : ""
                }`}
              >
                <span className={
                  line.highlight 
                    ? currentStepInfo?.currentCode === index 
                      ? "text-primary"
                      : "text-amber-300"
                    : "text-muted-foreground"
                }>
                  {line.code}
                </span>
              </div>
            ))}
          </div>

          {/* Current Step Info */}
          <div className="mt-4 p-3 bg-black/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">當前操作：</p>
            <p className="text-sm text-foreground">
              {currentStepInfo?.description || "等待開始..."}
            </p>
            {currentStepInfo?.comparisonResult && (
              <p className={`text-xs mt-1 ${
                currentStepInfo.comparisonResult === "less" ? "text-cyan-400" :
                currentStepInfo.comparisonResult === "greater" ? "text-amber-400" :
                "text-emerald-400"
              }`}>
                {currentStepInfo.comparisonResult === "less" && "◀ 往左走"}
                {currentStepInfo.comparisonResult === "greater" && "▶ 往右走"}
                {currentStepInfo.comparisonResult === "equal" && "✓ 找到了！"}
              </p>
            )}
          </div>
        </motion.div>

        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <BSTScene
            tree={tree}
            visitedNodes={visitedNodes}
            currentNodeId={currentNodeId}
            pathHistory={pathHistory}
            currentComparisonResult={currentStepInfo?.comparisonResult}
          />
        </motion.div>
      </div>

      {/* Path Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 border border-primary/20 rounded-lg p-4"
      >
        <h4 className="text-sm font-semibold text-primary mb-2">搜尋路徑</h4>
        <div className="flex items-center gap-2 min-h-[40px] flex-wrap">
          {pathHistory.length === 0 ? (
            <span className="text-muted-foreground text-sm">尚未開始...</span>
          ) : (
            pathHistory.map((nodeId, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-mono font-bold border border-primary/40">
                  {nodeId.replace("n", "")}
                </span>
                {index < pathHistory.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </motion.div>
            ))
          )}
        </div>
        {pathHistory.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            步數：{pathHistory.length} (效率：O(log n) ≈ {Math.ceil(Math.log2(7))} 步最優)
          </p>
        )}
      </motion.div>

      {/* Playback Controls */}
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
            disabled={steps.length === 0}
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
