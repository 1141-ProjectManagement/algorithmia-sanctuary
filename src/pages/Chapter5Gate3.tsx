import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter5-gate3/TeachBlock";
import DemoBlock from "@/components/chapter5-gate3/DemoBlock";
import TestBlock from "@/components/chapter5-gate3/TestBlock";
import { useToast } from "@/hooks/use-toast";

const Chapter5Gate3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate } = useChapterProgress("chapter5");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleTeachComplete = () => {
    setShowTeachDialog(false);
    if (!completedSections.includes("teach")) {
      setCompletedSections([...completedSections, "teach"]);
    }
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      const newCompleted = [...completedSections, section];
      setCompletedSections(newCompleted);

      if (newCompleted.length >= 3) {
        completeGate("gate3");
        toast({
          title: "🎉 關卡完成！",
          description: "你已掌握回溯法的試錯與撤銷藝術",
        });
        setTimeout(() => navigate("/chapter5"), 2000);
      }
    }
  };

  const progress = {
    completed: completedSections.length,
    total: 3,
  };

  const storyContent = (
    <>
      <p className="text-lg leading-relaxed">
        離開記憶水晶室，你來到了一座懸浮在虛空中的巨大
        <span className="text-primary font-semibold">立體迷宮</span>。
      </p>
      <p className="leading-relaxed">
        無數條岔路在黑暗中延伸，每當探險家走進死胡同，
        時間彷彿<span className="text-amber-400">倒流</span>，
        將他拉回上一個路口，之前的路徑化為虛線消散。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「這是回溯迷宮。」守護者的聲音從四面八方傳來：
        </p>
        <p className="italic mb-2">
          「在這裡，錯誤不是終點——每一次撞牆，都是學習的機會。
          選擇、探索、撤銷，直到找到正確的道路。」
        </p>
        <p className="italic">
          「記住：真正的智慧，是知道何時該前進，何時該回頭。」
        </p>
      </blockquote>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解回溯三步驟：選擇、探索、撤銷</li>
          <li>▸ 可視化遞迴調用堆疊的深度與廣度</li>
          <li>▸ 掌握「剪枝」概念，提前終止無效分支</li>
        </ul>
      </div>
    </>
  );

  const teachContent = (
    <TeachBlock onComplete={handleTeachComplete} />
  );

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="古老卷軸：回溯迷宮"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：回溯法"
        onComplete={handleTeachComplete}
      >
        {teachContent}
      </TeachDialog>

      <GatePageLayout
        title="回溯迷宮"
        subtitle="Backtracking - 回溯法"
        backgroundImage=""
        returnPath="/chapter5"
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
        showScrollNav
        sections={["互動演示", "實戰挑戰"]}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={progress}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="觀察 N 皇后問題的回溯過程"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復迷宮路徑搜尋的回溯邏輯"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter5Gate3;
