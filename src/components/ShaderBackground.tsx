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
    primary: { colors: ["#080808", "#0d0a06", "#1a150a", "#0a0808"], speed: 0.08 },
    secondary: { colors: ["#0a0a0a", "#8b7355", "#d4af37", "#1a1a2e"], speed: 0.05, opacity: "opacity-25" },
    particles: 12,
    orbs: [
      { position: "top-12 left-1/2 -translate-x-1/2", size: "w-72 h-72", opacity: "opacity-70" },
      { position: "top-24 left-1/2 -translate-x-1/2", size: "w-40 h-40", opacity: "opacity-80", blur: "blur-2xl" },
    ],
  },
  realms: {
    primary: { colors: ["#080808", "#0a0808", "#120e08", "#080808"], speed: 0.06 },
    secondary: { colors: ["#0a0a0a", "#6b5a3a", "#d4af37", "#1a1a2e"], speed: 0.04, opacity: "opacity-20" },
    particles: 8,
    orbs: [
      { position: "top-10 right-1/4", size: "w-48 h-48", opacity: "opacity-30" },
      { position: "bottom-20 left-1/5", size: "w-40 h-40", opacity: "opacity-20" },
    ],
  },
  about: {
    primary: { colors: ["#080808", "#0d0908", "#100c08", "#080808"], speed: 0.05 },
    secondary: { colors: ["#0a0a0a", "#4a3f2a", "#c9a227", "#1e1e3e"], speed: 0.03, opacity: "opacity-15" },
    particles: 10,
    orbs: [
      { position: "top-20 left-1/4", size: "w-56 h-56", opacity: "opacity-40" },
      { position: "bottom-20 right-1/4", size: "w-72 h-72", opacity: "opacity-30" },
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
      {/* Primary Mesh Gradient */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={config.primary.colors}
        speed={config.primary.speed}
      />
      
      {/* Secondary Mesh Gradient */}
      <MeshGradient
        className={`absolute inset-0 w-full h-full ${config.secondary.opacity}`}
        colors={config.secondary.colors}
        speed={config.secondary.speed}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(particles)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/50 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-15, -35, -15],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      {showOrbs && config.orbs.map((orb, i) => (
        <div 
          key={i}
          className={`absolute ${orb.position} ${orb.size} rounded-full ${orb.opacity} ${orb.blur || 'blur-3xl'}`}
          style={{
            background: "radial-gradient(circle, hsl(45, 100%, 55%) 0%, hsl(43, 74%, 45%) 30%, transparent 70%)",
          }} 
        />
      ))}
    </>
  );
};

export default ShaderBackground;
