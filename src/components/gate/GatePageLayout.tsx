import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Scroll, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollNav from "@/components/ScrollNav";
import { useAudioContext } from "@/contexts/AudioContext";
import { AITutorButton } from "@/components/AITutor";

interface GatePageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  backgroundImage: string;
  returnPath: string;
  returnLabel?: string;
  onShowStory?: () => void;
  onShowTeach?: () => void;
  showScrollNav?: boolean;
  sections?: string[];
  currentSection?: number;
  onNavigate?: (index: number) => void;
  progress?: {
    completed: number;
    total: number;
  };
}

const GatePageLayout = ({
  children,
  title,
  subtitle,
  backgroundImage,
  returnPath,
  returnLabel = "返回章節",
  onShowStory,
  onShowTeach,
  showScrollNav = false,
  sections = ["互動演示", "實戰挑戰"],
  currentSection = 0,
  onNavigate,
  progress,
}: GatePageLayoutProps) => {
  const navigate = useNavigate();
  const { playClick } = useAudioContext();

  const handleReturn = () => {
    playClick();
    navigate(returnPath);
  };

  const handleShowStory = () => {
    playClick();
    onShowStory?.();
  };

  const handleShowTeach = () => {
    playClick();
    onShowTeach?.();
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div
        className="relative h-[35vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

        <div className="relative z-10 container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80"
            onClick={handleReturn}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {returnLabel}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-['Cinzel'] text-4xl md:text-5xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              {title}
            </h1>
            <p className="text-lg text-foreground/90">{subtitle}</p>

            {(onShowStory || onShowTeach) && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {onShowStory && (
                  <Button
                    variant="outline"
                    onClick={handleShowStory}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    <Scroll className="mr-2 h-4 w-4" />
                    重溫故事
                  </Button>
                )}
                {onShowTeach && (
                  <Button
                    variant="outline"
                    onClick={handleShowTeach}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    複習知識
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">學習進度</span>
              <span className="text-sm text-primary font-medium">
                {progress.completed} / {progress.total} 完成
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-amber-glow"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {children}
      </div>

      {/* Scroll Navigation */}
      {showScrollNav && onNavigate && (
        <ScrollNav
          sections={sections}
          currentSection={currentSection}
          onNavigate={onNavigate}
        />
      )}

      {/* AI Tutor Button */}
      <AITutorButton context={title} />
    </div>
  );
};

export default GatePageLayout;
