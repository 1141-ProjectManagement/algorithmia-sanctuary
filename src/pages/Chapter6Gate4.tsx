import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { GatePageLayout, StoryDialog, TeachDialog, GateSection } from "@/components/gate";
import TeachBlock from "@/components/chapter6-gate4/TeachBlock";
import DemoBlock from "@/components/chapter6-gate4/DemoBlock";
import TestBlock from "@/components/chapter6-gate4/TestBlock";
import realm6Bg from "@/assets/realm-6-unity.jpg";

const Chapter6Gate4 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter6");
  
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [demoRef, testRef];

  const handleStoryComplete = () => {
    setShowStoryDialog(false);
    setShowTeachDialog(true);
  };

  const handleTeachComplete = () => {
    setShowTeachDialog(false);
    handleSectionComplete("teach");
  };

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const handleGateComplete = () => {
    handleSectionComplete("test");
    completeGate("gate4");
    setTimeout(() => navigate("/chapter6"), 2000);
  };

  const handleNavigate = (index: number) => {
    setCurrentSection(index);
    sectionRefs[index]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <GatePageLayout
        title="終極審判"
        subtitle="Integrated Algorithms - 演算法綜合應用"
        backgroundImage={realm6Bg}
        returnPath="/chapter6"
        returnLabel="返回整合神殿"
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
        showScrollNav
        sections={["戰前準備", "Boss 戰"]}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={{
          completed: completedSections.length,
          total: 3,
        }}
      >
        <div className="space-y-16">
          <GateSection
            ref={demoRef}
            title="戰前準備與觀察"
          >
            <DemoBlock onComplete={() => handleSectionComplete("demo")} />
          </GateSection>

          <GateSection
            ref={testRef}
            title="三階段 Boss 戰"
          >
            <TestBlock onComplete={handleGateComplete} />
          </GateSection>
        </div>
      </GatePageLayout>

      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="終極審判"
        onComplete={handleStoryComplete}
      >
        <div className="space-y-4">
          <p>你終於來到了終極聖所的最深處。</p>
          <p>眼前懸浮著 Algorithmia 的守護者，周圍環繞著三層流動的光能護盾。每一層護盾都呈現不同的數據結構紋理——陣列晶格、樹狀脈絡、圖論光網。</p>
          <p className="italic text-primary">「探索者，你已經走過了漫長的旅程，學習了排序與搜尋、樹與遞迴、圖論網路、策略優化...」</p>
          <p className="italic text-primary">「現在，是時候證明你已經真正理解這些知識的力量了。」</p>
          <p>守護者的聲音在虛空中迴盪：</p>
          <p className="italic text-primary">「每一層護盾都代表一類問題。只有選擇正確的演算法策略，你的攻擊才能穿透它們。」</p>
          <p className="italic text-primary">「錯誤的選擇會被反彈，消耗你的生命力。」</p>
          <p className="italic text-primary">「準備好了嗎？終極審判，開始！」</p>
          
          <div className="bg-primary/10 rounded-lg p-4 mt-6">
            <h4 className="font-['Cinzel'] text-primary mb-2">你的任務</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>綜合判斷：根據數據特徵選擇最適合的演算法</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>代碼實戰：修復關鍵代碼片段以通過測試</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>策略權衡：理解不同演算法的效能差異</span>
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="Boss 戰概覽"
        onComplete={handleTeachComplete}
        isCompleted={teachCompleted}
      >
        <TeachBlock onComplete={() => setTeachCompleted(true)} />
      </TeachDialog>
    </>
  );
};

export default Chapter6Gate4;
