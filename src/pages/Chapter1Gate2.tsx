import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter1-gate2/TeachBlock";
import DemoBlock from "@/components/chapter1-gate2/DemoBlock";
import TestBlock from "@/components/chapter1-gate2/TestBlock";
import stoneTablet from "@/assets/stone-tablet.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter1Gate2 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections } = useChapterProgress("chapter1");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);

  const sections = getGateSections("gate2");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleStoryComplete = () => {
    setShowStory(false);
    setShowTeach(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate2", section);
    if (section === "test") {
      setTimeout(() => navigate("/chapter1"), 1500);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeach(false);
  };

  return (
    <>
      <GatePageLayout
        title="容器遺跡"
        subtitle="陣列 vs 鏈結串列"
        backgroundImage={stoneTablet}
        returnPath="/chapter1"
        onShowStory={() => setShowStory(true)}
        onShowTeach={() => setShowTeach(true)}
        showScrollNav={sections.teach}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={{ completed: completedCount, total: 3 }}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="比較陣列與鏈結串列的操作效率"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="運用你的知識，選擇正確的資料結構"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStory}
        onOpenChange={setShowStory}
        title="容器遺跡"
        onComplete={handleStoryComplete}
      >
        <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="text-xl font-['Cinzel'] text-primary mb-3">容器遺跡的秘密</h3>
          <p className="leading-relaxed mb-4">
            在古老神殿的深處，你發現了一個被遺忘的儲藏室。牆上刻著古老的銘文：
          </p>
          <div className="bg-card/60 p-4 rounded-lg border-l-4 border-primary italic mb-4">
            「智者選擇容器，如同工匠選擇工具。石柱堅固整齊，珠鍊靈活自如。理解其性，方能駕馭其力。」
          </div>
          <p className="leading-relaxed">
            你看見兩種截然不同的容器：整齊排列的<strong className="text-primary">石柱陣列</strong>，
            以及靈活串連的<strong className="text-primary">珠鍊串列</strong>。
          </p>
        </div>

        <div className="p-6 bg-card/60 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-primary mb-3">你的任務</h4>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>理解陣列與鏈結串列的結構差異</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>比較兩者在不同操作下的效率表現</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>學會選擇適合場景的資料結構</span>
            </li>
          </ul>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeach}
        onOpenChange={setShowTeach}
        title="容器的奧秘"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>
    </>
  );
};

export default Chapter1Gate2;
