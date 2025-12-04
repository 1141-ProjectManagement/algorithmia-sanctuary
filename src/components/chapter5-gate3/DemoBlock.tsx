import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { useBacktrackingStore } from "@/stores/backtrackingStore";
import NQueensScene from "./NQueensScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    boardSize,
    queens,
    currentRow,
    currentCol,
    isPlaying,
    foundSolution,
    checkDiagonal,
    setBoardSize,
    setCheckDiagonal,
    resetQueens,
    placeQueen,
    removeQueen,
    setQueenStatus,
    addSolution,
    setFoundSolution,
    setIsPlaying,
    setCurrentPosition,
  } = useBacktrackingStore();

  const [stepLog, setStepLog] = useState<string[]>([]);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const solveStateRef = useRef<{
    stack: { row: number; col: number; tried: number[] }[];
    solving: boolean;
  }>({ stack: [], solving: false });
  const hasCompleted = useRef(false);

  const isValid = useCallback((row: number, col: number, currentQueens: { row: number; col: number }[]): boolean => {
    for (const q of currentQueens) {
      // Same column
      if (q.col === col) return false;
      
      // Diagonal check (can be toggled)
      if (checkDiagonal) {
        if (Math.abs(q.row - row) === Math.abs(q.col - col)) return false;
      }
    }
    return true;
  }, [checkDiagonal]);

  const addLog = (msg: string) => {
    setStepLog(prev => [...prev.slice(-8), msg]);
  };

  const solveStep = useCallback(() => {
    const state = solveStateRef.current;
    if (!state.solving) return;

    const currentQueens = queens.map(q => ({ row: q.row, col: q.col }));

    // If we have placed all queens, we found a solution
    if (currentQueens.length === boardSize) {
      setFoundSolution(true);
      addSolution();
      addLog(`🎉 找到解！${boardSize} 個皇后安全放置`);
      state.solving = false;
      setIsPlaying(false);
      
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setTimeout(() => onComplete(), 1000);
      }
      return;
    }

    const row = currentQueens.length;
    let frame = state.stack[row] || { row, col: 0, tried: [] };

    // Try next column
    while (frame.col < boardSize) {
      setCurrentPosition(row, frame.col);

      if (!frame.tried.includes(frame.col)) {
        frame.tried.push(frame.col);

        if (isValid(row, frame.col, currentQueens)) {
          // Place queen
          placeQueen(row, frame.col);
          addLog(`✓ 放置皇后於 (${row + 1}, ${String.fromCharCode(65 + frame.col)})`);
          
          setTimeout(() => setQueenStatus(row, "valid"), 200);
          
          state.stack[row] = frame;
          return;
        } else {
          // Conflict - show briefly then skip
          placeQueen(row, frame.col);
          setQueenStatus(row, "conflict");
          addLog(`✗ 衝突！(${row + 1}, ${String.fromCharCode(65 + frame.col)}) 被攻擊`);
          
          setTimeout(() => {
            removeQueen(row);
          }, 300);
        }
      }
      frame.col++;
    }

    // Backtrack - no valid column found in this row
    if (currentQueens.length > 0) {
      const lastQueen = currentQueens[currentQueens.length - 1];
      addLog(`↩ 回溯！從第 ${lastQueen.row + 1} 行撤回`);
      setQueenStatus(lastQueen.row, "removing");
      
      setTimeout(() => {
        removeQueen(lastQueen.row);
        // Update stack for backtracking
        state.stack[lastQueen.row] = {
          row: lastQueen.row,
          col: lastQueen.col + 1,
          tried: state.stack[lastQueen.row]?.tried || [],
        };
        state.stack.length = lastQueen.row + 1;
      }, 200);
    } else {
      addLog("❌ 無解！已嘗試所有可能");
      state.solving = false;
      setIsPlaying(false);
    }
  }, [queens, boardSize, isValid, placeQueen, removeQueen, setQueenStatus, setCurrentPosition, setFoundSolution, addSolution, setIsPlaying, onComplete]);

  // Auto-play loop
  useEffect(() => {
    if (isPlaying && solveStateRef.current.solving) {
      intervalRef.current = setInterval(solveStep, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, solveStep]);

  const handleStart = () => {
    resetQueens();
    setStepLog([]);
    setFoundSolution(false);
    hasCompleted.current = false;
    solveStateRef.current = { stack: [], solving: true };
    setIsPlaying(true);
    addLog("🚀 開始搜尋 N 皇后解...");
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    resetQueens();
    setStepLog([]);
    solveStateRef.current = { stack: [], solving: false };
  };

  const handleStep = () => {
    if (!solveStateRef.current.solving) {
      solveStateRef.current = { stack: [], solving: true };
    }
    solveStep();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>棋盤大小:</Label>
            <select
              value={boardSize}
              onChange={(e) => {
                setBoardSize(parseInt(e.target.value));
                handleReset();
              }}
              className="bg-card border border-primary/20 rounded px-2 py-1 text-sm"
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n} × {n}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={checkDiagonal}
              onCheckedChange={(checked) => {
                setCheckDiagonal(checked);
                handleReset();
              }}
            />
            <Label className="text-sm">檢查對角線</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleStart}>
            <RotateCcw className="w-4 h-4 mr-1" />
            開始
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePause}
            disabled={!solveStateRef.current.solving}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? "暫停" : "繼續"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleStep}>
            <StepForward className="w-4 h-4 mr-1" />
            單步
          </Button>
        </div>
      </div>

      {/* Warning when diagonal check is off */}
      {!checkDiagonal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm"
        >
          ⚠️ <strong>對角線檢查已關閉！</strong>
          觀察：演算法會放置更多皇后，但它們會互相攻擊（錯誤的解）。
          這展示了約束條件對剪枝的重要性。
        </motion.div>
      )}

      {/* 3D Scene */}
      <div className="h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
        <NQueensScene
          boardSize={boardSize}
          queens={queens}
          currentRow={currentRow}
          currentCol={currentCol}
          foundSolution={foundSolution}
        />
      </div>

      {/* Step log */}
      <div className="bg-black/60 rounded-lg p-4 h-[150px] overflow-y-auto font-mono text-sm">
        <div className="text-muted-foreground mb-2">執行日誌：</div>
        {stepLog.length === 0 ? (
          <div className="text-muted-foreground">點擊「開始」運行 N 皇后演算法</div>
        ) : (
          stepLog.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`py-1 ${
                log.includes("✓") ? "text-green-400" :
                log.includes("✗") ? "text-red-400" :
                log.includes("↩") ? "text-yellow-400" :
                log.includes("🎉") ? "text-primary" :
                "text-foreground/80"
              }`}
            >
              {log}
            </motion.div>
          ))
        )}
      </div>

      {/* Code display */}
      <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-green-400">{`function solveNQueens(n) {
  const board = [];
  
  function backtrack(row) {
    if (row === n) {
      solutions.push([...board]);
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isValid(board, row, col)) {
        board.push({ row, col });  // Choose
        backtrack(row + 1);        // Explore
        board.pop();               // Un-choose ⭐
      }
    }
  }
  
  backtrack(0);
}`}</pre>
      </div>
    </div>
  );
};

export default DemoBlock;
