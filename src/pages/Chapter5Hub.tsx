import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import ChapterHubLayout from "@/components/ChapterHubLayout";
import GateCard, { GateData } from "@/components/GateCard";
import { getChapterTheme } from "@/config/chapterThemes";

const gates: GateData[] = [
  {
    id: "gate1",
    title: "貪婪試煉",
    subtitle: "Greedy Algorithm",
    description: "貪心策略很簡單——每一步都選擇當前看起來最優的選項。活在當下，不為未來擔憂。活動安排問題中選擇最早結束的活動，但背包問題中可能錯失全局最優。貪心的誘惑在於簡單，代價是可能錯失全局最優。",
    algorithm: "貪心策略",
    route: "/chapter5/gate1",
  },
  {
    id: "gate2",
    title: "記憶水晶",
    subtitle: "Dynamic Programming",
    description: "巨大的水晶矩陣在虛空中展開，每個格子都是一個子問題的答案。把大問題拆成小問題，記錄每個答案避免重複計算。背包、LCS、編輯距離——這就是「最優子結構」的威力，以空間換時間的經典範例。",
    algorithm: "動態規劃",
    route: "/chapter5/gate2",
  },
  {
    id: "gate3",
    title: "回溯迷宮",
    subtitle: "Backtracking",
    description: "巨大的迷宮在虛空中展開，無數條岔路，無數個可能性。嘗試所有可能，走錯就退回換條路。N皇后、數獨求解、組合生成——智慧的暴力破解，在發現錯誤時立即停止，剪枝大量無效分支。",
    algorithm: "回溯搜索",
    route: "/chapter5/gate3",
  },
  {
    id: "gate4",
    title: "分治戰場",
    subtitle: "Divide & Conquer",
    description: "巨大的問題在虛空中分裂成無數小問題，然後又逐層合併。分解→解決→合併，化繁為簡的終極體現。快速冪、大整數乘法、矩陣乘法——將 O(n²) 降到 O(n log n) 的優化範式。",
    algorithm: "分治思想",
    route: "/chapter5/gate4",
  },
];

const gateOrder = gates.map((g) => g.id);
const theme = getChapterTheme(5);

// Plain text version of story for TTS
const storyText = `穿越織徑神殿後，你來到了一個完全不同的空間。這裡沒有具體的結構，沒有明確的道路。整個殿堂是由無數個閃爍的決策點組成的——每個決策點都有多個選擇，每個選擇都通往不同的未來。一位穿著白袍的智者出現在你面前。她的眼神深邃而平靜。「歡迎來到抉擇神殿。」「在前面的冒險中，你學會了測量、排序、構建結構、導航網絡。但你還沒有真正面對最困難的問題——如何做出最佳決策。」「貪心策略有時有效，有時失敗。動態規劃總是正確，但代價高昂。回溯能窮舉一切，但速度緩慢。」「這裡沒有單一的『正確答案』。只有適應不同場景的『最優選擇』。」`;

const Chapter5Hub = () => {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showLoreDialog, setShowLoreDialog] = useState(false);

  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    getGateSections,
  } = useChapterProgress("chapter5");

  const completedCount = getCompletedGatesCount();
  const chapterCompleted = isChapterCompleted(gates.length);

  const handleGateClick = (gate: GateData) => {
    if (isGateUnlocked(gate.id, gateOrder)) {
      navigate(gate.route);
    }
  };

  const storyContent = (
    <>
      <p className="text-lg">
        穿越織徑神殿後，你來到了一個完全不同的空間。
      </p>
      <p>
        這裡沒有具體的結構，沒有明確的道路。整個殿堂是由無數個閃爍的決策點組成的——每個決策點都有多個選擇，每個選擇都通往不同的未來。
      </p>
      <p>
        一位穿著白袍的智者出現在你面前。她的眼神深邃而平靜：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">「歡迎來到抉擇神殿。」</p>
        <p className="italic mb-2">「在前面的冒險中，你學會了測量、排序、構建結構、導航網絡。但你還沒有真正面對最困難的問題——如何做出最佳決策。」</p>
        <p className="italic mb-2">「貪心策略有時有效，有時失敗。動態規劃總是正確，但代價高昂。回溯能窮舉一切，但速度緩慢。」</p>
        <p className="italic">「這裡沒有單一的『正確答案』。只有適應不同場景的『最優選擇』。」</p>
      </blockquote>
    </>
  );

  const loreContent = (
    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 120 年</p>
      <h3 className="text-lg font-semibold mb-4 text-primary">首席決策科學家記錄</h3>
      
      <div className="space-y-4">
        <p>「我們終於明白了所有策略的本質。」</p>
        <p>「貪心有時贏，DP 有時贏，回溯有時贏，分治有時贏。沒有銀子彈。」</p>
        <p>「真正的智慧，是在正確的時刻用正確的方法。」</p>
        <p>「但第 100 年，一個可怕的問題出現了——」</p>
        <p>「當我們試圖為整個文明找到『全局最優決策』時，我們陷入了無盡的計算。」</p>
        <p>「DP 表格變得過於龐大。回溯搜索窮盡了所有計算資源。」</p>
        <p>「我們開始意識到一個悖論：尋找最優解本身，就是一個 NP-hard 問題。」</p>
        <p>「計算最優解的成本，往往超過次優解帶來的損失。」</p>
        <p className="text-primary font-semibold">「也許，最優性本身就是一個陷阱。」</p>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground italic text-center">
        — 抉擇神殿的警示 —
      </div>
    </div>
  );

  const completionMessage = (
    <>
      <p>
        抉擇神殿的所有考驗已被完成。當你成功地運用了貪心、DP、回溯、分治，並理解了它們各自的適用場景時，整個殿堂爆發出耀眼的光芒。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left mt-4">
        <p className="text-foreground/90 italic mb-2">
          「你已經掌握了所有的策略。」
        </p>
        <p className="text-foreground/80 text-sm">
          智者緩緩走來：「貪心、DP、回溯、分治——沒有哪個問題能難倒你。但我必須告訴你一個殘酷的真相——真正的智慧，是知道何時停止優化。」
        </p>
      </blockquote>
    </>
  );

  return (
    <ChapterHubLayout
      chapterNumber={5}
      templeName="抉擇神殿"
      chapterTitle="決策與最優性"
      chapterDescription="這裡沒有具體的結構，沒有明確的道路。整個殿堂由無數閃爍的決策點組成——貪心、動態規劃、回溯、分治，尋求最佳決策的智慧考驗。"
      completedCount={completedCount}
      totalGates={gates.length}
      isChapterCompleted={chapterCompleted}
      showStoryDialog={showStoryDialog}
      setShowStoryDialog={setShowStoryDialog}
      showLoreDialog={showLoreDialog}
      setShowLoreDialog={setShowLoreDialog}
      storyContent={storyContent}
      loreContent={loreContent}
      loreTitle="古籍碎片：《最優性悖論》第五卷"
      storyText={storyText}
      autoPlayTTS={true}
      completionTitle="抉擇神殿已被征服"
      completionMessage={completionMessage}
    >
      {gates.map((gate, index) => (
        <GateCard
          key={gate.id}
          gate={gate}
          index={index}
          isCompleted={isGateCompleted(gate.id)}
          isUnlocked={isGateUnlocked(gate.id, gateOrder)}
          onClick={() => handleGateClick(gate)}
          theme={theme}
          sections={getGateSections(gate.id)}
        />
      ))}
    </ChapterHubLayout>
  );
};

export default Chapter5Hub;
