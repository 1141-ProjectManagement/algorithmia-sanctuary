import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Scroll, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Opening Story Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-sm border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-['Cinzel'] text-primary">
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
            <Button onClick={() => setShowStoryDialog(false)} className="bg-primary hover:bg-primary/90">
              開始探索
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lore Fragment Dialog */}
      <Dialog open={showLoreDialog} onOpenChange={setShowLoreDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] bg-card/95 backdrop-blur-sm border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-['Cinzel'] text-primary">
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

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(40,50,194,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{templeName}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-['Cinzel']">
              第{chapterNumber}章：{chapterTitle}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {chapterDescription}
            </p>
            
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowStoryDialog(true)}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Scroll className="w-4 h-4 mr-2" />
                閱讀開場故事
              </Button>
              {isChapterCompleted && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoreDialog(true)}
                  className="border-accent/30 hover:bg-accent/10"
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
              <Progress value={progressPercentage} className="h-2" />
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
            className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/30 text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-primary" />
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
              className="bg-primary hover:bg-primary/90"
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
