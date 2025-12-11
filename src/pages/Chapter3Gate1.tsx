import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter3-gate1/TeachBlock";
import DemoBlock from "@/components/chapter3-gate1/DemoBlock";
import TestBlock from "@/components/chapter3-gate1/TestBlock";
import realmBg from "@/assets/realm-3-echoes.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter3Gate1 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections, isLoading } = useChapterProgress("chapter3");
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
        title="遍歷之森"
        subtitle="Tree Traversal - 樹的遍歷"
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
          description="調整程式碼順序，觀察光靈如何遍歷樹林"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復古老的訪問儀式，解開石碑上的密碼"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="遍歷之森"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-foreground/90">
          <p className="text-lg">
            穿過秩序神殿的迴廊，你踏入了一片古老的樹林——<span className="text-primary font-semibold">階層聖域</span>。
          </p>
          <p>
            這裡的每一棵樹都不是普通的植物，而是由閃爍著微光的<span className="text-primary">數據節點</span>構成的立體結構。
            樹枝是邏輯的通道，連接著父節點與子節點，形成了一個個知識的層級網絡。
          </p>
          <p>
            一位樹靈現身，向你展示了三條古老的探險路徑：
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
            <p className="italic mb-2">「前序之路——先插旗，再深入；」</p>
            <p className="italic mb-2">「中序之路——左路盡頭，方見根本；」</p>
            <p className="italic">「後序之路——探盡枝葉，最終歸根。」</p>
          </blockquote>
          <p>
            「同樣的樹林，不同的行走順序，會讓你看到完全不同的風景。」樹靈說道，
            「<span className="text-primary">這就是遞迴的奧秘——深入、回溯、再深入。</span>」
          </p>

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                理解樹形結構的非線性特徵
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                掌握前序、中序、後序三種遍歷的差異
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                感受遞迴如何表現為「深入」與「回溯」
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="樹的遍歷 - 三種深度優先路徑"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>
    </>
  );
};

export default Chapter3Gate1;
