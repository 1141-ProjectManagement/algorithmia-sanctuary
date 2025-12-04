import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { useDivideConquerStore, DivideAlgorithm } from "@/stores/divideConquerStore";
import RecursiveTreeScene from "./RecursiveTreeScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    algorithm,
    nextStep,
    prevStep,
    reset,
    setPlaying,
    setSpeed,
    setAlgorithm,
    generateSteps,
    setArray,
  } = useDivideConquerStore();

  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextStep();
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, nextStep]);

  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1 && !hasCompleted) {
      setHasCompleted(true);
      setPlaying(false);
      setTimeout(() => onComplete(), 1000);
    }
  }, [currentStep, steps.length, hasCompleted, setPlaying, onComplete]);

  const currentStepData = steps[currentStep];

  const shuffleArray = useCallback(() => {
    const sizes = [5, 7, 8];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setHasCompleted(false);
  }, [setArray]);

  const handleAlgorithmChange = (algo: string) => {
    setAlgorithm(algo as DivideAlgorithm);
    setHasCompleted(false);
  };

  if (!currentStepData) {
    return <div className="text-center p-8">載入中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Selector */}
      <div className="flex justify-center">
        <Tabs value={algorithm} onValueChange={handleAlgorithmChange}>
          <TabsList className="bg-card/60 border border-primary/30">
            <TabsTrigger 
              value="merge" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              🔀 Merge Sort
            </TabsTrigger>
            <TabsTrigger 
              value="quick" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              ⚡ Quick Sort
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Algorithm Description */}
      <motion.div
        key={algorithm}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-card/40 rounded-lg border border-primary/30"
      >
        {algorithm === 'merge' ? (
          <div className="text-center">
            <h4 className="text-primary font-semibold mb-2">合併術 Merge Sort</h4>
            <p className="text-sm text-muted-foreground">
              遞迴分割至最小單位，再逐層有序合併。穩定排序，保證 O(n log n)
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h4 className="text-primary font-semibold mb-2">快速術 Quick Sort</h4>
            <p className="text-sm text-muted-foreground">
              選擇基準值(Pivot)分區，小的放左、大的放右，再遞迴處理
            </p>
          </div>
        )}
      </motion.div>

      {/* 3D Visualization */}
      <div className="h-[350px] md:h-[450px] rounded-lg overflow-hidden border border-primary/20">
        <RecursiveTreeScene
          tree={currentStepData.tree}
          activeNodeId={currentStepData.activeNodeId}
          algorithm={algorithm}
        />
      </div>

      {/* Status Display */}
      <motion.div
        key={`${algorithm}-${currentStep}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-card/40 rounded-lg border border-primary/30 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            currentStepData.phase === 'divide' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {currentStepData.phase === 'divide' ? '分割階段' : '合併階段'}
          </span>
        </div>
        <p className="text-lg text-foreground">{currentStepData.description}</p>
        <p className="text-sm text-muted-foreground mt-1">
          步驟 {currentStep + 1} / {steps.length}
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={() => { reset(); setHasCompleted(false); }}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={prevStep} disabled={currentStep === 0}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          onClick={() => setPlaying(!isPlaying)}
          className="px-8"
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> 暫停
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> 播放
            </>
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={nextStep} disabled={currentStep === steps.length - 1}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={shuffleArray}>
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-4 px-4">
        <span className="text-sm text-muted-foreground">速度:</span>
        <Slider
          value={[3000 - speed]}
          onValueChange={(v) => setSpeed(3000 - v[0])}
          max={2500}
          min={500}
          step={100}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-20">{speed}ms</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#6b7280]" />
          <span className="text-muted-foreground">待處理</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#4a90d9]" />
          <span className="text-muted-foreground">分割中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#d4af37]" />
          <span className="text-muted-foreground">當前節點</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#00a86b]" />
          <span className="text-muted-foreground">已完成</span>
        </div>
      </div>

      {/* Completion Message */}
      {hasCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/20 rounded-lg border border-primary/40"
        >
          <p className="text-primary font-semibold">
            ✨ 演示完成！你已觀察完整的 {algorithm === 'merge' ? 'Merge Sort' : 'Quick Sort'} 遞迴過程
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
