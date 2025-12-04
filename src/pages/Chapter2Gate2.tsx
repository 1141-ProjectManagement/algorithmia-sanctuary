import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter2-gate2/TeachBlock";
import DemoBlock from "@/components/chapter2-gate2/DemoBlock";
import TestBlock from "@/components/chapter2-gate2/TestBlock";

const Chapter2Gate2 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter-2");
  
  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const handleStoryComplete = () => {
    setShowStory(false);
    setShowTeach(true);
  };

  const handleTeachComplete = () => {
    setShowTeach(false);
    setTeachCompleted(true);
    if (!completedSections.includes('teach')) {
      setCompletedSections(prev => [...prev, 'teach']);
    }
  };

  const handleDemoComplete = () => {
    if (!completedSections.includes('demo')) {
      setCompletedSections(prev => [...prev, 'demo']);
    }
  };

  const handleTestComplete = () => {
    if (!completedSections.includes('test')) {
      setCompletedSections(prev => [...prev, 'test']);
    }
    completeGate("gate-2");
    setTimeout(() => navigate("/chapter2"), 1500);
  };

  const progress = {
    completed: completedSections.length,
    total: 3,
  };

  return (
    <>
      <GatePageLayout
        title="分治殿堂"
        subtitle="Merge Sort & Quick Sort - 分而治之的藝術"
        backgroundImage="/placeholder.svg"
        returnPath="/chapter2"
        onShowStory={() => setShowStory(true)}
        onShowTeach={teachCompleted ? () => setShowTeach(true) : undefined}
        showScrollNav={teachCompleted}
        sections={["互動演示", "實戰挑戰"]}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={progress}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="觀察分而治之的遞迴樹狀結構"
        >
          <DemoBlock onComplete={handleDemoComplete} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="驗證你對分治演算法的理解"
          variant="gradient"
        >
          <TestBlock onComplete={handleTestComplete} />
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
      >
        <TeachBlock onComplete={handleTeachComplete} />
      </TeachDialog>
    </>
  );
};

export default Chapter2Gate2;
