import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import { useMSTStore } from "@/stores/mstStore";
import IslandScene from "./IslandScene";

interface TestBlockProps {
  onComplete: () => void;
}

// Challenge 1: Kruskal cycle detection
const KRUSKAL_CODE = `// Union-Find: 檢測是否會形成環
function shouldAddEdge(edge, unionFind) {
  const rootU = find(edge.source);
  const rootV = find(edge.target);
  
  // 如果兩端已經連通，加入會形成環
  return ______;  // 補全判斷條件
}`;

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { islands, bridges, resetMST, setBridgeStatus, setIslandVisited, addToMST } = useMSTStore();
  const [challenge, setChallenge] = useState<1 | 2>(1);
  const [kruskalAnswer, setKruskalAnswer] = useState<string>("");
  const [primSelection, setPrimSelection] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  // Challenge 2 setup: Prim with 3 visited nodes
  const setupPrimChallenge = useCallback(() => {
    resetMST();
    // Set A, B, D as visited
    setIslandVisited("A", true);
    setIslandVisited("B", true);
    setIslandVisited("D", true);
    // Mark existing MST edges
    addToMST("AB");
    addToMST("BD");
    // Set candidate edges (cut edges from visited to unvisited)
    setBridgeStatus("AC", "candidate"); // weight 2 - CORRECT
    setBridgeStatus("BC", "candidate"); // weight 6
    setBridgeStatus("DE", "candidate"); // weight 2 - CORRECT (tie)
    setBridgeStatus("DF", "candidate"); // weight 6
  }, [resetMST, setIslandVisited, addToMST, setBridgeStatus]);

  const handleKruskalSubmit = () => {
    setAttemptCount(prev => prev + 1);
    
    const normalized = kruskalAnswer.toLowerCase().replace(/\s/g, "");
    // Valid answers: rootU !== rootV, find(u) !== find(v), etc.
    const validAnswers = [
      "rootu!==rootv",
      "rootv!==rootu",
      "rootu!=rootv",
      "rootv!=rootu",
      "find(edge.source)!==find(edge.target)",
      "find(u)!==find(v)",
    ];
    
    const correct = validAnswers.some(ans => normalized.includes(ans.replace(/\s/g, "")));
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      toast({
        title: "✅ 正確！",
        description: "當兩端不在同一集合時，加入邊不會形成環",
      });
    } else {
      toast({
        title: "❌ 再想想",
        description: "提示：什麼條件下加入邊「不會」形成環？",
        variant: "destructive",
      });
    }
  };

  const handlePrimEdgeClick = (bridgeId: string) => {
    if (challenge !== 2) return;
    
    setPrimSelection(bridgeId);
    setAttemptCount(prev => prev + 1);
    
    // AC (weight 2) or DE (weight 2) are correct
    const correct = bridgeId === "AC" || bridgeId === "DE";
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      toast({
        title: "✅ 正確的貪心選擇！",
        description: `選取權重最小的切分邊 (權重 = 2)`,
      });
      addToMST(bridgeId);
      const newIsland = bridgeId === "AC" ? "C" : "E";
      setIslandVisited(newIsland, true);
    } else {
      const selectedBridge = bridges.find(b => b.id === bridgeId);
      toast({
        title: "❌ 不是最優選擇",
        description: `這條邊的權重是 ${selectedBridge?.weight}，還有更便宜的切分邊`,
        variant: "destructive",
      });
    }
  };

  const handleChallengeSwitch = (newChallenge: 1 | 2) => {
    setChallenge(newChallenge);
    setShowResult(false);
    setIsCorrect(false);
    setShowHint(false);
    setKruskalAnswer("");
    setPrimSelection(null);
    
    if (newChallenge === 2) {
      setupPrimChallenge();
    } else {
      resetMST();
    }
  };

  const handleComplete = () => {
    if (challenge === 1 && isCorrect) {
      handleChallengeSwitch(2);
    } else if (challenge === 2 && isCorrect) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Challenge selector */}
      <div className="flex gap-2">
        <Button
          variant={challenge === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handleChallengeSwitch(1)}
        >
          挑戰 1: Kruskal 判環
        </Button>
        <Button
          variant={challenge === 2 ? "default" : "outline"}
          size="sm"
          onClick={() => handleChallengeSwitch(2)}
        >
          挑戰 2: Prim 貪心
        </Button>
      </div>

      {challenge === 1 ? (
        /* Challenge 1: Kruskal */
        <div className="space-y-4">
          <div className="p-4 bg-card/40 rounded-lg border border-emerald-500/30">
            <h4 className="font-medium text-emerald-400 mb-2">🧩 Kruskal: 判環邏輯補全</h4>
            <p className="text-sm text-foreground/80 mb-4">
              Union-Find 的 <code>find()</code> 函數返回節點所屬集合的根。
              補全判斷條件：什麼情況下加入邊<strong>不會</strong>形成環？
            </p>
            
            <div className="bg-black/60 rounded-lg p-4 font-mono text-sm mb-4">
              <pre className="text-emerald-400 whitespace-pre-wrap">
                {KRUSKAL_CODE.split("\n").map((line, idx) => (
                  <div key={idx} className={line.includes("______") ? "bg-yellow-500/20 -mx-4 px-4" : ""}>
                    {line.includes("______") ? (
                      <>
                        {"  return "}
                        <input
                          type="text"
                          value={kruskalAnswer}
                          onChange={(e) => setKruskalAnswer(e.target.value)}
                          placeholder="rootU !== rootV"
                          className="bg-yellow-500/30 border border-yellow-500 rounded px-2 py-0.5 w-48 text-yellow-400"
                        />
                        {";"}
                      </>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </pre>
            </div>

            <Button onClick={handleKruskalSubmit} disabled={!kruskalAnswer.trim()}>
              <CheckCircle className="w-4 h-4 mr-1" />
              驗證答案
            </Button>
          </div>
        </div>
      ) : (
        /* Challenge 2: Prim */
        <div className="space-y-4">
          <div className="p-4 bg-card/40 rounded-lg border border-cyan-500/30">
            <h4 className="font-medium text-cyan-400 mb-2">🧩 Prim: 貪心選擇</h4>
            <p className="text-sm text-foreground/80 mb-2">
              島嶼 A, B, D 已被訪問（發光）。從當前的<strong>切分邊</strong>（藍色高亮）中，
              點擊權重最小的那條邊來繼續擴展 MST。
            </p>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-cyan-500/20 rounded">已訪問: A, B, D</span>
              <span className="px-2 py-1 bg-primary/20 rounded">已建橋: A-B, B-D</span>
            </div>
          </div>

          <div className="h-[350px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
            <IslandScene
              islands={islands}
              bridges={bridges}
              mode="prim"
              onBridgeClick={handlePrimEdgeClick}
            />
          </div>

          <div className="p-3 bg-cyan-500/10 rounded-lg">
            <p className="text-sm text-cyan-400 mb-1">候選切分邊：</p>
            <div className="flex flex-wrap gap-2">
              {bridges.filter(b => b.status === "candidate").map(b => (
                <Button
                  key={b.id}
                  variant={primSelection === b.id ? (isCorrect ? "default" : "destructive") : "outline"}
                  size="sm"
                  onClick={() => handlePrimEdgeClick(b.id)}
                  disabled={showResult && isCorrect}
                >
                  {b.source}-{b.target} (權重 {b.weight})
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result & hints */}
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
              {isCorrect ? "正確！" : "再試一次"}
            </p>
            {isCorrect && (
              <Button onClick={handleComplete} className="mt-2" size="sm">
                {challenge === 1 ? "進入挑戰 2" : "完成關卡"}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              {challenge === 1
                ? "如果 find(u) === find(v)，表示 u 和 v 已經連通，加入邊會形成環。所以我們要在「不相等」時才加入。"
                : "切分邊中，權重最小的是 2。有兩條邊權重都是 2，選哪條都對！"
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => handleChallengeSwitch(challenge)}>
          <RotateCcw className="w-4 h-4 mr-1" />
          重置挑戰
        </Button>
      </div>
    </div>
  );
};

export default TestBlock;
