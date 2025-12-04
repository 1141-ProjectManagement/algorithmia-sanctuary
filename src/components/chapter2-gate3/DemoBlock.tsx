import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { useBinarySearchStore } from "@/stores/binarySearchStore";
import StarMapScene from "./StarMapScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    array,
    target,
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
    setTarget,
    generateSteps,
    goToStep,
  } = useBinarySearchStore();

  const [hasCompleted, setHasCompleted] = useState(false);
  const [inputTarget, setInputTarget] = useState("");

  useEffect(() => {
    // Initialize with a target that exists in the array
    const randomIndex = Math.floor(Math.random() * array.length);
    setTarget(array[randomIndex]);
    setInputTarget(array[randomIndex].toString());
  }, []);

  useEffect(() => {
    generateSteps();
  }, [generateSteps, target]);

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
    const sizes = [12, 15, 18];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const newArray: number[] = [];
    let current = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < size; i++) {
      newArray.push(current);
      current += Math.floor(Math.random() * 8) + 2;
    }
    setArray(newArray);
    const randomIndex = Math.floor(Math.random() * newArray.length);
    setTarget(newArray[randomIndex]);
    setInputTarget(newArray[randomIndex].toString());
    setHasCompleted(false);
  }, [setArray, setTarget]);

  const handleTargetChange = () => {
    const num = parseInt(inputTarget);
    if (!isNaN(num)) {
      setTarget(num);
      setHasCompleted(false);
      reset();
    }
  };

  if (!currentStepData) {
    return <div className="text-center p-8">載入中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Target Input */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">目標值：</span>
          <Input
            type="number"
            value={inputTarget}
            onChange={(e) => setInputTarget(e.target.value)}
            className="w-24"
          />
          <Button variant="outline" size="sm" onClick={handleTargetChange}>
            設定
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={shuffleArray} className="gap-2">
          <Shuffle className="h-4 w-4" /> 重新生成陣列
        </Button>
      </div>

      {/* Array Display */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/30">
        <div className="text-sm text-muted-foreground mb-2">已排序陣列：</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {array.map((val, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded text-sm font-mono ${
                currentStepData.eliminated.includes(idx)
                  ? "bg-muted/30 text-muted-foreground line-through"
                  : idx === currentStepData.mid
                  ? "bg-primary text-primary-foreground"
                  : idx === currentStepData.low || idx === currentStepData.high
                  ? "bg-blue-500/30 text-blue-400"
                  : "bg-muted text-foreground"
              }`}
            >
              {val}
            </span>
          ))}
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-primary/20">
        <StarMapScene
          array={array}
          low={currentStepData.low}
          high={currentStepData.high}
          mid={currentStepData.mid}
          eliminated={currentStepData.eliminated}
          found={currentStepData.found}
        />
      </div>

      {/* Code Display */}
      <div className="p-4 bg-background/80 rounded-lg border border-border font-mono text-sm overflow-x-auto">
        <pre className="text-muted-foreground">
          <code>
{`while (low <= high) {
  const mid = Math.floor((low + high) / 2);  `}<span className="text-primary">// mid = {currentStepData.mid >= 0 ? currentStepData.mid : '?'}</span>{`
  
  if (arr[mid] === target) return mid;       `}<span className="text-green-400">// arr[{currentStepData.mid >= 0 ? currentStepData.mid : '?'}] = {currentStepData.mid >= 0 ? array[currentStepData.mid] : '?'}, target = {target}</span>{`
  else if (arr[mid] < target) low = mid + 1; `}<span className="text-blue-400">// 目標在右半邊</span>{`
  else high = mid - 1;                       `}<span className="text-red-400">// 目標在左半邊</span>{`
}`}
          </code>
        </pre>
      </div>

      {/* Status Display */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border text-center ${
          currentStepData.found
            ? "bg-green-500/20 border-green-500/40"
            : "bg-card/40 border-primary/30"
        }`}
      >
        <div className="flex items-center justify-center gap-4 mb-2 text-sm">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            Low: {currentStepData.low}
          </span>
          <span className="px-2 py-1 bg-primary/20 text-primary rounded">
            Mid: {currentStepData.mid >= 0 ? currentStepData.mid : '-'}
          </span>
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
            High: {currentStepData.high}
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

      {/* Completion Message */}
      {hasCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/20 rounded-lg border border-primary/40"
        >
          <p className="text-primary font-semibold">
            ✨ 演示完成！你已理解二分搜尋如何在 O(log n) 時間內找到目標
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
