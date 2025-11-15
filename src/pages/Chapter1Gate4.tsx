import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import queueCorridor from "@/assets/queue-corridor.png";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter-1");
  
  const [queue, setQueue] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [operationCount, setOperationCount] = useState(0);
  const [completed, setCompleted] = useState(isGateCompleted("gate-4"));

  const enqueue = (value: string) => {
    setQueue([...queue, value]);
    setOperationCount(operationCount + 1);
    toast({ title: "✅ 加入佇列", description: `${value} 進入等待` });
  };

  const dequeue = () => {
    if (queue.length === 0) {
      toast({ title: "佇列已空", description: "沒有等待的元素", variant: "destructive" });
      return;
    }
    const removed = queue[0];
    setQueue(queue.slice(1));
    setOperationCount(operationCount + 1);
    toast({ title: "🚪 離開佇列", description: `${removed} 完成等待` });
  };

  const handleComplete = () => {
    if (operationCount >= 5 && !completed) {
      completeGate("gate-4");
      setCompleted(true);
      toast({ title: "🎉 關卡完成！", description: "你已掌握佇列的運作原理！" });
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
              佇列之門
            </h1>
            <p className="text-lg text-foreground/90">Queue - 先進先出 (FIFO)</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8 p-6 bg-card/40 rounded-lg border border-border">
          <h2 className="text-xl font-['Cinzel'] text-primary mb-3">廊道之序</h2>
          <p className="text-foreground/80 leading-relaxed">
            佇列之門維持著古老神殿的秩序。探險家們從入口進入，按照抵達順序依次通過，
            先到者先出。這種「先進先出」的原則，正是佇列的核心智慧。
          </p>
        </div>

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <img
              src={queueCorridor}
              alt="Queue Corridor"
              className="w-full h-48 object-cover rounded-lg opacity-80 mb-6"
            />

            {/* Queue Visualization */}
            <div className="p-6 bg-card/30 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">入口 (Rear)</p>
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="flex-1 px-6 relative">
                  <div className="h-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-border flex items-center gap-3 px-4 overflow-x-auto">
                    <AnimatePresence>
                      {queue.map((person, index) => (
                        <motion.div
                          key={`${person}-${index}`}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 50, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="min-w-[60px] h-14 bg-gradient-to-br from-primary/30 to-amber-glow/20 rounded-lg border border-primary flex items-center justify-center"
                        >
                          <span className="text-primary font-bold text-sm">{person}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {queue.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center w-full">
                        佇列為空
                      </p>
                    )}
                  </div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none"
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">出口 (Front)</p>
                  <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center">
                    <UserMinus className="w-8 h-8 text-secondary" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && input && (enqueue(input), setInput(""))}
                    placeholder="輸入探險家名稱"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                  <Button
                    onClick={() => {
                      if (input) {
                        enqueue(input);
                        setInput("");
                      }
                    }}
                    className="bg-primary/20 hover:bg-primary/30 text-primary"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    加入 Enqueue
                  </Button>
                </div>

                <Button
                  onClick={dequeue}
                  disabled={queue.length === 0}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  離開 Dequeue
                </Button>
              </div>

              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>佇列長度: {queue.length}</span>
                <span>操作次數: {operationCount}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Insights */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border mb-8">
          <h3 className="text-xl font-['Cinzel'] text-primary mb-4">佇列特性</h3>
          <ul className="space-y-2 text-foreground/80">
            <li>🚶 <strong>FIFO</strong>：First In First Out - 先進先出</li>
            <li>⚡ <strong>O(1) 操作</strong>：Enqueue 和 Dequeue 都是常數時間</li>
            <li>🎯 <strong>應用場景</strong>：任務排程、訊息佇列、廣度優先搜尋</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleComplete}
            disabled={operationCount < 5}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold disabled:opacity-50"
          >
            {completed ? "返回章節" : operationCount < 5 ? `至少操作 ${5 - operationCount} 次` : "完成挑戰"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter1Gate4;
