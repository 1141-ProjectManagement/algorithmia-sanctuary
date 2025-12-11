import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter4-gate1/TeachBlock";
import DemoBlock from "@/components/chapter4-gate1/DemoBlock";
import TestBlock from "@/components/chapter4-gate1/TestBlock";
import { useToast } from "@/hooks/use-toast";
import type { SectionType } from "@/lib/auth";

const Chapter4Gate1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeSection, getGateSections } = useChapterProgress("chapter4");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);

  const sections = getGateSections("gate1");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate1", section);
    if (section === "test") {
      toast({
        title: "🎉 關卡完成！",
        description: "你已掌握 BFS 與 DFS 的圖遍歷技術",
      });
      setTimeout(() => navigate("/chapter4"), 2000);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeachDialog(false);
  };

  const storyContent = (
    <>
      <p className="text-lg leading-relaxed">
        你踏入了<span className="text-primary font-semibold">網絡聖殿</span>的虛空之中。
        眼前是由無數發光節點構成的錯綜複雜網絡，連接線如同神經網絡般脈動。
      </p>
      <p className="leading-relaxed">
        守護者緩緩現身，手中托著兩件古老的神器：
      </p>
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
          <div className="text-2xl mb-1">🌊</div>
          <p className="text-blue-400 font-medium">波紋發射器</p>
          <p className="text-xs text-muted-foreground">如石入水，層層擴散</p>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
          <div className="text-2xl mb-1">🔥</div>
          <p className="text-red-400 font-medium">深淵探針</p>
          <p className="text-xs text-muted-foreground">一路深入，撞牆回溯</p>
        </div>
      </div>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「年輕的探索者，」守護者的聲音迴盪：
        </p>
        <p className="italic mb-2">
          「波紋術讓你找到最近的目標，深淵術讓你探索每一條可能的道路。」
        </p>
        <p className="italic">
          「選擇你的策略，穿越這片網絡迷霧。」
        </p>
      </blockquote>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解 Queue (佇列) 與 Stack (堆疊) 的資料結構差異</li>
          <li>▸ 觀察 BFS 同心圓擴散 vs DFS 單路深入的遍歷模式</li>
          <li>▸ 選擇正確策略找到目標節點</li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="古老卷軸：波紋探索 & 深淵探險"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：BFS & DFS"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>

      <GatePageLayout
        title="波紋探索 & 深淵探險"
        subtitle="BFS & DFS - 圖論遍歷"
        backgroundImage=""
        returnPath="/chapter4"
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
        showScrollNav
        sections={["互動演示", "實戰挑戰"]}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={{ completed: completedCount, total: 3 }}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="觀察 BFS 與 DFS 的遍歷行為差異"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復遍歷代碼並預測訪問順序"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter4Gate1;
