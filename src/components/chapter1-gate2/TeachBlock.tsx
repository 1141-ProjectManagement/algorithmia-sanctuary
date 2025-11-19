import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Box, Link as LinkIcon } from "lucide-react";
import arrayPillars from "@/assets/array-pillars.png";
import linkedBeads from "@/assets/linked-beads.png";

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
          容器的智慧
        </h2>
        <p className="text-foreground/70">理解兩種基礎資料結構的特性</p>
      </motion.div>

      {/* Array Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <Box className="w-12 h-12 text-primary flex-shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          <div className="flex-1">
            <h3 className="text-xl font-['Cinzel'] text-primary mb-3">
              石柱陣列 (Array)
            </h3>
            <img 
              src={arrayPillars} 
              alt="Array structure" 
              className="w-full max-w-md mb-4 rounded-lg"
            />
            <div className="space-y-3 text-foreground/80">
              <p>
                <strong className="text-primary">結構特性：</strong>
                連續記憶體空間，如同排列整齊的石柱
              </p>
              <p>
                <strong className="text-primary">讀取速度：</strong>
                O(1) - 透過索引可瞬間存取任意元素
              </p>
              <p>
                <strong className="text-primary">插入/刪除：</strong>
                O(n) - 需要移動後續所有元素
              </p>
              <p className="text-sm italic text-foreground/60">
                💡 適合：需要頻繁隨機存取的場景
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Linked List Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <LinkIcon className="w-12 h-12 text-primary flex-shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          <div className="flex-1">
            <h3 className="text-xl font-['Cinzel'] text-primary mb-3">
              珠鍊串列 (Linked List)
            </h3>
            <img 
              src={linkedBeads} 
              alt="Linked List structure" 
              className="w-full max-w-md mb-4 rounded-lg"
            />
            <div className="space-y-3 text-foreground/80">
              <p>
                <strong className="text-primary">結構特性：</strong>
                節點透過指標連結，如同靈活的珠鍊
              </p>
              <p>
                <strong className="text-primary">讀取速度：</strong>
                O(n) - 必須從頭依序遍歷至目標位置
              </p>
              <p>
                <strong className="text-primary">插入/刪除：</strong>
                O(1) - 只需調整指標，無需移動元素
              </p>
              <p className="text-sm italic text-foreground/60">
                💡 適合：需要頻繁插入刪除的場景
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-primary/10 p-6 rounded-lg border border-primary/30"
      >
        <h4 className="font-['Cinzel'] text-lg text-primary mb-3">
          🔑 關鍵洞察
        </h4>
        <ul className="space-y-2 text-foreground/80">
          <li>• <strong>Trade-off 權衡：</strong>沒有絕對最佳的資料結構</li>
          <li>• <strong>場景決定選擇：</strong>根據操作頻率選擇合適容器</li>
          <li>• <strong>記憶體連續性：</strong>Array 連續 vs Linked List 分散</li>
        </ul>
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
