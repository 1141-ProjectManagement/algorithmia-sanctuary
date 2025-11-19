import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search } from "lucide-react";
import stoneSlabs from "@/assets/stone-slabs.png";

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
          搜尋的藝術
        </h2>
        <p className="text-foreground/70">理解線性搜尋 (Linear Search) 的原理</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <img 
          src={stoneSlabs} 
          alt="Stone Slabs" 
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
          <Search className="w-12 h-12 text-primary flex-shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-['Cinzel'] text-primary mb-3">
              線性搜尋 (Linear Search) 的核心
            </h3>
            
            <div className="space-y-3 text-foreground/80">
              <div>
                <p className="font-semibold text-primary mb-2">🔍 搜尋方式</p>
                <p>從頭到尾依序檢查每個元素，直到找到目標或遍歷完整個陣列。</p>
              </div>

              <div className="bg-primary/10 p-4 rounded border border-primary/20">
                <p className="font-semibold text-primary mb-2">⏱️ 時間複雜度</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>最佳情況：</strong>O(1) - 目標在第一個位置</li>
                  <li>• <strong>平均情況：</strong>O(n) - 目標在中間某處</li>
                  <li>• <strong>最差情況：</strong>O(n) - 目標在最後或不存在</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-primary mb-2">✅ 優點</p>
                <ul className="space-y-1 text-sm">
                  <li>• 實作簡單直觀</li>
                  <li>• 適用於未排序的資料</li>
                  <li>• 不需要額外的資料結構</li>
                  <li>• 適合小型資料集</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-primary mb-2">⚠️ 缺點</p>
                <ul className="space-y-1 text-sm">
                  <li>• 效率較低，需要逐一檢查</li>
                  <li>• 資料量大時速度慢</li>
                  <li>• 無法利用資料的排序特性</li>
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
          🔑 演算法步驟
        </h4>
        <div className="space-y-3">
          <div className="bg-card/60 p-4 rounded border border-border">
            <pre className="text-sm text-foreground/80 overflow-x-auto">
{`function linearSearch(arr, target):
    for i from 0 to arr.length - 1:
        if arr[i] == target:
            return i  // 找到目標，回傳索引
    return -1  // 沒找到`}
            </pre>
          </div>
          <p className="text-sm text-foreground/70 italic">
            💡 逐個檢查，找到就立即回傳，遍歷完仍未找到則回傳 -1
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <h4 className="font-['Cinzel'] text-lg text-primary mb-3">
          🎯 適用場景
        </h4>
        <div className="space-y-2 text-foreground/80 text-sm">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span><strong>小型資料集：</strong>資料量不大時，線性搜尋已足夠</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span><strong>未排序資料：</strong>資料沒有特定順序時的唯一選擇</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span><strong>一次性搜尋：</strong>只需搜尋一次，不值得先排序</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span><strong>鏈結串列：</strong>無法使用二元搜尋的資料結構</span>
            </li>
          </ul>
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
