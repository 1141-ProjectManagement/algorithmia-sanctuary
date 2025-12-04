"use client";
import { motion } from "framer-motion";
import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-column";
import { Sparkles } from "lucide-react";

const testimonials: Testimonial[] = [
  {
    text: "原本看到演算法就頭痛，沒想到透過這個平台的遊戲化學習，我居然開始期待每天的練習！現在面試白板題不再害怕了。",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "小雅",
    role: "台大資工系大三",
  },
  {
    text: "高中資訊競賽前用這個平台準備，3D 視覺化讓我真正理解了遞迴和樹狀結構，比課本有趣太多了！",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "阿翰",
    role: "建中高二學生",
  },
  {
    text: "轉職工程師最怕的就是演算法，這裡的互動式教學讓抽象概念變得具體，終於搞懂 Binary Search 了！",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Emily",
    role: "職場轉職新手",
  },
  {
    text: "身為非本科系的我，這個平台的漸進式設計讓我從零開始也能跟上，現在已經挑戰到圖論章節了！",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "志明",
    role: "政大經濟系大四",
  },
  {
    text: "準備 Google 面試時發現這個寶藏！每個演算法的動畫演示讓複雜的邏輯一目了然，大推！",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    name: "Jenny",
    role: "交大資工研究生",
  },
  {
    text: "教演算法給學弟妹時會推薦這個網站，遊戲化的關卡設計讓學習不再枯燥，進度追蹤也很有成就感。",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "Kevin",
    role: "成大資工系助教",
  },
  {
    text: "自學程式一年多，卡在演算法很久。這裡的神殿探險主題超吸引人，不知不覺就把排序演算法都學完了！",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    name: "小萱",
    role: "自學程式愛好者",
  },
  {
    text: "APCS 考試前兩週開始用，Stack 和 Queue 的視覺化讓我秒懂，成績進步超多！真的很感謝這個平台。",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "承恩",
    role: "師大附中高三",
  },
  {
    text: "工作後想精進 DSA，這個平台的實戰挑戰模式很適合有基礎想加強的人，程式碼即時反饋超棒！",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    name: "雅婷",
    role: "新創公司後端工程師",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section id="testimonials-section" className="py-16 md:py-24 relative overflow-hidden bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container z-10 mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[600px] mx-auto text-center"
        >
          <div className="flex justify-center">
            <div className="border border-primary/40 py-1.5 px-4 rounded-full bg-primary/10 backdrop-blur-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">學習者心聲</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-6 font-['Cinzel'] text-foreground">
            來自<span className="text-primary">探險者</span>的評價
          </h2>
          <p className="text-center mt-4 text-muted-foreground max-w-md">
            超過千位台灣學生與職場新人透過 Algorithmia 掌握演算法，聽聽他們怎麼說。
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 md:gap-6 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[600px] md:max-h-[700px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
