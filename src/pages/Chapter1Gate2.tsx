import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import TeachBlock from "@/components/chapter1-gate2/TeachBlock";
import DemoBlock from "@/components/chapter1-gate2/DemoBlock";
import TestBlock from "@/components/chapter1-gate2/TestBlock";
import ScrollNav from "@/components/ScrollNav";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate2 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter-1");

  // Dialog states
  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);
  const [storyCompleted, setStoryCompleted] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Scroll navigation
  const [currentSection, setCurrentSection] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const sections = ["互動演示", "實戰挑戰"];

  const handleStoryComplete = () => {
    setStoryCompleted(true);
    setShowStory(false);
    setShowTeach(true);
  };

  const handleTeachComplete = () => {
    setTeachCompleted(true);
    setShowTeach(false);
  };

  const handleDemoComplete = () => {
    setDemoCompleted(true);
  };

  const handleTestComplete = () => {
    setTestCompleted(true);
    completeGate("gate-2");
    setTimeout(() => navigate("/chapter1"), 1500);
  };

  const handleNavigate = (index: number) => {
    const refs = [demoRef, testRef];
    refs[index].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const demoTop = demoRef.current?.getBoundingClientRect().top ?? 0;
      const testTop = testRef.current?.getBoundingClientRect().top ?? 0;
      const windowHeight = window.innerHeight;

      if (testTop < windowHeight / 2) {
        setCurrentSection(1);
      } else if (demoTop < windowHeight / 2) {
        setCurrentSection(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${stoneTablet})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

        <div className="relative z-10 container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80"
            onClick={() => navigate("/chapter1")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回章節
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-['Cinzel'] text-4xl md:text-5xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              容器遺跡
            </h1>
            <p className="text-lg text-foreground/90">陣列 vs 鏈結串列</p>
          </motion.div>
        </div>
      </div>

      {/* Story Dialog */}
      <Dialog open={showStory} onOpenChange={setShowStory}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-card/95 backdrop-blur border-2 border-primary/30">
          <DialogTitle className="sr-only">容器遺跡故事</DialogTitle>
          <ScrollArea className="max-h-[80vh] p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                  容器遺跡的秘密
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>

              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  在古老神殿的深處，你發現了一個被遺忘的儲藏室。牆上刻著古老的銘文：
                </p>

                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary italic">
                  「智者選擇容器，如同工匠選擇工具。石柱堅固整齊，珠鍊靈活自如。
                  理解其性，方能駕馭其力。」
                </div>

                <p>
                  你看見兩種截然不同的容器：
                </p>

                <ul className="space-y-3 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>
                      <strong className="text-primary">石柱陣列：</strong>
                      整齊排列的石柱，每根都有固定位置。你可以瞬間找到任意一根，
                      但要在中間插入新柱，必須移動後面所有的石柱。
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>
                      <strong className="text-primary">珠鍊串列：</strong>
                      水晶珠透過金色絲線連結。要找到特定珠子需從頭開始數，
                      但插入新珠只需解開一條線、接上即可。
                    </span>
                  </li>
                </ul>

                <p>
                  神殿的守護者告訴你：「每種容器都有其適合的場景。理解它們的本質，
                  才能在正確的時刻做出明智的選擇。」
                </p>

                <div className="bg-card/60 p-4 rounded-lg border border-border">
                  <p className="text-sm text-foreground/70 text-center">
                    💡 提示：這兩種容器代表了資料結構中最基礎的兩種形式——
                    <strong className="text-primary">連續記憶體</strong> 與 
                    <strong className="text-primary">鏈式結構</strong>
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={handleStoryComplete} size="lg">
                  進入知識殿堂
                </Button>
              </div>
            </motion.div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Teach Dialog */}
      <Dialog open={showTeach} onOpenChange={setShowTeach}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 bg-card/95 backdrop-blur border-2 border-primary/30">
          <DialogTitle className="sr-only">容器知識講解</DialogTitle>
          <ScrollArea className="max-h-[85vh]">
            <TeachBlock onComplete={handleTeachComplete} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Main Content - Demo & Test Sections */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Demo Section */}
        <section
          ref={demoRef}
          className="min-h-screen flex items-center justify-center mb-20"
        >
          <div className="w-full max-w-5xl bg-card/40 rounded-lg border border-primary/20 p-8">
            <DemoBlock onComplete={handleDemoComplete} />
          </div>
        </section>

        {/* Test Section */}
        <section
          ref={testRef}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="w-full max-w-5xl bg-card/40 rounded-lg border border-primary/20 p-8">
            <TestBlock onComplete={handleTestComplete} />
          </div>
        </section>
      </div>

      {/* Scroll Navigation */}
      {teachCompleted && (
        <ScrollNav
          sections={sections}
          currentSection={currentSection}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default Chapter1Gate2;
