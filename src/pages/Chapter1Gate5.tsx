import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import stoneSlabs from "@/assets/stone-slabs.png";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate5 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter-1");
  
  const slabs = Array.from({ length: 16 }, (_, i) => ({ id: i, value: i + 1 }));
  const [targetValue] = useState(13);
  const [searchedSlabs, setSearchedSlabs] = useState<number[]>([]);
  const [found, setFound] = useState(false);
  const [completed, setCompleted] = useState(isGateCompleted("gate-5"));

  const searchSlab = (id: number) => {
    if (found) return;
    
    setSearchedSlabs([...searchedSlabs, id]);
    
    if (slabs[id].value === targetValue) {
      setFound(true);
      toast({ title: "🎉 找到了！", description: `經過 ${searchedSlabs.length + 1} 次搜尋找到目標` });
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!completed) {
      completeGate("gate-5");
      setCompleted(true);
      toast({
        title: "🎉 章節完成！",
        description: "你已完成起源聖殿的所有挑戰！",
      });
    }
    setTimeout(() => navigate("/chapter1"), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative h-[30vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${stoneTablet})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="relative z-10 container mx-auto px-4">
          <Button variant="ghost" className="mb-4 text-primary hover:text-primary/80" onClick={() => navigate("/chapter1")}>
            <ArrowLeft className="mr-2 h-4 w-4" />返回章節
          </Button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-['Cinzel'] text-4xl md:text-5xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">石板遺跡發掘廳</h1>
            <p className="text-lg text-foreground/90">線性搜尋 - Linear Search</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 p-6 bg-card/40 rounded-lg border border-border">
          <h2 className="text-xl font-['Cinzel'] text-primary mb-3">搜尋任務</h2>
          <p className="text-foreground/80">目標：找到刻有數字 <strong className="text-primary text-2xl">{targetValue}</strong> 的石板</p>
          <p className="text-sm text-muted-foreground mt-2">搜尋次數: {searchedSlabs.length}</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
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
                  isTarget ? "bg-primary/30 border-primary shadow-glow-gold" :
                  isSearched ? "bg-secondary/20 border-secondary/50" :
                  "bg-card/50 border-border hover:border-primary/50"
                }`}
              >
                {isSearched || found ? slab.value : "?"}
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/chapter1")} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold">
            {completed ? "返回章節總覽" : "繼續探索"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter1Gate5;
