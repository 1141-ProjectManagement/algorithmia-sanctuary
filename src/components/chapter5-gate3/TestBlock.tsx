import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, RotateCcw, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { useBacktrackingStore } from "@/stores/backtrackingStore";
import MazeScene from "./MazeScene";

interface TestBlockProps {
  onComplete: () => void;
}

const BUGGY_CODE = `function findPath(maze, row, col) {
  // 邊界檢查
  if (row < 0 || col < 0 || row >= 5 || col >= 5) return false;
  if (maze[row][col] === 'wall' || maze[row][col] === 'visited') return false;
  
  // 到達終點
  if (row === 4 && col === 4) return true;
  
  // 標記為已訪問
  maze[row][col] = 'visited';
  
  // 遞迴探索四個方向
  if (findPath(maze, row + 1, col)) return true;
  if (findPath(maze, row, col + 1)) return true;
  if (findPath(maze, row - 1, col)) return true;
  if (findPath(maze, row, col - 1)) return true;
  
  // ❌ 缺少回溯步驟！
  // ______________________
  
  return false;
}`;

const FIXED_CODE_LINE = "maze[row][col] = 'empty';  // 回溯：取消訪問標記";

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { maze, initMaze, setMazeCellVisited, setMazeCellExploring, setMazeCellOnPath, setMazeFound, resetMaze, mazeFound } = useBacktrackingStore();
  const [codeFixed, setCodeFixed] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();
  const animationRef = useRef<NodeJS.Timeout[]>([]);

  const clearAnimations = () => {
    animationRef.current.forEach(t => clearTimeout(t));
    animationRef.current = [];
  };

  const delay = (ms: number) => new Promise(resolve => {
    const t = setTimeout(resolve, ms);
    animationRef.current.push(t);
  });

  const runBuggyPathfinding = useCallback(async () => {
    resetMaze();
    setIsRunning(true);
    clearAnimations();

    // Simulate buggy pathfinding (no backtracking)
    const visited = new Set<string>();
    const stack: { row: number; col: number }[] = [{ row: 0, col: 0 }];
    
    while (stack.length > 0) {
      const { row, col } = stack.pop()!;
      const key = `${row}-${col}`;
      
      if (row < 0 || col < 0 || row >= 5 || col >= 5) continue;
      if (visited.has(key)) continue;
      if (maze[row][col].type === "wall") continue;
      
      visited.add(key);
      setMazeCellVisited(row, col, true);
      setMazeCellExploring(row, col, true);
      await delay(200);
      setMazeCellExploring(row, col, false);
      
      if (row === 4 && col === 4) {
        // Won't reach here in buggy version
        break;
      }
      
      // Push neighbors (buggy: visited stays marked forever)
      stack.push({ row: row + 1, col });
      stack.push({ row, col: col + 1 });
      stack.push({ row: row - 1, col });
      stack.push({ row, col: col - 1 });
    }

    setIsRunning(false);
    toast({
      title: "❌ 路徑搜尋失敗",
      description: "死胡同的標記沒有被清除，阻擋了正確路徑！",
      variant: "destructive",
    });
  }, [maze, resetMaze, setMazeCellVisited, setMazeCellExploring, toast]);

  const runFixedPathfinding = useCallback(async () => {
    resetMaze();
    setIsRunning(true);
    clearAnimations();

    const path: { row: number; col: number }[] = [];
    
    const backtrack = async (row: number, col: number): Promise<boolean> => {
      if (row < 0 || col < 0 || row >= 5 || col >= 5) return false;
      if (maze[row][col].type === "wall") return false;
      if (maze[row][col].visited) return false;
      
      setMazeCellVisited(row, col, true);
      setMazeCellExploring(row, col, true);
      path.push({ row, col });
      await delay(150);
      
      if (row === 4 && col === 4) {
        setMazeFound(true);
        return true;
      }
      
      // Try all directions
      if (await backtrack(row + 1, col)) return true;
      if (await backtrack(row, col + 1)) return true;
      if (await backtrack(row - 1, col)) return true;
      if (await backtrack(row, col - 1)) return true;
      
      // Backtrack! (the fixed part)
      setMazeCellExploring(row, col, false);
      setMazeCellVisited(row, col, false);
      path.pop();
      await delay(100);
      
      return false;
    };
    
    const found = await backtrack(0, 0);
    
    if (found) {
      // Highlight the path
      for (const p of path) {
        setMazeCellOnPath(p.row, p.col, true);
        await delay(100);
      }
      
      toast({
        title: "✨ 找到路徑！",
        description: "回溯正確運作，成功找到終點！",
      });
      
      onComplete();
    }
    
    setIsRunning(false);
  }, [maze, resetMaze, setMazeCellVisited, setMazeCellExploring, setMazeCellOnPath, setMazeFound, toast, onComplete]);

  const handleRun = () => {
    if (codeFixed) {
      runFixedPathfinding();
    } else {
      runBuggyPathfinding();
    }
  };

  const handleSubmitFix = () => {
    setAttemptCount(prev => prev + 1);
    
    const normalizedInput = userInput.toLowerCase().replace(/\s/g, "").replace(/['"]/g, "");
    const validAnswers = [
      "maze[row][col]='empty'",
      "maze[row][col]=empty",
      "maze[row][col]='unvisited'",
      "maze[row][col]=unvisited",
      "visited.delete",
      "maze[row][col]=false",
    ];
    
    const isCorrect = validAnswers.some(ans => normalizedInput.includes(ans.replace(/\s/g, "")));
    
    if (isCorrect) {
      setCodeFixed(true);
      toast({
        title: "✅ 修復成功！",
        description: "現在運行代碼看看效果",
      });
    } else {
      toast({
        title: "❌ 不太對",
        description: "提示：需要將當前格子標記回「未訪問」狀態",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    clearAnimations();
    resetMaze();
    setCodeFixed(false);
    setUserInput("");
    setIsRunning(false);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Challenge description */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
        <h4 className="font-medium text-primary mb-2">🧩 挑戰：修復迷宮回溯</h4>
        <p className="text-sm text-foreground/80">
          這段程式碼在探索迷宮時，忘記了「回溯時取消標記」的關鍵步驟。
          補上缺失的那行代碼，讓探險者能夠正確回退並找到出口！
        </p>
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
                    <span className="text-yellow-400">{line}</span>
                  ) : (
                    <span className={line.includes("//") ? "text-muted-foreground" : "text-green-400"}>
                      {line}
                    </span>
                  )}
                </div>
              ))}
            </pre>
          </div>

          {/* Input area */}
          {!codeFixed ? (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">補上缺失的回溯代碼：</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="maze[row][col] = ..."
                className="w-full bg-black/40 border border-primary/30 rounded px-3 py-2 font-mono text-sm focus:border-primary outline-none"
              />
              <Button onClick={handleSubmitFix} className="w-full" disabled={!userInput.trim()}>
                <CheckCircle className="w-4 h-4 mr-1" />
                提交修復
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <p className="text-sm text-green-400 font-mono">{FIXED_CODE_LINE}</p>
              <p className="text-xs text-muted-foreground mt-1">✓ 回溯邏輯已修復</p>
            </motion.div>
          )}

          {/* Hint */}
          {!showHint && attemptCount >= 2 && !codeFixed && (
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
              <Lightbulb className="w-4 h-4 mr-1" />
              需要提示？
            </Button>
          )}
          
          <AnimatePresence>
            {showHint && !codeFixed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
              >
                <p className="text-sm flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-400 mt-0.5" />
                  回溯時需要「恢復現場」——把當前格子從 'visited' 改回原本的狀態（如 'empty'）
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Maze visualization */}
        <div className="space-y-4">
          <MazeScene maze={maze} className="max-w-[300px] mx-auto" />
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>起點</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-primary rounded" />
              <span>終點</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-zinc-800 rounded" />
              <span>牆壁</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-400/50 rounded" />
              <span>已訪問</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-primary/60 rounded" />
              <span>正確路徑</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-1" />
              {codeFixed ? "運行修復版" : "運行錯誤版"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isRunning}>
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          </div>

          {/* Status message */}
          {mazeFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 bg-primary/10 border border-primary/30 rounded-lg"
            >
              <p className="text-primary font-medium">🎉 迷宮破解成功！</p>
              <p className="text-sm text-muted-foreground">回溯讓探險者能夠「撤銷錯誤」並找到正確道路</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestBlock;
