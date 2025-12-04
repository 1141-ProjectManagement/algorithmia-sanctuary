import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, RotateCcw, Lightbulb, CheckCircle, XCircle, Rocket } from "lucide-react";
import { useDijkstraStore } from "@/stores/dijkstraStore";
import StarScene from "./StarScene";

interface TestBlockProps {
  onComplete: () => void;
}

const CHALLENGE_CODE = `function relax(u, v, weight) {
  // u: 當前節點
  // v: 鄰居節點
  // weight: 邊的權重
  
  // TODO: 如果經過 u 到達 v 的距離更短，更新 v 的距離
  if ( ______________________________ ) {
    distances[v] = distances[u] + weight;
    pq.enqueue(v, distances[v]);
    previous[v] = u;
  }
}`;

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { nodes, edges, initGraph, setSourceNode, resetDijkstra } = useDijkstraStore();
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [shipPosition, setShipPosition] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    setAttemptCount(prev => prev + 1);
    
    const normalized = userAnswer.toLowerCase().replace(/\s/g, "").replace(/distances/g, "dist");
    
    // Valid answers
    const validAnswers = [
      "dist[u]+weight<dist[v]",
      "distances[u]+weight<distances[v]",
      "dist[u]+w<dist[v]",
      "newdist<dist[v]",
      "newdist<distances[v]",
      "dist[u]+weight<=dist[v]-1", // edge case
    ];
    
    const correct = validAnswers.some(ans => {
      const normAns = ans.replace(/\s/g, "");
      return normalized.includes(normAns) || normalized === normAns;
    });
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      toast({
        title: "✅ 導航系統修復成功！",
        description: "正在啟動最短路徑導航...",
      });
      
      // Animate spaceship along path
      setIsAnimating(true);
      const path = ["A", "C", "E", "F"];
      
      for (let i = 0; i < path.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setShipPosition(path[i]);
      }
      
      setIsAnimating(false);
      toast({
        title: "🚀 成功抵達目的地！",
        description: "最短路徑: A → C → E → F (距離: 7)",
      });
      
      setTimeout(() => onComplete(), 1000);
    } else {
      toast({
        title: "❌ 導航失敗",
        description: "鬆弛邏輯不正確，飛船迷航了",
        variant: "destructive",
      });
    }
  }, [userAnswer, toast, onComplete]);

  const handleReset = () => {
    initGraph();
    setSourceNode("A");
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
    setShipPosition(null);
    setShowHint(false);
  };

  // Initialize with source A
  useState(() => {
    initGraph();
    setSourceNode("A");
  });

  return (
    <div className="space-y-6">
      {/* Challenge description */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
        <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          🧩 修復星際導航儀
        </h4>
        <p className="text-sm text-foreground/80">
          導航系統的「鬆弛邏輯」損壞了！請在代碼編輯器中補全核心判斷式，
          讓飛船能從星球 <strong className="text-green-400">A</strong> 找到最短路徑到達星球 <strong className="text-amber-400">F</strong>。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Code editor */}
        <div className="space-y-4">
          <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
            <pre className="text-foreground/80 whitespace-pre-wrap">
              {CHALLENGE_CODE.split("\n").map((line, idx) => (
                <div key={idx} className={line.includes("______") ? "bg-yellow-500/20 -mx-4 px-4 py-1" : ""}>
                  <span className="text-muted-foreground mr-2">{String(idx + 1).padStart(2, " ")}</span>
                  {line.includes("______") ? (
                    <>
                      {"  if ( "}
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="distances[u] + weight < distances[v]"
                        className="bg-yellow-500/30 border border-yellow-500 rounded px-2 py-0.5 w-64 text-yellow-400 font-mono"
                        disabled={isAnimating}
                      />
                      {" ) {"}
                    </>
                  ) : (
                    <span className={line.includes("//") ? "text-muted-foreground" : "text-primary"}>
                      {line}
                    </span>
                  )}
                </div>
              ))}
            </pre>
          </div>

          <div className="p-3 bg-card/60 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">提示變數：</p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <code className="px-2 py-1 bg-black/30 rounded">distances[u]</code>
              <code className="px-2 py-1 bg-black/30 rounded">distances[v]</code>
              <code className="px-2 py-1 bg-black/30 rounded">weight</code>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!userAnswer.trim() || isAnimating} className="flex-1">
              <Play className="w-4 h-4 mr-1" />
              執行導航
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isAnimating}>
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
            {showHint && !isCorrect && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
              >
                <p className="text-sm">
                  <Lightbulb className="w-4 h-4 inline text-purple-400 mr-1" />
                  鬆弛的條件是：「經過 u 到達 v 的新距離」比「目前記錄的 v 距離」更短。
                  也就是 <code className="px-1 bg-black/30 rounded">distances[u] + weight</code> 要小於 <code className="px-1 bg-black/30 rounded">distances[v]</code>。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Star scene with ship animation */}
        <div className="space-y-4">
          <div className="h-[350px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden relative">
            <StarScene nodes={nodes} edges={edges} />
            
            {/* Ship indicator overlay */}
            {shipPosition && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <motion.div
                  key={shipPosition}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl"
                >
                  🚀
                </motion.div>
              </div>
            )}
          </div>

          {/* Mission info */}
          <div className="p-3 bg-card/40 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span>
                任務: <span className="text-green-400 font-bold">A</span> → <span className="text-amber-400 font-bold">F</span>
              </span>
              <span className="text-muted-foreground">
                預期最短距離: <span className="text-primary">7</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              最優路徑: A → C (2) → E (5) → F (7)
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <p className={`font-medium flex items-center gap-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {isCorrect ? "導航成功！飛船正在前往目的地..." : "導航邏輯錯誤，請檢查鬆弛條件"}
                </p>
                {isCorrect && isAnimating && (
                  <p className="text-sm text-muted-foreground mt-1">
                    當前位置: {shipPosition}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TestBlock;
