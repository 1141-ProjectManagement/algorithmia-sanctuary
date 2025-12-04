import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { useBubbleSortStore, SortAlgorithm } from "@/stores/bubbleSortStore";
import GemScene from "./GemScene";
import CodeDisplay from "./CodeDisplay";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    comparator,
    algorithm,
    nextStep,
    prevStep,
    reset,
    setPlaying,
    setSpeed,
    setComparator,
    setAlgorithm,
    generateSteps,
    setArray,
  } = useBubbleSortStore();

  const [hasCompleted, setHasCompleted] = useState(false);

  // Initialize steps on mount
  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextStep();
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, nextStep]);

  // Check completion
  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1 && !hasCompleted) {
      setHasCompleted(true);
      setPlaying(false);
      setTimeout(() => onComplete(), 1000);
    }
  }, [currentStep, steps.length, hasCompleted, setPlaying, onComplete]);

  const currentStepData = steps[currentStep] || {
    array: [64, 34, 25, 12, 22, 11, 90],
    comparing: null,
    swapped: false,
    sorted: [],
    description: "載入中...",
  };

  const getHighlightLine = useCallback(() => {
    if (algorithm === 'bubble') {
      if (!currentStepData.comparing) return 0;
      if (currentStepData.swapped) return 6;
      return 5;
    } else {
      // Insertion sort
      if (!currentStepData.comparing && currentStepData.insertingIndex !== undefined) return 4;
      if (currentStepData.swapped) return 7;
      if (currentStepData.comparing) return 6;
      return 10;
    }
  }, [currentStepData, algorithm]);

  const shuffleArray = () => {
    const sizes = [5, 7, 10];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setHasCompleted(false);
  };

  const handleAlgorithmChange = (algo: string) => {
    setAlgorithm(algo as SortAlgorithm);
    setHasCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Selector */}
      <div className="flex justify-center">
        <Tabs value={algorithm} onValueChange={handleAlgorithmChange}>
          <TabsList className="bg-card/60 border border-primary/30">
            <TabsTrigger value="bubble" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🫧 Bubble Sort
            </TabsTrigger>
            <TabsTrigger value="insertion" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              📥 Insertion Sort
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
        {algorithm === 'bubble' ? (
          <div className="text-center">
            <h4 className="text-primary font-semibold mb-2">泡泡術 Bubble Sort</h4>
            <p className="text-sm text-muted-foreground">
              透過相鄰兩兩比較，將較大值不斷「推」向末端，就像氣泡上浮一樣
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h4 className="text-primary font-semibold mb-2">插入術 Insertion Sort</h4>
            <p className="text-sm text-muted-foreground">
              像整理撲克牌一樣，每次拿起一張牌插入已排序序列的正確位置
            </p>
          </div>
        )}
      </motion.div>

      {/* 3D Visualization */}
      <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-primary/20">
        <GemScene
          array={currentStepData.array}
          comparing={currentStepData.comparing}
          swapped={currentStepData.swapped}
          sorted={currentStepData.sorted}
        />
      </div>

      {/* Status Display */}
      <motion.div
        key={`${algorithm}-${currentStep}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-card/40 rounded-lg border border-primary/30 text-center"
      >
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
          value={[2000 - speed]}
          onValueChange={(v) => setSpeed(2000 - v[0])}
          max={1800}
          min={200}
          step={100}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-16">{speed}ms</span>
      </div>

      {/* Code Display */}
      <CodeDisplay
        highlightLine={getHighlightLine()}
        comparator={comparator}
        onComparatorChange={setComparator}
        algorithm={algorithm}
      />

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#4a90d9]" />
          <span className="text-muted-foreground">未排序</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#d4af37]" />
          <span className="text-muted-foreground">比較中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#ff6b6b]" />
          <span className="text-muted-foreground">{algorithm === 'bubble' ? '交換' : '移動'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#00a86b]" />
          <span className="text-muted-foreground">已排序</span>
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
            ✨ 演示完成！你已觀察完整的 {algorithm === 'bubble' ? 'Bubble Sort' : 'Insertion Sort'} 過程
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
