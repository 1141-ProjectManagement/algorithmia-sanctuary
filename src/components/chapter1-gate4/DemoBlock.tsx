import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserMinus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import queueCorridor from "@/assets/queue-corridor.png";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const { toast } = useToast();
  const [queue, setQueue] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const enqueue = () => {
    if (!input.trim()) {
      toast({ title: "請輸入內容", variant: "destructive" });
      return;
    }

    setQueue([...queue, input.trim()]);
    setInput("");
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 1500);
    }

    toast({ 
      title: "✅ Enqueue 成功", 
      description: `已將 "${input.trim()}" 加入佇列尾端` 
    });
  };

  const dequeue = () => {
    if (queue.length === 0) {
      toast({ 
        title: "佇列已空", 
        description: "沒有等待的元素", 
        variant: "destructive" 
      });
      return;
    }

    const removed = queue[0];
    setQueue(queue.slice(1));
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 1500);
    }

    toast({ 
      title: "🚪 Dequeue 成功", 
      description: `"${removed}" 已從佇列前端離開` 
    });
  };

  return (
    <div className="space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          佇列實驗室
        </h2>
        <p className="text-foreground/70">親手操作佇列的 Enqueue、Dequeue</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-center"
      >
        <p className="text-foreground/80">
          模擬排隊系統，觀察先進先出的運作方式
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
                  輸入元素內容（例如顧客編號）
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && enqueue()}
                  placeholder="例如: 顧客A, 任務1, 🎫"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={enqueue}
                  className="w-full"
                  disabled={!input.trim()}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Enqueue (加入隊伍)
                </Button>

                <Button
                  onClick={dequeue}
                  variant="destructive"
                  className="w-full"
                  disabled={queue.length === 0}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Dequeue (服務完畢)
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                <Users className="w-4 h-4" />
                <span>佇列人數: <strong className="text-primary">{queue.length}</strong></span>
              </div>
            </div>
          </div>

          <img 
            src={queueCorridor} 
            alt="Queue visualization" 
            className="w-full max-w-[250px] mx-auto opacity-60 rounded-lg"
          />
        </motion.div>

        {/* Queue Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 p-6 rounded-lg border border-primary/20"
        >
          <h3 className="font-['Cinzel'] text-xl text-primary mb-4 text-center">
            佇列視覺化
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between text-xs text-foreground/60">
              <span>← 出口 (Front)</span>
              <span>入口 (Rear) →</span>
            </div>

            <div className="flex gap-2 items-center min-h-[300px] overflow-x-auto p-4">
              <AnimatePresence mode="popLayout">
                {queue.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-foreground/40 text-center w-full py-20"
                  >
                    <p className="text-sm">佇列為空</p>
                    <p className="text-xs mt-2">Enqueue 一些元素試試看！</p>
                  </motion.div>
                ) : (
                  queue.map((item, index) => (
                    <motion.div
                      key={`${item}-${index}`}
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        boxShadow: index === 0 
                          ? "0 0 20px rgba(212,175,55,0.6)" 
                          : "none"
                      }}
                      exit={{ opacity: 0, x: -50, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        min-w-[100px] px-4 py-6 rounded-lg border-2 
                        flex flex-col items-center justify-center gap-2
                        ${index === 0 
                          ? "bg-primary/20 border-primary" 
                          : "bg-card/50 border-border"
                        }
                      `}
                    >
                      <span className="font-bold text-lg">{item}</span>
                      {index === 0 && (
                        <span className="text-xs text-primary">下一個</span>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="text-center">
              <p className="text-xs text-foreground/60">
                💡 最先加入的元素會最先離開（左側）
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {hasInteracted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-primary font-semibold">
            ✨ 太好了！你已體驗過佇列的基本操作
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
