import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main golden glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, hsla(43, 74%, 49%, 0.15) 0%, hsla(43, 74%, 49%, 0.05) 40%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          left: position.x,
          top: position.y,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
      />
      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          background: "radial-gradient(circle, hsla(43, 74%, 49%, 0.25) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          left: position.x,
          top: position.y,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.3,
        }}
      />
    </motion.div>
  );
};

export default CursorGlow;
