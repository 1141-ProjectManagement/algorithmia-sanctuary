import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useChapterProgress } from "@/hooks/useChapterProgress";

const gates = [
  {
    id: "gate1",
    name: "基礎排序",
    subtitle: "Bubble & Insertion Sort",
    route: "/chapter2/gate1",
    description: "理解排序的基礎思維。透過簡單直觀的 O(N²) 排序法，建立對「比較」與「交換」這兩個核心操作的體感。",
  },
  {
    id: "gate2",
    name: "合併/快速排序",
    subtitle: "Merge & Quick Sort",
    route: "/chapter2/gate2",
    description: "掌握高效排序的核心技術。學習「分治法」思想，理解 O(N log N) 複雜度如何大幅提升大規模數據的處理效率。",
  },
  {
    id: "gate3",
    name: "二元搜尋",
    subtitle: "Binary Search",
    route: "/chapter2/gate3",
    description: "學會利用「已排序」的特性進行極速搜尋。體現 O(log N) 複雜度的威力，是演算法中最重要的概念之一。",
  },
  {
    id: "gate4",
    name: "雜湊表",
    subtitle: "Hash Table",
    route: "/chapter2/gate4",
    description: "掌握「鍵值對應」的藝術。學習如何透過 Hash Function 建立直接映射關係，實現近乎 O(1) 的插入、刪除與查找。",
  },
  {
    id: "gate5",
    name: "滑動窗口",
    subtitle: "Sliding Window",
    route: "/chapter2/gate5",
    description: "學習一種優化技巧，用於處理連續子數組問題。將暴力解的 O(N²) 降至 O(N)，是解決特定類型陣列問題的利器。",
  },
];

const gateOrder = gates.map((g) => g.id);

export default function Chapter2Hub() {
  const navigate = useNavigate();
  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
  } = useChapterProgress("chapter2");

  const completedCount = getCompletedGatesCount();
  const progressPercentage = (completedCount / gates.length) * 100;
  const chapterCompleted = isChapterCompleted(gates.length);

  const handleGateClick = (gate: typeof gates[0]) => {
    if (isGateUnlocked(gate.id, gateOrder)) {
      navigate(gate.route);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(40,50,194,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">時序神殿</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Chapter 2: 排序與搜尋之術
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              在時序神殿中，你將學習如何高效地整理與尋找資料。從基礎的排序思維到進階的搜尋技巧，掌握處理大規模數據的核心能力。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  章節進度
                </span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} / {gates.length} 關卡完成
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gates.map((gate, index) => {
            const completed = isGateCompleted(gate.id);
            const unlocked = isGateUnlocked(gate.id, gateOrder);
            const locked = !unlocked;

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`
                    relative overflow-hidden transition-all duration-300 cursor-pointer group
                    ${locked ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:scale-[1.02]"}
                    ${completed ? "border-primary/50 bg-primary/5" : ""}
                    ${unlocked && !completed ? "border-accent/50 hover:border-accent" : ""}
                  `}
                  onClick={() => handleGateClick(gate)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    {locked && (
                      <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center backdrop-blur-sm">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    {completed && (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {gate.subtitle}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground">
                        {gate.name}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[80px]">
                      {gate.description}
                    </p>

                    {/* Action Button */}
                    <div className="pt-2">
                      {locked ? (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          完成上一關卡以解鎖
                        </div>
                      ) : completed ? (
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          重新挑戰
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          開始探索
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Decorative gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Chapter Completion Message */}
        {chapterCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/30 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              🎉 恭喜完成時序神殿！
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              你已經掌握了排序與搜尋的核心技術，從基礎的比較排序到高效的分治法，再到雜湊表與滑動窗口優化。繼續前往下一個神殿，探索更深奧的演算法奧秘！
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="mt-4 bg-primary hover:bg-primary/90"
            >
              返回章節選單
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
