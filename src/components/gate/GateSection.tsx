import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface GateSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient";
}

const GateSection = forwardRef<HTMLDivElement, GateSectionProps>(
  ({ title, description, children, className = "", variant = "default" }, ref) => {
    const bgClass = variant === "gradient" 
      ? "bg-gradient-to-b from-background to-card/20" 
      : "";

    return (
      <div
        ref={ref}
        className={`min-h-screen flex items-center justify-center py-20 ${bgClass} ${className}`}
      >
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-['Cinzel'] text-primary mb-4">
                {title}
              </h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            <div className="bg-card/40 rounded-lg border border-primary/20 p-8">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
);

GateSection.displayName = "GateSection";

export default GateSection;
