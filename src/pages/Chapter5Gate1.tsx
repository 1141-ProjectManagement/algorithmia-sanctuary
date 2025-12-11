import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter5-gate1/TeachBlock";
import DemoBlock from "@/components/chapter5-gate1/DemoBlock";
import TestBlock from "@/components/chapter5-gate1/TestBlock";
import { useToast } from "@/hooks/use-toast";
import type { SectionType } from "@/lib/auth";

const Chapter5Gate1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeSection, getGateSections } = useChapterProgress("chapter5");
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
        description: "你已掌握貪婪演算法的精髓與局限性",
      });
      setTimeout(() => navigate("/chapter5"), 2000);
    }
  };

  const handleTeachComplete = async () => {
    await handleSectionComplete("teach");
    setShowTeachDialog(false);
  };

  const storyContent = (
    <>
      <p className="text-lg leading-relaxed">
        穿過階層聖域的深處，你來到了一個完全不同的空間——
        <span className="text-primary font-semibold">智慧殿堂的試煉場</span>。
      </p>
      <p className="leading-relaxed">
        這裡沒有明確的道路，只有懸浮在虛空中的無數
        <span className="text-primary">「決策光點」</span>。
        每一個光點代表一個當下的選擇，背景是深邃的星空。
      </p>
      <p className="leading-relaxed">
        眼前展開的是一系列需要安排的
        <span className="text-primary">「時間能量條」</span>
        和需要湊齊的
        <span className="text-primary">「水晶貨幣」</span>。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">
          「歡迎來到貪婪試煉場。」守護者的聲音在虛空中迴盪：
        </p>
        <p className="italic mb-2">
          「貪婪策略就像一位『活在當下』的獵手——不考慮森林盡頭有什麼，
          只抓取眼前看起來最肥美、最容易到手的獵物。」
        </p>
        <p className="italic">
          「但記住，眼前的最優，不一定是整體的最優...」
        </p>
      </blockquote>
      <div className="mt-4 p-3 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">你的任務：</p>
        <ul className="space-y-1 text-sm">
          <li>▸ 理解貪婪演算法：每一步都選擇當前最優</li>
          <li>▸ 掌握「活動選擇問題」的貪婪解法</li>
          <li>▸ 體驗「找零問題」中貪婪的局限性</li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="古老卷軸：貪婪試煉"
        onComplete={handleStoryComplete}
      >
        {storyContent}
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="知識卷軸：貪婪演算法"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>

      <GatePageLayout
        title="貪婪試煉"
        subtitle="Greedy Algorithm - 貪婪演算法"
        backgroundImage=""
        returnPath="/chapter5"
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
          description="體驗活動選擇與找零問題的貪婪策略"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="驗證你對貪婪演算法的理解"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter5Gate1;
