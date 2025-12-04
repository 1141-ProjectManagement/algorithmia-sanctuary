import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Scroll, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChapterTheme, ChapterTheme } from "@/config/chapterThemes";

interface ChapterHubLayoutProps {
  // Chapter Info
  chapterNumber: number;
  templeName: string;
  chapterTitle: string;
  chapterDescription: string;
  
  // Progress
  completedCount: number;
  totalGates: number;
  isChapterCompleted: boolean;
  
  // Dialogs
  showStoryDialog: boolean;
  setShowStoryDialog: (show: boolean) => void;
  showLoreDialog: boolean;
  setShowLoreDialog: (show: boolean) => void;
  storyContent: ReactNode;
  loreContent: ReactNode;
  loreTitle?: string;
  
  // Completion
  completionTitle?: string;
  completionMessage?: ReactNode;
  
  // Children (Gates Grid)
  children: ReactNode;
}

const ChapterHubLayout = ({
  chapterNumber,
  templeName,
  chapterTitle,
  chapterDescription,
  completedCount,
  totalGates,
  isChapterCompleted,
  showStoryDialog,
  setShowStoryDialog,
  showLoreDialog,
  setShowLoreDialog,
  storyContent,
  loreContent,
  loreTitle = "古籍碎片",
  completionTitle,
  completionMessage,
  children,
}: ChapterHubLayoutProps) => {
  const navigate = useNavigate();
  const progressPercentage = (completedCount / totalGates) * 100;
  const theme = getChapterTheme(chapterNumber);

  return (
    <div className="min-h-screen bg-background">
      {/* Opening Story Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent 
          className="max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-sm"
          style={{ borderColor: `${theme.accentColor}30` }}
        >
          <DialogHeader>
            <DialogTitle 
              className="flex items-center gap-3 text-2xl font-['Cinzel']"
              style={{ color: theme.accentColor }}
            >
              <Scroll className="w-7 h-7" />
              古老卷軸：{templeName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              第{chapterNumber}章開場故事
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              {storyContent}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setShowStoryDialog(false)} 
              style={{ 
                background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
              className="text-background hover:opacity-90"
            >
              開始探索
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lore Fragment Dialog */}
      <Dialog open={showLoreDialog} onOpenChange={setShowLoreDialog}>
        <DialogContent 
          className="max-w-3xl max-h-[85vh] bg-card/95 backdrop-blur-sm"
          style={{ borderColor: `${theme.accentColor}30` }}
        >
          <DialogHeader>
            <DialogTitle 
              className="flex items-center gap-3 text-2xl font-['Cinzel']"
              style={{ color: theme.accentColor }}
            >
              <BookOpen className="w-7 h-7" />
              {loreTitle}
            </DialogTitle>
            <DialogDescription className="sr-only">
              章節結束古籍碎片
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-4">
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              {loreContent}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowLoreDialog(false)} variant="outline">
              關閉
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden border-b border-border/50">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={theme.image} 
            alt={templeName}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${theme.accentColor}20, transparent 50%)`,
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 text-foreground/70 hover:text-foreground bg-background/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            {/* Chapter Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-4"
              style={{ 
                background: `${theme.accentColor}15`,
                border: `1px solid ${theme.accentColor}30`,
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span className="text-sm font-medium" style={{ color: theme.accentColor }}>
                {templeName}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-['Cinzel']">
              第{chapterNumber}章：
              <span 
                className="block sm:inline"
                style={{
                  background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {chapterTitle}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {chapterDescription}
            </p>
            
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowStoryDialog(true)}
                className="backdrop-blur-sm"
                style={{ 
                  borderColor: `${theme.accentColor}40`,
                  color: theme.accentColor,
                }}
              >
                <Scroll className="w-4 h-4 mr-2" />
                閱讀開場故事
              </Button>
              {isChapterCompleted && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoreDialog(true)}
                  className="backdrop-blur-sm border-accent/30 hover:bg-accent/10"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  查看古籍碎片
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  章節進度
                </span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} / {totalGates} 關卡完成
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                    boxShadow: progressPercentage > 0 ? `0 0 10px ${theme.glowColor}` : 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>

        {/* Chapter Completion Message */}
        {isChapterCompleted && completionMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-8 rounded-2xl text-center space-y-6"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}10, ${theme.accentColor}05)`,
              border: `2px solid ${theme.accentColor}30`,
            }}
          >
            <div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center animate-pulse"
              style={{ background: `${theme.accentColor}20` }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: theme.accentColor }} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground font-['Cinzel']">
                🎉 {completionTitle || `${templeName}已被征服`}
              </h3>
              <div className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {completionMessage}
              </div>
            </div>
            <Button
              onClick={() => setShowLoreDialog(true)}
              style={{ 
                background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
              className="text-background hover:opacity-90"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              閱讀古籍碎片
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChapterHubLayout;
