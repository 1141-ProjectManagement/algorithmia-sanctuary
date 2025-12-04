import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, StepForward, Waves, ArrowDownToLine } from "lucide-react";
import { useGraphTraversalStore } from "@/stores/graphTraversalStore";
import GraphScene from "./GraphScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    nodes,
    edges,
    mode,
    queue,
    stack,
    visited,
    currentNode,
    isPlaying,
    traversalOrder,
    isComplete,
    setMode,
    initGraph,
    resetTraversal,
    visitNode,
    setNodeVisiting,
    addToQueue,
    removeFromQueue,
    addToStack,
    removeFromStack,
    setEdgeActive,
    setIsPlaying,
    setCurrentNode,
    addToTraversalOrder,
    setIsComplete,
    markVisited,
  } = useGraphTraversalStore();

  const [stepLog, setStepLog] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  const addLog = (msg: string) => {
    setStepLog(prev => [...prev.slice(-6), msg]);
  };

  const getNeighbors = useCallback((nodeId: string) => {
    const neighbors: string[] = [];
    edges.forEach(edge => {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        neighbors.push(edge.target);
      }
      if (edge.target === nodeId && !visited.has(edge.source)) {
        neighbors.push(edge.source);
      }
    });
    return neighbors;
  }, [edges, visited]);

  const stepBFS = useCallback(() => {
    if (queue.length === 0) {
      setIsPlaying(false);
      setIsComplete(true);
      addLog("✅ BFS 遍歷完成！");
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => onComplete(), 500);
      }
      return;
    }

    const nodeId = removeFromQueue();
    if (!nodeId) return;

    setCurrentNode(nodeId);
    setNodeVisiting(nodeId, true);
    addLog(`📍 訪問節點 ${nodeId} (從 Queue 取出)`);

    setTimeout(() => {
      visitNode(nodeId);
      addToTraversalOrder(nodeId);

      const neighbors = getNeighbors(nodeId);
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          markVisited(neighbor);
          addToQueue(neighbor);
          setEdgeActive(nodeId, neighbor, true);
          addLog(`   ➕ 將 ${neighbor} 加入 Queue`);
        }
      });
    }, 200);
  }, [queue, visited, getNeighbors, removeFromQueue, setCurrentNode, setNodeVisiting, visitNode, addToTraversalOrder, markVisited, addToQueue, setEdgeActive, setIsPlaying, setIsComplete, onComplete]);

  const stepDFS = useCallback(() => {
    if (stack.length === 0) {
      setIsPlaying(false);
      setIsComplete(true);
      addLog("✅ DFS 遍歷完成！");
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => onComplete(), 500);
      }
      return;
    }

    const nodeId = removeFromStack();
    if (!nodeId) return;

    setCurrentNode(nodeId);
    setNodeVisiting(nodeId, true);
    addLog(`📍 訪問節點 ${nodeId} (從 Stack 彈出)`);

    setTimeout(() => {
      visitNode(nodeId);
      addToTraversalOrder(nodeId);

      const neighbors = getNeighbors(nodeId);
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          markVisited(neighbor);
          addToStack(neighbor);
          setEdgeActive(nodeId, neighbor, true);
          addLog(`   ➕ 將 ${neighbor} 壓入 Stack`);
        }
      });
    }, 200);
  }, [stack, visited, getNeighbors, removeFromStack, setCurrentNode, setNodeVisiting, visitNode, addToTraversalOrder, markVisited, addToStack, setEdgeActive, setIsPlaying, setIsComplete, onComplete]);

  const step = useCallback(() => {
    if (mode === "bfs") {
      stepBFS();
    } else {
      stepDFS();
    }
  }, [mode, stepBFS, stepDFS]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      intervalRef.current = setInterval(step, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isComplete, step]);

  const handleStart = () => {
    resetTraversal();
    setStepLog([]);
    hasCompletedRef.current = false;
    
    const startNode = nodes.find(n => n.isStart);
    if (startNode) {
      markVisited(startNode.id);
      if (mode === "bfs") {
        addToQueue(startNode.id);
        addLog(`🚀 開始 BFS：將起點 ${startNode.id} 加入 Queue`);
      } else {
        addToStack(startNode.id);
        addLog(`🚀 開始 DFS：將起點 ${startNode.id} 壓入 Stack`);
      }
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    resetTraversal();
    setStepLog([]);
    hasCompletedRef.current = false;
  };

  const handleModeChange = (newMode: "bfs" | "dfs") => {
    setMode(newMode);
    handleReset();
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Tabs value={mode} onValueChange={(v) => handleModeChange(v as "bfs" | "dfs")}>
          <TabsList className="bg-card/60">
            <TabsTrigger value="bfs" className="data-[state=active]:bg-blue-500/20">
              <Waves className="w-4 h-4 mr-1" />
              BFS 波紋術
            </TabsTrigger>
            <TabsTrigger value="dfs" className="data-[state=active]:bg-red-500/20">
              <ArrowDownToLine className="w-4 h-4 mr-1" />
              DFS 深淵術
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
            disabled={isComplete || (queue.length === 0 && stack.length === 0)}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? "暫停" : "繼續"}
          </Button>
          <Button variant="outline" size="sm" onClick={step} disabled={isPlaying || isComplete}>
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
          <GraphScene nodes={nodes} edges={edges} mode={mode} />
        </div>

        {/* Data Structure View */}
        <div className="space-y-4">
          {/* Queue/Stack visualization */}
          <div className={`p-4 rounded-lg border ${mode === "bfs" ? "bg-blue-500/10 border-blue-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <h4 className={`font-medium mb-2 ${mode === "bfs" ? "text-blue-400" : "text-red-400"}`}>
              {mode === "bfs" ? "Queue (佇列)" : "Stack (堆疊)"}
            </h4>
            <div className={`flex ${mode === "dfs" ? "flex-col-reverse" : "flex-row"} flex-wrap gap-2 min-h-[40px]`}>
              {(mode === "bfs" ? queue : stack).map((nodeId, idx) => (
                <motion.div
                  key={`${nodeId}-${idx}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-3 py-1 rounded text-sm font-mono ${
                    mode === "bfs" ? "bg-blue-500/30" : "bg-red-500/30"
                  }`}
                >
                  {nodeId}
                </motion.div>
              ))}
              {(mode === "bfs" ? queue : stack).length === 0 && (
                <span className="text-muted-foreground text-sm">空</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mode === "bfs" ? "← 出口 | 入口 →" : "↑ 頂部 (先出)"}
            </p>
          </div>

          {/* Visited set */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="font-medium text-purple-400 mb-2">Visited 集合</h4>
            <div className="flex flex-wrap gap-1">
              {Array.from(visited).map(nodeId => (
                <span key={nodeId} className="px-2 py-0.5 bg-purple-500/30 rounded text-xs">
                  {nodeId}
                </span>
              ))}
            </div>
          </div>

          {/* Traversal order */}
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <h4 className="font-medium text-primary mb-2">遍歷順序</h4>
            <p className="font-mono text-sm">
              {traversalOrder.length > 0 ? traversalOrder.join(" → ") : "尚未開始"}
            </p>
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
              log.includes("✅") ? "text-green-400" :
              log.includes("📍") ? (mode === "bfs" ? "text-blue-400" : "text-red-400") :
              "text-foreground/80"
            }`}
          >
            {log}
          </motion.div>
        ))}
      </div>

      {/* Code display */}
      <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className={mode === "bfs" ? "text-blue-400" : "text-red-400"}>
          {mode === "bfs" ? `// BFS 使用 Queue (FIFO)
let queue = [startNode];
while (queue.length > 0) {
  let node = queue.shift();  // ← 取隊首
  visit(node);
  for (neighbor of getNeighbors(node)) {
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      queue.push(neighbor);  // ← 加入隊尾
    }
  }
}` : `// DFS 使用 Stack (LIFO)
let stack = [startNode];
while (stack.length > 0) {
  let node = stack.pop();   // ← 取棧頂
  visit(node);
  for (neighbor of getNeighbors(node)) {
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      stack.push(neighbor); // ← 壓入棧頂
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default DemoBlock;
