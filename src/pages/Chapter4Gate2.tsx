import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter4-gate2/TeachBlock";
import DemoBlock from "@/components/chapter4-gate2/DemoBlock";
import TestBlock from "@/components/chapter4-gate2/TestBlock";
import { useToast } from "@/hooks/use-toast";

const Chapter4Gate2 = () => {
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
        completeGate("gate2");
        toast({
          title: "🎉 關卡完成！",
          description: "你已掌握 Kruskal 與 Prim 的最小生成樹演算法",
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
        你來到網絡聖殿的深處，眼前是一片<span className="text-primary font-semibold">漂浮的島嶼群</span>。
        每座島嶼在虛空中緩緩旋轉，隱約可見它們之間存在潛在的能量連接路徑。
      </p>
      <p className="leading-relaxed">
        守護者指向空中漂浮的建造圖紙：
      </p>
      <div className="grid grid-cols-3 gap-3 my-4 text-center">
        <div className="p-2 bg-card/60 rounded-lg">
          <div className="text-2xl mb-1">🏝️</div>
          <p className="text-xs">島嶼</p>
          <p className="text-xs text-muted-foreground">節點</p>
        </div>
        <div className="p-2 bg-card/60 rounded-lg">
          <div className="text-2xl mb-1">🌉</div>
          <p className="text-xs">橋樑</p>
          <p className="text-xs text-muted-foreground">邊</p>
        </div>
        <div className="p-2 bg-card/60 rounded-lg">
          <div className="text-2xl mb-1">💰</div>
          <p className="text-xs">造價</p>
          <p className="text-xs text-muted-foreground">權重</p>
        </div>
      </div>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「這些島嶼曾經緊密相連，」守護者嘆息道：
        </p>
        <p className="italic mb-2">
          「如今能量流失，你需要用最少的資源重建連接。」
        </p>
        <p className="italic">
          「兩種古老的造橋術可以幫助你——<span className="text-emerald-400">Kruskal 的撿邊之法</span>，
          以及 <span className="text-cyan-400">Prim 的擴散之術</span>。」
        </p>
      </blockquote>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解最小生成樹 (MST) 的定義與約束</li>
          <li>▸ 掌握 Kruskal 的排序 + Union-Find 策略</li>
          <li>▸ 掌握 Prim 的切分性質與優先佇列策略</li>
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
        title="古老卷軸：連接之橋"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：最小生成樹"
        onComplete={handleTeachComplete}
      >
        {teachContent}
      </TeachDialog>

      <GatePageLayout
        title="連接之橋"
        subtitle="Minimum Spanning Tree - Kruskal & Prim"
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
          description="觀察 Kruskal 與 Prim 建構 MST 的過程"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="完成 Union-Find 判環邏輯與 Prim 貪心選擇"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter4Gate2;
