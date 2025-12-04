import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useChapterProgress } from "@/hooks/useChapterProgress";

const Chapter4Hub = () => {
  const { isGateUnlocked, isGateCompleted } = useChapterProgress('chapter4');

  const gateOrder = ['gate1', 'gate2', 'gate3', 'gate4', 'gate5'];

  const gates = [
    {
      id: 'gate1',
      title: "波紋探索 & 深淵探險",
      subtitle: "BFS & DFS",
      description: "兩種古老的探索法術——「波紋術」像水波層層擴散，保證找到最短路徑但需記住每層節點；「深淵術」則深入盡頭再回溯，節省記憶但可能走彎路。沒有萬能的方法，選擇遍歷方式本身就是策略。",
      algorithm: "圖遍歷",
      route: "/chapter4/gate1"
    },
    {
      id: 'gate2',
      title: "連接之橋",
      subtitle: "Minimum Spanning Tree",
      description: "一片島嶼群島需要橋樑相連。Kruskal 從最便宜的邊入手，確保不形成環；Prim 從起點逐步擴展最近的島嶼——殊途同歸，找到最小成本的連接方案。最優並不代表唯一。",
      algorithm: "最小生成樹",
      route: "/chapter4/gate2"
    },
    {
      id: 'gate3',
      title: "導航星盤",
      subtitle: "Dijkstra's Algorithm",
      description: "巨大的星盤在虛空中旋轉，標記著無數城市與距離。古人用來計算最短路徑的神器——永遠選擇「已知最短距離」中最小的節點擴展，貪心策略的經典勝利。但要小心，無法處理負權重邊。",
      algorithm: "單源最短路徑",
      route: "/chapter4/gate3"
    },
    {
      id: 'gate4',
      title: "依序啟動",
      subtitle: "Topological Sort",
      description: "任務卡片漂浮在虛空中，箭頭標示著依賴關係。拓撲排序確保每個任務在前置條件完成後才執行——若出現循環依賴，排序將無法完成，意味著項目本身有邏輯錯誤。秩序不只是排列，也是理解。",
      algorithm: "拓撲排序",
      route: "/chapter4/gate4"
    },
    {
      id: 'gate5',
      title: "全域視界",
      subtitle: "Floyd-Warshall",
      description: "巨大的距離矩陣在虛空中展開，最強大但也最昂貴的全對最短路徑算法。三重迴圈的魔法一次計算所有城市對的距離——代價是 O(n³) 的時間複雜度。當網絡規模龐大時，維護成本會指數級增長。",
      algorithm: "全對最短路徑",
      route: "/chapter4/gate5"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-['Cinzel']">
            網絡聖殿
          </h1>
          <p className="text-lg text-muted-foreground">
            第四章：全局視野與路徑規劃 - 超越樹，進入錯綜複雜的網絡空間。無數節點懸浮在虛空中，用光線互相連接，理解「全局最優」的真正意義
          </p>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {gates.map((gate, index) => {
            const unlocked = isGateUnlocked(gate.id, gateOrder);
            const completed = isGateCompleted(gate.id);

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={unlocked ? gate.route : "#"}
                  className={`block h-full ${!unlocked ? 'pointer-events-none' : ''}`}
                >
                  <div
                    className={`
                      relative p-6 rounded-lg border-2 h-full
                      transition-all duration-300
                      ${unlocked 
                        ? 'border-primary bg-card hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105' 
                        : 'border-muted bg-muted/50 opacity-50'
                      }
                    `}
                  >
                    {/* Status Icon */}
                    <div className="absolute top-4 right-4">
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : !unlocked ? (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-primary">
                          {gate.algorithm}
                        </span>
                        <h3 className="text-xl font-bold text-foreground mt-1 font-['Cinzel']">
                          {gate.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {gate.subtitle}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {gate.description}
                      </p>
                    </div>

                    {/* Enter Indicator */}
                    {unlocked && !completed && (
                      <div className="mt-4 text-sm font-medium text-primary">
                        進入關卡 →
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chapter4Hub;
