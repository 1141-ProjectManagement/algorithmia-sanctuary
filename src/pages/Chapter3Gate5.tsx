import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter3-gate5/TeachBlock";
import DemoBlock from "@/components/chapter3-gate5/DemoBlock";
import TestBlock from "@/components/chapter3-gate5/TestBlock";

import realmBg from "@/assets/realm-3-echoes.jpg";

const Chapter3Gate5 = () => {
  const navigate = useNavigate();
  const { completeGate, isLoading } = useChapterProgress("chapter3");
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
    handleSectionComplete("teach");
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections((prev) => [...prev, section]);
    }
  };

  const handleGateComplete = async () => {
    handleSectionComplete("test");
    await completeGate("gate5");
    setTimeout(() => {
      navigate("/chapter3");
    }, 2000);
  };

  const progress = {
    completed: completedSections.length,
    total: 3,
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
        title="雙指引路"
        subtitle="Two Pointers - 雙指標法"
        backgroundImage={realmBg}
        returnPath="/chapter3"
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
        showScrollNav
        currentSection={currentSection}
        sections={["互動演示", "實戰挑戰"]}
        onNavigate={handleNavigate}
        progress={progress}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="操控雙指標在石板上移動，找到目標和"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="補全導航咒語，讓探險家成功會合"
          variant="gradient"
        >
          <TestBlock onComplete={handleGateComplete} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="雙指引路"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-foreground/90">
          <p className="text-lg">
            階層聖域的邊緣，一座懸浮的古老石板橋橫跨深淵。橋上的每塊石板刻有不同的數值，從左到右<span className="text-primary font-semibold">由小到大</span>排列。
          </p>
          <p>
            兩個發光的靈體——<span className="text-blue-400">金色探險家</span>與<span className="text-red-400">銀色探險家</span>——正準備從橋的兩端出發，尋找能量共鳴點。
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
            <p className="italic mb-2">「觀察這座橋，」守護者說道：</p>
            <p className="italic mb-2">「兩個探險家必須找到一對石板，其數值之和等於神聖的目標數。」</p>
            <p className="italic mb-2">「愚笨的方法是讓一人站著不動，另一人走遍全橋——這需要 n² 次嘗試。」</p>
            <p className="italic">「聰明的方法是讓他們<span className="text-primary">配合前進</span>——和太小，左者前進；和太大，右者後退。」</p>
          </blockquote>
          <p>
            守護者展示了這門古老的技藝：「<span className="text-primary">這就是雙指標的智慧——兩個默契的舞者，只需 n 步就能找到答案。</span>」
          </p>

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                理解雙指標如何利用有序特性決定移動方向
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                掌握對向移動技巧，解決 Two Sum 問題
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                觀察每次移動如何縮減搜尋空間
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="雙指標 - 從 O(n²) 到 O(n) 的躍進"
        onComplete={handleTeachComplete}
        isCompleted={true}
      >
        <TeachBlock onComplete={handleTeachComplete} />
      </TeachDialog>
    </>
  );
};

export default Chapter3Gate5;
