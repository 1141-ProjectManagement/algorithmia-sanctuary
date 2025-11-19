import { Button } from "@/components/ui/button";
import { Circle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
const Hero = () => {
  const scrollToRealms = () => {
    const realmsSection = document.getElementById("realms-section");
    realmsSection?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section id="hero-section" className="relative h-screen flex items-center justify-center overflow-hidden" aria-label="Hero introduction">
      {/* Radial gradient background */}
      <div className="absolute inset-0 z-0" style={{
      background: "radial-gradient(ellipse at center, hsl(30, 20%, 8%) 0%, hsl(0, 0%, 4%) 100%)"
    }} />

      {/* Temple pillars - left */}
      <div className="absolute left-8 md:left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold to-transparent opacity-30" />

      {/* Temple pillars - right */}
      <div className="absolute right-8 md:right-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold to-transparent opacity-30" />

      {/* Geometric decorations */}
      <div className="absolute top-20 left-1/4 w-16 h-16 opacity-20">
        
      </div>
      <div className="absolute bottom-32 right-1/4 w-12 h-12 opacity-20">
        
      </div>

      {/* Glowing orb - center top */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-40 blur-3xl" style={{
      background: "radial-gradient(circle, hsl(45, 100%, 50%) 0%, transparent 70%)",
      boxShadow: "0 0 60px hsla(45, 100%, 50%, 0.6)"
    }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Title with gold gradient effect */}
        <motion.h1 initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="font-cinzel text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wider" style={{
        background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 10px hsla(45, 100%, 50%, 0.8), 0 0 20px hsla(45, 100%, 50%, 0.5), 0 0 40px hsla(45, 100%, 50%, 0.3), 0 0 60px hsla(45, 100%, 50%, 0.2)"
      }}>
          ALGORITHMIA
          <br />
          EXPEDITION
        </motion.h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-temple-gold to-transparent" />
          <Circle className="w-3 h-3 text-temple-gold animate-pulse-glow" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-temple-gold to-transparent" />
        </div>

        {/* Subtitle */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }} className="font-inter text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          探索演算法的古老智慧，穿越六座神聖聖殿，解鎖計算思維的奧秘
        </motion.p>

        {/* CTA Button */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5
      }}>
          <Button size="lg" onClick={scrollToRealms} className="font-cinzel text-lg px-10 py-7 relative group overflow-hidden border-0" style={{
          background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)"
        }}>
            {/* Animated glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent)",
            animation: "pulse 2s ease-in-out infinite"
          }} />

            <span className="relative z-10 flex items-center gap-3 text-background font-semibold">
              <Sparkles className="w-5 h-5" />
              開始探索之旅
              <span className="text-sm font-inter ml-2">Start Your Expedition</span>
            </span>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
      </div>
    </section>;
};
export default Hero;