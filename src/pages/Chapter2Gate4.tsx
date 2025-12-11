import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter2-gate4/TeachBlock";
import DemoBlock from "@/components/chapter2-gate4/DemoBlock";
import TestBlock from "@/components/chapter2-gate4/TestBlock";
import realmImage from "@/assets/realm-2-chronos.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter2Gate4 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections } = useChapterProgress("chapter2");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();
  
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);

  const sections = getGateSections("gate4");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate4", section);
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
        title="映射密室"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            你踏入一間神秘的魔法密室，無數金色寶箱漂浮在空中，每個寶箱都刻著獨特的編號：0, 1, 2... 直到 N-1。
          </p>
          <p>
            房間中央懸浮著一本古老的法術書。它記載著一個強大的「傳送法術」——只需念出鑰匙的名字，法術就能瞬間將寶物傳送到正確的寶箱中。
          </p>
          <p>
            這就是雜湊表的奧秘：無需逐一檢查每個寶箱，透過數學公式直接計算出目標位置，實現 O(1) 的極速存取！
          </p>
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <h4 className="text-primary font-semibold mb-3">✨ 你的任務</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>理解雜湊函數如何將任意輸入映射到固定範圍的索引</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>體驗 O(1) 時間複雜度的查找威力</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>觀察雜湊碰撞的發生，學習線性探測解決方案</span>
            </li>
          </ul>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="雜湊表的魔法"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>

      <GatePageLayout
        title="映射密室"
        subtitle="Hash Table - 雜湊表"
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
          description="觀察鑰匙如何透過雜湊函數飛入正確的寶箱"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="計算雜湊值並處理碰撞"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter2Gate4;
