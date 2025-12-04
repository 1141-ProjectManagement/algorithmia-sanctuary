import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, GitMerge, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUnionFindStore } from "@/stores/unionFindStore";
import UnionFindScene from "./UnionFindScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    nodes,
    parent,
    highlightPath,
    activeNodes,
    isAnimating,
    usePathCompression,
    stepLogs,
    queryCount,
    initializeNodes,
    findWithAnimation,
    unionWithAnimation,
    setUsePathCompression,
    reset,
  } = useUnionFindStore();

  const [unionA, setUnionA] = useState("0");
  const [unionB, setUnionB] = useState("1");
  const [findX, setFindX] = useState("0");
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    initializeNodes(8);
  }, [initializeNodes]);

  const handleUnion = async () => {
    const a = parseInt(unionA);
    const b = parseInt(unionB);
    if (!isNaN(a) && !isNaN(b) && a >= 0 && a < nodes.length && b >= 0 && b < nodes.length) {
      setHasInteracted(true);
      await unionWithAnimation(a, b);
    }
  };

  const handleFind = async () => {
    const x = parseInt(findX);
    if (!isNaN(x) && x >= 0 && x < nodes.length) {
      setHasInteracted(true);
      await findWithAnimation(x);
    }
  };

  const handleReset = () => {
    reset();
    setHasInteracted(false);
  };

  // Complete when user has done multiple operations
  useEffect(() => {
    if (stepLogs.length >= 5 && hasInteracted) {
      onComplete();
    }
  }, [stepLogs.length, hasInteracted, onComplete]);

  return (
    <div className="space-y-6">
      {/* 3D Visualization */}
      <UnionFindScene
        nodes={nodes}
        parent={parent}
        highlightPath={highlightPath}
        activeNodes={activeNodes}
      />

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel - Operations */}
        <div className="space-y-4">
          {/* Union Operation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <GitMerge className="w-5 h-5 text-primary" />
              <span className="font-semibold">Union 合併</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">union(</span>
              <Input
                type="number"
                value={unionA}
                onChange={(e) => setUnionA(e.target.value)}
                className="w-16 h-8 text-center"
                min={0}
                max={nodes.length - 1}
              />
              <span className="text-muted-foreground">,</span>
              <Input
                type="number"
                value={unionB}
                onChange={(e) => setUnionB(e.target.value)}
                className="w-16 h-8 text-center"
                min={0}
                max={nodes.length - 1}
              />
              <span className="text-muted-foreground">)</span>
              <Button
                onClick={handleUnion}
                disabled={isAnimating}
                size="sm"
                className="ml-2"
              >
                <Play className="w-4 h-4 mr-1" />
                執行
              </Button>
            </div>
          </motion.div>

          {/* Find Operation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-primary" />
              <span className="font-semibold">Find 查找</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">find(</span>
              <Input
                type="number"
                value={findX}
                onChange={(e) => setFindX(e.target.value)}
                className="w-16 h-8 text-center"
                min={0}
                max={nodes.length - 1}
              />
              <span className="text-muted-foreground">)</span>
              <Button
                onClick={handleFind}
                disabled={isAnimating}
                size="sm"
                className="ml-2"
              >
                <Play className="w-4 h-4 mr-1" />
                執行
              </Button>
            </div>
          </motion.div>

          {/* Path Compression Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <Label htmlFor="path-compression">路徑壓縮</Label>
              </div>
              <Switch
                id="path-compression"
                checked={usePathCompression}
                onCheckedChange={setUsePathCompression}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {usePathCompression
                ? "啟用：find 時將路徑上所有節點直連到根"
                : "停用：保持原始樹結構"}
            </p>
          </motion.div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>

        {/* Right Panel - State & Logs */}
        <div className="space-y-4">
          {/* Parent Array Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <h4 className="font-semibold mb-3">Parent 陣列狀態</h4>
            <div className="flex flex-wrap gap-2">
              {parent.map((p, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center p-2 rounded ${
                    highlightPath.includes(i)
                      ? "bg-primary/30 border border-primary"
                      : "bg-black/20"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">i={i}</span>
                  <span className="font-mono text-sm">{p}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              parent[i] = i 表示 i 是根節點
            </p>
          </motion.div>

          {/* Query Count */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">總查詢次數</span>
              <span className="text-2xl font-bold text-primary">{queryCount}</span>
            </div>
          </motion.div>

          {/* Step Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <h4 className="font-semibold mb-3">操作記錄</h4>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {stepLogs.map((log, index) => (
                  <div
                    key={index}
                    className="text-xs p-2 bg-black/20 rounded flex items-center gap-2"
                  >
                    <span className="text-primary font-semibold">{log.action}</span>
                    <span className="text-muted-foreground">{log.details}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      </div>

      {/* Code Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/30 rounded-lg p-4"
      >
        <h4 className="font-semibold mb-3 text-primary">
          {usePathCompression ? "路徑壓縮版 Find" : "基礎版 Find"}
        </h4>
        <pre className="text-sm overflow-x-auto">
          <code className="text-green-400">
            {usePathCompression
              ? `function find(x) {
  if (parent[x] === x) return x;
  parent[x] = find(parent[x]); // 路徑壓縮
  return parent[x];
}`
              : `function find(x) {
  if (parent[x] === x) return x;
  return find(parent[x]); // 無壓縮
}`}
          </code>
        </pre>
      </motion.div>
    </div>
  );
};

export default DemoBlock;
