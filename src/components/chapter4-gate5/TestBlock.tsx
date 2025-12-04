import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Eye, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

const INF = 999;

// Challenge: Fix the relaxation logic
const CHALLENGE_CODE = `function floydWarshall(graph, V) {
  // Initialize distance matrix
  let dist = [];
  for (let i = 0; i < V; i++) {
    dist[i] = [];
    for (let j = 0; j < V; j++) {
      dist[i][j] = graph[i][j];
    }
  }
  
  // Floyd-Warshall core algorithm
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        // 🔧 修復這行鬆弛邏輯
        ___BLANK___
      }
    }
  }
  
  return dist;
}`;

const OPTIONS = [
  {
    id: "correct",
    code: "if (dist[i][k] + dist[k][j] < dist[i][j]) {\n          dist[i][j] = dist[i][k] + dist[k][j];\n        }",
    label: "dist[i][k] + dist[k][j] < dist[i][j]",
    isCorrect: true,
  },
  {
    id: "wrong1",
    code: "if (dist[i][k] + dist[k][j] > dist[i][j]) {\n          dist[i][j] = dist[i][k] + dist[k][j];\n        }",
    label: "dist[i][k] + dist[k][j] > dist[i][j]",
    isCorrect: false,
    hint: "符號方向錯誤！我們要找更短的路徑，不是更長的",
  },
  {
    id: "wrong2",
    code: "if (dist[i][j] < dist[i][k] + dist[k][j]) {\n          dist[i][j] = dist[i][k] + dist[k][j];\n        }",
    label: "dist[i][j] < dist[i][k] + dist[k][j]",
    isCorrect: false,
    hint: "條件判斷錯誤！這樣會用更長的路徑覆蓋更短的",
  },
  {
    id: "wrong3",
    code: "dist[i][j] = dist[i][k] + dist[k][j];",
    label: "直接覆蓋，不需判斷",
    isCorrect: false,
    hint: "缺少比較判斷！這樣會破壞已經計算好的最短路徑",
  },
];

// Test graph for visualization
const TEST_GRAPH = [
  [0, 3, INF, 5],
  [2, 0, INF, 4],
  [INF, 1, 0, INF],
  [INF, INF, 2, 0],
];
const NODE_IDS = ["A", "B", "C", "D"];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAlgorithm = useCallback((relaxFn: (dist: number[][], i: number, j: number, k: number) => void) => {
    const V = TEST_GRAPH.length;
    const dist: number[][] = TEST_GRAPH.map(row => [...row]);
    
    for (let k = 0; k < V; k++) {
      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          relaxFn(dist, i, j, k);
        }
      }
    }
    
    return dist;
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedOption) return;
    
    const option = OPTIONS.find(o => o.id === selectedOption);
    if (!option) return;
    
    setIsRunning(true);
    setShowVisualization(true);
    
    // Create relax function based on selection
    let relaxFn: (dist: number[][], i: number, j: number, k: number) => void;
    
    if (option.id === "correct") {
      relaxFn = (dist, i, j, k) => {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      };
    } else if (option.id === "wrong1") {
      relaxFn = (dist, i, j, k) => {
        if (dist[i][k] + dist[k][j] > dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      };
    } else if (option.id === "wrong2") {
      relaxFn = (dist, i, j, k) => {
        if (dist[i][j] < dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      };
    } else {
      relaxFn = (dist, i, j, k) => {
        dist[i][j] = dist[i][k] + dist[k][j];
      };
    }
    
    setTimeout(() => {
      const result = runAlgorithm(relaxFn);
      setResultMatrix(result);
      
      // Check if result is correct (compare with expected shortest paths)
      const expectedResult = runAlgorithm((dist, i, j, k) => {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      });
      
      const correct = JSON.stringify(result) === JSON.stringify(expectedResult);
      setIsCorrect(correct);
      setShowResult(true);
      setIsRunning(false);
      
      if (correct) {
        toast({
          title: "✨ 全知之眼成功啟動！",
          description: "你正確修復了鬆弛邏輯，所有最短路徑已計算完成！",
        });
        setTimeout(() => onComplete(), 1500);
      } else {
        toast({
          title: "❌ 邏輯錯誤",
          description: option.hint || "矩陣中有非最優路徑，請重試",
          variant: "destructive",
        });
      }
    }, 1000);
  }, [selectedOption, runAlgorithm, toast, onComplete]);

  const handleReset = useCallback(() => {
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowVisualization(false);
    setResultMatrix(null);
  }, []);

  const getCellColor = (value: number, isCorrectResult: boolean): string => {
    if (value === INF || value >= 900) return "bg-muted";
    if (!isCorrectResult && showResult && !isCorrect) return "bg-destructive/30";
    if (value === 0) return "bg-blue-500/30";
    return "bg-emerald-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Challenge Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/30"
      >
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="font-['Cinzel'] text-lg text-primary">修復全知之眼</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Floyd-Warshall 的核心邏輯被損壞了！選擇正確的「鬆弛（Relaxation）」條件來修復它。
        </p>
      </motion.div>

      {/* Code Display */}
      <div className="bg-black/50 rounded-lg p-4 border border-border overflow-x-auto">
        <pre className="text-xs md:text-sm font-mono">
          {CHALLENGE_CODE.split("___BLANK___").map((part, idx) => (
            <span key={idx}>
              <span className="text-muted-foreground">{part}</span>
              {idx === 0 && (
                <span className={`px-2 py-1 rounded ${
                  selectedOption 
                    ? showResult
                      ? isCorrect ? "bg-emerald-500/30 text-emerald-400" : "bg-destructive/30 text-destructive"
                      : "bg-primary/30 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {selectedOption 
                    ? OPTIONS.find(o => o.id === selectedOption)?.label 
                    : "[ 選擇答案 ]"}
                </span>
              )}
            </span>
          ))}
        </pre>
      </div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-3">
        {OPTIONS.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => !showResult && setSelectedOption(option.id)}
            disabled={showResult}
            className={`p-4 text-left rounded-lg border transition-all ${
              selectedOption === option.id
                ? showResult
                  ? option.isCorrect
                    ? "border-emerald-500 bg-emerald-500/20"
                    : "border-destructive bg-destructive/20"
                  : "border-primary bg-primary/20"
                : "border-border bg-card/30 hover:border-primary/50"
            } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <code className="text-xs font-mono text-foreground block mb-2">
              {option.label}
            </code>
            {showResult && selectedOption === option.id && !option.isCorrect && (
              <p className="text-xs text-destructive mt-2">{option.hint}</p>
            )}
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!selectedOption || showResult || isRunning}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
        >
          {isRunning ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              執行中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              啟動全知之眼
            </>
          )}
        </Button>
        
        {showResult && !isCorrect && (
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            重試
          </Button>
        )}
      </div>

      {/* Visualization Result */}
      {showVisualization && resultMatrix && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <h4 className="text-sm font-semibold text-center">
            {isCorrect ? "✅ 最終距離矩陣（正確）" : "❌ 計算結果（錯誤）"}
          </h4>
          
          <div className="overflow-x-auto">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="w-10 h-10 text-xs text-muted-foreground"></th>
                  {NODE_IDS.map((id) => (
                    <th key={id} className="w-12 h-10 text-xs font-bold text-primary">
                      {id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="w-10 h-10 text-xs font-bold text-primary text-center">
                      {NODE_IDS[i]}
                    </td>
                    {row.map((value, j) => (
                      <td key={j} className="p-1">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: (i * 4 + j) * 0.05 }}
                          className={`w-10 h-10 flex items-center justify-center text-sm font-mono rounded ${
                            getCellColor(value, isCorrect)
                          }`}
                        >
                          {value >= 900 ? "∞" : value}
                        </motion.div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isCorrect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/50"
            >
              <div className="text-lg font-['Cinzel'] text-emerald-400">
                🌟 全知之眼已完全啟動！
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                你已掌握 Floyd-Warshall 的精髓
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
