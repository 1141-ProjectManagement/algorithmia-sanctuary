import { Button } from "@/components/ui/button";
import { Circle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";

const Hero = () => {
  const scrollToRealms = () => {
    const realmsSection = document.getElementById("realms-section");
    realmsSection?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <section 
      id="hero-section" 
      className="relative h-screen flex items-center justify-center overflow-hidden" 
      aria-label="Hero introduction"
    >
      {/* SVG Filters for glass and glow effects */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f4d03f" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mesh Gradient Background - deep mystical temple atmosphere */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#080808", "#0d0a06", "#1a150a", "#0a0808"]}
        speed={0.08}
      />
      
      {/* Secondary mesh - subtle golden glow with mystical blue hint */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-25"
        colors={["#0a0a0a", "#8b7355", "#d4af37", "#1a1a2e"]}
        speed={0.05}
      />

      {/* Temple pillars - left */}
      <div className="absolute left-8 md:left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-40" />

      {/* Temple pillars - right */}
      <div className="absolute right-8 md:right-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-40" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Glowing orb - center top */}
      <div 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-50 blur-3xl" 
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          boxShadow: "0 0 80px hsla(var(--primary), 0.6)"
        }} 
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Announcement badge with glass effect */}
        <motion.div
          className="inline-flex items-center px-4 py-2 rounded-full bg-card/20 backdrop-blur-sm mb-8 relative border border-primary/20"
          style={{ filter: "url(#glass-effect)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
          <span className="text-foreground/90 text-sm font-medium tracking-wide">
            ✨ 探索六座神聖聖殿
          </span>
        </motion.div>

        {/* Title with enhanced gradient effect */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-cinzel text-5xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-wider leading-none"
        >
          <motion.span 
            className="block font-light text-foreground/80 text-3xl md:text-4xl lg:text-5xl mb-4 tracking-widest"
            style={{
              background: "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "url(#text-glow)",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Ancient Wisdom
          </motion.span>
          <span 
            className="block font-black drop-shadow-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(43, 74%, 60%) 50%, hsl(var(--primary)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px hsla(var(--primary), 0.5)"
            }}
          >
            ALGORITHMIA
          </span>
          <span className="block font-light text-foreground/70 italic text-4xl md:text-5xl lg:text-6xl mt-2">
            Expedition
          </span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <Circle className="w-3 h-3 text-primary animate-pulse-glow" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-inter text-lg md:text-xl text-foreground/60 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          探索演算法的古老智慧，穿越六座神聖聖殿，解鎖計算思維的奧秘
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex items-center justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              variant="outline"
              className="font-cinzel text-base px-8 py-6 border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm"
            >
              了解更多
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              onClick={scrollToRealms} 
              className="font-cinzel text-base px-10 py-6 relative group overflow-hidden border-0" 
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(43, 74%, 40%) 100%)",
                boxShadow: "0 0 40px hsla(var(--primary), 0.4), 0 10px 40px rgba(0, 0, 0, 0.3)"
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{
                  background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.3), transparent)"
                }} 
              />
              <span className="relative z-10 flex items-center gap-3 text-background font-semibold">
                <Sparkles className="w-5 h-5" />
                開始探索之旅
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Pulsing Border decoration - bottom right */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <PulsingBorder
            colors={["#d4af37", "#b8860b", "#f4d03f", "#c9a227", "#e6c200"]}
            colorBack="#00000000"
            speed={1.2}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
            }}
          />
          
          {/* Rotating text around the pulsing border */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transform: "scale(1.6)" }}
          >
            <defs>
              <path id="circle-path" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="text-[8px] fill-foreground/60 font-cinzel tracking-widest">
              <textPath href="#circle-path" startOffset="0%">
                ALGORITHMIA • EXPEDITION • ANCIENT WISDOM • EXPLORE •
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
