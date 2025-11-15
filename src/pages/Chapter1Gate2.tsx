import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, Play, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import arrayPillars from "@/assets/array-pillars.png";
import linkedBeads from "@/assets/linked-beads.png";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter-1");
  
  const [arrayItems, setArrayItems] = useState([1, 2, 3, 4, 5]);
  const [linkedItems, setLinkedItems] = useState([1, 2, 3, 4, 5]);
  const [arrayTime, setArrayTime] = useState(0);
  const [linkedTime, setLinkedTime] = useState(0);
  const [completed, setCompleted] = useState(isGateCompleted("gate-2"));

  const insertArray = (index: number) => {
    const start = Date.now();
    const newItems = [...arrayItems];
    newItems.splice(index, 0, Math.floor(Math.random() * 100));
    setArrayItems(newItems);
    setArrayTime(Date.now() - start + Math.random() * 50); // Simulate O(n)
  };

  const insertLinked = () => {
    const start = Date.now();
    const newItems = [Math.floor(Math.random() * 100), ...linkedItems];
    setLinkedItems(newItems);
    setLinkedTime(Date.now() - start + 5); // Simulate O(1)
  };

  const handleComplete = () => {
    if (!completed) {
      completeGate("gate-2");
      setCompleted(true);
      toast({
        title: "🎉 關卡完成！",
        description: "你已理解陣列與鏈結串列的差異！",
      });
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
              容器遺跡
            </h1>
            <p className="text-lg text-foreground/90">陣列 vs 鏈結串列</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 p-6 bg-card/40 rounded-lg border border-border">
          <h2 className="text-xl font-['Cinzel'] text-primary mb-3">遺跡故事</h2>
          <p className="text-foreground/80 leading-relaxed">
            在古老的神殿中，探險家發現兩種截然不同的寶石容器：一種是整齊排列的石柱（陣列），
            另一種是靈活連結的水晶珠鍊（鏈結串列）。每種容器都有其獨特的優勢與限制...
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Array */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-card/30 rounded-lg border border-primary/20"
          >
            <h3 className="text-2xl font-['Cinzel'] text-primary mb-4 text-center">
              石柱陣列 Array
            </h3>
            <img
              src={arrayPillars}
              alt="Array representation"
              className="w-full h-32 object-cover rounded mb-4 opacity-80"
            />
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">存取速度</span>
                <span className="text-primary font-bold">O(1) ⚡ 極快</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">插入/刪除</span>
                <span className="text-destructive font-bold">O(n) 🐌 較慢</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">記憶體</span>
                <span className="text-secondary">連續配置</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 min-h-[80px]">
              {arrayItems.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary/30 to-amber-glow/20 rounded border border-primary/50 flex items-center justify-center text-primary font-bold"
                >
                  {item}
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => insertArray(0)}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                插入到開頭（需移動全部）
              </Button>
              {arrayTime > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  耗時: {arrayTime.toFixed(1)}ms
                </p>
              )}
            </div>
          </motion.div>

          {/* Linked List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-card/30 rounded-lg border border-secondary/20"
          >
            <h3 className="text-2xl font-['Cinzel'] text-secondary mb-4 text-center">
              珠鍊串列 Linked List
            </h3>
            <img
              src={linkedBeads}
              alt="Linked List representation"
              className="w-full h-32 object-cover rounded mb-4 opacity-80"
            />
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">存取速度</span>
                <span className="text-destructive font-bold">O(n) 🐌 較慢</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">插入/刪除</span>
                <span className="text-primary font-bold">O(1) ⚡ 極快</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">記憶體</span>
                <span className="text-secondary">分散配置</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 min-h-[80px]">
              {linkedItems.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary/30 to-lapis-blue/20 rounded-full border border-secondary/50 flex items-center justify-center text-secondary font-bold">
                    {item}
                  </div>
                  {index < linkedItems.length - 1 && (
                    <div className="absolute top-1/2 -right-2 w-2 h-0.5 bg-secondary/50" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <Button
                onClick={insertLinked}
                className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                插入到開頭（只改指標）
              </Button>
              {linkedTime > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  耗時: {linkedTime.toFixed(1)}ms
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Key Insights */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border mb-8">
          <h3 className="text-xl font-['Cinzel'] text-primary mb-4">關鍵洞察</h3>
          <ul className="space-y-2 text-foreground/80">
            <li>✅ <strong>陣列</strong>：隨機存取快速，但插入刪除需要移動元素</li>
            <li>✅ <strong>鏈結串列</strong>：插入刪除靈活，但存取需要循序遍歷</li>
            <li>💡 <strong>選擇策略</strong>：根據操作頻率選擇合適的資料結構</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
          >
            {completed ? "返回章節" : "完成挑戰"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chapter1Gate2;
