import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChapterProgress } from "@/hooks/useChapterProgress";

const Chapter3Hub = () => {
  const { isGateCompleted, isGateUnlocked } = useChapterProgress("chapter3");

  const gates = [
    {
      id: "gate1",
      title: "第一道門扉：二元樹遍歷",
      description: "學習系統性訪問樹中所有節點的方法。前序、中序、後序遍歷是處理樹狀數據的基礎操作，應用於檔案系統、DOM 渲染等。",
      route: "/chapter3/gate1",
    },
    {
      id: "gate2",
      title: "第二道門扉：二元搜尋樹 (BST)",
      description: "學習一種自帶排序功能的樹。BST 結合了二元搜尋的快速與鏈結串列的彈性，能高效地進行數據的查找、插入與刪除。",
      route: "/chapter3/gate2",
    },
    {
      id: "gate3",
      title: "第三道門扉：堆積 (Heap / Priority Queue)",
      description: "掌握管理「優先級」的最高效結構。Heap 能在 O(log N) 時間內插入元素並取出最大/最小值，是實現優先級佇列和解決 Top-K 問題的關鍵。",
      route: "/chapter3/gate3",
    },
    {
      id: "gate4",
      title: "第四道門扉：霍夫曼編碼",
      description: "理解貪婪演算法與樹狀結構的經典應用。學習如何根據字元頻率建構最佳前綴碼樹，以實現無損資料壓縮。",
      route: "/chapter3/gate4",
    },
    {
      id: "gate5",
      title: "第五道門扉：雙指針 (Two Pointers)",
      description: "學習另一種陣列/字串的優化技巧。透過同向或對向移動的兩個指針，將雙重迴圈問題簡化為單次遍歷，有效降低時間複雜度。",
      route: "/chapter3/gate5",
    },
  ];

  const gateOrder = gates.map((g) => g.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回主選單
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          >
            迴聲神殿
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-4"
          >
            第三章：樹狀結構與優先級
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-muted-foreground max-w-2xl mx-auto"
          >
            從線性世界進入非線性的階層世界，處理更複雜的父子關係數據，並學會如何管理任務的優先順序。
          </motion.p>
        </div>
      </section>

      {/* Gates Grid */}
      <section className="py-12 px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {gates.map((gate, index) => {
              const completed = isGateCompleted(gate.id);
              const unlocked = isGateUnlocked(gate.id, gateOrder);

              return (
                <motion.div
                  key={gate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={unlocked ? gate.route : "#"}
                    className={`block ${!unlocked && "pointer-events-none"}`}
                  >
                    <div
                      className={`
                        relative p-6 rounded-lg border-2 transition-all duration-300
                        ${
                          completed
                            ? "border-primary/50 bg-primary/5"
                            : unlocked
                            ? "border-accent/50 bg-accent/5 hover:border-accent hover:shadow-lg hover:shadow-accent/20"
                            : "border-muted/30 bg-muted/5 opacity-50"
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

                      {/* Gate Number */}
                      <div className="text-sm font-semibold text-muted-foreground mb-2">
                        Gate {index + 1}
                      </div>

                      {/* Gate Title */}
                      <h3 className="text-xl font-bold mb-3 pr-8">
                        {gate.title}
                      </h3>

                      {/* Gate Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {gate.description}
                      </p>

                      {/* Call to Action */}
                      {unlocked && !completed && (
                        <div className="mt-4 flex items-center gap-2 text-accent font-semibold">
                          開始挑戰
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chapter3Hub;
