import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, StepForward, Settings } from "lucide-react";
import { useDPStore } from "@/stores/dpStore";
import CrystalMatrixScene from "./CrystalMatrixScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    dpTable,
    items,
    capacity,
    steps,
    currentStep,
    isPlaying,
    hoveredCell,
    setItems,
    setCapacity,
    generateSteps,
    nextStep,
    resetDemo,
    setHoveredCell,
    setIsPlaying,
  } = useDPStore();

  const [showSettings, setShowSettings] = useState(false);
  const [tempCapacity, setTempCapacity] = useState(capacity.toString());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompleted = useRef(false);

  // Auto-play
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, 600);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStep, steps.length]);

  // Check completion
  useEffect(() => {
    if (currentStep >= steps.length - 1 && steps.length > 0 && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete();
    }
  }, [currentStep, steps.length]);

  const currentMessage = steps[currentStep]?.message || "點擊「開始充能」生成 DP 步驟";
  const currentFormula = steps[currentStep]?.formula || "";

  const handleCapacityChange = () => {
    const newCapacity = parseInt(tempCapacity);
    if (newCapacity >= 1 && newCapacity <= 10) {
      setCapacity(newCapacity);
      resetDemo();
    }
  };

  const handleItemValueChange = (index: number, field: "weight" | "value", val: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: parseInt(val) || 0 };
    setItems(newItems);
    resetDemo();
  };

  return (
    <div className="space-y-6">
      {/* Settings panel */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-muted-foreground"
        >
          <Settings className="w-4 h-4 mr-1" />
          調整參數
        </Button>
        
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 bg-card/60 rounded">物品: {items.length}</span>
          <span className="px-2 py-1 bg-card/60 rounded">容量: {capacity}</span>
        </div>
      </div>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-card/40 rounded-lg border border-primary/20 space-y-4"
        >
          <div className="flex items-center gap-4">
            <Label>背包容量:</Label>
            <Input
              type="number"
              value={tempCapacity}
              onChange={(e) => setTempCapacity(e.target.value)}
              className="w-20"
              min={1}
              max={10}
            />
            <Button size="sm" onClick={handleCapacityChange}>套用</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="p-3 bg-black/20 rounded-lg">
                <p className="text-sm font-medium mb-2">{item.name}</p>
                <div className="flex gap-2">
                  <div>
                    <Label className="text-xs">重量</Label>
                    <Input
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleItemValueChange(idx, "weight", e.target.value)}
                      className="w-16 h-8 text-sm"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">價值</Label>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleItemValueChange(idx, "value", e.target.value)}
                      className="w-16 h-8 text-sm"
                      min={1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3D Scene */}
      <div className="h-[450px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
        <CrystalMatrixScene
          dpTable={dpTable}
          items={items}
          capacity={capacity}
          hoveredCell={hoveredCell}
          onHoverCell={setHoveredCell}
        />
      </div>

      {/* Message display */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-card/60 rounded-lg border border-primary/20"
      >
        <p className="text-foreground text-center">{currentMessage}</p>
        {currentFormula && (
          <p className="text-sm text-primary font-mono text-center mt-2">{currentFormula}</p>
        )}
        {currentStep >= 0 && (
          <p className="text-sm text-muted-foreground text-center mt-1">
            步驟 {currentStep + 1} / {steps.length}
          </p>
        )}
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetDemo();
            generateSteps();
          }}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          開始充能
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={steps.length === 0}
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isPlaying ? "暫停" : "播放"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={nextStep}
          disabled={currentStep >= steps.length - 1 || steps.length === 0}
        >
          <StepForward className="w-4 h-4 mr-1" />
          下一步
        </Button>
      </div>

      {/* Code panel */}
      <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-green-400">{`// 0/1 背包問題 - 狀態轉移
for (let i = 1; i <= n; i++) {
  for (let w = 1; w <= capacity; w++) {
    if (items[i-1].weight <= w) {
      dp[i][w] = Math.max(
        dp[i-1][w],                           // 不選
        dp[i-1][w-weight] + items[i-1].value  // 選
      );
    } else {
      dp[i][w] = dp[i-1][w];  // 放不下
    }
  }
}`}</pre>
      </div>

      {/* Hover info */}
      {hoveredCell && (
        <div className="text-center text-sm text-muted-foreground">
          懸停: dp[{hoveredCell.row}][{hoveredCell.col}] = {dpTable[hoveredCell.row]?.[hoveredCell.col]?.value ?? "?"}
          {hoveredCell.row > 0 && (
            <span className="ml-2">（藍色光束顯示依賴來源）</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DemoBlock;
