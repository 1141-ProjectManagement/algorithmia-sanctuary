import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter3-gate2/TeachBlock";
import DemoBlock from "@/components/chapter3-gate2/DemoBlock";
import TestBlock from "@/components/chapter3-gate2/TestBlock";
import realmBg from "@/assets/realm-3-echoes.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter3Gate2 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections, isLoading } = useChapterProgress("chapter3");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);

  const sections = getGateSections("gate2");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate2", section);
    if (section === "test") {
      setTimeout(() => navigate("/chapter3"), 2000);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeachDialog(false);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse">載入中...</div>
      </div>
    );
  }

  return (
    <>
      <GatePageLayout
        title="搜尋聖樹"
        subtitle="Binary Search Tree - 二元搜尋樹"
        backgroundImage={realmBg}
        returnPath="/chapter3"
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
        showScrollNav
        currentSection={currentSection}
        sections={["互動演示", "實戰挑戰"]}
        onNavigate={handleNavigate}
        progress={{ completed: completedCount, total: 3 }}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="插入數字或搜尋目標，觀察能量球如何在聖樹中導航"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復導航咒語，預測搜尋路徑"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="搜尋聖樹"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-foreground/90">
          <p className="text-lg">
            深入階層聖域，你來到了一棵聳入雲霄的巨大<span className="text-primary font-semibold">搜尋聖樹</span>前。
          </p>
          <p>
            這棵樹與眾不同——它的每一個枝幹都由發光的水晶節點構成，
            而這些水晶遵循著一個不可打破的法則：
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
            <p className="italic mb-2">「左側的水晶，永遠比主幹黯淡；」</p>
            <p className="italic mb-2">「右側的水晶，永遠比主幹耀眼。」</p>
            <p className="italic">「這是搜尋聖樹的幾何定律——<span className="text-primary">左小右大</span>。」</p>
          </blockquote>
          <p>
            一位守護者向你解釋：「普通的探險家需要逐一檢查每片樹葉才能找到目標，
            但掌握了這個法則，你只需在每個分岔路口問一個問題——
            <span className="text-primary">目標比這個節點大還是小？</span>
            然後選擇正確的方向。」
          </p>
          <p>
            「這就是 <span className="text-cyan-400">O(log n)</span> 的力量——
            每一步都能排除一半的可能性。」
          </p>

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                理解 BST 的核心性質：左 {"<"} 根 {"<"} 右
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                掌握搜尋與插入的遞迴邏輯
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                體驗 O(log n) 效率，並了解退化風險
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="二元搜尋樹 - 高效導航的秘密"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>
    </>
  );
};

export default Chapter3Gate2;
