import { motion } from "framer-motion";
import { ModernPricingPage, PricingCardProps } from "@/components/ui/animated-glassy-pricing";

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
    buttonText: "立即解鎖",
    isPopular: true,
    buttonVariant: "primary",
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

const Pricing = () => {
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
