import { motion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";

type BackgroundVariant = "hero" | "realms" | "about";

interface ShaderBackgroundProps {
  variant?: BackgroundVariant;
  particleCount?: number;
  showOrbs?: boolean;
}

const variantConfigs = {
  hero: {
    primary: { colors: ["#020202", "#050403", "#0a0806", "#030303"], speed: 0.12 },
    secondary: { colors: ["#000000", "#b8860b", "#ffd700", "#1a1a3a"], speed: 0.08, opacity: "opacity-40" },
    tertiary: { colors: ["#000000", "#8b6914", "#000000", "#2d1b00"], speed: 0.05, opacity: "opacity-25" },
    particles: 12,
    orbs: [
      { position: "top-12 left-1/2 -translate-x-1/2", size: "w-80 h-80", opacity: "opacity-60" },
      { position: "top-20 left-1/2 -translate-x-1/2", size: "w-48 h-48", opacity: "opacity-70", blur: "blur-2xl" },
    ],
  },
  realms: {
    primary: { colors: ["#020202", "#040404", "#080604", "#020202"], speed: 0.10 },
    secondary: { colors: ["#000000", "#a07830", "#e6be4d", "#12122a"], speed: 0.06, opacity: "opacity-35" },
    tertiary: { colors: ["#000000", "#705010", "#000000", "#1a1000"], speed: 0.04, opacity: "opacity-20" },
    particles: 8,
    orbs: [
      { position: "top-10 right-1/4", size: "w-56 h-56", opacity: "opacity-35" },
      { position: "bottom-20 left-1/5", size: "w-48 h-48", opacity: "opacity-25" },
    ],
  },
  about: {
    primary: { colors: ["#020202", "#030302", "#060504", "#020202"], speed: 0.08 },
    secondary: { colors: ["#000000", "#906820", "#daa520", "#151530"], speed: 0.05, opacity: "opacity-30" },
    tertiary: { colors: ["#000000", "#604010", "#000000", "#150a00"], speed: 0.03, opacity: "opacity-18" },
    particles: 10,
    orbs: [
      { position: "top-20 left-1/4", size: "w-64 h-64", opacity: "opacity-45" },
      { position: "bottom-20 right-1/4", size: "w-80 h-80", opacity: "opacity-35" },
    ],
  },
};

const ShaderBackground = ({ 
  variant = "hero", 
  particleCount,
  showOrbs = true 
}: ShaderBackgroundProps) => {
  const config = variantConfigs[variant];
  const particles = particleCount ?? config.particles;

  return (
    <>
      {/* Primary Mesh Gradient - Deep base layer */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={config.primary.colors}
        speed={config.primary.speed}
      />
      
      {/* Secondary Mesh Gradient - High contrast golden flow */}
      <MeshGradient
        className={`absolute inset-0 w-full h-full ${config.secondary.opacity}`}
        colors={config.secondary.colors}
        speed={config.secondary.speed}
      />

      {/* Tertiary Mesh Gradient - Additional depth layer */}
      <MeshGradient
        className={`absolute inset-0 w-full h-full ${config.tertiary.opacity}`}
        colors={config.tertiary.colors}
        speed={config.tertiary.speed}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(particles)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/60 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-20, -45, -20],
              x: [0, Math.random() * 25 - 12.5, 0],
              opacity: [0.15, 0.7, 0.15],
              scale: [0.4, 1.2, 0.4],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs - Enhanced intensity */}
      {showOrbs && config.orbs.map((orb, i) => (
        <div 
          key={i}
          className={`absolute ${orb.position} ${orb.size} rounded-full ${orb.opacity} ${orb.blur || 'blur-3xl'}`}
          style={{
            background: "radial-gradient(circle, hsl(48, 100%, 60%) 0%, hsl(45, 90%, 50%) 25%, hsl(43, 74%, 40%) 50%, transparent 75%)",
            boxShadow: "0 0 100px hsla(45, 100%, 50%, 0.4)",
          }} 
        />
      ))}

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </>
  );
};

export default ShaderBackground;
