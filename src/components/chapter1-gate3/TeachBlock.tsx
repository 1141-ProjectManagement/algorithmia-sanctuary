import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Layers } from "lucide-react";
import stackTower from "@/assets/stack-tower.png";

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
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          堆疊的奧秘
        </h2>
        <p className="text-foreground/70">理解後進先出 (LIFO) 的運作原理</p>
      </motion.div>

      {/* Visual Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <img 
          src={stackTower} 
          alt="Stack Tower" 
          className="w-full max-w-sm rounded-lg drop-shadow-lg"
        />
      </motion.div>

      {/* Core Concept */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <Layers className="w-12 h-12 text-primary flex-shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-['Cinzel'] text-primary mb-3">
              堆疊 (Stack) 的核心特性
            </h3>
            
            <div className="space-y-3 text-foreground/80">
              <div>
                <p className="font-semibold text-primary mb-2">📚 結構特性</p>
                <p>堆疊如同疊放的盤子，只能從頂端操作。最後放入的元素會最先被取出。</p>
              </div>

              <div className="bg-primary/10 p-4 rounded border border-primary/20">
                <p className="font-semibold text-primary mb-2">⚡ 主要操作</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Push (推入)：</strong>將元素加入堆疊頂端 - O(1)</li>
                  <li>• <strong>Pop (彈出)：</strong>移除堆疊頂端元素 - O(1)</li>
                  <li>• <strong>Peek (窺視)：</strong>查看頂端元素但不移除 - O(1)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-primary mb-2">🎯 應用場景</p>
                <ul className="space-y-1 text-sm">
                  <li>• 括號匹配檢查 (編譯器語法分析)</li>
                  <li>• 函式呼叫堆疊 (Call Stack)</li>
                  <li>• 瀏覽器的上一頁/下一頁功能</li>
                  <li>• 文字編輯器的復原 (Undo) 功能</li>
                  <li>• 深度優先搜尋 (DFS)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* LIFO Principle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/10 p-6 rounded-lg border border-primary/30"
      >
        <h4 className="font-['Cinzel'] text-lg text-primary mb-3">
          🔑 LIFO (Last In, First Out) 原則
        </h4>
        <div className="space-y-3 text-foreground/80">
          <p>
            想像一疊盤子：你總是從最上面拿取盤子，也只能把新盤子放在最上面。
            <strong className="text-primary">最後放上去的盤子，會最先被拿走</strong>，
            這就是堆疊的核心精神。
          </p>
          <div className="bg-card/60 p-4 rounded border border-border">
            <p className="text-sm text-center">
              <code className="bg-background/50 px-2 py-1 rounded text-primary">
                Push(A) → Push(B) → Push(C) → Pop() = C → Pop() = B → Pop() = A
              </code>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Real-World Example */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <h4 className="font-['Cinzel'] text-lg text-primary mb-3">
          💡 經典案例：括號匹配
        </h4>
        <div className="space-y-3 text-foreground/80 text-sm">
          <p>檢查括號是否正確配對，是堆疊最經典的應用：</p>
          <div className="bg-background/50 p-4 rounded space-y-2 font-mono text-xs">
            <p className="text-green-400">✅ 正確: <code>{"({[]})"}</code></p>
            <p className="text-green-400">✅ 正確: <code>{"(())"}</code></p>
            <p className="text-destructive">❌ 錯誤: <code>{"({[}])"}</code></p>
            <p className="text-destructive">❌ 錯誤: <code>{"(()"}</code></p>
          </div>
          <p className="italic text-foreground/60">
            💡 遇到左括號就 push，遇到右括號就 pop 並檢查是否匹配
          </p>
        </div>
      </motion.div>

      {/* Completion Button */}
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
