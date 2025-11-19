import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const handleAllComplete = () => {
    onGateComplete?.();
  };

  const progress = (completedSections.length / 3) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Background */}
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              歡迎來到 Algorithmia 的入口——啟程之殿。這裡是文明的基石，刻滿了衡量智慧的古老尺規與最初的容器密碼。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">學習進度</span>
            {completedSections.length === 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-primary"
              >
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">關卡完成！</span>
              </motion.div>
            )}
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-8 p-6 bg-card/50 border border-primary/30 rounded-lg">
            <h2 className="text-2xl font-['Cinzel'] text-primary mb-3">關卡故事</h2>
            <p className="text-foreground/90 leading-relaxed">
              探險家首先需學會『效率之尺』，這是古文明用來評估所有機關運作速度的神秘符文。
              掌握這把尺規，你將能預測任何演算法的執行效能，這是探索更深層神殿的必備能力。
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem 
              value="teach" 
              className="border border-border bg-card/30 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 hover:bg-card/50 data-[state=open]:bg-card/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${completedSections.includes('teach') ? 'bg-primary shadow-glow-gold' : 'bg-muted'}`} />
                  <span className="text-xl font-['Cinzel'] text-primary">一、知識講解</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <TeachBlock onComplete={() => handleSectionComplete('teach')} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="demo" 
              className="border border-border bg-card/30 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 hover:bg-card/50 data-[state=open]:bg-card/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${completedSections.includes('demo') ? 'bg-primary shadow-glow-gold' : 'bg-muted'}`} />
                  <span className="text-xl font-['Cinzel'] text-primary">二、互動演示</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <DemoBlock onComplete={() => handleSectionComplete('demo')} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="test" 
              className="border border-border bg-card/30 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 hover:bg-card/50 data-[state=open]:bg-card/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${completedSections.includes('test') ? 'bg-primary shadow-glow-gold' : 'bg-muted'}`} />
                  <span className="text-xl font-['Cinzel'] text-primary">三、實戰挑戰</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <TestBlock 
                  onComplete={() => {
                    handleSectionComplete('test');
                    handleAllComplete();
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default Module1_1;
