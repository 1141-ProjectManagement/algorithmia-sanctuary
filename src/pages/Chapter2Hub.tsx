import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import ChapterHubLayout from "@/components/ChapterHubLayout";
import GateCard, { GateData } from "@/components/GateCard";
import { getChapterTheme } from "@/config/chapterThemes";
import ProtectedChapter from "@/components/ProtectedChapter";

const gates: GateData[] = [
  {
    id: "gate1",
    title: "泡泡與交換之池",
    subtitle: "Bubble & Insertion Sort",
    description: "靜謐的水晶池中，五彩的寶石在漂浮。它們互相撞擊，發出清脆的聲音。古人稱之為『泡泡術』和『插入術』——通過一次次的比較與交換，讓無序的寶石逐漸上浮到正確的位置。",
    algorithm: "基礎排序",
    route: "/chapter2/gate1",
  },
  {
    id: "gate2",
    title: "分治殿堂",
    subtitle: "Merge & Quick Sort",
    description: "進入下一個房間，你看到一個巨大的樹狀光束構造。這裡展示的是一種古老而強大的秘術——『分而治之』。複雜的問題被遞迴地分裂成小問題。每個小問題被解決後，再從底部向上合併，最終形成完美的秩序。",
    algorithm: "分治排序",
    route: "/chapter2/gate2",
  },
  {
    id: "gate3",
    title: "折半星圖",
    subtitle: "Binary Search",
    description: "一幅星圖在眼前展開，星球按順序排列。在已排序的星圖上，我們可以使用『折半術』——最古老的加速法。不要逐一檢查每顆星球。而要從中點開始。系統會告訴你『太遠』或『太近』，然後你消除一半的搜尋空間。",
    algorithm: "二分搜尋",
    route: "/chapter2/gate3",
  },
  {
    id: "gate4",
    title: "映射密室",
    subtitle: "Hash Table",
    description: "一間充滿寶箱的密室出現在你眼前。古人發現了一個魔法：用一個魔法函數，可以直接將鑰匙對應到寶箱。不需要搜尋，不需要等待。只需一個計算，寶箱立即開啟。這就是 Hash Table 的秘密——平均情況下，查找速度是 O(1)。",
    algorithm: "雜湊表",
    route: "/chapter2/gate4",
  },
  {
    id: "gate5",
    title: "滑動之窗",
    subtitle: "Sliding Window",
    description: "一個半透明的窗格在陣列上滑動。『滑動之窗』是一個優雅的技巧。當你需要在連續數據中找到最優區段時，不需要重新計算每個位置。只要將窗口向前移動，添加新數據，移除舊數據。",
    algorithm: "滑動視窗",
    route: "/chapter2/gate5",
  },
];

const gateOrder = gates.map((g) => g.id);
const theme = getChapterTheme(2);

// Plain text version of story for TTS
const storyText = `穿過啟程之殿的大門，你進入了秩序神殿。這裡與之前的遺跡截然不同。牆壁展現著從混亂到有序的壯美變化——一端是雜亂無章的色彩碎片，另一端是井然有序的彩虹光譜。一位優雅而嚴厲的守殿者現身。她的聲音帶著絕對的權威。「歡迎來到秩序神殿。」「在這裡，混亂會被轉化為秩序。這不是選擇，而是必然。」「排序是一切力量的基礎。掌握它，你將能駕馭數據的力量；掌握不了，你將被混亂吞沒。」「你準備好了嗎？」`;

export default function Chapter2Hub() {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showLoreDialog, setShowLoreDialog] = useState(false);
  
  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    getGateSections,
  } = useChapterProgress("chapter2");

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
        穿過啟程之殿的大門，你進入了秩序神殿。
      </p>
      <p>
        這裡與之前的遺跡截然不同。牆壁展現著從混亂到有序的壯美變化——一端是雜亂無章的色彩碎片，另一端是井然有序的彩虹光譜。
      </p>
      <p>
        一位優雅而嚴厲的守殿者現身。她的聲音帶著絕對的權威：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">「歡迎來到秩序神殿。」</p>
        <p className="italic mb-2">「在這裡，混亂會被轉化為秩序。這不是選擇，而是必然。」</p>
        <p className="italic mb-2">「排序是一切力量的基礎。掌握它，你將能駕馭數據的力量；掌握不了，你將被混亂吞沒。」</p>
        <p className="italic">「你準備好了嗎？」</p>
      </blockquote>
    </>
  );

  const loreContent = (
    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 15 年</p>
      <h3 className="text-lg font-semibold mb-4 text-primary">歷史學家記載</h3>
      
      <div className="space-y-4">
        <p>「排序技術的發明改變了一切。」</p>
        <p>「現在，所有的知識都被組織得井然有序。檢索變得迅速。高效者開始掌握更多的資源。」</p>
        <p>「但一個意想不到的現象出現了：社會開始分化。」</p>
        <p>「那些掌握了排序與搜尋技巧的人成為了統治階級。他們能更快地存取最重要的信息，因此做出更快的決策。」</p>
        <p>「而那些仍在使用線性搜尋的人逐漸被邊緣化。他們的決策速度太慢，無法跟上新時代。」</p>
        <p>「我曾希望排序會讓所有人受益。但現在我明白，<span className="text-primary font-semibold">效率本身就是一種權力。它不是中立的。</span>」</p>
        <p>「更快的算法不只是工具，它們是權力的分配器。」</p>
        <p>「文明開始出現裂痕。我們創造的秩序，正在創造不公平。」</p>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground italic text-center">
        — 秩序神殿的警示 —
      </div>
    </div>
  );

  const completionMessage = (
    <>
      <p>
        秩序神殿的最後考驗已被通過。當所有的寶石、星球、寶箱都井然有序時，整座神殿的牆面開始發出耀眼的金光。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left mt-4">
        <p className="text-foreground/90 italic mb-2">
          「你已經理解了排序的力量。」
        </p>
        <p className="text-foreground/80 text-sm">
          守殿者的聲音帶著一絲敬意：「但力量會帶來責任。古籍會告訴你，我們的先人如何因為追求效率而付出代價。」
        </p>
      </blockquote>
    </>
  );

  return (
    <ProtectedChapter chapterNumber={2}>
      <ChapterHubLayout
        chapterNumber={2}
        templeName="時序神殿"
        chapterTitle="排序與加速"
        chapterDescription="理解「排序」的力量，掌握「最適化」的藝術。從混亂到秩序，體驗演算法效率帶來的革命性轉變。"
        completedCount={completedCount}
        totalGates={gates.length}
        isChapterCompleted={chapterCompleted}
        showStoryDialog={showStoryDialog}
        setShowStoryDialog={setShowStoryDialog}
        showLoreDialog={showLoreDialog}
        setShowLoreDialog={setShowLoreDialog}
        storyContent={storyContent}
        loreContent={loreContent}
        loreTitle="古籍碎片：《秩序紀年誌》第二卷"
        storyText={storyText}
        autoPlayTTS={true}
        completionTitle="時序神殿已被征服"
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
    </ProtectedChapter>
  );
}
