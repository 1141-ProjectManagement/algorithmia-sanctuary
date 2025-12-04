import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Binary, Layers } from "lucide-react";
import GatePageLayout from "@/components/gate/GatePageLayout";
import { StoryDialog, TeachDialog } from "@/components/gate";
import GateSection from "@/components/gate/GateSection";
import { useGateNavigation } from "@/hooks/useGateNavigation";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import TeachBlock from "@/components/chapter6-gate2/TeachBlock";
import DemoBlock from "@/components/chapter6-gate2/DemoBlock";
import TestBlock from "@/components/chapter6-gate2/TestBlock";

import realmImage from "@/assets/realm-6-unity.jpg";

const Chapter6Gate2 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter6");
  const { currentSection, demoRef, testRef, handleNavigate } = useGateNavigation();

  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [teachCompleted, setTeachCompleted] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const handleSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const handleAllComplete = () => {
    completeGate("gate2");
    setTimeout(() => navigate("/chapter6"), 1500);
  };

  return (
    <>
      <StoryDialog
        open={showStoryDialog}
        onOpenChange={setShowStoryDialog}
        title="位元聖典"
        onComplete={() => {
          setShowStoryDialog(false);
          setShowTeachDialog(true);
        }}
      >
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            進入終極聖所的最深層，這裡沒有宏偉的石像，只有懸浮在虛空中的微小「光子晶球」。
            這些晶球以 8 個為一組排列，構成了世界的底層脈絡。
          </p>
          <p className="text-lg leading-relaxed">
            每顆晶球只有兩種狀態——「光（1）」與「暗（0）」。這是計算機世界最原始的語言，
            也是最強大的操控工具。
          </p>
          <p className="text-lg leading-relaxed">
            <strong>AND</strong> 是嚴格的守門人，<strong>OR</strong> 是寬容的匯聚者，
            <strong>XOR</strong> 則是差異的共鳴——掌握這些咒語，你將能在最底層操控數據。
          </p>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
            <h4 className="font-semibold text-primary mb-3">你的任務</h4>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <Binary className="w-5 h-5 text-primary mt-0.5" />
                理解整數的二進位表示形式
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                掌握 &amp;, |, ^, ~, &lt;&lt;, &gt;&gt; 運算符的邏輯
              </li>
              <li className="flex items-start gap-2">
                <Layers className="w-5 h-5 text-primary mt-0.5" />
                學會使用位元遮罩精確控制特定位元
              </li>
            </ul>
          </div>
        </div>
      </StoryDialog>

      <TeachDialog
        open={showTeachDialog}
        onOpenChange={setShowTeachDialog}
        title="位元運算的核心概念"
        isCompleted={teachCompleted}
        onComplete={() => {
          setShowTeachDialog(false);
          handleSectionComplete("teach");
        }}
      >
        <TeachBlock onComplete={() => setTeachCompleted(true)} />
      </TeachDialog>

      <GatePageLayout
        title="位元聖典"
        subtitle="Bit Manipulation - 位元運算"
        backgroundImage={realmImage}
        returnPath="/chapter6"
        progress={{ completed: completedSections.length, total: 3 }}
        showScrollNav={true}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onShowStory={() => setShowStoryDialog(true)}
        onShowTeach={() => setShowTeachDialog(true)}
      >
        <GateSection
          ref={demoRef}
          title="互動演示"
          description="操作位元運算，觀察二進位的變化"
        >
          <DemoBlock onComplete={() => handleSectionComplete("demo")} />
        </GateSection>

        <GateSection
          ref={testRef}
          title="實戰挑戰"
          description="使用位元遮罩修復古代協議"
          variant="gradient"
        >
          <TestBlock
            onComplete={() => {
              handleSectionComplete("test");
              handleAllComplete();
            }}
          />
        </GateSection>
      </GatePageLayout>
    </>
  );
};

export default Chapter6Gate2;
