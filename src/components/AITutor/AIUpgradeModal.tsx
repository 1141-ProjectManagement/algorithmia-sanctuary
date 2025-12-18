import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Sparkles, Zap, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AIUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIUpgradeModal = ({ open, onOpenChange }: AIUpgradeModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/#pricing-section");
    // Scroll to pricing after navigation
    setTimeout(() => {
      document.getElementById("pricing-section")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-primary/30">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4"
          >
            <Bot className="w-8 h-8 text-primary" />
          </motion.div>
          <DialogTitle className="text-xl font-['Cinzel'] text-primary">
            解鎖 AI 助教
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            升級至冒險家方案，獲得專屬 AI 演算法導師
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: "即時演算法解答與指導" },
              { icon: Zap, text: "程式碼分析與優化建議" },
              { icon: Bot, text: "個人化學習建議" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Quota info */}
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-sm text-foreground">
              冒險家方案：<span className="text-primary font-semibold">每日 15 次</span> AI 提問
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            稍後再說
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={handleUpgrade}
          >
            立即升級
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
