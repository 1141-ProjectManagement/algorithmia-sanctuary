import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import ChapterHubLayout from "@/components/ChapterHubLayout";
import GateCard, { GateData } from "@/components/GateCard";

const gates: GateData[] = [
  {
    id: "gate1",
    title: "波紋探索 & 深淵探險",
    subtitle: "BFS & DFS",
    description: "兩種古老的探索法術——「波紋術」像水波層層擴散，保證找到最短路徑但需記住每層節點；「深淵術」則深入盡頭再回溯，節省記憶但可能走彎路。沒有萬能的方法，選擇遍歷方式本身就是策略。",
    algorithm: "圖遍歷",
    route: "/chapter4/gate1",
  },
  {
    id: "gate2",
    title: "連接之橋",
    subtitle: "Minimum Spanning Tree",
    description: "一片島嶼群島需要橋樑相連。Kruskal 從最便宜的邊入手，確保不形成環；Prim 從起點逐步擴展最近的島嶼——殊途同歸，找到最小成本的連接方案。最優並不代表唯一。",
    algorithm: "最小生成樹",
    route: "/chapter4/gate2",
  },
  {
    id: "gate3",
    title: "導航星盤",
    subtitle: "Dijkstra's Algorithm",
    description: "巨大的星盤在虛空中旋轉，標記著無數城市與距離。古人用來計算最短路徑的神器——永遠選擇「已知最短距離」中最小的節點擴展，貪心策略的經典勝利。但要小心，無法處理負權重邊。",
    algorithm: "單源最短路徑",
    route: "/chapter4/gate3",
  },
  {
    id: "gate4",
    title: "依序啟動",
    subtitle: "Topological Sort",
    description: "任務卡片漂浮在虛空中，箭頭標示著依賴關係。拓撲排序確保每個任務在前置條件完成後才執行——若出現循環依賴，排序將無法完成，意味著項目本身有邏輯錯誤。秩序不只是排列，也是理解。",
    algorithm: "拓撲排序",
    route: "/chapter4/gate4",
  },
  {
    id: "gate5",
    title: "全域視界",
    subtitle: "Floyd-Warshall",
    description: "巨大的距離矩陣在虛空中展開，最強大但也最昂貴的全對最短路徑算法。三重迴圈的魔法一次計算所有城市對的距離——代價是 O(n³) 的時間複雜度。當網絡規模龐大時，維護成本會指數級增長。",
    algorithm: "全對最短路徑",
    route: "/chapter4/gate5",
  },
];

const gateOrder = gates.map((g) => g.id);

const Chapter4Hub = () => {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [showLoreDialog, setShowLoreDialog] = useState(false);

  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
  } = useChapterProgress("chapter4");

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
        走出階層聖域，景色再次變化。
      </p>
      <p>
        你不再面對整齊的樹林，而是一個錯綜複雜的網絡空間。無數的節點懸浮在虛空中，每個節點都用光線與其他節點相連。這些連接線互相交織，形成了一個密集而美麗的網絡。
      </p>
      <p>
        一位穿著長袍的網絡守護者緩緩走來。她的聲音帶著哲學家的深邃：
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
        <p className="italic mb-2">「歡迎來到網絡聖殿。」</p>
        <p className="italic mb-2">「在前面的冒險中，你掌握了線性和樹形的世界。但現實遠比樹更複雜——在這裡，一切都可以連接一切。」</p>
        <p className="italic mb-2">「圖沒有根，沒有方向，甚至可能有環。」</p>
        <p className="italic">「在這個迷宮般的世界中，找到路徑不再是簡單的遍歷，而是全局視野的展現。」</p>
      </blockquote>
    </>
  );

  const loreContent = (
    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 80 年</p>
      <h3 className="text-lg font-semibold mb-4 text-primary">網絡工程師記錄</h3>
      
      <div className="space-y-4">
        <p>「我們創造了有史以來最偉大的成就——全球知識網絡。」</p>
        <p>「所有的知識島嶼都被連接起來。任何人都可以從任何節點訪問任何其他節點。」</p>
        <p>「我們用最小生成樹優化了連接成本。我們用 Dijkstra 加速了信息傳遞。我們用拓撲排序確保了學習路徑的合理性。」</p>
        <p>「一切都看起來如此完美。」</p>
        <p>「但問題在第 50 年開始浮現。」</p>
        <p>「網絡變得過於龐大。維護成本開始超過預期。每增加一個新節點，都會影響到整個網絡的平衡。」</p>
        <p>「更糟的是，我們發現了一個悖論：全局最優路徑的計算成本隨著網絡規模呈三次方增長。」</p>
        <p className="text-primary font-semibold">「我們開始意識到——連接一切並不一定是最優解。」</p>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground italic text-center">
        — 網絡聖殿的警示 —
      </div>
    </div>
  );

  const completionMessage = (
    <>
      <p>
        網絡聖殿的所有謎題已被破解。當你成功地遍歷了圖、連接了島嶼、導航了星盤、排序了任務、計算了全域距離時，整個網絡空間泛起耀眼的光芒。
      </p>
      <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left mt-4">
        <p className="text-foreground/90 italic mb-2">
          「你已經掌握了圖論的精髓。」
        </p>
        <p className="text-foreground/80 text-sm">
          網絡守護者緩緩走來：「但你有沒有想過——當網絡變得越來越大，越來越複雜時，會發生什麼？維護的成本會超過收益嗎？」
        </p>
      </blockquote>
    </>
  );

  return (
    <ChapterHubLayout
      chapterNumber={4}
      templeName="網絡聖殿"
      chapterTitle="全局視野與路徑規劃"
      chapterDescription="超越樹，進入錯綜複雜的網絡空間。無數節點懸浮在虛空中，用光線互相連接，理解「全局最優」的真正意義。"
      completedCount={completedCount}
      totalGates={gates.length}
      isChapterCompleted={chapterCompleted}
      showStoryDialog={showStoryDialog}
      setShowStoryDialog={setShowStoryDialog}
      showLoreDialog={showLoreDialog}
      setShowLoreDialog={setShowLoreDialog}
      storyContent={storyContent}
      loreContent={loreContent}
      loreTitle="古籍碎片：《網絡紀元錄》第四卷"
      completionTitle="網絡聖殿已被征服"
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

export default Chapter4Hub;
