import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTopologicalSortStore } from "@/stores/topologicalSortStore";
import TaskCardScene from "./TaskCardScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [customInput, setCustomInput] = useState('[[0,1],[0,3],[1,2],[1,3],[2,4],[3,5],[4,5]]');
  const [hasError, setHasError] = useState(false);

  const {
    nodes,
    edges,
    queue,
    result,
    hasCycle,
    isRunning,
    stepLog,
    initGraph,
    setCustomGraph,
    step,
    reset,
  } = useTopologicalSortStore();

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  const handleStep = useCallback(() => {
    const canContinue = step();
    if (!canContinue && !hasCycle && result.length === nodes.length) {
      setCompleted(true);
      onComplete();
    }
  }, [step, hasCycle, result.length, nodes.length, onComplete]);

  useEffect(() => {
    if (!isPlaying || !isRunning) return;

    const interval = setInterval(() => {
      const canContinue = step();
      if (!canContinue) {
        setIsPlaying(false);
        if (!hasCycle && result.length === nodes.length) {
          setCompleted(true);
          onComplete();
        }
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, isRunning, step, hasCycle, result.length, nodes.length, onComplete]);

  const handleStart = () => {
    if (result.length === 0 && queue.length > 0) {
      setIsPlaying(true);
    } else {
      reset();
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCompleted(false);
    reset();
  };

  const handleCustomGraph = () => {
    try {
      const deps = JSON.parse(customInput);
      if (!Array.isArray(deps) || !deps.every(d => Array.isArray(d) && d.length === 2)) {
        throw new Error('Invalid format');
      }
      setHasError(false);
      setIsPlaying(false);
      setCompleted(false);
      setCustomGraph(deps);
    } catch {
      setHasError(true);
    }
  };

  const handleAddCycle = () => {
    // Add a cycle to demonstrate deadlock
    setCustomInput('[[0,1],[1,2],[2,0]]');
    setHasError(false);
    setIsPlaying(false);
    setCompleted(false);
    setCustomGraph([[0,1],[1,2],[2,0]]);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-['Cinzel'] text-primary mb-2">
          Kahn 演算法視覺化
        </h3>
        <p className="text-muted-foreground text-sm">
          觀察任務卡片如何依照入度順序依次啟動
        </p>
      </motion.div>

      {/* Control Panel */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={isPlaying ? () => setIsPlaying(false) : handleStart}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? '暫停' : '播放'}
        </Button>
        <Button
          onClick={handleStep}
          disabled={isPlaying || !isRunning}
          variant="outline"
          className="border-primary/50 text-primary"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          單步
        </Button>
        <Button onClick={handleReset} variant="outline" className="border-primary/50 text-primary">
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
        <Button 
          onClick={handleAddCycle} 
          variant="outline" 
          className="border-destructive/50 text-destructive"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          製造死鎖
        </Button>
      </div>

      {/* 3D Scene */}
      <TaskCardScene nodes={nodes} edges={edges} hasCycle={hasCycle} />

      {/* Status Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Queue & Result */}
        <div className="bg-card/40 border border-primary/30 rounded-lg p-4">
          <h4 className="font-['Cinzel'] text-primary mb-3">演算法狀態</h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">佇列 (Queue)：</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {queue.length > 0 ? queue.map(id => {
                  const node = nodes.find(n => n.id === id);
                  return (
                    <span key={id} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                      {node?.label || id}
                    </span>
                  );
                }) : <span className="text-muted-foreground">空</span>}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">拓撲序列：</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.length > 0 ? result.map(id => {
                  const node = nodes.find(n => n.id === id);
                  return (
                    <span key={id} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                      {node?.label || id}
                    </span>
                  );
                }) : <span className="text-muted-foreground">尚未開始</span>}
              </div>
            </div>
            {hasCycle && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span>檢測到循環依賴！</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom Input */}
        <div className="bg-card/40 border border-primary/30 rounded-lg p-4">
          <h4 className="font-['Cinzel'] text-primary mb-3">自訂依賴圖</h4>
          <div className="space-y-2">
            <textarea
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setHasError(false);
              }}
              className={`w-full h-20 bg-black/30 border rounded p-2 font-mono text-xs text-foreground ${
                hasError ? 'border-destructive' : 'border-primary/30'
              }`}
              placeholder="[[0,1],[1,2],...]"
            />
            {hasError && (
              <p className="text-destructive text-xs">格式錯誤，請輸入正確的 JSON 陣列</p>
            )}
            <Button 
              onClick={handleCustomGraph}
              size="sm"
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary"
            >
              套用自訂圖形
            </Button>
          </div>
        </div>
      </div>

      {/* Step Log */}
      <div className="bg-card/40 border border-primary/30 rounded-lg p-4 max-h-40 overflow-y-auto">
        <h4 className="font-['Cinzel'] text-primary mb-2">執行日誌</h4>
        <div className="space-y-1 text-xs font-mono">
          {stepLog.slice(-8).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${log.includes('⚠️') ? 'text-destructive' : log.includes('✅') ? 'text-green-400' : 'text-muted-foreground'}`}
            >
              {log}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoBlock;
