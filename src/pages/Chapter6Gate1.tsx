import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Zap, GitMerge } from "lucide-react";
import GatePageLayout from "@/components/gate/GatePageLayout";
import { StoryDialog, TeachDialog } from "@/components/gate";
import GateSection from "@/components/gate/GateSection";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter6-gate1/TeachBlock";
import DemoBlock from "@/components/chapter6-gate1/DemoBlock";
import TestBlock from "@/components/chapter6-gate1/TestBlock";
import realmImage from "@/assets/realm-6-unity.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter6Gate1 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections } = useChapterProgress("chapter6");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);

  const sections = getGateSections("gate1");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate1", section);
    if (section === "test") {
      setTimeout(() => navigate("/chapter6"), 1500);
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
        title="群組聖約"
        onComplete={() => {
          setShowStoryDialog(false);
          setShowTeachDialog(true);
        }}
      >
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            踏入終極聖所的第一個試煉場，虛空中懸浮著無數發光的靈魂水晶。
            它們本是散落的個體，正等待締結契約成為強大的聯盟。
          </p>
          <p className="text-lg leading-relaxed">
            這裡記載著「併查集」的古老智慧——如何讓散落的個體快速聯合成強大的群體，
            又如何在瞬間辨識任意兩個水晶是否已屬同一聯盟。
          </p>
          <p className="text-lg leading-relaxed">
            「合併」如同兩個部落結盟，「查找」則是追溯契約線找到最終的首領。
            而「路徑壓縮」的奧義，能讓你在眨眼間完成原本漫長的追溯之旅。
          </p>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
            <h4 className="font-semibold text-primary mb-3">你的任務</h4>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                理解互斥集 (Disjoint Set) 的陣列表示法
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-primary mt-0.5" />
                掌握 Find 操作中的路徑壓縮技巧
              </li>
              <li className="flex items-start gap-2">
                <GitMerge className="w-5 h-5 text-primary mt-0.5" />
                學習 Union 操作中的按秩合併概念
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="併查集的核心概念"
        isCompleted={sections.teach}
        onComplete={handleTeachComplete}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>

      <GatePageLayout
        title="群組聖約"
        subtitle="Union-Find - 併查集與路徑壓縮"
        backgroundImage={realmImage}
        returnPath="/chapter6"
        progress={{ completed: completedCount, total: 3 }}
        showScrollNav={true}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="操作 Union 和 Find，觀察路徑壓縮的效果"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復 find 函數，實現路徑壓縮"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter6Gate1;
