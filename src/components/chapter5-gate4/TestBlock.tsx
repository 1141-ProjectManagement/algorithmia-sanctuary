import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, RotateCcw, Lightbulb, CheckCircle } from "lucide-react";

interface TestBlockProps {
  onComplete: () => void;
}

const BUGGY_CODE = `function merge(leftArr, rightArr) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < leftArr.length && j < rightArr.length) {
    // ❌ 缺少比較邏輯！
    // ______________________
    
    // 根據比較結果決定放入哪個元素
  }
  
  // 處理剩餘元素
  return [...result, ...leftArr.slice(i), ...rightArr.slice(j)];
}`;

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [codeFixed, setCodeFixed] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [crystals, setCrystals] = useState<{ value: number; status: string; position: number }[]>([]);
  const [mergeResult, setMergeResult] = useState<number[]>([]);
  const { toast } = useToast();

  const leftArr = [3, 27, 38];
  const rightArr = [9, 43, 82];

  const initCrystals = useCallback(() => {
    const left = leftArr.map((v, i) => ({ value: v, status: "left", position: i }));
    const right = rightArr.map((v, i) => ({ value: v, status: "right", position: i + 4 }));
    setCrystals([...left, ...right]);
    setMergeResult([]);
  }, []);

  const runBuggyMerge = useCallback(async () => {
    initCrystals();
    setIsRunning(true);
    
    // Simulate wrong merge (no comparison, just interleave or random)
    await new Promise(r => setTimeout(r, 500));
    
    const wrongResult = [leftArr[0], rightArr[0], leftArr[1], rightArr[1], leftArr[2], rightArr[2]];
    
    setCrystals(prev => prev.map(c => ({ ...c, status: "error" })));
    setMergeResult(wrongResult);
    
    await new Promise(r => setTimeout(r, 500));
    
    toast({
      title: "💥 能量亂流！",
      description: "排序順序錯誤，水晶碰撞爆炸",
      variant: "destructive",
    });
    
    setIsRunning(false);
  }, [initCrystals, toast]);

  const runFixedMerge = useCallback(async () => {
    initCrystals();
    setIsRunning(true);
    
    const result: number[] = [];
    let i = 0, j = 0;
    const left = [...leftArr];
    const right = [...rightArr];
    
    const updateCrystals = (resultSoFar: number[]) => {
      const newCrystals: typeof crystals = [];
      
      // Remaining left
      for (let k = i; k < left.length; k++) {
        newCrystals.push({ value: left[k], status: "left", position: k });
      }
      // Remaining right
      for (let k = j; k < right.length; k++) {
        newCrystals.push({ value: right[k], status: "right", position: k + 4 });
      }
      // Merged
      resultSoFar.forEach((v, idx) => {
        newCrystals.push({ value: v, status: "merged", position: idx + 10 });
      });
      
      setCrystals(newCrystals);
    };
    
    while (i < left.length && j < right.length) {
      await new Promise(r => setTimeout(r, 400));
      
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
      
      updateCrystals(result);
    }
    
    // Handle remaining
    while (i < left.length) {
      await new Promise(r => setTimeout(r, 300));
      result.push(left[i]);
      i++;
      updateCrystals(result);
    }
    while (j < right.length) {
      await new Promise(r => setTimeout(r, 300));
      result.push(right[j]);
      j++;
      updateCrystals(result);
    }
    
    setMergeResult(result);
    setCrystals(result.map((v, idx) => ({ value: v, status: "complete", position: idx })));
    
    toast({
      title: "✨ 合併成功！",
      description: "能量水晶有序融合",
    });
    
    onComplete();
    setIsRunning(false);
  }, [initCrystals, toast, onComplete]);

  const handleSubmitFix = () => {
    setAttemptCount(prev => prev + 1);
    
    const normalizedInput = userInput.toLowerCase().replace(/\s/g, "");
    const validPatterns = [
      "leftarr[i]<rightarr[j]",
      "left[i]<right[j]",
      "leftarr[i]<=rightarr[j]",
      "left[i]<=right[j]",
      "if(leftarr[i]<rightarr[j])",
      "if(left[i]<right[j])",
    ];
    
    const isCorrect = validPatterns.some(p => normalizedInput.includes(p.replace(/\s/g, "")));
    
    if (isCorrect) {
      setCodeFixed(true);
      toast({
        title: "✅ 邏輯正確！",
        description: "現在運行代碼看看效果",
      });
    } else {
      // Check if they used > instead of <
      if (normalizedInput.includes(">")) {
        toast({
          title: "❌ 方向相反",
          description: "想想看：我們要從小到大排序",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ 不太對",
          description: "提示：比較 leftArr[i] 和 rightArr[j] 的大小",
          variant: "destructive",
        });
      }
    }
  };

  const handleReset = () => {
    setCodeFixed(false);
    setUserInput("");
    setCrystals([]);
    setMergeResult([]);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Challenge description */}
      <div className="p-4 bg-card/40 rounded-lg border border-primary/20">
        <h4 className="font-medium text-primary mb-2">🔧 挑戰：修復合併咒語</h4>
        <p className="text-sm text-foreground/80">
          能量球已成功分裂到底部，但合併時發生了碰撞！
          原因是缺少「比較邏輯」——我們需要判斷哪個元素較小，才能正確排序。
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
              <label className="text-sm text-muted-foreground">補上比較邏輯：</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="if (leftArr[i] __ rightArr[j])"
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
              <p className="text-sm text-green-400 font-mono">
                if (leftArr[i] {"<"} rightArr[j]) {"{"}
              </p>
              <p className="text-sm text-green-400 font-mono pl-4">
                result.push(leftArr[i++]);
              </p>
              <p className="text-sm text-green-400 font-mono">{"}"}</p>
              <p className="text-xs text-muted-foreground mt-1">✓ 比較邏輯已修復</p>
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
                  我們要從小到大排序，所以如果 leftArr[i] 比較小，就先放它
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          {/* Crystal display */}
          <div className="bg-black/40 rounded-lg p-6 min-h-[200px]">
            <div className="flex justify-center gap-8 mb-6">
              {/* Left array */}
              <div className="text-center">
                <p className="text-xs text-blue-400 mb-2">左陣列</p>
                <div className="flex gap-2">
                  {leftArr.map((v, i) => (
                    <motion.div
                      key={`left-${i}`}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        crystals.find(c => c.value === v && c.status === "left")
                          ? "bg-blue-500/50 border border-blue-400"
                          : crystals.find(c => c.value === v && c.status === "error")
                          ? "bg-red-500/50 border border-red-400"
                          : "bg-blue-500/20 border border-blue-400/30"
                      }`}
                      animate={{
                        scale: crystals.find(c => c.value === v && c.status === "error") ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      {v}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Right array */}
              <div className="text-center">
                <p className="text-xs text-green-400 mb-2">右陣列</p>
                <div className="flex gap-2">
                  {rightArr.map((v, i) => (
                    <motion.div
                      key={`right-${i}`}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        crystals.find(c => c.value === v && c.status === "right")
                          ? "bg-green-500/50 border border-green-400"
                          : crystals.find(c => c.value === v && c.status === "error")
                          ? "bg-red-500/50 border border-red-400"
                          : "bg-green-500/20 border border-green-400/30"
                      }`}
                      animate={{
                        scale: crystals.find(c => c.value === v && c.status === "error") ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      {v}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Merged result */}
            {mergeResult.length > 0 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">合併結果</p>
                <div className="flex justify-center gap-2">
                  {mergeResult.map((v, i) => (
                    <motion.div
                      key={`merged-${i}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        crystals.find(c => c.status === "complete")
                          ? "bg-primary/50 border border-primary shadow-glow-gold"
                          : crystals.find(c => c.status === "error")
                          ? "bg-red-500/50 border border-red-400"
                          : "bg-primary/30 border border-primary/50"
                      }`}
                    >
                      {v}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={codeFixed ? runFixedMerge : runBuggyMerge}
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-1" />
              {codeFixed ? "執行修復版" : "執行錯誤版"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isRunning}>
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          </div>

          {/* Success message */}
          {crystals.some(c => c.status === "complete") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 bg-primary/10 border border-primary/30 rounded-lg"
            >
              <p className="text-primary font-medium">🎉 合併成功！</p>
              <p className="text-sm text-muted-foreground">
                正確的比較邏輯讓能量水晶有序融合
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestBlock;
