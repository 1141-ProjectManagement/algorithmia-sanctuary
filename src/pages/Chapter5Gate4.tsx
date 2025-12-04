import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter5-gate4/TeachBlock";
import DemoBlock from "@/components/chapter5-gate4/DemoBlock";
import TestBlock from "@/components/chapter5-gate4/TestBlock";
import { useToast } from "@/hooks/use-toast";

const Chapter5Gate4 = () => {
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
        completeGate("gate4");
        toast({
          title: "🎉 關卡完成！",
          description: "你已掌握分治法的分解與合併策略",
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
        穿越回溯迷宮後，你懸浮於虛空之中。眼前漂浮著巨大的
        <span className="text-primary font-semibold">能量水晶陣列</span>，
        不穩定地閃爍著危險的紅光。
      </p>
      <p className="leading-relaxed">
        背景是無限延伸的「遞迴樹」光影結構——光流從頂端向下分裂，
        再從底部<span className="text-amber-400">匯聚向上</span>。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「這是分治戰場。」守護者的聲音在虛空中迴盪：
        </p>
        <p className="italic mb-2">
          「巨大的能量球無法直接淨化——你必須將它分裂成無數微小的碎片，
          直到每個碎片小到可以被單獨處理。」
        </p>
        <p className="italic">
          「然後，將淨化後的碎片依序重新融合，形成完美的金色能量球。
          分解、征服、合併——這就是分治之道。」
        </p>
      </blockquote>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解分治法三步驟：分解、解決、合併</li>
          <li>▸ 觀察 Merge Sort 的遞迴樹執行順序</li>
          <li>▸ 分析 O(n²) 如何優化至 O(n log n)</li>
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
        title="古老卷軸：分治戰場"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：分治演算法"
        onComplete={handleTeachComplete}
      >
        {teachContent}
      </TeachDialog>

      <GatePageLayout
        title="分治戰場"
        subtitle="Divide & Conquer - 分治演算法"
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
          description="觀察 Merge Sort 的遞迴分裂與合併過程"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復合併邏輯，讓能量水晶有序融合"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter5Gate4;
