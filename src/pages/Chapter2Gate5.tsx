import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter2-gate5/TeachBlock";
import DemoBlock from "@/components/chapter2-gate5/DemoBlock";
import TestBlock from "@/components/chapter2-gate5/TestBlock";
import realmImage from "@/assets/realm-2-chronos.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter2Gate5 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections } = useChapterProgress("chapter2");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();
  
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);

  const sections = getGateSections("gate5");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate5", section);
    if (section === "test") {
      setTimeout(() => navigate("/chapter2"), 1500);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeachDialog(false);
  };

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="滑動之窗"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            你來到秩序神殿深處的長廊，空中懸浮著一條無限延伸的數據星河。每顆星星代表一個數值，亮度代表數值大小。
          </p>
          <p>
            神殿賦予你一扇神奇的「透視窗格」。這扇窗格可以框住連續的 k 顆星星，並即時顯示它們的能量總和。
          </p>
          <p>
            古老的智慧告訴你：當視窗滑動時，不需要重新計算所有星星——只需「減去離去者，加上進入者」。這個增量更新的技巧，讓你能以 O(n) 的時間掃描整條星河！
          </p>
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <h4 className="text-primary font-semibold mb-3">✨ 你的任務</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>理解暴力解法與滑動視窗的效率差異 (O(n×k) vs O(n))</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>掌握增量更新公式：CurrentSum = PreviousSum - arr[i-k] + arr[i]</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>找出數據星河中能量總和最大的區段</span>
            </li>
          </ul>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="滑動視窗的精髓"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>

      <GatePageLayout
        title="滑動之窗"
        subtitle="Sliding Window - 線性掃描優化"
        backgroundImage={realmImage}
        returnPath="/chapter2"
        returnLabel="返回秩序神殿"
        progress={{ completed: completedCount, total: 3 }}
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
          description="拖動視窗觀察增量更新的魔法"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="補全滑動視窗的代碼邏輯"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter2Gate5;
