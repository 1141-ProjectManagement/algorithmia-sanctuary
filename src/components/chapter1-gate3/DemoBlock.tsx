import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import stackTower from "@/assets/stack-tower.png";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const { toast } = useToast();
  const [stack, setStack] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const push = () => {
    if (!input.trim()) {
      toast({ title: "請輸入內容", variant: "destructive" });
      return;
    }
    setStack([...stack, input.trim()]);
    setInput("");
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 1500);
    }

    toast({ 
      title: "✅ Push 成功", 
      description: `已將 "${input.trim()}" 推入堆疊頂端` 
    });
  };

  const pop = () => {
    if (stack.length === 0) {
      toast({ 
        title: "堆疊已空", 
        description: "無法彈出元素", 
        variant: "destructive" 
      });
      return;
    }

    const removed = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 1500);
    }

    toast({ 
      title: "🗑️ Pop 成功", 
      description: `已將 "${removed}" 從堆疊頂端彈出` 
    });
  };

  const peek = () => {
    if (stack.length === 0) {
      toast({ 
        title: "堆疊已空", 
        description: "沒有元素可以查看", 
        variant: "destructive" 
      });
      return;
    }

    toast({ 
      title: "👀 Peek 查看", 
      description: `頂端元素是: "${stack[stack.length - 1]}"` 
    });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          堆疊實驗室
        </h2>
        <p className="text-foreground/70">親手操作堆疊的 Push、Pop、Peek</p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-center"
      >
        <p className="text-foreground/80">
          輸入任意內容並操作堆疊，觀察 LIFO 原則的運作方式
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-card/40 p-6 rounded-lg border border-primary/20">
            <h3 className="font-['Cinzel'] text-xl text-primary mb-4">
              控制面板
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground/70 mb-2 block">
                  輸入元素內容
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && push()}
                  placeholder="例如: A, 1, 🎯"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={push}
                  className="w-full"
                  disabled={!input.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Push (推入堆疊)
                </Button>

                <Button
                  onClick={pop}
                  variant="destructive"
                  className="w-full"
                  disabled={stack.length === 0}
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Pop (彈出頂端)
                </Button>

                <Button
                  onClick={peek}
                  variant="outline"
                  className="w-full"
                  disabled={stack.length === 0}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Peek (查看頂端)
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm text-foreground/60 text-center">
                堆疊大小: <strong className="text-primary">{stack.length}</strong>
              </p>
            </div>
          </div>

          <img 
            src={stackTower} 
            alt="Stack visualization" 
            className="w-full max-w-[200px] mx-auto opacity-60"
          />
        </motion.div>

        {/* Stack Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 p-6 rounded-lg border border-primary/20"
        >
          <h3 className="font-['Cinzel'] text-xl text-primary mb-4 text-center">
            堆疊視覺化
          </h3>

          <div className="flex flex-col-reverse items-center gap-2 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {stack.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-foreground/40 text-center py-20"
                >
                  <p className="text-sm">堆疊為空</p>
                  <p className="text-xs mt-2">Push 一些元素試試看！</p>
                </motion.div>
              ) : (
                stack.map((item, index) => (
                  <motion.div
                    key={`${item}-${index}`}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      boxShadow: index === stack.length - 1 
                        ? "0 0 20px rgba(212,175,55,0.6)" 
                        : "none"
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      w-full max-w-[250px] px-6 py-4 rounded-lg border-2 
                      flex items-center justify-center text-lg font-bold
                      ${index === stack.length - 1 
                        ? "bg-primary/20 border-primary" 
                        : "bg-card/50 border-border"
                      }
                    `}
                  >
                    <span>{item}</span>
                    {index === stack.length - 1 && (
                      <span className="ml-2 text-xs text-primary">← 頂端</span>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-foreground/60">
              💡 最新加入的元素會出現在最上方
            </p>
          </div>
        </motion.div>
      </div>

      {/* Completion Message */}
      {hasInteracted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-primary font-semibold">
            ✨ 太好了！你已體驗過堆疊的基本操作
          </p>
          <p className="text-sm text-foreground/60 mt-1">
            繼續向下滾動進入實戰挑戰
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
