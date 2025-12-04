import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHuffmanStore } from "@/stores/huffmanStore";
import HuffmanTreeScene from "./HuffmanTreeScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [tempFreqMap, setTempFreqMap] = useState<Record<string, number>>({
    'A': 5, 'B': 9, 'C': 12, 'D': 13, 'E': 16, 'F': 45
  });

  const {
    nodes,
    tree,
    freqMap,
    isAnimating,
    currentStep,
    stepLog,
    highlightedNodes,
    encodingResult,
    buildComplete,
    initFromFreqMap,
    stepMerge,
    autoBuild,
    reset,
    setFreqMap,
    highlightPath,
    clearHighlights,
  } = useHuffmanStore();

  useEffect(() => {
    initFromFreqMap(freqMap);
  }, []);

  useEffect(() => {
    if (buildComplete && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
    }
  }, [buildComplete, hasCompleted, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && !buildComplete && !isAnimating) {
      interval = setInterval(async () => {
        const canContinue = await stepMerge();
        if (!canContinue) {
          setIsAutoPlaying(false);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, buildComplete, isAnimating, stepMerge]);

  const handleApplyFreqMap = () => {
    setFreqMap(tempFreqMap);
    setShowSettings(false);
    setHasCompleted(false);
  };

  const handleReset = () => {
    reset();
    setIsAutoPlaying(false);
    setHasCompleted(false);
  };

  const handleFreqChange = (char: string, value: string) => {
    const num = parseInt(value) || 1;
    setTempFreqMap(prev => ({ ...prev, [char]: Math.max(1, num) }));
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={buildComplete || isAnimating}
          >
            {isAutoPlaying ? (
              <><Pause className="w-4 h-4 mr-2" />暫停</>
            ) : (
              <><Play className="w-4 h-4 mr-2" />自動建樹</>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => stepMerge()}
            disabled={buildComplete || isAnimating || isAutoPlaying}
          >
            <SkipForward className="w-4 h-4 mr-2" />
            單步合併
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
          節點數: {nodes.length} {buildComplete && "✓ 完成"}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-card/60 rounded-xl border border-primary/30"
        >
          <h4 className="text-sm font-semibold text-primary mb-3">調整字符頻率</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(tempFreqMap).map(([char, freq]) => (
              <div key={char} className="space-y-1">
                <Label className="text-xs">{char}</Label>
                <Input
                  type="number"
                  min={1}
                  value={freq}
                  onChange={(e) => handleFreqChange(char, e.target.value)}
                  className="h-8 bg-background/50"
                />
              </div>
            ))}
          </div>
          <Button
            size="sm"
            className="mt-3"
            onClick={handleApplyFreqMap}
          >
            套用變更
          </Button>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2 h-[450px] bg-black/40 rounded-xl border border-primary/30 overflow-hidden">
          <HuffmanTreeScene 
            nodes={nodes}
            tree={tree}
            highlightedNodes={highlightedNodes}
            buildComplete={buildComplete}
          />
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Current Step */}
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-2">當前狀態</h4>
            <p className="text-sm text-foreground">{currentStep || "等待操作..."}</p>
          </div>

          {/* Encoding Result */}
          {buildComplete && Object.keys(encodingResult).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 rounded-xl border border-green-500/30"
            >
              <h4 className="text-sm font-semibold text-green-400 mb-3">編碼結果</h4>
              <div className="space-y-2">
                {Object.entries(encodingResult)
                  .sort((a, b) => a[1].length - b[1].length)
                  .map(([char, code]) => (
                    <div
                      key={char}
                      className="flex justify-between items-center p-2 bg-background/30 rounded cursor-pointer hover:bg-background/50 transition-colors"
                      onMouseEnter={() => highlightPath(char)}
                      onMouseLeave={() => clearHighlights()}
                    >
                      <span className="font-bold text-primary">{char}</span>
                      <span className="font-mono text-green-400 text-sm">{code}</span>
                      <span className="text-xs text-muted-foreground">
                        {code.length} bits
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Original Frequency */}
          <div className="p-4 bg-card/40 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-3">字符頻率</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(freqMap)
                .sort((a, b) => b[1] - a[1])
                .map(([char, freq]) => (
                  <div key={char} className="text-center p-2 bg-background/30 rounded">
                    <div className="font-bold text-foreground">{char}</div>
                    <div className="text-xs text-muted-foreground">{freq}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Log */}
      <div className="p-4 bg-black/40 rounded-xl border border-primary/30 max-h-40 overflow-y-auto">
        <h4 className="text-sm font-semibold text-primary mb-2">建樹日誌</h4>
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
