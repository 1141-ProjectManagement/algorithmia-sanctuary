import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import ChapterHubLayout from "@/components/ChapterHubLayout";
import GateCard, { GateData } from "@/components/GateCard";
import { getChapterTheme } from "@/config/chapterThemes";

// Gate background images
import gate1Bg from "@/assets/gates/chapter1-gate1-measurement.jpg";
import gate2Bg from "@/assets/gates/chapter1-gate2-containers.jpg";
import gate3Bg from "@/assets/gates/chapter1-gate3-stack-tower.jpg";
import gate4Bg from "@/assets/gates/chapter1-gate4-queue-gate.jpg";
import gate5Bg from "@/assets/gates/chapter1-gate5-tablets.jpg";

const gates: GateData[] = [
  {
    id: "gate-1",
    title: "尺規神殿",
    subtitle: "Temple of Measurement",
    description: "掌握 Big O 時間複雜度的奧秘，理解演算法效率的基石。如同古人用尺規丈量世界，你將學會用時間複雜度衡量演算法的效能。",
    algorithm: "Big O 分析",
    route: "/chapter1/gate1",
    backgroundImage: gate1Bg,
  },
  {
    id: "gate-2",
    title: "容器遺跡",
    subtitle: "Ruins of Containers",
    description: "探索陣列與鏈結串列的差異，理解記憶體的連續與離散之美。容器的選擇決定了數據的命運。",
    algorithm: "陣列 / 鏈結串列",
    route: "/chapter1/gate2",
    backgroundImage: gate2Bg,
  },
  {
    id: "gate-3",
    title: "堆疊之塔",
    subtitle: "Tower of Stacks",
    description: "揭開後進先出的堆疊秘密。如同一座高塔，最後放上的石塊必須最先移除。函數呼叫、括號配對，皆遵循此道。",
    algorithm: "Stack / LIFO",
    route: "/chapter1/gate3",
    backgroundImage: gate3Bg,
  },
  {
    id: "gate-4",
    title: "佇列之門",
    subtitle: "Gate of Queues",
    description: "理解先進先出的佇列原理。排隊等候的智慧——先來者先服務，公平且有序的數據結構。",
    algorithm: "Queue / FIFO",
    route: "/chapter1/gate4",
    backgroundImage: gate4Bg,
  },
  {
    id: "gate-5",
    title: "石板遺跡發掘廳",
    subtitle: "Hall of Linear Search",
    description: "學會線性搜尋的基本技巧。在未知的遺跡中，逐一檢查每塊石板，直到找到刻有秘密的那一塊。",
    algorithm: "線性搜尋",
    route: "/chapter1/gate5",
    backgroundImage: gate5Bg,
  },
];

const gateOrder = gates.map((g) => g.id);
const theme = getChapterTheme(1);

// Map gate IDs without hyphen for database storage
const gateIdToDbId = (gateId: string) => gateId.replace("-", "");

// Plain text version of story for TTS
const storyText = `你站在一座古老神殿的入口處。巨大的石柱上刻滿了神秘的符文，空氣中瀰漫著遠古的氣息。這裡是起源聖殿——Algorithmia 文明的起點。所有的知識都從這裡開始。一位蒼老的守殿者從陰影中走出，他的眼中閃爍著智慧的光芒。「歡迎，年輕的探索者。」「在這裡，你將學習演算法的基礎——時間的測量、數據的容器、順序的秘密。」「這些看似簡單的概念，卻是一切高級技術的根基。」「準備好開始你的旅程了嗎？」`;

const Chapter1Hub = () => {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showLoreDialog, setShowLoreDialog] = useState(false);
  
  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    getGateSections,
  } = useChapterProgress("chapter1");

  const completedCount = getCompletedGatesCount();
  const chapterCompleted = isChapterCompleted(gates.length);

  const handleGateClick = (gate: GateData) => {
    const dbGateId = gateIdToDbId(gate.id);
    if (isGateUnlocked(dbGateId, gateOrder.map(gateIdToDbId))) {
      navigate(gate.route);
    }
  };

  const storyContent = (
    <>
      <p className="text-lg">
        你站在一座古老神殿的入口處。巨大的石柱上刻滿了神秘的符文，空氣中瀰漫著遠古的氣息。
      </p>
      <p>
        這裡是起源聖殿——Algorithmia 文明的起點。所有的知識都從這裡開始。
      </p>
      <p>
        一位蒼老的守殿者從陰影中走出，他的眼中閃爍著智慧的光芒：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">「歡迎，年輕的探索者。」</p>
        <p className="italic mb-2">「在這裡，你將學習演算法的基礎——時間的測量、數據的容器、順序的秘密。」</p>
        <p className="italic mb-2">「這些看似簡單的概念，卻是一切高級技術的根基。」</p>
        <p className="italic">「準備好開始你的旅程了嗎？」</p>
      </blockquote>
    </>
  );

  const loreContent = (
    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 1 年</p>
      <h3 className="text-lg font-semibold mb-4 text-primary">創始者手記</h3>
      
      <div className="space-y-4">
        <p>「今天，我們發現了一個改變一切的真理——效率是有代價的。」</p>
        <p>「我們可以用更少的步驟完成同樣的任務。這聽起來像是純粹的進步。」</p>
        <p>「但當我們開始測量一切、優化一切時，我們也開始失去一些東西。」</p>
        <p>「那些『低效』的過程——閒聊、漫步、沉思——它們有其價值嗎？」</p>
        <p>「我們創造了時間複雜度的概念，用來衡量演算法的效率。」</p>
        <p>「但我們還沒有創造出衡量『意義』的公式。」</p>
        <p className="text-primary font-semibold">「也許，這就是我們最大的盲點。」</p>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground italic text-center">
        — 起源聖殿的警示 —
      </div>
    </div>
  );

  const completionMessage = (
    <>
      <p>
        起源聖殿的所有試煉已被通過。當你掌握了時間的測量、數據的容器，地面開始震動，一道光芒從神殿深處射出。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left mt-4">
        <p className="text-foreground/90 italic mb-2">
          「你已經邁出了第一步。」
        </p>
        <p className="text-foreground/80 text-sm">
          守殿者點了點頭：「但真正的挑戰才剛開始。秩序神殿等待著你——那裡將教你如何將混亂轉化為秩序。」
        </p>
      </blockquote>
    </>
  );

  return (
    <ChapterHubLayout
      chapterNumber={1}
      templeName="起源聖殿"
      chapterTitle="基礎與啟程"
      chapterDescription="理解演算法效率的基石，掌握基礎資料結構的奧秘。從時間複雜度到線性搜尋，一切偉大的旅程都從這裡開始。"
      completedCount={completedCount}
      totalGates={gates.length}
      isChapterCompleted={chapterCompleted}
      showStoryDialog={showStoryDialog}
      setShowStoryDialog={setShowStoryDialog}
      showLoreDialog={showLoreDialog}
      setShowLoreDialog={setShowLoreDialog}
      storyContent={storyContent}
      loreContent={loreContent}
      loreTitle="古籍碎片：《創世紀錄》第一卷"
      storyText={storyText}
      autoPlayTTS={true}
      completionTitle="起源聖殿已被征服"
      completionMessage={completionMessage}
    >
      {gates.map((gate, index) => {
        const dbGateId = gateIdToDbId(gate.id);
        const dbGateOrder = gateOrder.map(gateIdToDbId);
        return (
          <GateCard
            key={gate.id}
            gate={gate}
            index={index}
            isCompleted={isGateCompleted(dbGateId)}
            isUnlocked={isGateUnlocked(dbGateId, dbGateOrder)}
            onClick={() => handleGateClick(gate)}
            theme={theme}
            sections={getGateSections(dbGateId)}
          />
        );
      })}
    </ChapterHubLayout>
  );
};

export default Chapter1Hub;
