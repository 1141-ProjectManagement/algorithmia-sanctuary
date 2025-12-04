import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dices, Zap, AlertTriangle, Check, X, Lightbulb, ShieldAlert } from "lucide-react";

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [explosionEffect, setExplosionEffect] = useState(false);

  const validateCode = (code: string): boolean => {
    const normalizedCode = code.replace(/\s+/g, '').toLowerCase();
    
    const patterns = [
      /low\+math\.floor\(math\.random\(\)\*\(high-low\+1\)\)/,
      /math\.floor\(math\.random\(\)\*\(high-low\+1\)\)\+low/,
      /low\+~~\(math\.random\(\)\*\(high-low\+1\)\)/,
      /~~\(math\.random\(\)\*\(high-low\+1\)\)\+low/,
      /low\+parseInt\(math\.random\(\)\*\(high-low\+1\)\)/,
    ];
    
    return patterns.some(pattern => pattern.test(normalizedCode));
  };

  const runTests = async () => {
    setIsRunning(true);
    setResult(null);
    setTestResults([]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isValid = validateCode(userCode);
    
    const results: boolean[] = [];
    
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      results.push(isValid);
      setTestResults([...results]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isValid) {
      setResult('success');
      toast({
        title: "🎲 隨機化成功！",
        description: "護盾被擊碎，守護者的測試已通過！",
      });
      setTimeout(() => onComplete(), 1500);
    } else {
      setResult('fail');
      setExplosionEffect(true);
      toast({
        title: "💥 陣列過熱爆炸！",
        description: "隨機範圍不正確，請檢查公式。",
        variant: "destructive",
      });
      setTimeout(() => setExplosionEffect(false), 1000);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
          <ShieldAlert className="w-5 h-5" />
          <span className="font-semibold">守護者的挑戰</span>
        </div>
        <p className="text-muted-foreground text-sm">
          實作 getRandomIndex 函數，讓 Pivot 選擇隨機化以通過針對性測試
        </p>
      </div>

      <Card className={`border-primary/30 bg-card/60 transition-all ${
        explosionEffect ? 'animate-pulse border-red-500' : ''
      }`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            代碼編輯器
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground">{"// 在 [low, high] 範圍內生成隨機整數"}</p>
            <p className="text-blue-400">{"function"} <span className="text-yellow-400">getRandomIndex</span>{"(low, high) {"}</p>
            <p className="text-muted-foreground pl-4">{"// TODO: 實作正確的隨機選取邏輯"}</p>
            <p className="text-purple-400 pl-4">{"let"} <span className="text-foreground">randomIndex =</span></p>
          </div>
          
          <Textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="low + Math.floor(Math.random() * (high - low + 1))"
            className="font-mono text-sm bg-black/30 border-primary/30 min-h-[60px]"
            disabled={isRunning || result === 'success'}
          />
          
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
            <p className="text-purple-400 pl-4">{"return"} <span className="text-foreground">randomIndex;</span></p>
            <p className="text-blue-400">{"}"}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span>提示：確保結果在 [low, high] 範圍內（包含兩端）</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={runTests}
          disabled={isRunning || !userCode.trim() || result === 'success'}
          className="flex-1 gap-2"
        >
          {isRunning ? (
            <>執行測試中...</>
          ) : (
            <>
              <Dices className="w-4 h-4" />
              執行挑戰
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowHint(!showHint)}
          disabled={result === 'success'}
          className="gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? '隱藏提示' : '顯示提示'}
        </Button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-yellow-500/30 bg-yellow-500/10">
              <CardContent className="p-4 text-sm">
                <p className="text-yellow-400 font-semibold mb-2">💡 提示：</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Math.random() 產生 [0, 1) 的浮點數</li>
                  <li>• 要得到 [low, high] 範圍的整數，需要：</li>
                  <li className="pl-4">1. 計算範圍大小：(high - low + 1)</li>
                  <li className="pl-4">2. 乘以 Math.random()</li>
                  <li className="pl-4">3. 取整數：Math.floor()</li>
                  <li className="pl-4">4. 加上起始值：+ low</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {testResults.length > 0 && (
        <Card className="border-border/50 bg-card/40">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-3">測試案例：</p>
            <div className="space-y-2">
              {[
                { name: '反向排序陣列 [10,9,8,...,1]', tested: testResults[0] !== undefined },
                { name: '已排序陣列 [1,2,3,...,10]', tested: testResults[1] !== undefined },
                { name: '全相同元素 [5,5,5,...,5]', tested: testResults[2] !== undefined },
                { name: '單一元素 [42]', tested: testResults[3] !== undefined },
                { name: '大規模隨機陣列 (n=1000)', tested: testResults[4] !== undefined },
              ].map((test, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-2 p-2 rounded ${
                    !test.tested ? 'bg-muted/20' :
                    testResults[i] ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {test.tested ? (
                    testResults[i] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                  )}
                  <span className={`text-sm ${
                    test.tested && testResults[i] ? 'text-green-400' :
                    test.tested && !testResults[i] ? 'text-red-400' :
                    'text-muted-foreground'
                  }`}>
                    {test.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {result === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 bg-primary/20 rounded-lg border border-primary/50"
          >
            <Dices className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold text-primary mb-2">
              🎲 命運骰子已覺醒！
            </h3>
            <p className="text-muted-foreground">
              你已掌握隨機化演算法的精髓，守護者的護盾已被擊碎。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestBlock;
