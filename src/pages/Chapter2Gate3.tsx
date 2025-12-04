import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter2-gate3/TeachBlock";
import DemoBlock from "@/components/chapter2-gate3/DemoBlock";
import TestBlock from "@/components/chapter2-gate3/TestBlock";
import realmImage from "@/assets/realm-2-chronos.jpg";

const Chapter2Gate3 = () => {
  const navigate = useNavigate();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter-2");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();
  
  const [showStoryDialog, setShowStoryDialog] = useState(!isGateCompleted("gate-3"));
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [teachCompleted, setTeachCompleted] = useState(false);

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleTeachComplete = () => {
    setTeachCompleted(true);
    setShowTeachDialog(false);
    handleSectionComplete("teach");
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const handleAllComplete = () => {
    completeGate("gate-3");
    setTimeout(() => navigate("/chapter2"), 1500);
  };

  const progress = {
    completed: completedSections.length,
    total: 3,
  };

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="折半星圖"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            進入秩序神殿深處，眼前展開一幅浩瀚的 3D 星圖。無數星球依照「能量值」的大小，嚴格地排成一列橫跨虛空的直線。
          </p>
          <p>
            古老的「折半術」是神殿最強大的搜尋法術。你不需要逐一飛過每顆星球，而是直接跳躍到當前範圍的中點。如果目標能量比中點大，就直接捨棄左半邊宇宙；反之則捨棄右半邊。
          </p>
          <p>
            每一次折半，搜尋範圍都會減半。這就是為何即使面對十億顆星球，也只需要約三十次跳躍就能找到目標。
          </p>
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <h4 className="text-primary font-semibold mb-3">✨ 你的任務</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>理解二分搜尋法只能應用於已排序的資料結構</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>掌握 low、high、mid 三指針的動態更新邏輯</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>體驗 O(log n) 與線性搜尋 O(n) 的巨大效能差距</span>
            </li>
          </ul>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="二分搜尋的精髓"
        onComplete={handleTeachComplete}
        isCompleted={teachCompleted}
      >
        <TeachBlock onComplete={() => setTeachCompleted(true)} />
      </TeachDialog>

      <GatePageLayout
        title="折半星圖"
        subtitle="Binary Search - 二分搜尋法"
        backgroundImage={realmImage}
        returnPath="/chapter2"
        returnLabel="返回秩序神殿"
        progress={progress}
        showScrollNav
        currentSection={currentSection}
        sections={["互動演示", "實戰挑戰"]}
        onNavigate={handleNavigate}
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="觀察二分搜尋如何在星圖中快速定位目標"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="運用你的知識來預測搜尋方向並補全代碼"
          variant="gradient"
        >
          <TestBlock
            onComplete={() => {
              handleSectionComplete("test");
              handleAllComplete();
            }}
          />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter2Gate3;
