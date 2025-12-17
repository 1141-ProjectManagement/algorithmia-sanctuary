import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaywallOverlayProps {
  title?: string;
  description?: string;
}

const PaywallOverlay = ({ 
  title = "此內容僅限冒險家會員",
  description = "解鎖完整 6 章 28 關卡，開啟你的演算法探險之旅"
}: PaywallOverlayProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/", { state: { scrollTo: "pricing" } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card/80 border border-primary/30 rounded-2xl p-8 max-w-md text-center"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(212,175,55,0.3)",
              "0 0 40px rgba(212,175,55,0.5)",
              "0 0 20px rgba(212,175,55,0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Lock className="w-10 h-10 text-primary" />
        </motion.div>

        <h2 className="font-['Cinzel'] text-2xl text-primary mb-3">
          {title}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {description}
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            立即解鎖完整旅程
          </Button>
          
          <p className="text-xs text-muted-foreground">
            一次付款 NT$299，永久解鎖所有內容
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaywallOverlay;
