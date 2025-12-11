import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowRight, BookOpen, Play, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChapterTheme } from "@/config/chapterThemes";

export interface SectionProgress {
  teach: boolean;
  demo: boolean;
  test: boolean;
}

export interface GateData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  algorithm?: string;
  route: string;
  backgroundImage?: string;
}

interface GateCardProps {
  gate: GateData;
  index: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  onClick: () => void;
  theme?: ChapterTheme;
  sections?: SectionProgress;
}

const GateCard = ({ gate, index, isCompleted, isUnlocked, onClick, theme, sections }: GateCardProps) => {
  const locked = !isUnlocked;
  
  // Default theme colors if not provided
  const accentColor = theme?.accentColor || "hsl(43, 74%, 53%)";
  const glowColor = theme?.glowColor || "rgba(212, 175, 55, 0.5)";
  const gradientFrom = theme?.gradientFrom || "hsl(43, 74%, 53%)";
  const gradientTo = theme?.gradientTo || "hsl(43, 74%, 40%)";

  // Calculate section completion count
  const completedSectionsCount = sections 
    ? [sections.teach, sections.demo, sections.test].filter(Boolean).length 
    : 0;
  const hasPartialProgress = completedSectionsCount > 0 && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`
          relative overflow-hidden transition-all duration-300 cursor-pointer group h-full
          bg-card/60 backdrop-blur-sm
          ${locked ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:scale-[1.02]"}
        `}
        style={{
          borderColor: isCompleted 
            ? `${accentColor}50` 
            : hasPartialProgress
              ? `${accentColor}30`
              : isUnlocked 
                ? `${accentColor}30` 
                : undefined,
          boxShadow: isCompleted 
            ? `0 0 20px ${glowColor}` 
            : undefined,
        }}
        onClick={onClick}
      >
        {/* Background Image */}
        {gate.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={gate.backgroundImage} 
              alt=""
              className={`w-full h-full object-cover transition-all duration-500 ${
                locked ? "grayscale opacity-30" : "opacity-40 group-hover:opacity-50 group-hover:scale-105"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/40" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {locked && (
            <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          {isCompleted && (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm animate-in fade-in zoom-in duration-500"
              style={{ background: `${accentColor}20` }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: accentColor }} />
            </div>
          )}
          {hasPartialProgress && !isCompleted && (
            <div 
              className="px-2 py-1 rounded-full flex items-center justify-center backdrop-blur-sm text-xs font-medium"
              style={{ background: `${accentColor}20`, color: accentColor }}
            >
              {completedSectionsCount}/3
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ 
                  background: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                {index + 1}
              </div>
              {gate.algorithm && (
                <div 
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: accentColor }}
                >
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

          {/* Section Progress Indicators */}
          {sections && isUnlocked && (
            <div className="flex items-center gap-3 pt-2 border-t border-border/50">
              <div className={`flex items-center gap-1 text-xs ${sections.teach ? 'text-green-500' : 'text-muted-foreground'}`}>
                <BookOpen className="w-3 h-3" />
                <span>教學</span>
                {sections.teach && <CheckCircle2 className="w-3 h-3" />}
              </div>
              <div className={`flex items-center gap-1 text-xs ${sections.demo ? 'text-green-500' : 'text-muted-foreground'}`}>
                <Play className="w-3 h-3" />
                <span>演示</span>
                {sections.demo && <CheckCircle2 className="w-3 h-3" />}
              </div>
              <div className={`flex items-center gap-1 text-xs ${sections.test ? 'text-green-500' : 'text-muted-foreground'}`}>
                <ClipboardCheck className="w-3 h-3" />
                <span>測驗</span>
                {sections.test && <CheckCircle2 className="w-3 h-3" />}
              </div>
            </div>
          )}

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
                className="w-full transition-colors"
                style={{ 
                  borderColor: `${accentColor}40`,
                  color: accentColor,
                }}
              >
                重新挑戰
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : hasPartialProgress ? (
              <Button
                className="w-full text-background"
                style={{ 
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                }}
              >
                繼續學習
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                className="w-full text-background"
                style={{ 
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                }}
              >
                開始探索
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>

        {/* Decorative gradient on hover */}
        <div 
          className="absolute inset-x-0 bottom-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      </Card>
    </motion.div>
  );
};

export default GateCard;
