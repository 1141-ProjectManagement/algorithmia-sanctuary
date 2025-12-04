import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Plus, Minus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeapStore } from "@/stores/heapStore";
import HeapScene from "./HeapScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [inputValue, setInputValue] = useState("");
  const [operationCount, setOperationCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const {
    heap,
    isMaxHeap,
    isAnimating,
    currentStep,
    stepLog,
    highlightIndices,
    initHeap,
    push,
    pop,
    setIsMaxHeap,
    reset,
    buildHeap,
  } = useHeapStore();

  useEffect(() => {
    // Initialize with sample data
    initHeap([30, 20, 15, 5, 10, 8, 12]);
  }, [initHeap]);

  useEffect(() => {
    // Complete after 3 operations
    if (operationCount >= 3 && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
    }
  }, [operationCount, hasCompleted, onComplete]);

  const handlePush = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    await push(value);
    setInputValue("");
    setOperationCount(prev => prev + 1);
  };

  const handlePop = async () => {
    await pop();
    setOperationCount(prev => prev + 1);
  };

  const handleBuildHeap = async () => {
    await buildHeap();
    setOperationCount(prev => prev + 1);
  };

  const handleReset = () => {
    reset();
    initHeap([30, 20, 15, 5, 10, 8, 12]);
  };

  const handleToggleHeapType = (value: string) => {
    setIsMaxHeap(value === "max");
    // Rebuild heap with new property
    if (heap.length > 0) {
      setTimeout(() => buildHeap(), 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tabs defaultValue="max" onValueChange={handleToggleHeapType}>
            <TabsList className="bg-card/60">
              <TabsTrigger value="max">Max Heap</TabsTrigger>
              <TabsTrigger value="min">Min Heap</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isAnimating}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          操作次數: {operationCount} / 3 {hasCompleted && "✓"}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2 h-[400px] bg-black/40 rounded-xl border border-primary/30 overflow-hidden">
          <HeapScene heap={heap} highlightIndices={highlightIndices} />
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Push Control */}
          <div className="p-4 bg-card/40 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              插入元素 (Push)
            </h4>
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="輸入數字"
                className="bg-background/50"
                disabled={isAnimating}
              />
              <Button
                onClick={handlePush}
                disabled={isAnimating || !inputValue}
                size="sm"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Pop Control */}
          <div className="p-4 bg-card/40 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <Minus className="w-4 h-4" />
              提取頂端 (Pop)
            </h4>
            <Button
              onClick={handlePop}
              disabled={isAnimating || heap.length === 0}
              className="w-full"
              variant="outline"
            >
              提取 {isMaxHeap ? "最大值" : "最小值"}
            </Button>
          </div>

          {/* Build Heap */}
          <div className="p-4 bg-card/40 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <Play className="w-4 h-4" />
              建構堆積
            </h4>
            <Button
              onClick={handleBuildHeap}
              disabled={isAnimating || heap.length === 0}
              className="w-full"
              variant="outline"
            >
              Heapify
            </Button>
          </div>

          {/* Current Step */}
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
            <h4 className="text-sm font-semibold text-primary mb-2">當前狀態</h4>
            <p className="text-sm text-foreground">{currentStep || "等待操作..."}</p>
          </div>
        </div>
      </div>

      {/* Array Representation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-card/40 rounded-xl border border-primary/30"
      >
        <h4 className="text-sm font-semibold text-primary mb-3">陣列表示</h4>
        <div className="flex flex-wrap gap-2">
          {heap.map((node, index) => (
            <motion.div
              key={node.id}
              layout
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                backgroundColor: highlightIndices.includes(index) 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--card))',
              }}
              className="w-12 h-12 rounded-lg border border-primary/30 flex flex-col items-center justify-center"
            >
              <span className={`font-bold ${highlightIndices.includes(index) ? 'text-primary-foreground' : 'text-foreground'}`}>
                {node.value}
              </span>
              <span className="text-xs text-muted-foreground">[{index}]</span>
            </motion.div>
          ))}
          {heap.length === 0 && (
            <span className="text-muted-foreground text-sm">堆積為空</span>
          )}
        </div>
      </motion.div>

      {/* Step Log */}
      <div className="p-4 bg-black/40 rounded-xl border border-primary/30 max-h-40 overflow-y-auto">
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
