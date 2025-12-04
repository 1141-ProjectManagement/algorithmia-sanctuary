import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter4-gate3/TeachBlock";
import DemoBlock from "@/components/chapter4-gate3/DemoBlock";
import TestBlock from "@/components/chapter4-gate3/TestBlock";
import { useToast } from "@/hooks/use-toast";

const Chapter4Gate3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate } = useChapterProgress("chapter4");
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
          description: "你已掌握 Dijkstra 最短路徑演算法",
        });
        setTimeout(() => navigate("/chapter4"), 2000);
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
        深入網絡聖殿，一個巨大的<span className="text-primary font-semibold">導航星盤</span>在虛空中緩緩旋轉。
        星盤上標記著無數個星球，連接線上閃爍著航行距離。
      </p>
      <p className="leading-relaxed">
        守護者指向星盤中心，那裡有一道沉睡的金色光芒：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「這是戴克斯特拉（Dijkstra）的導航術，」守護者解釋道：
        </p>
        <p className="italic mb-2">
          「它能找到從任意起點到所有目的地的最短航線。」
        </p>
        <p className="italic">
          「秘訣在於<span className="text-amber-400">貪婪選擇</span>——永遠先照亮最近的星球，
          再透過<span className="text-green-400">鬆弛</span>發現更短的捷徑。」
        </p>
      </blockquote>
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
          <div className="text-2xl mb-1">🎯</div>
          <p className="text-sm text-amber-400 font-medium">貪婪策略</p>
          <p className="text-xs text-muted-foreground">選擇當前最小距離</p>
        </div>
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <div className="text-2xl mb-1">⚡</div>
          <p className="text-sm text-green-400 font-medium">鬆弛操作</p>
          <p className="text-xs text-muted-foreground">發現更短路徑就更新</p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解 Dijkstra 如何用 Priority Queue 維持貪婪選擇</li>
          <li>▸ 掌握鬆弛 (Relaxation) 的核心邏輯</li>
          <li>▸ 修復導航系統的鬆弛判斷式</li>
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
        title="古老卷軸：導航星盤"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：Dijkstra 演算法"
        onComplete={handleTeachComplete}
      >
        {teachContent}
      </TeachDialog>

      <GatePageLayout
        title="導航星盤"
        subtitle="Dijkstra's Algorithm - 單源最短路徑"
        backgroundImage=""
        returnPath="/chapter4"
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
          description="觀察 Dijkstra 演算法的執行過程"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復星際導航儀的鬆弛邏輯"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter4Gate3;
