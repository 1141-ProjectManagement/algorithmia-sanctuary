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
    title: "遍歷之森",
    subtitle: "Tree Traversal",
    description: "古老的樹林在眼前展開，每個節點都閃爍著不同的光芒。前序、中序、後序——三種古老的訪問路徑，選擇不同的路徑，你會得到不同的訪問順序。",
    algorithm: "樹遍歷",
    route: "/chapter3/gate1",
  },
  {
    id: "gate2",
    title: "搜尋聖樹",
    subtitle: "Binary Search Tree",
    description: "一棵特殊的樹，左邊的節點更小，右邊的節點更大。它動態地維持著秩序，但要小心——如果插入的數據已經是排序的，樹會退化成一條線。",
    algorithm: "二元搜尋樹",
    route: "/chapter3/gate2",
  },
  {
    id: "gate3",
    title: "優先峰頂",
    subtitle: "Heap / Priority Queue",
    description: "金字塔形的結構，最重要的任務始終在頂端。Heapify 的過程就像一場無聲的芭蕾——每個元素在找到自己的位置前都會上下移動。",
    algorithm: "堆積 / 優先佇列",
    route: "/chapter3/gate3",
  },
  {
    id: "gate4",
    title: "編碼卷軸",
    subtitle: "Huffman Coding",
    description: "古老的卷軸展開，上面是密集的符文。根據符文的使用頻率來分配編碼長度——常用的符文用短碼，罕見的符文用長碼。這是最優化的經典例子。",
    algorithm: "霍夫曼編碼",
    route: "/chapter3/gate4",
  },
  {
    id: "gate5",
    title: "雙指引路",
    subtitle: "Two Pointers",
    description: "兩個發光的指針在陣列上移動。一個快速，一個緩慢。一個從左，一個從右。他們會在某個地方相遇——這個簡單但優雅的技巧在許多高級演算法中都有應用。",
    algorithm: "雙指針技巧",
    route: "/chapter3/gate5",
  },
];

const gateOrder = gates.map((g) => g.id);
const theme = getChapterTheme(3);

// Plain text version of story for TTS
const storyText = `穿越秩序神殿的大門後，景色驟然改變。你不再面對簡單的線性世界。眼前是一片古老的樹林，樹木彼此相連，形成了複雜的網絡。樹枝向四面八方延伸，樹根深深扎入地下。一位長者現身。他的聲音在樹林中迴盪。「歡迎來到迴聲神殿。」「你已經掌握了線性的秩序。但現實遠比一條直線複雜。」「在這裡，知識以樹的形式生長。每個節點都有父親與孩子。每條路徑都代表著不同的邏輯分支。」「要深入 Algorithmia 的秘密，你必須學會在樹的世界中導航。」`;

const Chapter3Hub = () => {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(true);
  const [showLoreDialog, setShowLoreDialog] = useState(false);

  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    getGateSections,
  } = useChapterProgress("chapter3");

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
        穿越秩序神殿的大門後，景色驟然改變。
      </p>
      <p>
        你不再面對簡單的線性世界。眼前是一片古老的樹林，樹木彼此相連，形成了複雜的網絡。樹枝向四面八方延伸，樹根深深扎入地下。
      </p>
      <p>
        一位長者現身。他的聲音在樹林中迴盪：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">「歡迎來到迴聲神殿。」</p>
        <p className="italic mb-2">「你已經掌握了線性的秩序。但現實遠比一條直線複雜。」</p>
        <p className="italic mb-2">「在這裡，知識以樹的形式生長。每個節點都有父親與孩子。每條路徑都代表著不同的邏輯分支。」</p>
        <p className="italic">「要深入 Algorithmia 的秘密，你必須學會在樹的世界中導航。」</p>
      </blockquote>
    </>
  );

  const loreContent = (
    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 45 年</p>
      <h3 className="text-lg font-semibold mb-4 text-primary">哲學家手記</h3>
      
      <div className="space-y-4">
        <p>「樹形結構的誕生改變了我們的政治結構。」</p>
        <p>「如果說排序創造了水平的不平等，那麼樹形結構則創造了垂直的等級制度。」</p>
        <p>「每個知識領域都被組織成一棵樹。樹根是基礎概念，樹幹是進階知識，樹葉是具體應用。」</p>
        <p>「那些掌握樹根的人——也就是理論家——開始成為新的統治者。」</p>
        <p>「而最危險的是，這個結構內置了『權力集中』的傾向。根節點擁有的權力最大，越往外圍的葉節點權力越小。」</p>
        <p>「我們創造的結構正在反過來塑造我們的社會。」</p>
        <p>「更恐怖的是，有人開始提議用『最優堆積』的邏輯來安排政治等級——最優先的人應該永遠在頂端。」</p>
        <p className="text-primary font-semibold">「文明變得更高效，但也變得更不公平。」</p>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground italic text-center">
        — 迴聲神殿的警示 —
      </div>
    </div>
  );

  const completionMessage = (
    <>
      <p>
        古老樹林的謎題已被破解。當你成功地遍歷了所有的樹，優先級堆完美地排列，編碼卷軸展開了它的秘密時，樹林中發出了溫暖的光芒。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left mt-4">
        <p className="text-foreground/90 italic mb-2">
          「你已經開始理解複雜的結構。」
        </p>
        <p className="text-foreground/80 text-sm">
          長者點了點頭：「但記住——樹只是開始。在不久的將來，你會發現樹之間也可以相連。當樹失去了其樹的限制，成為圖時，複雜性會達到全新的高度。」
        </p>
      </blockquote>
    </>
  );

  return (
    <ProtectedChapter chapterNumber={3}>
      <ChapterHubLayout
        chapterNumber={3}
        templeName="迴聲神殿"
        chapterTitle="結構與關係"
        chapterDescription="從線性到分層，管理「父子關係」與「優先級」。在樹的世界中導航，理解層次結構的力量與陷阱。"
        completedCount={completedCount}
        totalGates={gates.length}
        isChapterCompleted={chapterCompleted}
        showStoryDialog={showStoryDialog}
        setShowStoryDialog={setShowStoryDialog}
        showLoreDialog={showLoreDialog}
        setShowLoreDialog={setShowLoreDialog}
        storyContent={storyContent}
        loreContent={loreContent}
        loreTitle="古籍碎片：《權力經——階層篇》"
        storyText={storyText}
        autoPlayTTS={true}
        completionTitle="迴聲神殿已被征服"
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
};

export default Chapter3Hub;
