import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import ChapterHubLayout from "@/components/ChapterHubLayout";
import GateCard, { GateData } from "@/components/GateCard";

const gates: GateData[] = [
  {
    id: "gate1",
    title: "聯合之印",
    subtitle: "Union-Find",
    description: "學習古老的『聯盟術』，以近乎 O(1) 的效率管理群組關係與連通性。當兩個元素需要合併時，只需簡單的指向操作。路徑壓縮讓每次查詢都更快。",
    algorithm: "並查集",
    route: "/chapter6/gate1",
  },
  {
    id: "gate2",
    title: "位元聖典",
    subtitle: "Bit Manipulation",
    description: "探索運算的最底層奧秘，用 0 與 1 的魔法實現極致效能。位元運算是電腦世界的原始語言，掌握它，你將能與機器直接對話。",
    algorithm: "位元運算",
    route: "/chapter6/gate2",
  },
  {
    id: "gate3",
    title: "命運骰子",
    subtitle: "Randomized Algorithms",
    description: "擁抱不確定性的力量，讓隨機性成為解題的利器。蒙地卡羅方法證明了：有時候，不確定的答案比確定的計算更有價值。",
    algorithm: "隨機演算法",
    route: "/chapter6/gate3",
  },
  {
    id: "gate4",
    title: "終極審判",
    subtitle: "Final Boss",
    description: "融合所有知識，面對文明最後的考驗與真相的揭示。在這裡，你將運用一切所學，解開 Algorithmia 文明消亡的終極謎題。",
    algorithm: "綜合應用",
    route: "/chapter6/gate4",
  },
];

const gateOrder = gates.map((g) => g.id);

const Chapter6Hub = () => {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [showLoreDialog, setShowLoreDialog] = useState(false);

  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
  } = useChapterProgress("chapter6");

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
        穿越所有試煉後，你終於來到了最後的聖殿。
      </p>
      <p>
        這裡是整合神殿——Algorithmia 文明的終點，也是所有知識匯聚的地方。牆壁上刻滿了你在旅途中見過的所有符文，它們現在以全新的方式組合在一起。
      </p>
      <p>
        一位年邁的守殿者站在中央，他的眼中既有智慧也有悲傷：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">「歡迎來到整合神殿。」</p>
        <p className="italic mb-2">「你已經走了很長的路。時間複雜度、排序、樹、圖、決策策略——這些都是我們文明的精華。」</p>
        <p className="italic mb-2">「但在這裡，你將學習最後的秘密：如何將所有知識融合為一。」</p>
        <p className="italic">「以及...我們文明為何消亡的真相。」</p>
      </blockquote>
    </>
  );

  const loreContent = (
    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 200 年</p>
      <h3 className="text-lg font-semibold mb-4 text-primary">最後的記錄者</h3>
      
      <div className="space-y-4">
        <p>「這是我們文明的最後記錄。」</p>
        <p>「我們追求了完美的效率。我們創造了完美的排序。我們建立了完美的網絡。我們計算了完美的最優解。」</p>
        <p>「但我們忘記了一件事——完美本身就是不完美的。」</p>
        <p>「當一切都被優化到極致，就沒有了成長的空間。當所有路徑都被計算過，就沒有了探索的樂趣。當所有決策都是最優的，就沒有了選擇的自由。」</p>
        <p>「我們的文明死於它自己的成功。」</p>
        <p>「給未來的探索者：」</p>
        <p className="text-primary font-semibold">「學習演算法，但不要被演算法束縛。追求效率，但不要忘記意義。尋找最優解，但也要接受不完美。」</p>
        <p>「這就是我們用滅亡換來的智慧。」</p>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground italic text-center">
        — 整合神殿的最終啟示 —
      </div>
    </div>
  );

  const completionMessage = (
    <>
      <p>
        整合神殿的所有謎題已被解開。當你融合了所有知識，理解了文明的興衰，整座神殿開始發出柔和而持久的光芒。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left mt-4">
        <p className="text-foreground/90 italic mb-2">
          「恭喜你，探索者。你已經完成了 Algorithmia 的全部旅程。」
        </p>
        <p className="text-foreground/80 text-sm">
          守殿者微笑著：「現在你擁有了我們文明所有的知識。但更重要的是，你也學到了我們的教訓。願你用這些智慧創造比我們更好的未來。」
        </p>
      </blockquote>
    </>
  );

  return (
    <ChapterHubLayout
      chapterNumber={6}
      templeName="整合神殿"
      chapterTitle="終極整合"
      chapterDescription="穿越所有試煉，揭開 Algorithmia 文明的最終真相。將所有知識融合為一，理解文明興衰的深層意義。"
      completedCount={completedCount}
      totalGates={gates.length}
      isChapterCompleted={chapterCompleted}
      showStoryDialog={showStoryDialog}
      setShowStoryDialog={setShowStoryDialog}
      showLoreDialog={showLoreDialog}
      setShowLoreDialog={setShowLoreDialog}
      storyContent={storyContent}
      loreContent={loreContent}
      loreTitle="古籍碎片：《終章——文明的遺言》"
      completionTitle="整合神殿已被征服"
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
        />
      ))}
    </ChapterHubLayout>
  );
};

export default Chapter6Hub;
