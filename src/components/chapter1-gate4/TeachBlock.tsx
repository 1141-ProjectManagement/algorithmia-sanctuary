import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRightLeft } from "lucide-react";
import queueCorridor from "@/assets/queue-corridor.png";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          佇列的智慧
        </h2>
        <p className="text-foreground/70">理解先進先出 (FIFO) 的運作原理</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <img 
          src={queueCorridor} 
          alt="Queue Corridor" 
          className="w-full max-w-md rounded-lg drop-shadow-lg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <ArrowRightLeft className="w-12 h-12 text-primary flex-shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-['Cinzel'] text-primary mb-3">
              佇列 (Queue) 的核心特性
            </h3>
            
            <div className="space-y-3 text-foreground/80">
              <div>
                <p className="font-semibold text-primary mb-2">🚪 結構特性</p>
                <p>佇列如同排隊隊伍，從後方進入，從前方離開。先到的人先服務。</p>
              </div>

              <div className="bg-primary/10 p-4 rounded border border-primary/20">
                <p className="font-semibold text-primary mb-2">⚡ 主要操作</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Enqueue (入列)：</strong>將元素加入佇列尾端 - O(1)</li>
                  <li>• <strong>Dequeue (出列)：</strong>移除佇列前端元素 - O(1)</li>
                  <li>• <strong>Front (查看)：</strong>查看前端元素但不移除 - O(1)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-primary mb-2">🎯 應用場景</p>
                <ul className="space-y-1 text-sm">
                  <li>• 作業系統的工作排程 (Task Scheduling)</li>
                  <li>• 網路資料傳輸緩衝區 (Buffer)</li>
                  <li>• 印表機列印佇列</li>
                  <li>• 廣度優先搜尋 (BFS)</li>
                  <li>• 訊息佇列系統 (Message Queue)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/10 p-6 rounded-lg border border-primary/30"
      >
        <h4 className="font-['Cinzel'] text-lg text-primary mb-3">
          🔑 FIFO (First In, First Out) 原則
        </h4>
        <div className="space-y-3 text-foreground/80">
          <p>
            想像在銀行排隊：<strong className="text-primary">先到的客戶先被服務</strong>，
            新來的客戶在隊伍後方等候。這就是佇列的核心精神——公平且有序。
          </p>
          <div className="bg-card/60 p-4 rounded border border-border">
            <p className="text-sm text-center">
              <code className="bg-background/50 px-2 py-1 rounded text-primary">
                Enqueue(A) → Enqueue(B) → Enqueue(C) → Dequeue() = A → Dequeue() = B
              </code>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <h4 className="font-['Cinzel'] text-lg text-primary mb-3">
          ⚖️ 佇列 vs 堆疊
        </h4>
        <div className="space-y-2 text-foreground/80 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-3 rounded">
              <p className="font-semibold text-primary mb-1">佇列 (Queue)</p>
              <p className="text-xs">FIFO - 先進先出</p>
              <p className="text-xs mt-1">像排隊一樣公平</p>
            </div>
            <div className="bg-secondary/10 p-3 rounded">
              <p className="font-semibold text-secondary mb-1">堆疊 (Stack)</p>
              <p className="text-xs">LIFO - 後進先出</p>
              <p className="text-xs mt-1">像疊盤子一樣</p>
            </div>
          </div>
          <p className="italic text-foreground/60 text-center mt-3">
            💡 兩者都是線性結構，但存取順序完全相反
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleComplete}
          disabled={completed}
          size="lg"
          className="min-w-[200px]"
        >
          {completed ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              已完成學習
            </>
          ) : (
            "完成知識學習"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
