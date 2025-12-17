import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, checkSubscription } = useSubscription();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (sessionId) {
      verifyPayment(sessionId)
        .then((result) => {
          if (result?.success) {
            setIsVerified(true);
            toast({
              title: "🎉 付款成功！",
              description: "歡迎成為冒險家，開始你的完整旅程吧！",
            });
          } else {
            toast({
              title: "付款驗證中",
              description: "請稍後刷新頁面確認狀態",
            });
          }
        })
        .catch((error) => {
          console.error("Verification error:", error);
          toast({
            title: "驗證失敗",
            description: "請聯繫客服確認付款狀態",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      // No session_id, just refresh subscription status
      checkSubscription().finally(() => {
        setIsVerifying(false);
        setIsVerified(true);
      });
    }
  }, [searchParams, verifyPayment, checkSubscription, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 border border-primary/30 rounded-2xl p-8 max-w-md text-center"
      >
        {isVerifying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="font-['Cinzel'] text-2xl text-primary mb-3">
              驗證付款中...
            </h2>
            <p className="text-muted-foreground">
              請稍候，正在確認您的付款狀態
            </p>
          </>
        ) : isVerified ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h2 className="font-['Cinzel'] text-2xl text-primary mb-3">
              歡迎成為冒險家！
            </h2>
            <p className="text-muted-foreground mb-6">
              你已成功解鎖全部 6 章 28 關卡。<br />
              準備好開始你的演算法探險之旅了嗎？
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/chapter2")}
                className="w-full bg-gradient-to-r from-primary to-primary/80"
                size="lg"
              >
                前往第二章
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                返回首頁
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-['Cinzel'] text-2xl text-primary mb-3">
              付款處理中
            </h2>
            <p className="text-muted-foreground mb-6">
              如果您已完成付款，請稍後刷新頁面。
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              刷新頁面
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
