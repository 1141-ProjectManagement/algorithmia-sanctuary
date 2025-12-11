import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter3-gate3/TeachBlock";
import DemoBlock from "@/components/chapter3-gate3/DemoBlock";
import TestBlock from "@/components/chapter3-gate3/TestBlock";
import realmBg from "@/assets/realm-3-echoes.jpg";
import type { SectionType } from "@/lib/auth";

const Chapter3Gate3 = () => {
  const navigate = useNavigate();
  const { completeSection, getGateSections, isLoading } = useChapterProgress("chapter3");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);

  const sections = getGateSections("gate3");
  const completedCount = [sections.teach, sections.demo, sections.test].filter(Boolean).length;

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate3", section);
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
        title="優先峰頂"
        subtitle="Heap / Priority Queue - 堆積與優先隊列"
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
          description="操作金字塔堆積，觀察上浮與下沉的動態過程"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="修復堆積的秩序，完成 siftDown 核心邏輯"
          variant="gradient"
        >
          <TestBlock onComplete={() => handleSectionComplete("test")} />
        </GateSection>
      </GatePageLayout>

      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="優先峰頂"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4 text-foreground/90">
          <p className="text-lg">
            進入階層聖域的高處，眼前是一座由浮空石板構成的發光金字塔結構——<span className="text-primary font-semibold">優先峰頂</span>。
          </p>
          <p>
            最重要的任務石板始終懸浮在塔尖，散發著最強烈的金色光芒。這裡遵循「<span className="text-primary">長尊幼卑</span>」的嚴格軍規。
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
            <p className="italic mb-2">「父節點的能量值必須永遠大於或等於子節點。」</p>
            <p className="italic mb-2">「新晉者從底部入場，若能量更強，便向上晉升——此乃 Sift Up；」</p>
            <p className="italic">「頂端離任時，末端者暫補其位，因能量不足而逐層下沉——此乃 Sift Down。」</p>
          </blockquote>
          <p>
            守護者向你展示了這座金字塔的奧秘：「<span className="text-primary">這就是 Heap 的本質——用陣列表示完全二元樹，用簡單的索引計算找到父子關係。</span>」
          </p>

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                理解完全二元樹的陣列表示法
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                掌握 Max Heap Property：父節點恆大於子節點
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                實作並觀察 Insert 與 Extract Max 操作的 heapify 過程
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="堆積的奧秘 - O(log n) 優先級管理"
        onComplete={handleTeachComplete}
        isCompleted={sections.teach}
      >
        <TeachBlock onComplete={() => {}} />
      </TeachDialog>
    </>
  );
};

export default Chapter3Gate3;
