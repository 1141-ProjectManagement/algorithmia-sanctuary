import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import stackTower from "@/assets/stack-tower.png";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter-1");
  
  const [stack, setStack] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [challenge, setChallenge] = useState("({[]})");
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [completed, setCompleted] = useState(isGateCompleted("gate-3"));

  const push = (value: string) => {
    setStack([...stack, value]);
  };

  const pop = () => {
    if (stack.length === 0) {
      toast({ title: "堆疊已空", description: "無法彈出元素", variant: "destructive" });
      return;
    }
    setStack(stack.slice(0, -1));
  };

  const checkBrackets = () => {
    const testStack: string[] = [];
    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
    
    for (const char of challenge) {
      if (char in pairs) {
        testStack.push(char);
      } else if (Object.values(pairs).includes(char)) {
        if (testStack.length === 0 || pairs[testStack[testStack.length - 1]] !== char) {
          toast({ title: "❌ 括號不匹配", variant: "destructive" });
          return;
        }
        testStack.pop();
      }
    }
    
    if (testStack.length === 0) {
      toast({ title: "✅ 完美匹配！", description: "你已掌握堆疊的奧秘" });
      handleComplete();
    } else {
      toast({ title: "❌ 還有未閉合的括號", variant: "destructive" });
    }
  };

  const handleComplete = () => {
    if (!completed) {
      completeGate("gate-3");
      setCompleted(true);
    }
    setTimeout(() => navigate("/chapter1"), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${stoneTablet})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        
        <div className="relative z-10 container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80"
            onClick={() => navigate("/chapter1")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回章節
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-['Cinzel'] text-4xl md:text-5xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              堆疊之塔
            </h1>
            <p className="text-lg text-foreground/90">Stack - 後進先出 (LIFO)</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 p-6 bg-card/40 rounded-lg border border-border">
          <h2 className="text-xl font-['Cinzel'] text-primary mb-3">塔之奧秘</h2>
          <p className="text-foreground/80 leading-relaxed">
            堆疊之塔只能從頂端存取，最後放入的元素會最先被取出。這種「後進先出」的特性，
            正是解決括號匹配、函式呼叫等問題的關鍵。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Stack Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-card/30 rounded-lg border border-primary/20"
          >
            <h3 className="text-xl font-['Cinzel'] text-primary mb-4 text-center">
              堆疊操作
            </h3>
            
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img
                  src={stackTower}
                  alt="Stack Tower"
                  className="w-48 h-64 object-contain opacity-60"
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex flex-col-reverse items-center gap-2 pb-4">
                  <AnimatePresence>
                    {stack.slice(-5).map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ y: -20, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 0.8 }}
                        className="w-32 h-10 bg-gradient-to-r from-primary/40 to-amber-glow/30 rounded border-2 border-primary flex items-center justify-center text-primary font-bold shadow-glow-gold"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && input && (push(input), setInput(""))}
                  placeholder="輸入元素"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground"
                />
                <Button
                  onClick={() => {
                    if (input) {
                      push(input);
                      setInput("");
                    }
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={pop}
                disabled={stack.length === 0}
                className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive"
              >
                <Minus className="mr-2 h-4 w-4" />
                彈出 Pop
              </Button>

              <div className="text-sm text-muted-foreground text-center">
                堆疊大小: {stack.length}
              </div>
            </div>
          </motion.div>

          {/* Bracket Matching Challenge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-card/30 rounded-lg border border-secondary/20"
          >
            <h3 className="text-xl font-['Cinzel'] text-secondary mb-4 text-center">
              括號匹配挑戰
            </h3>

            <div className="mb-6 p-4 bg-black/40 rounded border border-border">
              <p className="text-sm text-muted-foreground mb-2">測試字串：</p>
              <p className="text-2xl font-mono text-center text-primary tracking-wider">
                {challenge}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded border border-primary/20">
                <p className="text-sm text-foreground/80 mb-2">
                  <strong className="text-primary">規則：</strong>
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 左括號 push 入堆疊</li>
                  <li>• 右括號與堆疊頂配對並 pop</li>
                  <li>• 最後堆疊應為空</li>
                </ul>
              </div>

              <div className="p-4 bg-card/40 rounded">
                <p className="text-xs text-muted-foreground mb-2">配對說明：</p>
                <div className="flex justify-around text-sm">
                  <span className="text-primary">( )</span>
                  <span className="text-secondary">[ ]</span>
                  <span className="text-accent">{ }</span>
                </div>
              </div>
            </div>

            <Button
              onClick={checkBrackets}
              className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              驗證括號匹配
            </Button>
          </motion.div>
        </div>

        {/* Key Insights */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border mb-8">
          <h3 className="text-xl font-['Cinzel'] text-primary mb-4">堆疊特性</h3>
          <ul className="space-y-2 text-foreground/80">
            <li>📚 <strong>LIFO</strong>：Last In First Out - 後進先出</li>
            <li>⚡ <strong>O(1) 操作</strong>：Push 和 Pop 都是常數時間</li>
            <li>🎯 <strong>應用場景</strong>：括號匹配、函式呼叫堆疊、復原/重做功能</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
          >
            {completed ? "返回章節" : "完成挑戰"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter1Gate3;
