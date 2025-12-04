import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter6-gate3/TeachBlock";
import DemoBlock from "@/components/chapter6-gate3/DemoBlock";
import TestBlock from "@/components/chapter6-gate3/TestBlock";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import backgroundImage from "@/assets/realm-6-unity.jpg";

const Chapter6Gate3 = () => {
  const navigate = useNavigate();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter6");
  
  const [showStoryDialog, setShowStoryDialog] = useState(!isGateCompleted("gate3"));
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>(
    isGateCompleted("gate3") ? ["teach", "demo", "test"] : []
  );
  const [currentSection, setCurrentSection] = useState(0);

  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleTeachComplete = () => {
    setShowTeachDialog(false);
    if (!completedSections.includes("teach")) {
      setCompletedSections(prev => [...prev, "teach"]);
    }
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections(prev => [...prev, section]);
    }
    
    if (section === "test") {
      completeGate("gate3");
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentSection(index);
    const refs = [demoRef, testRef];
    refs[index]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="命運骰子"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-foreground/90">
          <p>
            進入終極聖所的核心區域，你發現這裡沒有固定的道路，只有漂浮在虛空中的巨大發光骰子與隨機閃爍的資料光柱。
          </p>
          <p>
            守護者的聲音在空間中迴盪：「傳統的決定性演算法，面對惡意構造的數據時，會陷入最壞情況的陷阱。但如果你學會擲出命運的骰子——引入隨機性——就能打破數據的規律，讓演算法在期望值上達到高效。」
          </p>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
            <h4 className="text-primary font-semibold mb-2">你的任務：</h4>
            <ul className="space-y-1 text-sm">
              <li>▸ 理解 Randomized Quicksort 的核心概念</li>
              <li>▸ 體驗隨機性如何破解 O(n²) 的最壞情況</li>
              <li>▸ 實作正確的隨機整數生成公式</li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="隨機化演算法原理"
        onComplete={handleTeachComplete}
        isCompleted={true}
      >
        <TeachBlock onComplete={handleTeachComplete} />
      </TeachDialog>

      <GatePageLayout
        title="命運骰子"
        subtitle="Randomized Algorithms - 隨機化演算法"
        backgroundImage={backgroundImage}
        returnPath="/chapter6"
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
        showScrollNav={true}
        sections={["互動演示", "實戰挑戰"]}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={{ completed: completedSections.length, total: 3 }}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="比較固定 Pivot 與隨機 Pivot 的效率差異"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="實作正確的隨機整數生成函數"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter6Gate3;
