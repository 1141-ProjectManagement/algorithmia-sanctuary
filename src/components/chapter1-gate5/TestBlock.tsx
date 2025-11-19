import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [slabs] = useState(Array.from({ length: 16 }, (_, i) => ({ id: i, value: i + 1 })));
  const [targetValue] = useState(13);
  const [searchedSlabs, setSearchedSlabs] = useState<number[]>([]);
  const [found, setFound] = useState(false);

  const searchSlab = (id: number) => {
    if (found) return;
    
    setSearchedSlabs([...searchedSlabs, id]);
    
    if (slabs[id].value === targetValue) {
      setFound(true);
      toast({ 
        title: "🎉 找到了！", 
        description: `經過 ${searchedSlabs.length + 1} 次搜尋找到目標` 
      });
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          石板搜尋挑戰
        </h2>
        <p className="text-foreground/70">找到刻有數字 {targetValue} 的石板</p>
      </motion.div>

      <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-center">
        <p className="text-foreground/80">
          目標: <strong className="text-primary text-2xl">{targetValue}</strong>
        </p>
        <p className="text-sm text-foreground/60 mt-2">
          搜尋次數: {searchedSlabs.length}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {slabs.map((slab) => {
          const isSearched = searchedSlabs.includes(slab.id);
          const isTarget = slab.value === targetValue && found;
          return (
            <motion.button
              key={slab.id}
              onClick={() => searchSlab(slab.id)}
              disabled={found || isSearched}
              whileHover={!found && !isSearched ? { scale: 1.05 } : {}}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                isTarget ? "bg-primary/30 border-primary shadow-[0_0_20px_rgba(212,175,55,0.8)]" :
                isSearched ? "bg-secondary/20 border-secondary/50" :
                "bg-card/50 border-border hover:border-primary/50"
              }`}
            >
              {isSearched || found ? slab.value : "?"}
            </motion.button>
          );
        })}
      </div>

      {found && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-primary/10 rounded-lg border border-primary/30"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-['Cinzel'] text-2xl text-primary mb-2">🎉 挑戰完成！</h3>
          <p className="text-foreground/80">你已完成起源聖殿的所有挑戰！</p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
