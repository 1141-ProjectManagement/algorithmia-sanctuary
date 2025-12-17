import { motion } from "framer-motion";
import { ModernPricingPage, PricingCardProps } from "@/components/ui/animated-glassy-pricing";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { isPremium, startCheckout, isLoading } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAdventurerClick = async () => {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "請先登入",
        description: "購買冒險家方案需要先登入帳號",
        variant: "destructive",
      });
      return;
    }

    if (isPremium) {
      toast({
        title: "你已是冒險家！",
        description: "你已擁有完整存取權限",
      });
      navigate("/chapter2");
      return;
    }

    try {
      await startCheckout();
    } catch (error) {
      toast({
        title: "結帳失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      });
    }
  };

  const pricingPlans: PricingCardProps[] = [
    {
      planName: "探索者",
      description: "免費體驗，探索演算法的奧秘",
      price: "0",
      features: [
        "第 1 章節體驗內容",
        "Discord 社群討論區",
      ],
      buttonText: "免費開始",
      buttonVariant: "secondary",
      onButtonClick: () => {
        document.getElementById("realms-section")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      planName: "冒險家",
      description: "解鎖完整旅程，深入掌握演算法",
      price: "299",
      features: [
        "全 6 章節完整內容",
        "學習進度分析儀表板",
        "沈浸式語音導覽功能",
        "新開發章節存取權限",
      ],
      buttonText: isPremium ? "已解鎖" : (isLoading ? "載入中..." : "立即解鎖"),
      isPopular: true,
      buttonVariant: "primary",
      onButtonClick: handleAdventurerClick,
    },
    {
      planName: "大師",
      description: "為團隊或教育機構打造",
      price: "聯繫我們",
      features: [
        "多用戶團隊授權",
        "客製化課程內容",
        "專屬技術支援",
      ],
      buttonText: "聯繫諮詢",
      buttonVariant: "secondary",
    },
  ];

  return (
    <section
      id="pricing-section"
      className="min-h-screen relative"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ModernPricingPage
          title={
            <>
              選擇你的<span className="text-primary">學習之路</span>
            </>
          }
          subtitle="從免費探索開始，解鎖完整演算法旅程。靈活方案，適合各種學習需求。"
          plans={pricingPlans}
          showAnimatedBackground={true}
        />
      </motion.div>
    </section>
  );
};

export default Pricing;
