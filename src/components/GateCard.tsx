import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface GateData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  algorithm?: string;
  route: string;
}

interface GateCardProps {
  gate: GateData;
  index: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}

const GateCard = ({ gate, index, isCompleted, isUnlocked, onClick }: GateCardProps) => {
  const locked = !isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`
          relative overflow-hidden transition-all duration-300 cursor-pointer group h-full
          ${locked ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:scale-[1.02]"}
          ${isCompleted ? "border-primary/50 bg-primary/5" : ""}
          ${isUnlocked && !isCompleted ? "border-accent/50 hover:border-accent" : ""}
        `}
        onClick={onClick}
      >
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {locked && (
            <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          {isCompleted && (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {index + 1}
              </div>
              {gate.algorithm && (
                <div className="text-xs font-medium text-primary uppercase tracking-wider">
                  {gate.algorithm}
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-foreground font-['Cinzel']">
              {gate.title}
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {gate.subtitle}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed min-h-[80px]">
            {gate.description}
          </p>

          {/* Action Button */}
          <div className="pt-2">
            {locked ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" />
                完成上一關卡以解鎖
              </div>
            ) : isCompleted ? (
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                重新挑戰
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                開始探索
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </motion.div>
  );
};

export default GateCard;
