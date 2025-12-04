import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import RecursionTreeScene, { TreeNode } from "./RecursionTreeScene";

interface DemoBlockProps {
  onComplete: () => void;
}

interface Step {
  tree: TreeNode;
  activeNodeId: string;
  description: string;
  phase: "divide" | "base" | "merge";
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [initialArray, setInitialArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const hasCompleted = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate merge sort steps
  const generateSteps = useCallback((arr: number[]) => {
    const allSteps: Step[] = [];
    let nodeIdCounter = 0;

    const buildTree = (values: number[], depth: number): TreeNode => ({
      id: `node-${nodeIdCounter++}`,
      values: [...values],
      depth,
      status: "pending",
    });

    const cloneTree = (node: TreeNode): TreeNode => ({
      ...node,
      values: [...node.values],
      left: node.left ? cloneTree(node.left) : undefined,
      right: node.right ? cloneTree(node.right) : undefined,
    });

    const findNode = (tree: TreeNode, id: string): TreeNode | null => {
      if (tree.id === id) return tree;
      if (tree.left) {
        const found = findNode(tree.left, id);
        if (found) return found;
      }
      if (tree.right) {
        const found = findNode(tree.right, id);
        if (found) return found;
      }
      return null;
    };

    const mergeSort = (tree: TreeNode, rootTree: TreeNode): void => {
      const currentTree = cloneTree(rootTree);
      const node = findNode(currentTree, tree.id)!;

      // Mark as dividing
      node.status = "dividing";
      allSteps.push({
        tree: currentTree,
        activeNodeId: node.id,
        description: `分解 [${node.values.join(", ")}] 為左右兩半`,
        phase: "divide",
      });

      if (tree.values.length <= 1) {
        // Base case
        const baseTree = cloneTree(currentTree);
        const baseNode = findNode(baseTree, tree.id)!;
        baseNode.status = "base";
        allSteps.push({
          tree: baseTree,
          activeNodeId: baseNode.id,
          description: `基本情況：[${baseNode.values.join(", ")}] 已是最小單位`,
          phase: "base",
        });
        return;
      }

      const mid = Math.floor(tree.values.length / 2);
      const leftValues = tree.values.slice(0, mid);
      const rightValues = tree.values.slice(mid);

      tree.left = buildTree(leftValues, tree.depth + 1);
      tree.right = buildTree(rightValues, tree.depth + 1);

      // Recurse
      mergeSort(tree.left, rootTree);
      mergeSort(tree.right, rootTree);

      // Merge phase
      const mergeTree = cloneTree(rootTree);
      const mergeNode = findNode(mergeTree, tree.id)!;
      mergeNode.status = "merging";
      
      // Simulate merge
      const merged: number[] = [];
      const left = [...leftValues].sort((a, b) => a - b);
      const right = [...rightValues].sort((a, b) => a - b);
      let i = 0, j = 0;
      while (i < left.length && j < right.length) {
        if (left[i] < right[j]) merged.push(left[i++]);
        else merged.push(right[j++]);
      }
      while (i < left.length) merged.push(left[i++]);
      while (j < right.length) merged.push(right[j++]);
      
      mergeNode.values = merged;
      
      allSteps.push({
        tree: mergeTree,
        activeNodeId: mergeNode.id,
        description: `合併 [${leftValues.join(", ")}] 和 [${rightValues.join(", ")}] → [${merged.join(", ")}]`,
        phase: "merge",
      });

      // Mark complete
      const completeTree = cloneTree(mergeTree);
      const completeNode = findNode(completeTree, tree.id)!;
      completeNode.status = "complete";
      allSteps.push({
        tree: completeTree,
        activeNodeId: completeNode.id,
        description: `節點完成：[${merged.join(", ")}]`,
        phase: "merge",
      });
    };

    const rootTree = buildTree(arr, 0);
    mergeSort(rootTree, rootTree);
    
    return allSteps;
  }, []);

  useEffect(() => {
    setSteps(generateSteps(initialArray));
    setCurrentStep(0);
  }, [initialArray, generateSteps]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      if (!hasCompleted.current && steps.length > 0) {
        hasCompleted.current = true;
        onComplete();
      }
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed, onComplete]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    hasCompleted.current = false;
  };

  const handleShuffle = () => {
    const newArr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setInitialArray(newArr);
    hasCompleted.current = false;
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">初始陣列：</span>
          <code className="bg-black/40 px-2 py-1 rounded text-sm">
            [{initialArray.join(", ")}]
          </code>
          <Button variant="ghost" size="sm" onClick={handleShuffle}>
            🎲 隨機
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">速度：</span>
          <Slider
            value={[2000 - speed]}
            onValueChange={([v]) => setSpeed(2000 - v)}
            min={500}
            max={1800}
            step={100}
            className="w-24"
          />
        </div>
      </div>

      {/* 3D Scene */}
      <div className="h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
        {currentStepData ? (
          <RecursionTreeScene
            tree={currentStepData.tree}
            activeNodeId={currentStepData.activeNodeId}
            hoveredNodeId={hoveredNodeId}
            onHover={setHoveredNodeId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            載入中...
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">進度：</span>
          <Slider
            value={[currentStep]}
            onValueChange={([v]) => {
              setIsPlaying(false);
              setCurrentStep(v);
            }}
            min={0}
            max={steps.length - 1}
            step={1}
            className="flex-1"
          />
          <span className="text-sm">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Playback controls */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <StepBack className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? "暫停" : "播放"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep >= steps.length - 1}
          >
            <StepForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Step description */}
      {currentStepData && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            currentStepData.phase === "divide"
              ? "bg-blue-500/10 border-blue-500/30"
              : currentStepData.phase === "base"
              ? "bg-white/10 border-white/30"
              : "bg-primary/10 border-primary/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded ${
              currentStepData.phase === "divide" ? "bg-blue-500/20 text-blue-400" :
              currentStepData.phase === "base" ? "bg-white/20 text-white" :
              "bg-primary/20 text-primary"
            }`}>
              {currentStepData.phase === "divide" ? "分解" :
               currentStepData.phase === "base" ? "基本情況" : "合併"}
            </span>
          </div>
          <p className="text-sm">{currentStepData.description}</p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-600" />
          <span>未處理</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span>分裂中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-white" />
          <span>基本情況</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span>合併中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>完成</span>
        </div>
      </div>
    </div>
  );
};

export default DemoBlock;
