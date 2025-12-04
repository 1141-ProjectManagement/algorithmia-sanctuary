import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import ScrollNav from "@/components/ScrollNav";
import { useChapterProgress } from "@/hooks/useChapterProgress";

import TeachBlock from "@/components/chapter4-gate5/TeachBlock";
import DemoBlock from "@/components/chapter4-gate5/DemoBlock";
import TestBlock from "@/components/chapter4-gate5/TestBlock";

const Chapter4Gate5 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter4");
  
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);

  const sections = ["互動演示", "實戰挑戰"];
  const sectionRefs = [demoRef, testRef];

  const progress = (completedSections.length / 3) * 100;

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleTeachComplete = () => {
    setShowTeachDialog(false);
    handleSectionComplete('teach');
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections(prev => [...prev, section]);
    }
  };

  const handleAllComplete = () => {
    completeGate("gate5");
    setTimeout(() => navigate("/chapter4"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Story Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="max-w-2xl bg-card/95 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Cinzel'] text-primary flex items-center gap-2">
              <Scroll className="w-6 h-6" />
              古老卷軸：全域視界
            </DialogTitle>
            <DialogDescription className="sr-only">
              Chapter 4 Gate 5 故事介紹
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 p-4 text-foreground"
            >
              <p className="text-lg leading-relaxed">
                你漂浮在「網絡聖殿」的最高點，眼前展開一個巨大的發光
                <span className="text-primary font-semibold">距離矩陣</span>與錯綜複雜的城市星盤。
              </p>
              <p className="leading-relaxed text-muted-foreground">
                矩陣中的格子隨著計算不斷閃爍，顏色從代表「遙遠」的<span className="text-destructive">深紅</span>
                逐漸轉變為代表「鄰近」的<span className="text-emerald-400">翠綠</span>。
              </p>
              <p className="leading-relaxed text-muted-foreground">
                守護者的聲音迴盪：「這是<span className="text-primary">全知之眼</span>——
                Floyd-Warshall 演算法。它嘗試將網絡中的每一個節點當作
                <span className="text-primary">中轉站</span>，檢查任意兩點之間的路徑是否能夠更短。」
              </p>
              <p className="leading-relaxed text-muted-foreground">
                「這是<span className="text-primary">動態規劃</span>的極致體現。
                但代價是 O(V³) 的時間複雜度——當網絡規模龐大時，維護成本會指數級增長。」
              </p>
              <div className="bg-primary/10 rounded-lg p-4 mt-4">
                <h4 className="font-['Cinzel'] text-primary mb-2">你的任務</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    理解核心狀態轉移方程式：D[i][j] = min(D[i][j], D[i][k] + D[k][j])
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    觀察三重迴圈（k, i, j）的運作機制
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    掌握如何利用鄰接矩陣初始化並迭代更新找出所有最短距離
                  </li>
                </ul>
              </div>
            </motion.div>
          </ScrollArea>
          <div className="pt-4">
            <Button
              type="button"
              onClick={handleStoryComplete}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              開始學習知識
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Teach Dialog */}
      <Dialog open={showTeachDialog} onOpenChange={setShowTeachDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-card/95 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Cinzel'] text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              知識卷軸：Floyd-Warshall
            </DialogTitle>
            <DialogDescription className="sr-only">
              Floyd-Warshall 核心概念教學
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <TeachBlock onComplete={handleTeachComplete} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/chapter4")}
            className="absolute top-4 left-4 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回章節
          </Button>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-['Cinzel'] text-primary mb-4"
          >
            全域視界
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Floyd-Warshall - 全對最短路徑
          </motion.p>

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStoryDialog(true)}
              className="border-primary/50 text-primary"
            >
              <Scroll className="w-4 h-4 mr-2" />
              重溫故事
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTeachDialog(true)}
              className="border-primary/50 text-primary"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              複習知識
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-primary/20 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {completedSections.length} / 3 完成
          </span>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* ScrollNav */}
      <ScrollNav
        sections={sections}
        currentSection={currentSection}
        onNavigate={(index) => {
          setCurrentSection(index);
          sectionRefs[index]?.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Demo Section */}
        <section ref={demoRef} className="scroll-mt-20">
          <h2 className="text-2xl font-['Cinzel'] text-primary mb-6 text-center">
            互動演示
          </h2>
          <DemoBlock onComplete={() => handleSectionComplete('demo')} />
        </section>

        {/* Test Section */}
        <section ref={testRef} className="scroll-mt-20">
          <h2 className="text-2xl font-['Cinzel'] text-primary mb-6 text-center">
            實戰挑戰
          </h2>
          <TestBlock onComplete={() => {
            handleSectionComplete('test');
            handleAllComplete();
          }} />
        </section>
      </div>
    </div>
  );
};

export default Chapter4Gate5;
