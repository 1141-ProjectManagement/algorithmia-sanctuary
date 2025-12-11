import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter2-gate1/TeachBlock";
import DemoBlock from "@/components/chapter2-gate1/DemoBlock";
import TestBlock from "@/components/chapter2-gate1/TestBlock";
import realm2Image from "@/assets/realm-2-chronos.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter2Gate1 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections, isGateCompleted } = useChapterProgress("chapter2");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  // Dialog states
  const [showStory, setShowStory] = useState(true);
  const [showTeach, setShowTeach] = useState(false);
  
  // Get current section status from database
  const sections = getGateSections("gate1");

  const handleStoryComplete = () => {
    setShowStory(false);
    setShowTeach(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate1", section);
    
    // Check if all sections complete, then navigate
    if (section === "test") {
      setTimeout(() => navigate("/chapter2"), 1500);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeach(false);
  };

  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  return (
    <>
      <GatePageLayout
        title="泡泡與交換之池"
        subtitle="Bubble Sort & Insertion Sort - 基礎排序"
        backgroundImage={realm2Image}
        returnPath="/chapter2"
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
          description="觀察 Bubble Sort 的排序過程，體驗相鄰交換的魔法"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="預判每一步的交換決策，證明你已掌握泡泡術"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>

      {/* Story Dialog */}
      <StoryDialog
        open={showStory}
        onOpenChange={setShowStory}
        title="泡泡與交換之池"
        onComplete={handleStoryComplete}
      >
        <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="text-xl font-['Cinzel'] text-primary mb-3">水晶池的秘密</h3>
          <p className="leading-relaxed mb-4">
            你踏入了秩序神殿的第一個房間——一座靜謐的水晶池。
            池水如鏡，倒映著穹頂上閃爍的星辰。
          </p>
          <p className="leading-relaxed mb-4">
            池中漂浮著散發不同色澤的光輝寶石，每顆寶石都刻著古老的數字。
            當你靠近時，牆上的銘文開始發光：
          </p>
          <div className="bg-card/60 p-4 rounded-lg border-l-4 border-primary italic mb-4">
            「觀察這些寶石。較重者沉，較輕者浮。透過『比較』與『交換』，讓混沌歸於秩序。」
          </div>
          <p className="leading-relaxed">
            你注意到寶石們似乎在等待著什麼——每當兩顆相鄰的寶石互相碰撞，
            池水就會泛起金色的漣漪，發出清脆的水晶撞擊聲。
          </p>
        </div>

        <div className="p-6 bg-card/60 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-primary mb-3">你的任務</h4>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>理解「相鄰交換」機制：觀察 Bubble Sort 如何將最大值推向陣列末端</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>可視化 O(n²) 複雜度：感受當寶石增加時，排序過程的急劇變慢</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span>
              <span>代碼與動作的映射：理解 j 與 j+1 在視覺上對應的是哪兩顆寶石</span>
            </li>
          </ul>
        </div>
      </StoryDialog>

      {/* Teach Dialog */}
      <TeachDialog
        open={showTeach}
        onOpenChange={setShowTeach}
        title="泡泡排序的奧秘"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>
    </>
  );
};

export default Chapter2Gate1;
