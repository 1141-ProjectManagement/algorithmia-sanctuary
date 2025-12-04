import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, StepForward, Navigation } from "lucide-react";
import { useDijkstraStore } from "@/stores/dijkstraStore";
import StarScene from "./StarScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    nodes,
    edges,
    sourceNode,
    targetNode,
    priorityQueue,
    currentNode,
    isPlaying,
    isComplete,
    shortestPath,
    stepLog,
    setSourceNode,
    setIsPlaying,
    startDijkstra,
    processNextNode,
    resetDijkstra,
  } = useDijkstraStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  const step = useCallback(() => {
    const result = processNextNode();
    if (!result && isComplete) {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => onComplete(), 1000);
      }
    }
  }, [processNextNode, isComplete, onComplete]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      intervalRef.current = setInterval(step, 1200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isComplete, step]);

  const handleNodeClick = (nodeId: string) => {
    if (!isPlaying && !isComplete) {
      setSourceNode(nodeId);
    }
  };

  const handleStart = () => {
    hasCompletedRef.current = false;
    startDijkstra();
  };

  const handleReset = () => {
    setIsPlaying(false);
    resetDijkstra();
    hasCompletedRef.current = false;
  };

  const handleManualStep = () => {
    if (!sourceNode) {
      setSourceNode("A");
    }
    step();
  };

  // Calculate total distance for the path
  const totalDistance = nodes.find(n => n.id === targetNode)?.distance;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-card/60 rounded-lg">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm">起點:</span>
            <span className="font-bold text-primary">{sourceNode || "點擊選擇"}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-card/60 rounded-lg">
            <span className="text-sm">終點:</span>
            <span className="font-bold text-amber-400">{targetNode}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleStart} disabled={isPlaying || !sourceNode}>
            <Play className="w-4 h-4 mr-1" />
            開始
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!sourceNode || isComplete}
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

      {/* Hint for selecting source */}
      {!sourceNode && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-400">
          💡 點擊 3D 場景中的任意星球作為起點
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* 3D Scene */}
        <div className="md:col-span-2 h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
          <StarScene
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Stats & Priority Queue */}
        <div className="space-y-4">
          {/* Distance table */}
          <div className="p-4 bg-card/40 border border-primary/20 rounded-lg">
            <h4 className="font-medium text-primary mb-2">距離表</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`p-2 rounded text-center ${
                    node.status === "settled" ? "bg-green-500/20" :
                    node.status === "visiting" ? "bg-primary/20" :
                    "bg-card/60"
                  }`}
                >
                  <span className="font-bold">{node.id}</span>
                  <span className="text-muted-foreground mx-1">:</span>
                  <span className={node.distance === Infinity ? "text-muted-foreground" : "text-primary"}>
                    {node.distance === Infinity ? "∞" : node.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Queue */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <h4 className="font-medium text-amber-400 mb-2">Priority Queue</h4>
            <div className="flex flex-wrap gap-2">
              {priorityQueue.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${idx}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-2 py-1 rounded text-xs ${
                    idx === 0 ? "bg-amber-500/30 font-bold" : "bg-amber-500/10"
                  }`}
                >
                  {item.id}({item.distance})
                </motion.div>
              ))}
              {priorityQueue.length === 0 && (
                <span className="text-muted-foreground text-xs">空</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">← 最小優先取出</p>
          </div>

          {/* Shortest Path Result */}
          {isComplete && shortestPath.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <h4 className="font-medium text-green-400 mb-2">🎯 最短路徑</h4>
              <p className="font-mono text-sm">{shortestPath.join(" → ")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                總距離: <span className="text-primary font-bold">{totalDistance}</span>
              </p>
            </motion.div>
          )}

          {/* Legend */}
          <div className="p-3 bg-card/40 rounded-lg text-xs">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>未訪問</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>訪問中</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>已確定</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step log */}
      <div className="bg-black/60 rounded-lg p-4 h-[120px] overflow-y-auto font-mono text-sm">
        <div className="text-muted-foreground mb-2">執行日誌：</div>
        {stepLog.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`py-0.5 ${
              log.includes("🎯") ? "text-green-400" :
              log.includes("📍") ? "text-primary" :
              log.includes("↳") ? "text-amber-400" :
              "text-foreground/80"
            }`}
          >
            {log}
          </motion.div>
        ))}
      </div>

      {/* Code display */}
      <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-primary">{`// Dijkstra 核心邏輯
while (!pq.isEmpty()) {
  let u = pq.extractMin();      // 取最小距離節點
  if (visited[u]) continue;
  visited[u] = true;
  
  for (let [v, weight] of neighbors[u]) {
    let newDist = distances[u] + weight;
    if (newDist < distances[v]) {  // ⭐ 鬆弛操作
      distances[v] = newDist;
      pq.add(v, newDist);
    }
  }
}`}</pre>
      </div>
    </div>
  );
};

export default DemoBlock;
