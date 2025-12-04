import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { useChapterProgress } from "@/hooks/useChapterProgress";

const Chapter5Hub = () => {
  const { isGateCompleted, isGateUnlocked } = useChapterProgress("chapter5");

  const gates = [
    {
      id: "gate1",
      title: "貪婪試煉",
      subtitle: "Greedy Algorithm",
      description: "貪心策略很簡單——每一步都選擇當前看起來最優的選項。活在當下，不為未來擔憂。活動安排問題中選擇最早結束的活動，但背包問題中可能錯失全局最優。貪心的誘惑在於簡單，代價是可能錯失全局最優。",
      algorithm: "貪心策略",
      link: "/chapter5/gate1",
    },
    {
      id: "gate2",
      title: "記憶水晶",
      subtitle: "Dynamic Programming",
      description: "巨大的水晶矩陣在虛空中展開，每個格子都是一個子問題的答案。把大問題拆成小問題，記錄每個答案避免重複計算。背包、LCS、編輯距離——這就是「最優子結構」的威力，以空間換時間的經典範例。",
      algorithm: "動態規劃",
      link: "/chapter5/gate2",
    },
    {
      id: "gate3",
      title: "回溯迷宮",
      subtitle: "Backtracking",
      description: "巨大的迷宮在虛空中展開，無數條岔路，無數個可能性。嘗試所有可能，走錯就退回換條路。N皇后、數獨求解、組合生成——智慧的暴力破解，在發現錯誤時立即停止，剪枝大量無效分支。",
      algorithm: "回溯搜索",
      link: "/chapter5/gate3",
    },
    {
      id: "gate4",
      title: "分治戰場",
      subtitle: "Divide & Conquer",
      description: "巨大的問題在虛空中分裂成無數小問題，然後又逐層合併。分解→解決→合併，化繁為簡的終極體現。快速冪、大整數乘法、矩陣乘法——將 O(n²) 降到 O(n log n) 的優化範式。",
      algorithm: "分治思想",
      link: "/chapter5/gate4",
    },
  ];

  const gateOrder = gates.map(g => g.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with back button */}
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-cinzel">返回首頁</span>
        </Link>

        {/* Chapter Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-cinzel text-5xl md:text-6xl text-primary mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
            智慧殿堂
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            第五章：決策與最優性
          </p>
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-3xl mx-auto">
            這裡沒有具體的結構，沒有明確的道路。整個殿堂由無數閃爍的決策點組成——貪心、動態規劃、回溯、分治，尋求最佳決策的智慧考驗
          </p>
        </motion.div>

        {/* Gates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {gates.map((gate, index) => {
            const completed = isGateCompleted(gate.id);
            const unlocked = isGateUnlocked(gate.id, gateOrder);

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {unlocked ? (
                  <Link to={gate.link}>
                    <div className="relative group bg-card border-2 border-primary/30 rounded-lg p-6 hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 h-full">
                      {completed && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-primary">
                        {gate.algorithm}
                      </span>
                      <h3 className="font-cinzel text-2xl text-primary mt-1 mb-1">
                        {gate.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {gate.subtitle}
                      </span>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {gate.description}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="relative bg-card/50 border-2 border-muted rounded-lg p-6 opacity-60 cursor-not-allowed h-full">
                    <div className="absolute top-4 right-4">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {gate.algorithm}
                    </span>
                    <h3 className="font-cinzel text-2xl text-muted-foreground mt-1 mb-1">
                      {gate.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {gate.subtitle}
                    </span>
                    <p className="text-sm text-muted-foreground mt-3">
                      完成前一個關卡以解鎖
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chapter5Hub;
