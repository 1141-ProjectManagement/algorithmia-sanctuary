import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, StepForward, ChevronRight } from "lucide-react";
import { useGreedyStore } from "@/stores/greedyStore";
import ActivityScene from "./ActivityScene";
import CoinScene from "./CoinScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    activities,
    activitySteps,
    currentActivityStep,
    scanPosition,
    sortStrategy,
    setSortStrategy,
    generateActivitySteps,
    nextActivityStep,
    resetActivityDemo,
    coins,
    coinSteps,
    currentCoinStep,
    denominations,
    targetAmount,
    remainingAmount,
    generateCoinSteps,
    nextCoinStep,
    resetCoinDemo,
    isPlaying,
    setIsPlaying,
  } = useGreedyStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompleted = useRef(false);

  // Activity auto-play
  useEffect(() => {
    if (isPlaying && currentActivityStep < activitySteps.length - 1) {
      intervalRef.current = setInterval(() => {
        nextActivityStep();
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentActivityStep, activitySteps.length]);

  // Check completion
  useEffect(() => {
    const activityDone = currentActivityStep >= activitySteps.length - 1 && activitySteps.length > 0;
    const coinDone = currentCoinStep >= coinSteps.length - 1 && coinSteps.length > 0;
    
    if ((activityDone || coinDone) && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete();
    }
  }, [currentActivityStep, activitySteps.length, currentCoinStep, coinSteps.length]);

  const currentMessage = activitySteps[currentActivityStep]?.message || "點擊「生成步驟」開始演示";
  const coinMessage = coinSteps[currentCoinStep]?.message || "點擊「開始找零」開始演示";

  const handleStrategyChange = (value: string) => {
    setSortStrategy(value as "start" | "duration" | "end");
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card/60">
          <TabsTrigger value="activity">活動選擇問題</TabsTrigger>
          <TabsTrigger value="coin">找零錢問題</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6 space-y-4">
          {/* Strategy selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground self-center">排序策略：</span>
            {[
              { value: "start", label: "按開始時間", correct: false },
              { value: "duration", label: "按持續時間", correct: false },
              { value: "end", label: "按結束時間", correct: true },
            ].map((option) => (
              <Button
                key={option.value}
                variant={sortStrategy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleStrategyChange(option.value)}
                className={sortStrategy === option.value && option.correct ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {option.label}
                {option.correct && sortStrategy === option.value && " ✓"}
              </Button>
            ))}
          </div>

          {/* 3D Scene */}
          <div className="h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
            <ActivityScene activities={activities} scanPosition={scanPosition} />
          </div>

          {/* Message display */}
          <motion.div
            key={currentActivityStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card/60 rounded-lg border border-primary/20 text-center"
          >
            <p className="text-foreground">{currentMessage}</p>
            {currentActivityStep >= 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                步驟 {currentActivityStep + 1} / {activitySteps.length}
              </p>
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetActivityDemo();
                generateActivitySteps();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              生成步驟
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={activitySteps.length === 0}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isPlaying ? "暫停" : "播放"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextActivityStep}
              disabled={currentActivityStep >= activitySteps.length - 1 || activitySteps.length === 0}
            >
              <StepForward className="w-4 h-4 mr-1" />
              下一步
            </Button>
          </div>

          {/* Code panel */}
          <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-green-400">{`// 貪婪策略：選擇最早結束的活動
activities.sort((a, b) => a.${sortStrategy} - b.${sortStrategy});

let lastEnd = 0;
for (const activity of activities) {
  if (activity.start >= lastEnd) {  // 不衝突
    select(activity);
    lastEnd = activity.end;
  }
}`}</pre>
          </div>
        </TabsContent>

        <TabsContent value="coin" className="mt-6 space-y-4">
          {/* Denomination display */}
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <span className="text-sm text-muted-foreground">幣值：</span>
            {denominations.map((d) => (
              <span
                key={d}
                className="px-3 py-1 bg-primary/20 rounded-full text-sm font-medium"
              >
                {d}
              </span>
            ))}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-primary font-medium">目標：{targetAmount} 元</span>
          </div>

          {/* 3D Scene */}
          <div className="h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
            <CoinScene
              coins={coins}
              targetAmount={targetAmount}
              remainingAmount={remainingAmount}
              isComplete={currentCoinStep >= coinSteps.length - 1}
            />
          </div>

          {/* Message display */}
          <motion.div
            key={currentCoinStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card/60 rounded-lg border border-primary/20 text-center"
          >
            <p className="text-foreground">{coinMessage}</p>
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetCoinDemo();
                generateCoinSteps();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              開始找零
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextCoinStep}
              disabled={currentCoinStep >= coinSteps.length - 1 || coinSteps.length === 0}
            >
              <StepForward className="w-4 h-4 mr-1" />
              投入硬幣
            </Button>
          </div>

          {/* Code panel */}
          <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-green-400">{`// 貪婪策略：總是選最大面額
coins.sort((a, b) => b - a);  // 大到小排序

for (const coin of coins) {
  while (amount >= coin) {
    amount -= coin;
    count++;
  }
}`}</pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemoBlock;
