import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter1-gate3/TeachBlock";
import DemoBlock from "@/components/chapter1-gate3/DemoBlock";
import TestBlock from "@/components/chapter1-gate3/TestBlock";
import stoneTablet from "@/assets/stone-tablet.jpg";

const Chapter1Gate3 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter-1");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const handleStoryComplete = () => {
    setShowStory(false);
    setShowTeach(true);
  };

  const handleTeachComplete = () => {
    setTeachCompleted(true);
    if (!completedSections.includes("teach")) {
      setCompletedSections([...completedSections, "teach"]);
    }
    setShowTeach(false);
  };

  const handleDemoComplete = () => {
    if (!completedSections.includes("demo")) {
      setCompletedSections([...completedSections, "demo"]);
    }
  };

  const handleTestComplete = () => {
    if (!completedSections.includes("test")) {
      setCompletedSections([...completedSections, "test"]);
    }
    completeGate("gate-3");
    setTimeout(() => navigate("/chapter1"), 1500);
  };

  return (
    <>
      <GatePageLayout
        title="堆疊之塔"
        subtitle="Stack - 後進先出 (LIFO)"
        backgroundImage={stoneTablet}
        returnPath="/chapter1"
        onShowStory={() => setShowStory(true)}
        onShowTeach={() => setShowTeach(true)}
        showScrollNav={teachCompleted}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={{ completed: completedSections.length, total: 3 }}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="體驗堆疊的 Push 與 Pop 操作"
        >
          <DemoBlock onComplete={handleDemoComplete} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="運用堆疊知識解決實際問題"
          variant="gradient"
        >
          <TestBlock onComplete={handleTestComplete} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStory}
        onOpenChange={setShowStory}
        title="堆疊之塔"
        onComplete={handleStoryComplete}
      >
        <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="text-xl font-['Cinzel'] text-primary mb-3">堆疊之塔的考驗</h3>
          <p className="leading-relaxed mb-4">
            你來到一座高聳的古老之塔。守護者告訴你：此塔遵循「後進先出」的法則。
          </p>
          <div className="bg-card/60 p-4 rounded-lg border-l-4 border-primary italic mb-4">
            「最後放上的石磚，必須最先取下。這是秩序的真諦。」
          </div>
          <p className="leading-relaxed">
            這座塔只有一個入口，你只能從<strong className="text-primary">頂端</strong>放入或取出物品。
          </p>
        </div>

        <div className="p-6 bg-card/60 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-primary mb-3">你的任務</h4>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>理解 Stack 的 LIFO（後進先出）原理</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>掌握 Push（推入）與 Pop（彈出）操作</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>了解堆疊在程式中的實際應用</span>
            </li>
          </ul>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeach}
        onOpenChange={setShowTeach}
        title="堆疊的奧秘"
        onComplete={handleTeachComplete}
        isCompleted={teachCompleted}
      >
        <TeachBlock onComplete={() => setTeachCompleted(true)} />
      </TeachDialog>
    </>
  );
};

export default Chapter1Gate3;
