import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter3-gate4/TeachBlock";
import DemoBlock from "@/components/chapter3-gate4/DemoBlock";
import TestBlock from "@/components/chapter3-gate4/TestBlock";

import realmBg from "@/assets/realm-3-echoes.jpg";

const Chapter3Gate4 = () => {
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
    await completeGate("gate4");
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
        title="編碼卷軸"
        subtitle="Huffman Coding - 霍夫曼編碼"
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
          description="觀察符文如何合併成編碼樹，調整頻率看樹形變化"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="手動執行貪婪合併，完成霍夫曼編碼的核心邏輯"
          variant="gradient"
        >
          <TestBlock onComplete={handleGateComplete} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="編碼卷軸"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-foreground/90">
          <p className="text-lg">
            階層聖域深處的藏書閣中，一張巨大的古老羊皮卷軸懸浮在半空，周圍漂浮著散發不同亮度的<span className="text-primary font-semibold">古老符文</span>。
          </p>
          <p>
            符文的亮度代表它們的使用頻率——越常出現的符文越「輕盈」明亮，越罕見的符文越「沉重」黯淡。
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
            <p className="italic mb-2">「觀察這些符文，」卷軸的守護者說道：</p>
            <p className="italic mb-2">「將最微弱的兩點星光融合，生成更亮的新星。」</p>
            <p className="italic mb-2">「重複此過程，直到匯聚成唯一的根源。」</p>
            <p className="italic">「這就是霍夫曼的智慧——<span className="text-primary">用最少的符號，表達最多的內容。</span>」</p>
          </blockquote>
          <p>
            守護者展開卷軸，上方的空間開始構建編碼樹：「<span className="text-primary">頻率決定位置，位置決定編碼長度。</span>這是資料壓縮的古老藝術。」
          </p>

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                理解貪婪策略在霍夫曼編碼中的應用
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                掌握二元樹自底向上的構建過程
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                認識前綴碼特性：確保解碼的唯一性
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="霍夫曼編碼 - 貪婪的壓縮藝術"
        onComplete={handleTeachComplete}
        isCompleted={true}
      >
        <TeachBlock onComplete={handleTeachComplete} />
      </TeachDialog>
    </>
  );
};

export default Chapter3Gate4;
