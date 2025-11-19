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
      title: "Gate 1: 廣度/深度優先搜尋",
      description: "掌握遍歷圖的兩種核心方法。BFS 能找到無權重圖的最短路徑，DFS 則擅長探索所有可能性、檢測環路。",
      algorithm: "BFS/DFS",
      route: "/chapter4/gate1"
    },
    {
      id: 'gate2',
      title: "Gate 2: 最小生成樹",
      description: "學會用最低成本連接所有節點。Kruskal 和 Prim 演算法是解決網路鋪設、電路板佈線等成本最小化問題的經典方案。",
      algorithm: "MST",
      route: "/chapter4/gate2"
    },
    {
      id: 'gate3',
      title: "Gate 3: 戴克斯特拉演算法",
      description: "精通單點出發的最短路徑問題。解決地圖導航、網路路由等場景中，從一個起點到所有其他點的最短路徑計算。",
      algorithm: "Dijkstra",
      route: "/chapter4/gate3"
    },
    {
      id: 'gate4',
      title: "Gate 4: 拓撲排序",
      description: "學會安排有依賴關係的任務順序。應用於課程修課順序、專案管理、軟體編譯依賴等，確保任務在滿足其所有前置條件後才被執行。",
      algorithm: "Topological Sort",
      route: "/chapter4/gate4"
    },
    {
      id: 'gate5',
      title: "Gate 5: 弗洛伊德演算法",
      description: "解決「全對全」的最短路徑問題。一次性計算出圖中任意兩點之間的最短距離，適用於需要全域路徑資訊的場景。",
      algorithm: "Floyd-Warshall",
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            織徑神殿
          </h1>
          <p className="text-lg text-muted-foreground">
            第四章：圖論與路徑規劃 - 將視野擴展到複雜的「網路」結構，學習如何在點與點之間找到最佳的路徑與連接方式
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
                        <h3 className="text-xl font-bold text-foreground mt-1">
                          {gate.title}
                        </h3>
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
