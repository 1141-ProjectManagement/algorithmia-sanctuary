import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter5-gate2/TeachBlock";
import DemoBlock from "@/components/chapter5-gate2/DemoBlock";
import TestBlock from "@/components/chapter5-gate2/TestBlock";
import { useToast } from "@/hooks/use-toast";

const Chapter5Gate2 = () => {
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
        completeGate("gate2");
        toast({
          title: "🎉 關卡完成！",
          description: "記憶水晶矩陣已完全充能",
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
        穿過貪婪試煉場，你來到了智慧殿堂的核心——
        <span className="text-primary font-semibold">記憶水晶室</span>。
      </p>
      <p className="leading-relaxed">
        眼前是一個巨大的、由無數透明水晶構成的
        <span className="text-primary">矩陣</span>，懸浮在深邃的虛空中。
        每個水晶代表一個「子問題」的存儲空間，未計算的格子是暗淡的，
        計算過的格子會變成發光的
        <span className="text-purple-400">紫色水晶</span>。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「歡迎來到記憶水晶室。」守護者的聲音迴盪：
        </p>
        <p className="italic mb-2">
          「貪婪策略有時會失敗，但動態規劃永不出錯——
          它會記住每一個子問題的答案，用空間換取時間。」
        </p>
        <p className="italic">
          「觀察水晶如何被逐步充能，感受狀態轉移的力量...」
        </p>
      </blockquote>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解動態規劃：將大問題拆解為重疊子問題</li>
          <li>▸ 掌握 0/1 背包問題的狀態轉移方程</li>
          <li>▸ 視覺化「空間換時間」的記憶化過程</li>
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
        title="古老卷軸：記憶水晶"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：動態規劃"
        onComplete={handleTeachComplete}
      >
        {teachContent}
      </TeachDialog>

      <GatePageLayout
        title="記憶水晶"
        subtitle="Dynamic Programming - 動態規劃"
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
          description="觀察 DP 表格如何被逐步充能"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="完成狀態轉移方程，修復記憶迴路"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter5Gate2;
