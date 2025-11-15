import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Award, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import stoneTablet from "@/assets/stone-tablet.jpg";
import lockedGate from "@/assets/locked-gate.png";
import foundationBadge from "@/assets/foundation-explorer-badge.png";
import efficiencyBadge from "@/assets/efficiency-eye-badge.png";

const gates = [
  {
    id: "gate-1",
    name: "尺規神殿",
    englishName: "Temple of Measurement",
    description: "掌握 Big O 時間複雜度的奧秘",
    route: "/chapter1/gate1",
    number: 1,
  },
  {
    id: "gate-2",
    name: "容器遺跡",
    englishName: "Ruins of Containers",
    description: "探索陣列與鏈結串列的差異",
    route: "/chapter1/gate2",
    number: 2,
  },
  {
    id: "gate-3",
    name: "堆疊之塔",
    englishName: "Tower of Stacks",
    description: "揭開後進先出的堆疊秘密",
    route: "/chapter1/gate3",
    number: 3,
  },
  {
    id: "gate-4",
    name: "佇列之門",
    englishName: "Gate of Queues",
    description: "理解先進先出的佇列原理",
    route: "/chapter1/gate4",
    number: 4,
  },
  {
    id: "gate-5",
    name: "石板遺跡發掘廳",
    englishName: "Hall of Linear Search",
    description: "學會線性搜尋的基本技巧",
    route: "/chapter1/gate5",
    number: 5,
  },
];

const gateOrder = gates.map((g) => g.id);

const Chapter1Hub = () => {
  const navigate = useNavigate();
  const {
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    hasBadge,
  } = useChapterProgress("chapter-1");

  const completedCount = getCompletedGatesCount();
  const progress = (completedCount / gates.length) * 100;
  const chapterComplete = isChapterCompleted(gates.length);

  const handleGateClick = (gate: typeof gates[0]) => {
    if (isGateUnlocked(gate.id, gateOrder)) {
      navigate(gate.route);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${stoneTablet})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

        <div className="relative z-10 container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首頁
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-['Cinzel'] text-4xl md:text-6xl font-bold text-primary mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              起源聖殿
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-2">
              Sanctuary of Beginnings
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              第一章：基礎資料結構與效率分析
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm text-muted-foreground">章節進度</span>
              <div className="flex items-center gap-2 mt-1">
                {gates.map((gate) => (
                  <div
                    key={gate.id}
                    className={`w-3 h-3 rounded-full transition-all ${
                      isGateCompleted(gate.id)
                        ? "bg-primary shadow-glow-gold"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {chapterComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-primary"
              >
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">章節完成！</span>
              </motion.div>
            )}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-amber-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{ boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Badge Shelf */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-['Cinzel'] text-primary mb-6 text-center">
            徽章收藏
          </h2>
          <div className="flex justify-center gap-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`text-center ${
                hasBadge("foundation-explorer") ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className="relative">
                <img
                  src={foundationBadge}
                  alt="基石探索者徽章"
                  className={`w-24 h-24 object-contain mx-auto ${
                    hasBadge("foundation-explorer")
                      ? "drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                      : ""
                  }`}
                />
                {!hasBadge("foundation-explorer") && (
                  <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm mt-2 text-foreground/80">基石探索者</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`text-center ${
                hasBadge("efficiency-eye") ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className="relative">
                <img
                  src={efficiencyBadge}
                  alt="效率之眼徽章"
                  className={`w-24 h-24 object-contain mx-auto ${
                    hasBadge("efficiency-eye")
                      ? "drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                      : ""
                  }`}
                />
                {!hasBadge("efficiency-eye") && (
                  <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm mt-2 text-foreground/80">效率之眼</p>
            </motion.div>
          </div>
          {chapterComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6 text-primary"
            >
              🎉 恭喜獲得所有徽章！
            </motion.p>
          )}
        </motion.div>

        {/* Gates Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-['Cinzel'] text-primary mb-8 text-center">
            五道神殿之門
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gates.map((gate, index) => {
              const isCompleted = isGateCompleted(gate.id);
              const isUnlocked = isGateUnlocked(gate.id, gateOrder);

              return (
                <motion.div
                  key={gate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => handleGateClick(gate)}
                    className={`relative p-6 bg-card/50 border-2 transition-all duration-300 min-h-[280px] ${
                      isUnlocked
                        ? "cursor-pointer hover:scale-105 border-primary/30 hover:border-primary/60"
                        : "opacity-60 cursor-not-allowed border-border"
                    } ${
                      isCompleted
                        ? "shadow-glow-gold border-primary"
                        : ""
                    }`}
                  >
                    {/* Gate Number */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold font-['Cinzel']">
                        {gate.number}
                      </span>
                    </div>

                    {/* Status Icons */}
                    <div className="absolute top-4 right-4">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : !isUnlocked ? (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      ) : null}
                    </div>

                    {/* Gate Visual */}
                    <div className="flex flex-col items-center mt-8 mb-4">
                      {!isUnlocked ? (
                        <img
                          src={lockedGate}
                          alt="鎖定的大門"
                          className="w-32 h-32 object-contain opacity-50"
                        />
                      ) : (
                        <div
                          className={`w-32 h-32 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-gradient-to-br from-primary/30 to-amber-glow/30 shadow-glow-gold"
                              : "bg-gradient-to-br from-primary/10 to-transparent"
                          }`}
                        >
                          <span className="text-5xl">🏛️</span>
                        </div>
                      )}
                    </div>

                    {/* Gate Info */}
                    <div className="text-center">
                      <h3 className="text-xl font-['Cinzel'] text-primary mb-1">
                        {gate.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 italic">
                        {gate.englishName}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {gate.description}
                      </p>

                      {isUnlocked && !isCompleted && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mt-3 text-sm text-primary font-medium"
                        >
                          點擊進入 →
                        </motion.div>
                      )}

                      {!isUnlocked && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          完成前一關以解鎖
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chapter Complete Message */}
        {chapterComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/30 text-center"
          >
            <Award className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-['Cinzel'] text-primary mb-3">
              章節完成！
            </h3>
            <p className="text-foreground/90 mb-6">
              恭喜你完成起源聖殿的所有挑戰！你已掌握基礎資料結構與效率分析的核心知識。
              準備好探索下一座神殿了嗎？
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
              onClick={() => navigate("/")}
            >
              返回探索地圖
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Chapter1Hub;
