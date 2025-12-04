import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Code2, Target, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Images
import heroImage from "@/assets/about/about-hero.jpg";
import algorithmMasteryImage from "@/assets/about/card-algorithm-mastery.jpg";
import challengesImage from "@/assets/about/card-challenges.jpg";
import progressiveImage from "@/assets/about/card-progressive.jpg";

const About = () => {
  return (
    <section 
      id="about-section"
      className="min-h-screen flex flex-col justify-center px-6 py-16 md:py-24 relative overflow-hidden bg-background"
      aria-label="About Algorithmia Expedition"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(30, 20%, 8%) 0%, transparent 70%)'
        }}
      />

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            className="rounded-xl object-cover w-full h-[200px] md:h-[360px] shadow-2xl"
            src={heroImage}
            alt="Ancient temple with glowing algorithmic runes"
            style={{
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)'
            }}
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl font-cinzel font-semibold leading-snug"
          >
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)'
              }}
            >
              探索之旅
            </span>{" "}
            <span className="text-foreground/60">
              穿越七座神聖聖殿，解鎖古老的演算法智慧。
            </span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4 text-muted-foreground"
          >
            <p className="font-inter text-sm md:text-base leading-relaxed">
              Algorithmia Expedition 是一個遊戲化的演算法學習平台，透過互動式挑戰與漸進式學習路徑，
              讓你在古文明探險的主題中掌握計算思維的藝術。
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1 pr-1.5 border-temple-gold/50 text-temple-gold hover:bg-temple-gold/10 hover:border-temple-gold"
            >
              <Link to="/chapter1">
                <span>開始探索</span>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section with Cards */}
      <div className="mx-auto max-w-6xl space-y-12 px-0 mt-16 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 text-center md:grid-cols-2 md:gap-12 md:text-left"
        >
          <h2 
            className="text-3xl md:text-4xl font-cinzel font-semibold bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)'
            }}
          >
            核心特色
          </h2>
          <p className="text-muted-foreground font-inter">
            透過精心設計的遊戲化機制，將複雜的演算法概念轉化為有趣的探險挑戰，讓學習成為一場冒險。
          </p>
        </motion.div>

        {/* Cards Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LEFT BIG IMAGE - Algorithm Mastery */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:flex-1 relative group"
          >
            <div 
              className="rounded-xl overflow-hidden h-[300px] sm:h-[360px] md:h-full relative"
              style={{
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)'
              }}
            >
              <img
                src={algorithmMasteryImage}
                alt="Algorithm Mastery - Mystical Library"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Code2 
                    className="w-8 h-8 text-temple-gold"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.7))' }}
                  />
                  <h3 className="font-cinzel text-2xl font-bold text-temple-gold">演算法探索</h3>
                </div>
                <p className="text-xs text-temple-gold/70 italic mb-2">Algorithm Mastery</p>
                <p className="text-sm text-gray-200 leading-relaxed">
                  透過互動式學習，深入理解核心演算法概念。從基礎的排序搜尋到進階的圖論與動態規劃，
                  每個概念都有專屬的視覺化演示。
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT TWO CARDS */}
          <div className="flex flex-col gap-6 md:flex-1">
            {/* FIRST CARD - Real Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-xl bg-card shadow-lg group"
              style={{
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)'
              }}
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={challengesImage}
                  alt="Real Challenges - Temple Arena"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-card via-card/70 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Target 
                    className="w-5 h-5 text-temple-gold"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))' }}
                  />
                  <h3 className="font-cinzel text-lg font-bold text-temple-gold">實戰挑戰</h3>
                </div>
                <p className="text-xs text-temple-gold/60 italic mb-2">Real Challenges</p>
                <p className="text-sm text-muted-foreground">
                  在實際場景中應用所學，提升解題能力。每個關卡都設計了獨特的互動測驗。
                </p>
              </div>
            </motion.div>

            {/* SECOND CARD - Progressive Path */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-xl shadow-lg group"
              style={{
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)'
              }}
            >
              <img
                src={progressiveImage}
                alt="Progressive Path - Golden Stairway"
                className="h-full w-full object-cover min-h-[200px] sm:min-h-[220px] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Zap 
                    className="w-5 h-5 text-temple-gold"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))' }}
                  />
                  <h3 className="font-cinzel text-lg font-bold text-temple-gold">漸進式學習</h3>
                </div>
                <p className="text-xs text-temple-gold/60 italic mb-2">Progressive Path</p>
                <p className="text-sm text-gray-200">
                  從基礎到進階，系統化的學習旅程。六大章節循序漸進，層層解鎖新的知識領域。
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Community Feature Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="rounded-xl p-6 md:p-8 border border-temple-gold/20 bg-card/30 backdrop-blur-sm"
          style={{
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Users 
                className="w-16 h-16 text-temple-gold"
                style={{ filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.5))' }}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-cinzel text-xl font-bold text-temple-gold mb-1">社群協作</h3>
              <p className="text-xs text-temple-gold/60 italic mb-3">Community Driven</p>
              <p className="text-muted-foreground font-inter">
                與其他探索者分享經驗，共同成長。在這個學習社群中，你可以交流心得、互相激勵，
                一起揭開 Algorithmia 古文明的神秘面紗。
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-temple-gold/50 text-temple-gold hover:bg-temple-gold/10 hover:border-temple-gold"
            >
              <Link to="/chapter1">
                <span>加入探索</span>
                <ChevronRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
