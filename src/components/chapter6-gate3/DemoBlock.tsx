import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dices, Play, RotateCcw, Zap } from "lucide-react";
import { useRandomizedStore } from "@/stores/randomizedStore";
import DiceScene from "./DiceScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const WORST_CASE_ARRAY = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    array,
    pivotIndex,
    useRandomPivot,
    isAnimating,
    stepLog,
    diceValue,
    isRolling,
    comparisonCount,
    worstCaseComparisons,
    expectedComparisons,
    initializeArray,
    setUseRandomPivot,
    rollDice,
    setPivot,
    setComparing,
    markSorted,
    swapElements,
    incrementComparisons,
    addLog,
    setAnimating,
    reset
  } = useRandomizedStore();

  const [demoRuns, setDemoRuns] = useState(0);
  const [hasUsedRandom, setHasUsedRandom] = useState(false);

  useEffect(() => {
    initializeArray([...WORST_CASE_ARRAY]);
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runPartition = async (low: number, high: number): Promise<number> => {
    if (low >= high) {
      if (low === high) markSorted(low);
      return low;
    }

    let pivotIdx = low;
    
    if (useRandomPivot) {
      pivotIdx = await rollDice(low, high);
      await sleep(500);
      if (pivotIdx !== low) {
        swapElements(low, pivotIdx);
        await sleep(300);
      }
    }
    
    setPivot(low);
    await sleep(400);
    
    const pivotValue = array[low].value;
    let i = low + 1;
    
    for (let j = low + 1; j <= high; j++) {
      setComparing([j, low]);
      incrementComparisons();
      await sleep(200);
      
      if (array[j].value < pivotValue) {
        if (i !== j) {
          swapElements(i, j);
          await sleep(200);
        }
        i++;
      }
    }
    
    const finalPivotPos = i - 1;
    if (finalPivotPos !== low) {
      swapElements(low, finalPivotPos);
      await sleep(300);
    }
    
    markSorted(finalPivotPos);
    return finalPivotPos;
  };

  const runQuickSort = async (low: number, high: number) => {
    if (low < high) {
      const pivotPos = await runPartition(low, high);
      await runQuickSort(low, pivotPos - 1);
      await runQuickSort(pivotPos + 1, high);
    } else if (low === high) {
      markSorted(low);
    }
  };

  const handleRun = async () => {
    setAnimating(true);
    addLog(`開始排序 (${useRandomPivot ? '隨機' : '固定'} Pivot)`);
    
    if (useRandomPivot) {
      setHasUsedRandom(true);
    }
    
    await runQuickSort(0, array.length - 1);
    
    addLog(`排序完成！總比較次數: ${comparisonCount}`);
    setAnimating(false);
    setDemoRuns(prev => prev + 1);
    
    if (demoRuns >= 1 && hasUsedRandom) {
      onComplete();
    }
  };

  const handleReset = () => {
    reset();
    initializeArray([...WORST_CASE_ARRAY]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          比較固定 Pivot 與隨機 Pivot 的效率差異
        </p>
        <p className="text-sm text-primary mt-1">
          當前陣列：已排序的「最壞情況」數據
        </p>
      </div>

      <DiceScene 
        array={array}
        pivotIndex={pivotIndex}
        isRolling={isRolling}
        diceValue={diceValue}
        useRandomPivot={useRandomPivot}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/30 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              控制面板
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="random-pivot" className="text-sm">
                {useRandomPivot ? '🎲 隨機 Pivot' : '📍 固定 Pivot (arr[0])'}
              </Label>
              <Switch
                id="random-pivot"
                checked={useRandomPivot}
                onCheckedChange={setUseRandomPivot}
                disabled={isAnimating}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleRun}
                disabled={isAnimating}
                className="flex-1 gap-2"
              >
                {isAnimating ? (
                  <>執行中...</>
                ) : (
                  <>
                    {useRandomPivot ? <Dices className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {useRandomPivot ? '擲骰子排序' : '開始排序'}
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                disabled={isAnimating}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-red-500/20 rounded">
                <p className="text-red-400">最壞 O(n²)</p>
                <p className="font-mono">{worstCaseComparisons}</p>
              </div>
              <div className="p-2 bg-primary/20 rounded">
                <p className="text-primary">當前</p>
                <p className="font-mono">{comparisonCount}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded">
                <p className="text-green-400">期望 O(n log n)</p>
                <p className="font-mono">~{expectedComparisons}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">執行日誌</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[180px]">
              <div className="space-y-1 font-mono text-xs">
                {stepLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-1 rounded ${
                      log.includes('🎲') ? 'text-primary bg-primary/10' :
                      log.includes('Pivot') ? 'text-yellow-400' :
                      log.includes('完成') ? 'text-green-400' :
                      'text-muted-foreground'
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-black/30">
        <CardContent className="p-4">
          <p className="text-sm font-mono text-muted-foreground mb-2">
            // 當前 partition 邏輯
          </p>
          <pre className="text-sm font-mono text-green-400 overflow-x-auto">
{useRandomPivot ? 
`function partition(arr, low, high) {
  // 🎲 隨機選取 Pivot
  let randomIdx = low + Math.floor(
    Math.random() * (high - low + 1)
  );
  swap(arr, low, randomIdx);
  let pivot = arr[low];
  // ... 標準分區邏輯
}` :
`function partition(arr, low, high) {
  // ⚠️ 固定選取第一個元素
  let pivot = arr[low]; // 危險！
  // 對已排序數據，分區極度不平衡
  // ... 標準分區邏輯
}`}
          </pre>
        </CardContent>
      </Card>

      {demoRuns >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-green-400"
        >
          ✨ 你已體驗了隨機化的威力！
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
