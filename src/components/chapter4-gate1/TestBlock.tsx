import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, RotateCcw, Lightbulb, CheckCircle } from "lucide-react";
import { useGraphTraversalStore } from "@/stores/graphTraversalStore";
import GraphScene from "./GraphScene";

interface TestBlockProps {
  onComplete: () => void;
}

const BUGGY_CODE = `function traverse(graph, start, target) {
  // ❌ 錯誤：混用了 Queue 結構與 Stack 操作！
  let structure = [];  // 應該用哪種結構？
  structure.push(start);
  let visited = new Set([start]);
  
  while (structure.length > 0) {
    // ❌ 這裡的操作與結構不匹配
    let node = structure.______();  // shift 還是 pop?
    
    if (node === target) return true;
    
    for (let neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        structure.push(neighbor);
      }
    }
  }
  return false;
}`;

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { nodes, edges, mode, setMode, initGraph, resetTraversal } = useGraphTraversalStore();
  const [userAnswer, setUserAnswer] = useState<"shift" | "pop" | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const handleNodeClick = (nodeId: string) => {
    if (predictions.length >= 3 || predictions.includes(nodeId)) return;
    
    setPredictions([...predictions, nodeId]);
    toast({
      title: `預測第 ${predictions.length + 1} 個節點`,
      description: `選擇了 ${nodeId}`,
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!userAnswer) {
      toast({
        title: "請選擇操作方法",
        description: "選擇 shift() 或 pop() 來完成代碼",
        variant: "destructive",
      });
      return;
    }

    setAttemptCount(prev => prev + 1);
    setIsRunning(true);

    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if answer matches mode expectation
    // shift = BFS (queue behavior), pop = DFS (stack behavior)
    const expectedAnswer = mode === "bfs" ? "shift" : "pop";
    const correct = userAnswer === expectedAnswer;

    setIsCorrect(correct);
    setShowResult(true);
    setIsRunning(false);

    if (correct) {
      // Check predictions
      const expectedOrder = mode === "bfs" 
        ? ["A", "B", "C"] // BFS order from A
        : ["A", "C", "F"]; // DFS order (right-first for this graph)
      
      const predictionsCorrect = predictions.length >= 3 && 
        predictions.slice(0, 3).every((p, i) => p === expectedOrder[i]);

      toast({
        title: "✅ 代碼修復成功！",
        description: predictionsCorrect 
          ? "預測也正確！獲得預言家積分 🔮"
          : "遍歷邏輯正確",
      });

      setTimeout(() => onComplete(), 1000);
    } else {
      toast({
        title: "❌ 遍歷行為異常",
        description: userAnswer === "shift" 
          ? "使用 shift() 是 BFS 行為，但目標需要 DFS 深入探索"
          : "使用 pop() 是 DFS 行為，但目標需要 BFS 層級搜索",
        variant: "destructive",
      });
    }
  }, [userAnswer, mode, predictions, toast, onComplete]);

  const handleReset = () => {
    setUserAnswer(null);
    setPredictions([]);
    setShowResult(false);
    setIsCorrect(false);
    resetTraversal();
    initGraph("simple");
  };

  const handleModeSwitch = (newMode: "bfs" | "dfs") => {
    setMode(newMode);
    handleReset();
  };

  return (
    <div className="space-y-6">
      {/* Challenge description */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
        <h4 className="font-medium text-primary mb-2">🧩 挑戰：修復遍歷代碼</h4>
        <p className="text-sm text-foreground/80 mb-2">
          這段程式碼混淆了 Queue 和 Stack 的操作。根據你選擇的遍歷策略，
          填入正確的操作方法來到達目標節點 (🎯)。
        </p>
        <div className="flex gap-2 mt-3">
          <Button
            variant={mode === "bfs" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeSwitch("bfs")}
          >
            使用 BFS 策略
          </Button>
          <Button
            variant={mode === "dfs" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeSwitch("dfs")}
          >
            使用 DFS 策略
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Code editor */}
        <div className="space-y-4">
          <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground/80 whitespace-pre-wrap">
              {BUGGY_CODE.split("\n").map((line, idx) => (
                <div key={idx} className={line.includes("______") ? "bg-yellow-500/20 -mx-4 px-4" : ""}>
                  <span className="text-muted-foreground mr-2">{String(idx + 1).padStart(2, " ")}</span>
                  {line.includes("______") ? (
                    <span>
                      {line.replace("______", "")}
                      <select
                        value={userAnswer || ""}
                        onChange={(e) => setUserAnswer(e.target.value as "shift" | "pop")}
                        className="bg-yellow-500/30 border border-yellow-500 rounded px-2 py-0.5 text-yellow-400 mx-1"
                      >
                        <option value="">選擇...</option>
                        <option value="shift">shift</option>
                        <option value="pop">pop</option>
                      </select>
                      {"()"}
                    </span>
                  ) : (
                    <span className={line.includes("//") ? "text-muted-foreground" : "text-green-400"}>
                      {line}
                    </span>
                  )}
                </div>
              ))}
            </pre>
          </div>

          {/* Answer explanation */}
          <div className={`p-3 rounded-lg border ${
            mode === "bfs" ? "bg-blue-500/10 border-blue-500/30" : "bg-red-500/10 border-red-500/30"
          }`}>
            <p className="text-sm">
              <strong className={mode === "bfs" ? "text-blue-400" : "text-red-400"}>
                {mode === "bfs" ? "BFS 策略" : "DFS 策略"}
              </strong>
              <span className="text-muted-foreground ml-2">
                {mode === "bfs" 
                  ? "使用 Queue：先進先出，層層擴散找最短路徑"
                  : "使用 Stack：後進先出，深入探索再回溯"}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={isRunning || !userAnswer} className="flex-1">
              <Play className="w-4 h-4 mr-1" />
              執行驗證
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          </div>

          {/* Hint */}
          {attemptCount >= 2 && !isCorrect && (
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
              <Lightbulb className="w-4 h-4 mr-1" />
              需要提示？
            </Button>
          )}

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
              >
                <p className="text-sm">
                  <Lightbulb className="w-4 h-4 inline text-purple-400 mr-1" />
                  BFS 需要 FIFO（先進先出），用 <code>shift()</code> 取隊首；
                  DFS 需要 LIFO（後進先出），用 <code>pop()</code> 取棧頂。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Graph visualization & prediction */}
        <div className="space-y-4">
          <div className="h-[300px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
            <GraphScene 
              nodes={nodes} 
              edges={edges} 
              mode={mode}
              onNodeClick={handleNodeClick}
            />
          </div>

          {/* Prediction area */}
          <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
            <h5 className="font-medium text-sm mb-2">🔮 預測挑戰（可選）</h5>
            <p className="text-xs text-muted-foreground mb-2">
              點擊圖中的節點，預測前 3 個被訪問的順序
            </p>
            <div className="flex gap-2 items-center">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono ${
                    predictions[i] 
                      ? "bg-primary/20 border-primary text-primary" 
                      : "border-dashed border-muted-foreground"
                  }`}
                >
                  {predictions[i] || "?"}
                </div>
              ))}
              {predictions.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPredictions([])}
                >
                  清除
                </Button>
              )}
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <p className={`font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      遍歷成功到達目標！
                    </>
                  ) : (
                    "遍歷路徑錯誤，請重試"
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TestBlock;
