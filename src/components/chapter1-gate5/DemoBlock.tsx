import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const { toast } = useToast();
  const [array] = useState(Array.from({ length: 12 }, (_, i) => i + 1));
  const [target, setTarget] = useState(7);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [searchedIndices, setSearchedIndices] = useState<number[]>([]);
  const [found, setFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const startSearch = async () => {
    setIsSearching(true);
    setSearchedIndices([]);
    setFound(false);
    setCurrentIndex(null);

    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 3000);
    }

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      setSearchedIndices((prev) => [...prev, i]);
      
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (array[i] === target) {
        setFound(true);
        toast({
          title: "🎉 找到了！",
          description: `在索引 ${i} 找到目標值 ${target}，共搜尋 ${i + 1} 次`,
        });
        setIsSearching(false);
        return;
      }
    }

    toast({
      title: "❌ 未找到",
      description: `遍歷完整個陣列，未找到目標值 ${target}`,
      variant: "destructive",
    });
    setIsSearching(false);
  };

  const reset = () => {
    setSearchedIndices([]);
    setFound(false);
    setCurrentIndex(null);
    setIsSearching(false);
  };

  const changeTarget = () => {
    const newTarget = Math.floor(Math.random() * 12) + 1;
    setTarget(newTarget);
    reset();
  };

  return (
    <div className="space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          線性搜尋演示
        </h2>
        <p className="text-foreground/70">觀察逐一檢查的搜尋過程</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-center"
      >
        <p className="text-foreground/80 mb-2">
          目標值: <strong className="text-primary text-2xl">{target}</strong>
        </p>
        <p className="text-sm text-foreground/60">
          點擊「開始搜尋」觀察演算法如何從頭到尾逐一檢查
        </p>
      </motion.div>

      {/* Array Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/40 p-6 rounded-lg border border-primary/20"
      >
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
          {array.map((value, index) => {
            const isCurrent = currentIndex === index;
            const isSearched = searchedIndices.includes(index);
            const isTarget = found && value === target;

            return (
              <motion.div
                key={index}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  boxShadow: isCurrent 
                    ? "0 0 20px rgba(212,175,55,0.8)" 
                    : isTarget
                    ? "0 0 30px rgba(34,197,94,0.8)"
                    : "none",
                }}
                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                  transition-all duration-300
                  ${isTarget 
                    ? "bg-green-500/20 border-green-500" 
                    : isCurrent
                    ? "bg-primary/30 border-primary"
                    : isSearched
                    ? "bg-secondary/20 border-secondary/50"
                    : "bg-card/50 border-border"
                  }
                `}
              >
                <span className="text-2xl font-bold text-foreground">
                  {value}
                </span>
                {isCurrent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-primary mt-1"
                  >
                    <Search className="w-3 h-3" />
                  </motion.div>
                )}
                {isTarget && (
                  <span className="text-xs text-green-500 mt-1">找到!</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-sm text-foreground/70">
          <div>
            已檢查: <strong className="text-primary">{searchedIndices.length}</strong>
          </div>
          <div>
            陣列大小: <strong className="text-primary">{array.length}</strong>
          </div>
          {found && (
            <div className="text-green-500 font-semibold">
              ✓ 搜尋成功
            </div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button
          onClick={startSearch}
          disabled={isSearching || found}
          size="lg"
          className="min-w-[150px]"
        >
          <Play className="mr-2 h-4 w-4" />
          開始搜尋
        </Button>

        <Button
          onClick={reset}
          disabled={isSearching}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          重置
        </Button>

        <Button
          onClick={changeTarget}
          disabled={isSearching}
          variant="secondary"
          size="lg"
        >
          隨機目標
        </Button>
      </motion.div>

      {/* Completion Message */}
      {hasInteracted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-primary font-semibold">
            ✨ 太好了！你已體驗過線性搜尋的運作方式
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
