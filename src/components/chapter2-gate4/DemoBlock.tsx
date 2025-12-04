import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Plus, Trash2 } from "lucide-react";
import { useHashTableStore } from "@/stores/hashTableStore";
import HashTableScene from "./HashTableScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    buckets,
    steps,
    currentStep,
    isPlaying,
    speed,
    hashFormula,
    pendingKeys,
    nextStep,
    prevStep,
    reset,
    setPlaying,
    setSpeed,
    setHashFormula,
    generateSteps,
    goToStep,
    addKey,
    clearBuckets,
  } = useHashTableStore();

  const [hasCompleted, setHasCompleted] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

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

  const handleAddKey = useCallback(() => {
    const key = parseInt(newKey) || newKey;
    if (key && newValue) {
      addKey(key, newValue);
      setNewKey("");
      setNewValue("");
      setHasCompleted(false);
    }
  }, [newKey, newValue, addKey]);

  const handleFormulaChange = (formula: string) => {
    setHashFormula(formula as 'simple' | 'multiplied');
    setHasCompleted(false);
    reset();
  };

  const handleClear = () => {
    clearBuckets();
    setHasCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Hash Formula Selector */}
      <div className="flex justify-center">
        <Tabs value={hashFormula} onValueChange={handleFormulaChange}>
          <TabsList className="bg-card/60 border border-primary/30">
            <TabsTrigger 
              value="simple" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              簡單模運算
            </TabsTrigger>
            <TabsTrigger 
              value="multiplied" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              乘法雜湊
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Formula Display */}
      <div className="p-4 bg-background/80 rounded-lg border border-border font-mono text-center">
        <span className="text-muted-foreground">Hash Function: </span>
        <span className="text-primary">
          {hashFormula === 'simple' 
            ? 'index = key % 8' 
            : 'index = (key × 31) % 8'}
        </span>
      </div>

      {/* Add Key Form */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Input
          type="text"
          placeholder="鑰匙 (數字)"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="w-28"
        />
        <Input
          type="text"
          placeholder="寶物名稱"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="w-32"
        />
        <Button variant="outline" size="sm" onClick={handleAddKey} className="gap-1">
          <Plus className="h-4 w-4" /> 新增
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear} className="gap-1">
          <Trash2 className="h-4 w-4" /> 清空
        </Button>
      </div>

      {/* Pending Keys */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/30">
        <div className="text-sm text-muted-foreground mb-2">待存入的鑰匙：</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {pendingKeys.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded bg-primary/20 text-primary text-sm font-mono"
            >
              {typeof item.key === 'string' ? `"${item.key}"` : item.key} → {item.value}
            </span>
          ))}
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-primary/20">
        <HashTableScene
          buckets={buckets}
          currentStep={currentStepData ? {
            targetIndex: currentStepData.targetIndex,
            value: currentStepData.value,
            phase: currentStepData.phase,
            collision: currentStepData.collision,
            collisionResolution: currentStepData.collisionResolution
          } : null}
        />
      </div>

      {/* Buckets Display */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/30">
        <div className="text-sm text-muted-foreground mb-2">寶箱狀態：</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {buckets.map((entry, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded text-sm font-mono text-center min-w-[60px] ${
                entry
                  ? "bg-primary/30 text-primary border border-primary/50"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="text-xs text-muted-foreground">#{idx}</div>
              <div>{entry ? entry.value : "空"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Display */}
      {currentStepData && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border text-center ${
            currentStepData.phase === 'complete'
              ? "bg-green-500/20 border-green-500/40"
              : currentStepData.collision
              ? "bg-red-500/20 border-red-500/40"
              : "bg-card/40 border-primary/30"
          }`}
        >
          <p className="text-lg text-foreground">{currentStepData.description}</p>
          <p className="text-sm text-muted-foreground mt-1">
            步驟 {currentStep + 1} / {steps.length}
          </p>
        </motion.div>
      )}

      {/* Timeline Slider */}
      <div className="flex items-center gap-4 px-4">
        <span className="text-sm text-muted-foreground">時間軸：</span>
        <Slider
          value={[currentStep]}
          onValueChange={(v) => goToStep(v[0])}
          max={Math.max(0, steps.length - 1)}
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
          disabled={steps.length === 0}
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

      {/* Completion Message */}
      {hasCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/20 rounded-lg border border-primary/40"
        >
          <p className="text-primary font-semibold">
            ✨ 演示完成！你已理解雜湊表如何在 O(1) 時間內存取數據
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
