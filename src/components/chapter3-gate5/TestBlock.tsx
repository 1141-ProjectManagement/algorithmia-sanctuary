import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [condition, setCondition] = useState('');
  const [actionSmall, setActionSmall] = useState('');
  const [actionBig, setActionBig] = useState('');
  const [testResult, setTestResult] = useState<'idle' | 'running' | 'success' | 'fail'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
  const { toast } = useToast();

  const stones = [1, 2, 4, 6, 8, 9, 11, 15];
  const target = 15;

  const handleRunCode = () => {
    // Validate inputs
    const condNorm = condition.replace(/\s/g, '').toLowerCase();
    const actionSmallNorm = actionSmall.replace(/\s/g, '').toLowerCase();
    const actionBigNorm = actionBig.replace(/\s/g, '').toLowerCase();

    // Check condition
    const validConditions = ['sum<target', 'target>sum'];
    const conditionValid = validConditions.some(c => condNorm.includes(c));

    // Check actions
    const validSmallActions = ['left++', 'left+=1', '++left', 'left=left+1'];
    const validBigActions = ['right--', 'right-=1', '--right', 'right=right-1'];
    
    const smallActionValid = validSmallActions.some(a => actionSmallNorm.includes(a));
    const bigActionValid = validBigActions.some(a => actionBigNorm.includes(a));

    if (!conditionValid || !smallActionValid || !bigActionValid) {
      setTestResult('fail');
      
      let errorMsg = '邏輯有誤：';
      if (!conditionValid) errorMsg += '條件判斷應該是 sum < target；';
      if (!smallActionValid) errorMsg += '和太小時應該 left++；';
      if (!bigActionValid) errorMsg += '和太大時應該 right--；';
      
      toast({
        title: "❌ 咒語失效",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    // Simulate the algorithm
    setTestResult('running');
    setSimulationSteps([]);
    
    let left = 0;
    let right = stones.length - 1;
    const steps: string[] = [];
    let found = false;
    let iterations = 0;
    const maxIterations = 20;

    while (left < right && iterations < maxIterations) {
      iterations++;
      const sum = stones[left] + stones[right];
      steps.push(`L=${left}, R=${right}: stones[${left}]+stones[${right}] = ${stones[left]}+${stones[right]} = ${sum}`);
      
      if (sum === target) {
        steps.push(`✓ 找到目標！stones[${left}] + stones[${right}] = ${target}`);
        found = true;
        break;
      } else if (sum < target) {
        steps.push(`${sum} < ${target}, 執行 left++`);
        left++;
      } else {
        steps.push(`${sum} > ${target}, 執行 right--`);
        right--;
      }
    }

    // Animate steps
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setSimulationSteps(prev => [...prev, steps[stepIndex]]);
        stepIndex++;
      } else {
        clearInterval(interval);
        if (found) {
          setTestResult('success');
          toast({
            title: "✨ 完美！",
            description: "導航咒語正確，石板橋已修復！",
          });
          setTimeout(() => onComplete(), 1500);
        } else {
          setTestResult('fail');
          toast({
            title: "❌ 未找到目標",
            description: "邏輯可能有問題",
            variant: "destructive",
          });
        }
      }
    }, 500);
  };

  const handleReset = () => {
    setCondition('');
    setActionSmall('');
    setActionBig('');
    setTestResult('idle');
    setShowHint(false);
    setSimulationSteps([]);
  };

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card/40 rounded-xl border border-primary/30"
      >
        <h3 className="text-xl font-bold text-primary font-['Cinzel'] mb-3">
          修復導航咒語
        </h3>
        <p className="text-muted-foreground">
          石板橋部分斷裂！請補全控制雙指標移動的邏輯，讓兩個探險家在正確位置會合。
        </p>
        <div className="mt-3 p-3 bg-primary/10 rounded-lg">
          <span className="text-sm">陣列: <code className="text-primary">[1, 2, 4, 6, 8, 9, 11, 15]</code></span>
          <span className="text-sm ml-4">目標和: <code className="text-primary">{target}</code></span>
        </div>
      </motion.div>

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-black/60 rounded-xl border border-primary/30"
      >
        <h4 className="text-sm font-semibold text-primary mb-3">補全代碼</h4>
        
        <pre className="font-mono text-sm text-green-400 space-y-2">
          <div className="text-muted-foreground">let left = 0;</div>
          <div className="text-muted-foreground">let right = stones.length - 1;</div>
          <div className="text-muted-foreground">while (left &lt; right) {'{'}</div>
          <div className="text-muted-foreground pl-4">let sum = stones[left] + stones[right];</div>
          <div className="text-muted-foreground pl-4">if (sum === target) return [left, right];</div>
          
          <div className="pl-4 flex items-center gap-2">
            <span className="text-muted-foreground">else if (</span>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="???"
              className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/50 font-mono text-sm w-32"
              disabled={testResult === 'running' || testResult === 'success'}
            />
            <span className="text-muted-foreground">) {'{'}</span>
          </div>
          
          <div className="pl-8 flex items-center gap-2">
            <input
              type="text"
              value={actionSmall}
              onChange={(e) => setActionSmall(e.target.value)}
              placeholder="???"
              className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/50 font-mono text-sm w-24"
              disabled={testResult === 'running' || testResult === 'success'}
            />
            <span className="text-muted-foreground">;</span>
            <span className="text-xs text-muted-foreground ml-2">// 和太小時的動作</span>
          </div>
          
          <div className="text-muted-foreground pl-4">{'}'} else {'{'}</div>
          
          <div className="pl-8 flex items-center gap-2">
            <input
              type="text"
              value={actionBig}
              onChange={(e) => setActionBig(e.target.value)}
              placeholder="???"
              className="bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/50 font-mono text-sm w-24"
              disabled={testResult === 'running' || testResult === 'success'}
            />
            <span className="text-muted-foreground">;</span>
            <span className="text-xs text-muted-foreground ml-2">// 和太大時的動作</span>
          </div>
          
          <div className="text-muted-foreground pl-4">{'}'}</div>
          <div className="text-muted-foreground">{'}'}</div>
        </pre>
      </motion.div>

      {/* Simulation Output */}
      {simulationSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-black/40 rounded-xl border border-primary/30 max-h-48 overflow-y-auto"
        >
          <h4 className="text-sm font-semibold text-primary mb-2">執行過程</h4>
          <div className="space-y-1 font-mono text-xs">
            {simulationSteps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={step.includes('✓') ? 'text-green-400 font-bold' : 'text-foreground'}
              >
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
        >
          <p className="text-amber-400 text-sm flex items-start gap-2">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              條件：當 <code>sum &lt; target</code> 時，我們需要讓和變大<br/>
              動作：left++ 會讓和變大（因為陣列是有序的，右邊的數更大）<br/>
              反之：right-- 會讓和變小
            </span>
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint(!showHint)}
        >
          <Lightbulb className="w-4 h-4 mr-1" />
          {showHint ? '隱藏提示' : '顯示提示'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
        
        <Button
          onClick={handleRunCode}
          disabled={
            testResult === 'success' || 
            testResult === 'running' ||
            !condition.trim() || 
            !actionSmall.trim() || 
            !actionBig.trim()
          }
          className="min-w-32"
        >
          {testResult === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              已通過
            </>
          ) : testResult === 'running' ? (
            <>執行中...</>
          ) : testResult === 'fail' ? (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              再試一次
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              執行咒語
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TestBlock;
