import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import TeachBlock from "@/components/chapter1-gate3/TeachBlock";
import DemoBlock from "@/components/chapter1-gate3/DemoBlock";
import TestBlock from "@/components/chapter1-gate3/TestBlock";
import ScrollNav from "@/components/ScrollNav";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate3 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter-1");
  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const sections = ["互動演示", "實戰挑戰"];

  const handleNavigate = (index: number) => {
    const refs = [demoRef, testRef];
    refs[index].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const demoTop = demoRef.current?.getBoundingClientRect().top ?? 0;
      const testTop = testRef.current?.getBoundingClientRect().top ?? 0;
      if (testTop < window.innerHeight / 2) setCurrentSection(1);
      else if (demoTop < window.innerHeight / 2) setCurrentSection(0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[30vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${stoneTablet})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="relative z-10 container mx-auto px-4">
          <Button variant="ghost" className="mb-4 text-primary" onClick={() => navigate("/chapter1")}>
            <ArrowLeft className="mr-2 h-4 w-4" />返回章節
          </Button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-['Cinzel'] text-4xl md:text-5xl font-bold text-primary mb-3">堆疊之塔</h1>
            <p className="text-lg">Stack - 後進先出 (LIFO)</p>
          </motion.div>
        </div>
      </div>

      <Dialog open={showStory} onOpenChange={setShowStory}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-card/95 backdrop-blur border-2 border-primary/30">
          <DialogTitle className="sr-only">堆疊之塔故事</DialogTitle>
          <ScrollArea className="max-h-[80vh] p-6">
            <div className="space-y-4 text-foreground/80">
              <h2 className="font-['Cinzel'] text-3xl text-primary text-center mb-4">堆疊之塔的考驗</h2>
              <p>你來到一座高聳的古老之塔。守護者告訴你：此塔遵循「後進先出」的法則...</p>
              <Button onClick={() => { setShowStory(false); setShowTeach(true); }} size="lg" className="w-full mt-6">進入知識殿堂</Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showTeach} onOpenChange={setShowTeach}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 bg-card/95">
          <DialogTitle className="sr-only">堆疊知識講解</DialogTitle>
          <ScrollArea className="max-h-[85vh]"><TeachBlock onComplete={() => { setTeachCompleted(true); setShowTeach(false); }} /></ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <section ref={demoRef} className="min-h-screen flex items-center justify-center mb-20">
          <div className="w-full max-w-5xl bg-card/40 rounded-lg border border-primary/20 p-8"><DemoBlock onComplete={() => {}} /></div>
        </section>
        <section ref={testRef} className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-5xl bg-card/40 rounded-lg border border-primary/20 p-8"><TestBlock onComplete={() => { completeGate("gate-3"); setTimeout(() => navigate("/chapter1"), 1500); }} /></div>
        </section>
      </div>

      {teachCompleted && <ScrollNav sections={sections} currentSection={currentSection} onNavigate={handleNavigate} />}
    </div>
  );
};

export default Chapter1Gate3;
