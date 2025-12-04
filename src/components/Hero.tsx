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

  return (
    <section 
      id="hero-section" 
      className="relative h-screen flex items-center justify-center overflow-hidden" 
      aria-label="Hero introduction"
    >
      {/* Deep mystical gradient background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          background: "radial-gradient(ellipse at center, hsl(30, 15%, 6%) 0%, hsl(240, 10%, 3%) 50%, hsl(0, 0%, 2%) 100%)"
        }} 
      />

      {/* Ancient stone texture overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sacred geometry - large circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.08, scale: 1, rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="w-[800px] h-[800px] border border-temple-gold/30 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.06, scale: 1, rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] border border-temple-gold/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute w-[400px] h-[400px] border border-temple-gold/15 rounded-full"
        />
      </div>

      {/* Sacred geometry - hexagon pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hexPattern" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <polygon points="5,0 10,2.89 10,8.66 5,11.55 0,8.66 0,2.89" fill="none" stroke="hsl(43, 74%, 53%)" strokeWidth="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>

      {/* Corner ornaments - top left */}
      <div className="absolute top-8 left-8 w-32 h-32 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-temple-gold">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" opacity="0.6"/>
          <path d="M10 10 L30 10 L30 12 L12 12 L12 30 L10 30 Z" fill="currentColor" opacity="0.4"/>
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Corner ornaments - top right */}
      <div className="absolute top-8 right-8 w-32 h-32 opacity-20 pointer-events-none rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full text-temple-gold">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" opacity="0.6"/>
          <path d="M10 10 L30 10 L30 12 L12 12 L12 30 L10 30 Z" fill="currentColor" opacity="0.4"/>
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Corner ornaments - bottom left */}
      <div className="absolute bottom-8 left-8 w-32 h-32 opacity-20 pointer-events-none -rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full text-temple-gold">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" opacity="0.6"/>
          <path d="M10 10 L30 10 L30 12 L12 12 L12 30 L10 30 Z" fill="currentColor" opacity="0.4"/>
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Corner ornaments - bottom right */}
      <div className="absolute bottom-8 right-8 w-32 h-32 opacity-20 pointer-events-none rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full text-temple-gold">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" opacity="0.6"/>
          <path d="M10 10 L30 10 L30 12 L12 12 L12 30 L10 30 Z" fill="currentColor" opacity="0.4"/>
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Floating ancient runes */}
      {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'].map((rune, index) => (
        <motion.div
          key={index}
          className="absolute text-temple-gold/10 font-bold text-4xl pointer-events-none select-none"
          style={{
            left: `${15 + index * 14}%`,
            top: `${20 + (index % 3) * 25}%`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.05, 0.15, 0.05], 
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
        >
          {rune}
        </motion.div>
      ))}

      {/* Mystical particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-temple-gold/30 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Temple pillars - left */}
      <div className="absolute left-8 md:left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold to-transparent opacity-20" />
      <div className="absolute left-12 md:left-28 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold/50 to-transparent opacity-10" />

      {/* Temple pillars - right */}
      <div className="absolute right-8 md:right-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold to-transparent opacity-20" />
      <div className="absolute right-12 md:right-28 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold/50 to-transparent opacity-10" />

      {/* Horizontal decorative lines */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-temple-gold/10 to-transparent" />
      <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-temple-gold/10 to-transparent" />

      {/* Glowing orb - center top */}
      <div 
        className="absolute top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-30 blur-3xl" 
        style={{
          background: "radial-gradient(circle, hsl(43, 74%, 50%) 0%, hsl(30, 60%, 30%) 40%, transparent 70%)",
          boxShadow: "0 0 80px hsla(43, 74%, 50%, 0.4)"
        }} 
      />

      {/* Secondary glow orbs */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle, hsl(240, 30%, 30%) 0%, transparent 70%)",
        }} 
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          background: "radial-gradient(circle, hsl(30, 40%, 25%) 0%, transparent 70%)",
        }} 
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, hsl(0, 0%, 0%) 100%)",
          opacity: 0.6
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Title with gold gradient effect */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="font-cinzel text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wider" 
          style={{
            background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 10px hsla(45, 100%, 50%, 0.8), 0 0 20px hsla(45, 100%, 50%, 0.5), 0 0 40px hsla(45, 100%, 50%, 0.3), 0 0 60px hsla(45, 100%, 50%, 0.2)"
          }}
        >
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
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} 
          className="font-inter text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          探索演算法的古老智慧，穿越六座神聖聖殿，解鎖計算思維的奧秘
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <Button 
            size="lg" 
            onClick={scrollToRealms} 
            className="font-cinzel text-lg px-10 py-7 relative group overflow-hidden border-0" 
            style={{
              background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
              boxShadow: "0 0 30px rgba(212, 175, 55, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)"
            }}
          >
            {/* Animated glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              style={{
                background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent)",
                animation: "pulse 2s ease-in-out infinite"
              }} 
            />

            <span className="relative z-10 flex items-center gap-3 text-background font-semibold">
              <Sparkles className="w-5 h-5" />
              開始探索之旅
              <span className="text-sm font-inter ml-2">Start Your Expedition</span>
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
