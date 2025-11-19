import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Scroll } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ScrollNav from "@/components/ScrollNav";
import TeachBlock from "@/components/module1-1/TeachBlock";
import DemoBlock from "@/components/module1-1/DemoBlock";
import TestBlock from "@/components/module1-1/TestBlock";
import stoneTablet from "@/assets/stone-tablet.jpg";

interface Module1_1Props {
  onGateComplete?: () => void;
  returnPath?: string;
}

const Module1_1 = ({ onGateComplete, returnPath = "/" }: Module1_1Props = {}) => {
  const navigate = useNavigate();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);

  const sections = ["互動演示", "實戰挑戰"];
  const sectionRefs = [demoRef, testRef];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleTeachComplete = () => {
    handleSectionComplete('teach');
    setShowTeachDialog(false);
  };

  const handleAllComplete = () => {
    onGateComplete?.();
  };

  const progress = (completedSections.length / 3) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Story Dialog - Ancient Scroll */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] p-0 border-2 border-primary/40 bg-gradient-to-b from-card to-card/80">
          <ScrollArea className="max-h-[80vh] p-8">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <Scroll className="w-8 h-8 text-primary" />
                <DialogTitle className="text-3xl font-['Cinzel'] text-primary">
                  古老卷軸：尺規神殿
                </DialogTitle>
              </motion.div>
              <DialogDescription className="sr-only">
                關卡故事介紹
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-foreground/90"
            >
              <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="text-xl font-['Cinzel'] text-primary mb-3">Big O 時間複雜度</h3>
                <p className="leading-relaxed mb-4">
                  歡迎來到 Algorithmia 的入口——啟程之殿。這裡是文明的基石，刻滿了衡量智慧的古老尺規與最初的容器密碼。
                </p>
                <p className="leading-relaxed">
                  探險家首先需學會『效率之尺』，這是古文明用來評估所有機關運作速度的神秘符文。
                  掌握這把尺規，你將能預測任何演算法的執行效能，這是探索更深層神殿的必備能力。
                </p>
              </div>

              <div className="p-6 bg-card/60 rounded-lg border border-border">
                <h4 className="text-lg font-semibold text-primary mb-3">你的任務</h4>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>學習 Big O 符號的神秘語言</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>透過沙漏水晶觀察不同演算法的執行速度</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>挑戰實戰測驗，證明你的理解</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleStoryComplete}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  開始學習知識
                </Button>
              </div>
            </motion.div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Teach Dialog - Knowledge Scroll */}
      <Dialog open={showTeachDialog} onOpenChange={setShowTeachDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 border-2 border-primary/40 bg-gradient-to-b from-card to-card/80">
          <ScrollArea className="max-h-[85vh] p-8">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <BookOpen className="w-8 h-8 text-primary" />
                <DialogTitle className="text-3xl font-['Cinzel'] text-primary">
                  知識卷軸：效率之尺
                </DialogTitle>
              </motion.div>
              <DialogDescription className="sr-only">
                Big O 時間複雜度知識講解
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <TeachBlock onComplete={handleTeachComplete} />
              
              <div className="flex justify-center pt-6 border-t border-border">
                <Button
                  size="lg"
                  onClick={handleTeachComplete}
                  disabled={!completedSections.includes('teach')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold disabled:opacity-50"
                >
                  完成學習，開始挑戰
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${stoneTablet})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        
        <div className="relative z-10 container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80"
            onClick={() => navigate(returnPath)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回{returnPath === "/" ? "首頁" : "章節"}
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-['Cinzel'] text-4xl md:text-6xl font-bold text-primary mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              尺規神殿
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-2">
              Big O 時間複雜度
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowStoryDialog(true)}
                className="border-primary/50 hover:bg-primary/10"
              >
                <Scroll className="mr-2 h-4 w-4" />
                重溫故事
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTeachDialog(true)}
                className="border-primary/50 hover:bg-primary/10"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                複習知識
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">學習進度</span>
            <span className="text-sm text-primary font-medium">
              {completedSections.length} / 3 完成
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-amber-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{ boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" }}
            />
          </div>
        </div>
      </div>

      {/* Scroll Navigation */}
      <ScrollNav
        sections={sections}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      {/* Interactive Demo Section */}
      <section
        ref={demoRef}
        className="min-h-screen flex items-center justify-center py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-['Cinzel'] text-primary mb-4">
                互動演示
              </h2>
              <p className="text-muted-foreground">
                觀察沙漏水晶的流動，感受不同複雜度的執行速度
              </p>
            </div>

            <div className="p-8 bg-card/50 rounded-lg border border-primary/30">
              <DemoBlock onComplete={() => handleSectionComplete('demo')} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Test Challenge Section */}
      <section
        ref={testRef}
        className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-background to-card/20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-['Cinzel'] text-primary mb-4">
                實戰挑戰
              </h2>
              <p className="text-muted-foreground">
                運用你的知識，判斷程式碼的時間複雜度
              </p>
            </div>

            <div className="p-8 bg-card/50 rounded-lg border border-primary/30">
              <TestBlock 
                onComplete={() => {
                  handleSectionComplete('test');
                  handleAllComplete();
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Module1_1;
