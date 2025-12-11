import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter2-gate2/TeachBlock";
import DemoBlock from "@/components/chapter2-gate2/DemoBlock";
import TestBlock from "@/components/chapter2-gate2/TestBlock";
import type { SectionType } from "@/lib/auth";

const Chapter2Gate2 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections } = useChapterProgress("chapter2");
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
      setTimeout(() => navigate("/chapter2"), 1500);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeach(false);
  };

  return (
    <>
      <GatePageLayout
        title="分治殿堂"
        subtitle="Merge Sort & Quick Sort - 分而治之的藝術"
        backgroundImage="/placeholder.svg"
        returnPath="/chapter2"
        onShowStory={() => setShowStory(true)}
        onShowTeach={sections.teach ? () => setShowTeach(true) : undefined}
        showScrollNav={sections.teach}
        sections={["互動演示", "實戰挑戰"]}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={{ completed: completedCount, total: 3 }}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="觀察分而治之的遞迴樹狀結構"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="驗證你對分治演算法的理解"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStory}
        onOpenChange={setShowStory}
        title="古老卷軸：分治殿堂"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-muted-foreground">
          <p>
            你踏入了一座充滿未來感的巨大殿堂。殿堂中央懸浮著巨大的「光束樹狀構造」——
            這不是植物，而是數據流動的實體化。
          </p>
          <p>
            光束從頂端射入，經過無數個「分光稜鏡」被拆解成細小的光流，
            最終在底部匯聚成純淨的金色光柱。
          </p>
          <p className="text-primary italic">
            「分而治之，是古老智者應對龐大挑戰的秘法。」
          </p>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
            <h4 className="font-semibold text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                理解遞迴的視覺化結構：樹狀圖的展開與回溯
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                區分 Merge Sort 與 Quick Sort 的策略差異
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                掌握 O(n log n) 的效率優勢
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeach}
        onOpenChange={setShowTeach}
        title="知識卷軸：分而治之"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>
    </>
  );
};

export default Chapter2Gate2;
