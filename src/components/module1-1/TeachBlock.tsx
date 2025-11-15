import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import goldenRuler from "@/assets/golden-ruler.png";
import hourglassCrystal from "@/assets/hourglass-crystal.png";

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
    <div className="space-y-6">
      {/* Visual Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="flex items-center justify-center gap-8 p-8 bg-gradient-to-br from-card to-card/50 rounded-lg border border-primary/20">
          <img 
            src={hourglassCrystal} 
            alt="沙漏水晶 - 時間的象徵" 
            className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
          />
          <img 
            src={goldenRuler} 
            alt="黃金尺規 - 測量的工具" 
            className="w-48 h-24 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="p-6 bg-card/40 rounded-lg border border-border">
          <div className="flex items-start gap-3 mb-3">
            <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">為何需要效率之尺？</h3>
              <p className="text-foreground/80 leading-relaxed">
                在遠古的 Algorithmia 文明中，工程師們發現不同的機關執行速度差異極大。
                有些機關瞬間完成，有些卻需要等待漫長的時光。為了預測和比較這些機關的效能，
                他們創造了『Big O 符號』——一種用來描述演算法執行時間增長率的神秘語言。
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/30 cursor-pointer"
          >
            <h4 className="text-primary font-semibold mb-2">O(1) - 瞬息之速</h4>
            <p className="text-sm text-muted-foreground">
              無論資料多大，總是固定時間完成。如同打開一扇永遠就在眼前的門。
            </p>
            <div className="mt-3 text-xs font-mono bg-black/30 p-2 rounded">
              array[0] // 直接存取
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border border-secondary/30 cursor-pointer"
          >
            <h4 className="text-secondary font-semibold mb-2">O(n) - 線性之律</h4>
            <p className="text-sm text-muted-foreground">
              資料量增加，執行時間成正比增長。如同逐一檢查每個房間。
            </p>
            <div className="mt-3 text-xs font-mono bg-black/30 p-2 rounded">
              for (item in array)
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-gradient-to-br from-destructive/10 to-transparent rounded-lg border border-destructive/30 cursor-pointer"
          >
            <h4 className="text-destructive font-semibold mb-2">O(n²) - 倍增之咒</h4>
            <p className="text-sm text-muted-foreground">
              資料量翻倍，時間卻翻四倍。如同為每個房間再檢查所有其他房間。
            </p>
            <div className="mt-3 text-xs font-mono bg-black/30 p-2 rounded">
              nested loops
            </div>
          </motion.div>
        </div>

        <div className="p-6 bg-gradient-to-r from-amber-glow/5 to-primary/5 rounded-lg border border-primary/30">
          <p className="text-foreground/90 leading-relaxed">
            💡 <strong className="text-primary">古老智慧</strong>：
            Big O 只關注『增長趨勢』，而非精確數值。我們忽略常數和低階項，
            專注於當資料量趨向無限大時，演算法的表現如何。這就是為什麼 O(2n) 簡化為 O(n)，
            O(n² + n) 簡化為 O(n²)。
          </p>
        </div>
      </motion.div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleComplete}
          disabled={completed}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
        >
          {completed ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              已完成理解
            </>
          ) : (
            "我已理解概念"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
