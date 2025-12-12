import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import arrayPillars from "@/assets/array-pillars.png";
import linkedBeads from "@/assets/linked-beads.png";
import { useAudioContext } from "@/contexts/AudioContext";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [arrayItems, setArrayItems] = useState([1, 2, 3, 4, 5]);
  const [linkedItems, setLinkedItems] = useState([1, 2, 3, 4, 5]);
  const [arrayTime, setArrayTime] = useState<number | null>(null);
  const [linkedTime, setLinkedTime] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { playClick } = useAudioContext();

  const insertArray = (index: number) => {
    playClick();
    const start = Date.now();
    const newItems = [...arrayItems];
    newItems.splice(index, 0, Math.floor(Math.random() * 100));
    setArrayItems(newItems);
    setArrayTime(Date.now() - start + Math.random() * 50 + 30); // Simulate O(n)
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const insertLinked = () => {
    playClick();
    const start = Date.now();
    const newItems = [Math.floor(Math.random() * 100), ...linkedItems];
    setLinkedItems(newItems);
    setLinkedTime(Date.now() - start + 5); // Simulate O(1)
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const reset = () => {
    playClick();
    setArrayItems([1, 2, 3, 4, 5]);
    setLinkedItems([1, 2, 3, 4, 5]);
    setArrayTime(null);
    setLinkedTime(null);
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
          容器實驗
        </h2>
        <p className="text-foreground/70">親手體驗兩種資料結構的操作差異</p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-center"
      >
        <p className="text-foreground/80">
          點擊下方的「插入元素」按鈕，觀察兩種資料結構的性能差異
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Array Demo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/30 p-6 rounded-lg border border-primary/20"
        >
          <h3 className="text-2xl font-['Cinzel'] text-primary mb-4 text-center">
            石柱陣列
          </h3>
          
          <img 
            src={arrayPillars} 
            alt="Array" 
            className="w-full max-w-[200px] mx-auto mb-4"
          />

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {arrayItems.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-primary/20 border-2 border-primary rounded flex items-center justify-center font-bold text-primary"
              >
                {item}
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-foreground/70 text-center">
              插入位置：中間 (索引 {Math.floor(arrayItems.length / 2)})
            </p>
            <Button
              onClick={() => insertArray(Math.floor(arrayItems.length / 2))}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              插入元素
            </Button>
            {arrayTime !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-3 bg-destructive/20 rounded border border-destructive/30"
              >
                <p className="text-lg font-bold text-destructive">
                  耗時: {arrayTime.toFixed(2)}ms
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  需要移動後續元素 (O(n))
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Linked List Demo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/30 p-6 rounded-lg border border-primary/20"
        >
          <h3 className="text-2xl font-['Cinzel'] text-primary mb-4 text-center">
            珠鍊串列
          </h3>
          
          <img 
            src={linkedBeads} 
            alt="Linked List" 
            className="w-full max-w-[200px] mx-auto mb-4"
          />

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {linkedItems.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center font-bold text-primary"
              >
                {item}
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-foreground/70 text-center">
              插入位置：開頭 (只需調整指標)
            </p>
            <Button
              onClick={insertLinked}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              插入元素
            </Button>
            {linkedTime !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-3 bg-green-500/20 rounded border border-green-500/30"
              >
                <p className="text-lg font-bold text-green-400">
                  耗時: {linkedTime.toFixed(2)}ms
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  僅調整指標 (O(1))
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center"
      >
        <Button
          onClick={reset}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          重置實驗
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
            ✨ 太好了！你已體驗過兩種資料結構的差異
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
