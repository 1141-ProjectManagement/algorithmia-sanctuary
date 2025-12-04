import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, StepForward, Scissors, GitBranch } from "lucide-react";
import { useMSTStore } from "@/stores/mstStore";
import IslandScene from "./IslandScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    islands,
    bridges,
    mode,
    sortedEdges,
    currentEdgeIndex,
    mstEdges,
    totalWeight,
    isPlaying,
    isComplete,
    visitedSet,
    candidateEdges,
    setMode,
    resetMST,
    setIsPlaying,
    sortEdges,
    processNextEdgeKruskal,
    startPrim,
    processNextEdgePrim,
  } = useMSTStore();

  const [stepLog, setStepLog] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  const addLog = (msg: string) => {
    setStepLog(prev => [...prev.slice(-6), msg]);
  };

  const stepKruskal = useCallback(() => {
    const result = processNextEdgeKruskal();
    if (!result) {
      addLog("✅ Kruskal 完成！MST 總權重: " + totalWeight);
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => onComplete(), 500);
      }
      return;
    }

    const { edge, accepted } = result;
    if (accepted) {
      addLog(`✓ 選取邊 ${edge.source}-${edge.target} (權重 ${edge.weight})`);
    } else {
      addLog(`✗ 跳過邊 ${edge.source}-${edge.target} (會形成環)`);
    }
  }, [processNextEdgeKruskal, totalWeight, onComplete]);

  const stepPrim = useCallback(() => {
    const result = processNextEdgePrim();
    if (!result) {
      addLog("✅ Prim 完成！MST 總權重: " + totalWeight);
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => onComplete(), 500);
      }
      return;
    }

    const { edge } = result;
    const newNode = visitedSet.has(edge.source) ? edge.target : edge.source;
    addLog(`✓ 選取邊 ${edge.source}-${edge.target} → 新增島嶼 ${newNode}`);
  }, [processNextEdgePrim, totalWeight, visitedSet, onComplete]);

  const step = useCallback(() => {
    if (mode === "kruskal") {
      stepKruskal();
    } else {
      stepPrim();
    }
  }, [mode, stepKruskal, stepPrim]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      intervalRef.current = setInterval(step, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isComplete, step]);

  const handleStart = () => {
    resetMST();
    setStepLog([]);
    hasCompletedRef.current = false;

    if (mode === "kruskal") {
      sortEdges();
      addLog("🚀 Kruskal: 邊已按權重排序，開始選取...");
    } else {
      startPrim("A");
      addLog("🚀 Prim: 從島嶼 A 開始擴散...");
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    resetMST();
    setStepLog([]);
    hasCompletedRef.current = false;
  };

  const handleModeChange = (newMode: "kruskal" | "prim") => {
    setMode(newMode);
    handleReset();
  };

  const handleManualStep = () => {
    if (sortedEdges.length === 0 && mode === "kruskal") {
      sortEdges();
      addLog("🚀 Kruskal: 邊已按權重排序");
    } else if (visitedSet.size === 0 && mode === "prim") {
      startPrim("A");
      addLog("🚀 Prim: 從島嶼 A 開始");
    } else {
      step();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Tabs value={mode} onValueChange={(v) => handleModeChange(v as "kruskal" | "prim")}>
          <TabsList className="bg-card/60">
            <TabsTrigger value="kruskal" className="data-[state=active]:bg-emerald-500/20">
              <Scissors className="w-4 h-4 mr-1" />
              Kruskal
            </TabsTrigger>
            <TabsTrigger value="prim" className="data-[state=active]:bg-cyan-500/20">
              <GitBranch className="w-4 h-4 mr-1" />
              Prim
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleStart} disabled={isPlaying}>
            <Play className="w-4 h-4 mr-1" />
            開始
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isComplete}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? "暫停" : "繼續"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleManualStep} disabled={isPlaying || isComplete}>
            <StepForward className="w-4 h-4 mr-1" />
            單步
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* 3D Scene */}
        <div className="md:col-span-2 h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
          <IslandScene islands={islands} bridges={bridges} mode={mode} />
        </div>

        {/* Stats & Progress */}
        <div className="space-y-4">
          {/* MST Progress */}
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <h4 className="font-medium text-primary mb-2">MST 進度</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>已選邊數</span>
                <span className="text-primary">{mstEdges.length} / {islands.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span>總權重</span>
                <span className="text-primary font-bold">{totalWeight}</span>
              </div>
              {isComplete && (
                <div className="text-green-400 text-center mt-2">✓ MST 完成</div>
              )}
            </div>
          </div>

          {/* Mode-specific info */}
          {mode === "kruskal" ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <h4 className="font-medium text-emerald-400 mb-2">排序邊列表</h4>
              <div className="space-y-1 text-xs max-h-[120px] overflow-y-auto">
                {sortedEdges.map((edge, idx) => (
                  <div
                    key={edge.id}
                    className={`flex justify-between px-2 py-1 rounded ${
                      idx < currentEdgeIndex
                        ? edge.inMST
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400 line-through"
                        : idx === currentEdgeIndex
                        ? "bg-yellow-500/20 text-yellow-400"
                        : ""
                    }`}
                  >
                    <span>{edge.source}-{edge.target}</span>
                    <span>{edge.weight}</span>
                  </div>
                ))}
                {sortedEdges.length === 0 && (
                  <span className="text-muted-foreground">點擊「開始」排序邊</span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <h4 className="font-medium text-cyan-400 mb-2">已訪問島嶼</h4>
              <div className="flex flex-wrap gap-1 mb-3">
                {Array.from(visitedSet).map(id => (
                  <span key={id} className="px-2 py-0.5 bg-cyan-500/30 rounded text-xs">{id}</span>
                ))}
                {visitedSet.size === 0 && (
                  <span className="text-muted-foreground text-xs">尚未開始</span>
                )}
              </div>
              <h4 className="font-medium text-cyan-400 mb-1 text-sm">候選邊 (Cut Edges)</h4>
              <div className="space-y-1 text-xs">
                {candidateEdges.map(edge => (
                  <div key={edge.id} className="flex justify-between px-2 py-1 bg-cyan-500/10 rounded">
                    <span>{edge.source}-{edge.target}</span>
                    <span>{edge.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MST Edges */}
          <div className="p-4 bg-card/40 border border-primary/20 rounded-lg">
            <h4 className="font-medium text-primary mb-2">已建橋樑</h4>
            <div className="flex flex-wrap gap-1">
              {mstEdges.map(edge => (
                <motion.span
                  key={edge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-primary/20 rounded text-xs"
                >
                  {edge.source}-{edge.target} ({edge.weight})
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step log */}
      <div className="bg-black/60 rounded-lg p-4 h-[100px] overflow-y-auto font-mono text-sm">
        <div className="text-muted-foreground mb-2">執行日誌：</div>
        {stepLog.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`py-0.5 ${
              log.includes("✅") ? "text-green-400" :
              log.includes("✓") ? "text-primary" :
              log.includes("✗") ? "text-gray-400" :
              "text-foreground/80"
            }`}
          >
            {log}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DemoBlock;
