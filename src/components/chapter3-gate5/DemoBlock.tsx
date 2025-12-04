import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTwoPointersStore } from "@/stores/twoPointersStore";
import TwoPointersScene from "./TwoPointersScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [tempTarget, setTempTarget] = useState(15);

  const {
    stones,
    left,
    right,
    target,
    currentSum,
    found,
    isAnimating,
    stepLog,
    currentStep,
    moveCount,
    initStones,
    moveLeft,
    moveRight,
    reset,
    autoSolve,
    setTarget,
  } = useTwoPointersStore();

  useEffect(() => {
    initStones([1, 2, 4, 6, 8, 9, 11, 15], 15);
  }, [initStones]);

  useEffect(() => {
    if (found && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
    }
  }, [found, hasCompleted, onComplete]);

  const handleApplyTarget = () => {
    setTarget(tempTarget);
    setShowSettings(false);
    setHasCompleted(false);
  };

  const handleReset = () => {
    reset();
    setHasCompleted(false);
  };

  // Get current code highlight
  const getCodeHighlight = () => {
    if (found) return 'found';
    if (currentSum < target) return 'tooSmall';
    if (currentSum > target) return 'tooBig';
    return 'check';
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={moveLeft}
            disabled={found || isAnimating || left >= right - 1}
          >
            <ChevronRight className="w-4 h-4 mr-1" />
            L++ (右移)
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={moveRight}
            disabled={found || isAnimating || right <= left + 1}
          >
            R-- (左移)
            <ChevronLeft className="w-4 h-4 ml-1" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => autoSolve()}
            disabled={found || isAnimating}
          >
            <Play className="w-4 h-4 mr-2" />
            自動求解
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isAnimating}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          移動次數: {moveCount} {found && "✓ 完成"}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-card/60 rounded-xl border border-primary/30"
        >
          <div className="flex items-end gap-4">
            <div className="space-y-1">
              <Label className="text-sm">目標和 (Target)</Label>
              <Input
                type="number"
                value={tempTarget}
                onChange={(e) => setTempTarget(parseInt(e.target.value) || 0)}
                className="w-32 bg-background/50"
              />
            </div>
            <Button size="sm" onClick={handleApplyTarget}>
              套用
            </Button>
            <span className="text-xs text-muted-foreground">
              陣列: [1, 2, 4, 6, 8, 9, 11, 15]
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2 h-[400px] bg-black/40 rounded-xl border border-primary/30 overflow-hidden">
          <TwoPointersScene 
            stones={stones}
            currentSum={currentSum}
            target={target}
            found={found}
          />
        </div>

        {/* Code Panel */}
        <div className="space-y-4">
          {/* Current Status */}
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-2">當前狀態</h4>
            <div className="space-y-1 text-sm">
              <div>L = {left} (值: {stones[left]?.value})</div>
              <div>R = {right} (值: {stones[right]?.value})</div>
              <div className={`font-bold ${found ? 'text-green-400' : 'text-foreground'}`}>
                {currentStep}
              </div>
            </div>
          </div>

          {/* Code Visualization */}
          <div className="p-4 bg-black/60 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-3">程式碼映射</h4>
            <pre className="text-xs font-mono space-y-1">
              <div className={getCodeHighlight() === 'check' ? 'text-yellow-400' : 'text-muted-foreground'}>
                while (left &lt; right) {'{'}
              </div>
              <div className="text-muted-foreground pl-2">
                sum = arr[L] + arr[R];
              </div>
              <div className={`pl-2 ${getCodeHighlight() === 'found' ? 'text-green-400 font-bold' : 'text-muted-foreground'}`}>
                if (sum === target) return ✓
              </div>
              <div className={`pl-2 ${getCodeHighlight() === 'tooSmall' ? 'text-blue-400 font-bold' : 'text-muted-foreground'}`}>
                else if (sum &lt; target) left++;
              </div>
              <div className={`pl-2 ${getCodeHighlight() === 'tooBig' ? 'text-red-400 font-bold' : 'text-muted-foreground'}`}>
                else right--;
              </div>
              <div className="text-muted-foreground">{'}'}</div>
            </pre>
          </div>

          {/* Visual hint */}
          {!found && (
            <div className={`p-3 rounded-lg border ${currentSum < target ? 'bg-blue-500/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className={`text-sm font-semibold ${currentSum < target ? 'text-blue-400' : 'text-red-400'}`}>
                {currentSum < target ? '💡 和太小，應該增大' : '💡 和太大，應該減小'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentSum < target 
                  ? '左指標右移 (L++) 可以讓和變大' 
                  : '右指標左移 (R--) 可以讓和變小'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step Log */}
      <div className="p-4 bg-black/40 rounded-xl border border-primary/30 max-h-32 overflow-y-auto">
        <h4 className="text-sm font-semibold text-primary mb-2">操作日誌</h4>
        <div className="space-y-1 font-mono text-xs">
          {stepLog.map((log, i) => (
            <div key={i} className="text-green-400">
              <span className="text-muted-foreground mr-2">[{i + 1}]</span>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoBlock;
