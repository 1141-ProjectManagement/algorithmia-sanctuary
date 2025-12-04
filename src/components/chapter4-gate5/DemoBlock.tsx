import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFloydWarshallStore } from "@/stores/floydWarshallStore";
import NetworkScene from "./NetworkScene";
import DistanceMatrix from "./DistanceMatrix";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    nodes,
    edges,
    distMatrix,
    nodeIds,
    currentK,
    currentI,
    currentJ,
    isPlaying,
    isComplete,
    stepLog,
    speed,
    updatedCells,
    resetAlgorithm,
    setIsPlaying,
    setSpeed,
    processNextStep,
    skipToK,
  } = useFloydWarshallStore();

  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      const result = processNextStep();
      if (result.finished) {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, processNextStep, setIsPlaying]);

  // Track completion
  useEffect(() => {
    if (isComplete && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
    }
  }, [isComplete, hasCompleted, onComplete]);

  const handleStart = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPlaying(true);
  }, [hasStarted, setIsPlaying]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleStep = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    processNextStep();
  }, [hasStarted, processNextStep]);

  const handleReset = useCallback(() => {
    resetAlgorithm();
    setHasStarted(false);
    setHasCompleted(false);
  }, [resetAlgorithm]);

  const handleSkipToK = useCallback((k: number) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    skipToK(k);
  }, [hasStarted, skipToK]);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isPlaying ? (
          <Button
            onClick={handleStart}
            disabled={isComplete}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            <Play className="w-4 h-4 mr-2" />
            {hasStarted ? "繼續" : "開始"}
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50"
          >
            <Pause className="w-4 h-4 mr-2" />
            暫停
          </Button>
        )}
        
        <Button
          onClick={handleStep}
          disabled={isPlaying || isComplete}
          variant="outline"
          className="border-primary/50"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          單步
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          className="border-muted-foreground/50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground">速度:</span>
        <div className="w-32">
          <Slider
            value={[1000 - speed]}
            onValueChange={(v) => setSpeed(1000 - v[0])}
            max={900}
            min={0}
            step={100}
          />
        </div>
        <span className="text-xs text-muted-foreground w-16">{speed}ms</span>
      </div>

      {/* Skip to K buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">跳轉到 k =</span>
        {nodeIds.map((id, idx) => (
          <Button
            key={id}
            size="sm"
            variant={currentK === idx ? "default" : "outline"}
            onClick={() => handleSkipToK(idx)}
            className={`w-8 h-8 p-0 ${
              currentK === idx ? "bg-primary text-primary-foreground" : "border-primary/30"
            }`}
          >
            {id}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSkipToK(nodeIds.length)}
          className="border-primary/30"
        >
          <FastForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Main visualization area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 3D Network Scene */}
        <div className="h-[350px] bg-card/30 rounded-xl border border-border overflow-hidden">
          <NetworkScene
            nodes={nodes}
            edges={edges}
            nodeIds={nodeIds}
            currentK={currentK}
            currentI={currentI}
            currentJ={currentJ}
          />
        </div>

        {/* Distance Matrix */}
        <div className="bg-card/30 rounded-xl border border-border p-4 flex flex-col justify-center">
          <DistanceMatrix
            matrix={distMatrix}
            nodeIds={nodeIds}
            currentK={currentK}
            currentI={currentI}
            currentJ={currentJ}
            updatedCells={updatedCells}
          />
        </div>
      </div>

      {/* Algorithm State */}
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
          <div className="text-xs text-muted-foreground">中轉站 k</div>
          <div className="text-2xl font-bold text-primary">
            {currentK >= 0 && currentK < nodeIds.length ? nodeIds[currentK] : "-"}
          </div>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="text-xs text-muted-foreground">起點 i</div>
          <div className="text-2xl font-bold text-blue-400">
            {currentK >= 0 ? nodeIds[currentI] : "-"}
          </div>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
          <div className="text-xs text-muted-foreground">終點 j</div>
          <div className="text-2xl font-bold text-emerald-400">
            {currentK >= 0 ? nodeIds[currentJ] : "-"}
          </div>
        </div>
      </div>

      {/* Step Log */}
      <div className="bg-black/30 rounded-lg p-4 max-h-40 overflow-y-auto">
        <h4 className="text-sm font-semibold text-primary mb-2">執行記錄</h4>
        <div className="space-y-1">
          {stepLog.length === 0 ? (
            <p className="text-xs text-muted-foreground">點擊「開始」觀察演算法執行過程...</p>
          ) : (
            stepLog.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-muted-foreground font-mono"
              >
                {log}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Completion status */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/20 rounded-lg border border-primary/50"
        >
          <div className="text-lg font-['Cinzel'] text-primary">🎉 全知之眼已啟動！</div>
          <div className="text-sm text-muted-foreground mt-1">
            所有最短路徑已計算完成
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
