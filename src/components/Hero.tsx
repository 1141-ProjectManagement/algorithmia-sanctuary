import { Button } from "@/components/ui/button";
import { Circle, Triangle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(30, 20%, 8%) 0%, hsl(0, 0%, 4%) 100%)'
        }}
      />
      
      {/* Temple pillars - left */}
      <div className="absolute left-8 md:left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold to-transparent opacity-30" />
      
      {/* Temple pillars - right */}
      <div className="absolute right-8 md:right-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-temple-gold to-transparent opacity-30" />
      
      {/* Geometric decorations */}
      <div className="absolute top-20 left-1/4 w-16 h-16 opacity-20">
        <Circle className="w-full h-full text-temple-gold animate-pulse-glow" />
      </div>
      <div className="absolute bottom-32 right-1/4 w-12 h-12 opacity-20">
        <Triangle className="w-full h-full text-lapis animate-float-gentle" />
      </div>
      
      {/* Glowing orb - center top */}
      <div 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(45, 100%, 50%) 0%, transparent 70%)',
          boxShadow: '0 0 60px hsla(45, 100%, 50%, 0.6)'
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in-up">
        {/* Title with gold gradient effect */}
        <h1 
          className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wider"
          style={{
            background: 'linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px hsla(45, 100%, 50%, 0.3)',
          }}
        >
          ALGORITHMIA
          <br />
          EXPEDITION
        </h1>
        
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-temple-gold to-transparent" />
          <Circle className="w-3 h-3 text-temple-gold animate-pulse-glow" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-temple-gold to-transparent" />
        </div>
        
        {/* Subtitle */}
        <p className="font-inter text-xl md:text-2xl text-foreground/80 mb-12 tracking-wide">
          穿越神殿之門，習得古老智慧
        </p>
        
        {/* CTA Button */}
        <Button 
          size="lg"
          className="font-cinzel text-lg px-12 py-6 bg-transparent border-2 border-temple-gold text-temple-gold hover:bg-temple-gold hover:text-temple-black transition-all duration-300 shadow-glow-gold hover:shadow-glow-gold-intense"
        >
          啟封神殿
        </Button>
        
        {/* Bottom decorative elements */}
        <div className="mt-20 flex items-center justify-center gap-8 opacity-50">
          <div className="w-px h-16 bg-gradient-to-b from-temple-gold to-transparent" />
          <Circle className="w-2 h-2 text-temple-gold" />
          <div className="w-px h-16 bg-gradient-to-b from-temple-gold to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
