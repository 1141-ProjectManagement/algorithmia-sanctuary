import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { useSlidingWindowStore } from "@/stores/slidingWindowStore";
import SlidingWindowScene from "./SlidingWindowScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    array,
    windowSize,
    steps,
    currentStep,
    isPlaying,
    speed,
    nextStep,
    prevStep,
    reset,
    setPlaying,
    setSpeed,
    setArray,
    setWindowSize,
    generateSteps,
    goToStep,
  } = useSlidingWindowStore();

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
    const newArray = Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) - 5);
    setArray(newArray);
    setHasCompleted(false);
  }, [setArray]);

  const handleWindowSizeChange = (value: number[]) => {
    setWindowSize(value[0]);
    setHasCompleted(false);
    reset();
  };

  if (!currentStepData) {
    return <div className="text-center p-8">載入中...</div>;
  }

  // Calculate removed/added indices
  const removedIndex = currentStepData.removedValue !== null ? currentStepData.windowStart - 1 : null;
  const addedIndex = currentStepData.addedValue !== null ? currentStepData.windowEnd : null;

  return (
    <div className="space-y-6">
      {/* Window Size Control */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">視窗大小 (k):</span>
          <Slider
            value={[windowSize]}
            onValueChange={handleWindowSizeChange}
            min={2}
            max={6}
            step={1}
            className="w-32"
          />
          <span className="text-primary font-mono w-8">{windowSize}</span>
        </div>
        <Button variant="outline" size="sm" onClick={shuffleArray} className="gap-2">
          <Shuffle className="h-4 w-4" /> 重新生成
        </Button>
      </div>

      {/* Array Display */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/30">
        <div className="text-sm text-muted-foreground mb-2">數據陣列：</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {array.map((val, idx) => {
            const isInWindow = idx >= currentStepData.windowStart && idx <= currentStepData.windowEnd;
            const isMax = idx >= currentStepData.maxStart && idx < currentStepData.maxStart + windowSize;
            return (
              <span
                key={idx}
                className={`px-3 py-1 rounded text-sm font-mono transition-all ${
                  isInWindow
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    : isMax && currentStepData.phase !== 'init'
                    ? "bg-primary/30 text-primary border border-primary/50"
                    : "bg-muted text-foreground"
                }`}
              >
                {val}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-primary/20">
        <SlidingWindowScene
          array={array}
          windowStart={currentStepData.windowStart}
          windowEnd={currentStepData.windowEnd}
          windowSum={currentStepData.windowSum}
          maxStart={currentStepData.maxStart}
          windowSize={windowSize}
          removedIndex={removedIndex}
          addedIndex={addedIndex}
        />
      </div>

      {/* Formula Display */}
      {currentStepData.phase === 'slide' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-background/80 rounded-lg border border-border font-mono text-center"
        >
          <span className="text-muted-foreground">windowSum = </span>
          <span className="text-foreground">{currentStepData.windowSum + (currentStepData.removedValue || 0) - (currentStepData.addedValue || 0)}</span>
          <span className="text-red-400"> - {currentStepData.removedValue}</span>
          <span className="text-green-400"> + {currentStepData.addedValue}</span>
          <span className="text-muted-foreground"> = </span>
          <span className="text-primary font-bold">{currentStepData.windowSum}</span>
        </motion.div>
      )}

      {/* Status Display */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border text-center ${
          currentStepData.phase === 'complete'
            ? "bg-green-500/20 border-green-500/40"
            : "bg-card/40 border-primary/30"
        }`}
      >
        <div className="flex items-center justify-center gap-4 mb-2 text-sm">
          <span className="px-2 py-1 bg-primary/20 text-primary rounded">
            視窗 [{currentStepData.windowStart}, {currentStepData.windowEnd}]
          </span>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            當前和: {currentStepData.windowSum}
          </span>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
            最大和: {currentStepData.maxSum}
          </span>
        </div>
        <p className="text-lg text-foreground">{currentStepData.description}</p>
        <p className="text-sm text-muted-foreground mt-1">
          步驟 {currentStep + 1} / {steps.length}
        </p>
      </motion.div>

      {/* Timeline Slider */}
      <div className="flex items-center gap-4 px-4">
        <span className="text-sm text-muted-foreground">時間軸：</span>
        <Slider
          value={[currentStep]}
          onValueChange={(v) => goToStep(v[0])}
          max={steps.length - 1}
          min={0}
          step={1}
          className="flex-1"
        />
      </div>

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
            <><Pause className="mr-2 h-4 w-4" /> 暫停</>
          ) : (
            <><Play className="mr-2 h-4 w-4" /> 播放</>
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={nextStep} disabled={currentStep === steps.length - 1}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-4 px-4">
        <span className="text-sm text-muted-foreground">速度:</span>
        <Slider
          value={[2500 - speed]}
          onValueChange={(v) => setSpeed(2500 - v[0])}
          max={2000}
          min={300}
          step={100}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-20">{speed}ms</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#4a90d9]" />
          <span className="text-muted-foreground">視窗內</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#ef4444]" />
          <span className="text-muted-foreground">移除</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#22c55e]" />
          <span className="text-muted-foreground">新增</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#d4af37]" />
          <span className="text-muted-foreground">最大和位置</span>
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
            ✨ 演示完成！你已理解滑動視窗如何在 O(n) 時間內找到最大子陣列和
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
