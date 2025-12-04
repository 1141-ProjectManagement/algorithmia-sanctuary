import { motion } from "framer-motion";
import { Code2, Target, Zap, Users } from "lucide-react";
import ShaderBackground from "./ShaderBackground";

const features = [
  {
    icon: Code2,
    title: "演算法探索",
    subtitle: "Algorithm Mastery",
    description: "透過互動式學習，深入理解核心演算法概念"
  },
  {
    icon: Target,
    title: "實戰挑戰",
    subtitle: "Real Challenges",
    description: "在實際場景中應用所學，提升解題能力"
  },
  {
    icon: Zap,
    title: "漸進式學習",
    subtitle: "Progressive Path",
    description: "從基礎到進階，系統化的學習旅程"
  },
  {
    icon: Users,
    title: "社群協作",
    subtitle: "Community Driven",
    description: "與其他探索者分享經驗，共同成長"
  }
];

const About = () => {
  return (
    <section 
      id="about-section"
      className="h-screen flex items-center justify-center px-6 relative overflow-hidden"
      aria-label="About Algorithmia Expedition"
    >
      {/* Shared Shader Background */}
      <ShaderBackground variant="about" />

      <div className="max-w-6xl mx-auto relative z-10 py-20">
        {/* Section title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 
            className="font-cinzel text-4xl md:text-6xl font-bold mb-4 inline-block relative"
            style={{
              background: 'linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            探索之旅
          </h2>
          <div 
            className="h-1 w-32 mx-auto mt-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(43, 74%, 53%), transparent)',
              boxShadow: '0 0 20px hsla(45, 100%, 50%, 0.5)'
            }}
          />
          <p className="font-inter text-lg text-foreground/70 mt-6 max-w-2xl mx-auto">
            Journey Through Ancient Algorithmic Wisdom
          </p>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-center mb-10"
        >
          <p className="font-inter text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-3xl mx-auto mb-4">
            踏上一場穿越七座神聖聖殿的史詩之旅，在每座神殿中解鎖古老的演算法智慧。
          </p>
          <p className="font-inter text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
            Embark on an epic journey through seven sacred temples, unlocking ancient algorithmic wisdom in each sanctuary. Master the art of computational thinking through gamified challenges and progressive learning paths.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: 0.3 + index * 0.1 
                }}
                className="relative group"
              >
                <div 
                  className="bg-card/30 backdrop-blur-sm border border-temple-gold/20 rounded-lg p-6 h-full transition-all duration-500 hover:border-temple-gold/50 hover:scale-105 focus-within:border-temple-gold/60 min-h-[200px]"
                  style={{
                    boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)',
                  }}
                  tabIndex={0}
                  role="article"
                  aria-label={feature.title}
                >
                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"
                    style={{
                      boxShadow: '0 0 25px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)'
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <Icon 
                      className="w-12 h-12 text-temple-gold mb-4 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        filter: 'drop-shadow(0 0 8px hsla(43, 74%, 53%, 0.7))'
                      }}
                    />
                    <h3 className="font-cinzel text-lg font-semibold text-temple-gold mb-1">
                      {feature.title}
                    </h3>
                    <p className="font-inter text-xs text-foreground/60 mb-3 italic">
                      {feature.subtitle}
                    </p>
                    <p className="font-inter text-sm text-foreground/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
