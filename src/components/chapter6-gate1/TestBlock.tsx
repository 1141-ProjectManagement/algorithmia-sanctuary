import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UnionFindScene from "./UnionFindScene";

interface TestBlockProps {
  onComplete: () => void;
}

// Create a chain structure: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
const createChainStructure = () => {
  const nodes = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    nodes.push({
      id: i,
      parent: i === 7 ? i : i + 1, // Chain: each points to next, 7 is root
      rank: 0,
      x: -3 + i * 0.9,
      y: i * 0.3 - 1,
      z: Math.sin(angle) * 0.5,
    });
  }
  return nodes;
};

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [nodes] = useState(createChainStructure);
  const [parent, setParent] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 7]);
  const [highlightPath, setHighlightPath] = useState<number[]>([]);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  
  const [userCode, setUserCode] = useState("parent[x]");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [beforeCount, setBeforeCount] = useState<number | null>(null);
  const [afterCount, setAfterCount] = useState<number | null>(null);

  const correctAnswer = "parent[x] = find(parent[x])";

  const resetState = () => {
    setParent([1, 2, 3, 4, 5, 6, 7, 7]);
    setHighlightPath([]);
    setActiveNodes([]);
    setIsCorrect(null);
    setBeforeCount(null);
    setAfterCount(null);
    setShowHint(false);
  };

  const simulateFind = async (useCompression: boolean) => {
    setIsAnimating(true);
    const testParent = [1, 2, 3, 4, 5, 6, 7, 7];
    const path: number[] = [];
    let current = 0;
    let queryCount = 0;

    // Trace path from node 0 to root
    while (testParent[current] !== current) {
      path.push(current);
      queryCount++;
      setHighlightPath([...path]);
      setActiveNodes([current]);
      await new Promise(resolve => setTimeout(resolve, 400));
      current = testParent[current];
    }
    path.push(current);
    setHighlightPath(path);
    setBeforeCount(queryCount);

    if (useCompression) {
      // Apply path compression
      await new Promise(resolve => setTimeout(resolve, 600));
      for (let i = 0; i < path.length - 1; i++) {
        testParent[path[i]] = 7; // Connect directly to root
      }
      setParent([...testParent]);
      
      // Show second query is now O(1)
      await new Promise(resolve => setTimeout(resolve, 800));
      setHighlightPath([0, 7]);
      setAfterCount(1);
    }

    setIsAnimating(false);
    return useCompression;
  };

  const handleSubmit = async () => {
    // Check if user's answer matches the pattern
    const normalizedInput = userCode.replace(/\s+/g, "").toLowerCase();
    const isValid = 
      normalizedInput.includes("parent[x]=find(parent[x])") ||
      normalizedInput === "parent[x]=find(parent[x])";

    if (isValid) {
      setIsCorrect(true);
      toast({
        title: "✨ 正確！",
        description: "路徑壓縮已啟用，長鏈將被壓平！",
      });
      await simulateFind(true);
      setTimeout(() => onComplete(), 1500);
    } else {
      setIsCorrect(false);
      toast({
        title: "❌ 答錯了",
        description: "提示：需要在返回前更新 parent[x]",
        variant: "destructive",
      });
      await simulateFind(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Challenge Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-red-500/10 border border-primary/30 rounded-lg p-6"
      >
        <h3 className="text-xl font-['Cinzel'] text-primary mb-3">
          🔥 挑戰：修復路徑壓縮
        </h3>
        <p className="text-muted-foreground mb-4">
          眼前是一條極度不平衡的「長鏈」結構（0→1→2→3→4→5→6→7）。
          為了應對即將到來的 Boss 戰，我們需要極速查詢。請修復 find 函數，
          讓下一次查詢時所有經過的節點直接效忠於首領！
        </p>
      </motion.div>

      {/* 3D Visualization */}
      <UnionFindScene
        nodes={nodes}
        parent={parent}
        highlightPath={highlightPath}
        activeNodes={activeNodes}
      />

      {/* Query Count Comparison */}
      {(beforeCount !== null || afterCount !== null) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-card/40 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">首次查詢</p>
            <p className="text-3xl font-bold text-red-400">{beforeCount ?? "-"}</p>
            <p className="text-xs text-muted-foreground">次遍歷</p>
          </div>
          <div className="bg-card/40 border border-green-500/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">壓縮後查詢</p>
            <p className="text-3xl font-bold text-green-400">{afterCount ?? "-"}</p>
            <p className="text-xs text-muted-foreground">次遍歷</p>
          </div>
        </motion.div>
      )}

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 rounded-lg p-4"
      >
        <pre className="text-sm overflow-x-auto mb-4">
          <code>
            <span className="text-blue-400">function</span>{" "}
            <span className="text-yellow-400">find</span>(x) {"{"}
            {"\n"}
            {"  "}<span className="text-blue-400">if</span> (parent[x] === x){" "}
            <span className="text-blue-400">return</span> x;
            {"\n"}
            {"  "}<span className="text-gray-500">// TODO: 填寫代碼以實現路徑壓縮</span>
            {"\n"}
            {"  "}<span className="text-blue-400">return</span>{" "}
          </code>
        </pre>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-green-400 font-mono">return</span>
          <input
            type="text"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className={`flex-1 bg-black/50 border rounded px-3 py-2 font-mono text-sm ${
              isCorrect === true
                ? "border-green-500 text-green-400"
                : isCorrect === false
                ? "border-red-500 text-red-400"
                : "border-primary/30 text-foreground"
            }`}
            placeholder="填寫返回值..."
            disabled={isAnimating || isCorrect === true}
          />
          <span className="text-muted-foreground font-mono">;</span>
        </div>

        <pre className="text-sm">
          <code>{"}"}</code>
        </pre>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isAnimating || isCorrect === true}
          className="flex-1"
        >
          {isAnimating ? (
            "執行中..."
          ) : isCorrect === true ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              通過！
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              執行咒語
            </>
          )}
        </Button>

        <Button
          onClick={resetState}
          variant="outline"
          disabled={isAnimating}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>

        {isCorrect === false && !showHint && (
          <Button
            onClick={() => setShowHint(true)}
            variant="secondary"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            提示
          </Button>
        )}
      </div>

      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-foreground mb-2">
                <strong>提示：</strong>路徑壓縮的關鍵是在遞迴返回時更新 parent[x]
              </p>
              <p className="text-xs text-muted-foreground">
                想想看：我們需要讓 parent[x] 直接指向根節點。
                而 find(parent[x]) 會返回根節點...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {isCorrect === true && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center"
        >
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-400 mb-2">
            路徑壓縮成功！
          </h4>
          <p className="text-sm text-muted-foreground">
            長鏈結構已被壓平為扁平的「菊花狀」結構，
            查詢效率從 O(n) 提升至 O(1)！
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
