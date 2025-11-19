import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import TeachBlock from "@/components/chapter1-gate5/TeachBlock";
import DemoBlock from "@/components/chapter1-gate5/DemoBlock";
import TestBlock from "@/components/chapter1-gate5/TestBlock";
import ScrollNav from "@/components/ScrollNav";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate5 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter-1");

  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);

  const [currentSection, setCurrentSection] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const sections = ["互動演示", "實戰挑戰"];

  const handleStoryComplete = () => {
    setShowStory(false);
    setShowTeach(true);
  };

  const handleTeachComplete = () => {
    setTeachCompleted(true);
    setShowTeach(false);
  };

  const handleTestComplete = () => {
    completeGate("gate-5");
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
              石板遺跡
            </h1>
            <p className="text-lg text-foreground/90">Linear Search - 線性搜尋</p>
          </motion.div>
        </div>
      </div>

      {/* Story Dialog */}
      <Dialog open={showStory} onOpenChange={setShowStory}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-card/95 backdrop-blur border-2 border-primary/30">
          <DialogTitle className="sr-only">石板遺跡故事</DialogTitle>
          <ScrollArea className="max-h-[80vh] p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="font-['Cinzel'] text-3xl text-primary mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                  石板遺跡的挑戰
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>

              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  你來到神殿最後的試煉場——石板遺跡。這裡散落著數十塊刻有神秘數字的石板。
                </p>

                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary italic">
                  「探險家啊，在這些石板中找到特定的一塊。
                  沒有捷徑，沒有規律，只有最純粹的搜尋方式。」
                </div>

                <p>
                  守護者指向那些石板：
                </p>

                <ul className="space-y-3 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>
                      <strong className="text-primary">逐一檢查：</strong>
                      石板沒有排序，你必須從頭到尾依序檢查每一塊。
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>
                      <strong className="text-primary">耐心與堅持：</strong>
                      可能第一塊就是目標，也可能在最後一塊。這就是搜尋的本質。
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">▸</span>
                    <span>
                      <strong className="text-primary">簡單而有效：</strong>
                      雖然效率不是最高，但這是最直接、最可靠的方法。
                    </span>
                  </li>
                </ul>

                <p>
                  「這就是線性搜尋，」守護者說，「最基礎的搜尋演算法。
                  在沒有其他資訊的情況下，這是唯一的選擇。記住：簡單並不代表無用，
                  有時候最直接的方法就是最好的方法。」
                </p>

                <div className="bg-card/60 p-4 rounded-lg border border-border">
                  <p className="text-sm text-foreground/70 text-center">
                    💡 這是起源聖殿的最終試煉。完成它，你將掌握所有基礎知識！
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
          <DialogTitle className="sr-only">線性搜尋知識講解</DialogTitle>
          <ScrollArea className="max-h-[85vh]">
            <TeachBlock onComplete={handleTeachComplete} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <section
          ref={demoRef}
          className="min-h-screen flex items-center justify-center mb-20"
        >
          <div className="w-full max-w-5xl bg-card/40 rounded-lg border border-primary/20 p-8">
            <DemoBlock onComplete={() => {}} />
          </div>
        </section>

        <section
          ref={testRef}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="w-full max-w-5xl bg-card/40 rounded-lg border border-primary/20 p-8">
            <TestBlock onComplete={handleTestComplete} />
          </div>
        </section>
      </div>

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

export default Chapter1Gate5;
