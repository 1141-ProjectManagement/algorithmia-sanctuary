import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useChapterProgress } from "@/hooks/useChapterProgress";

const Chapter6Hub = () => {
  const navigate = useNavigate();
  const { isGateUnlocked, getCompletedGatesCount, isGateCompleted } = useChapterProgress("chapter6");

  const gates = [
    {
      id: "gate1",
      title: "並查集",
      description: "高效管理群組關係，以近乎 O(1) 的效率進行合併與查詢操作",
      route: "/chapter6/gate1",
    },
    {
      id: "gate2",
      title: "位元操作",
      description: "探索電腦運算的最小單位，利用位元級操作實現極致效能",
      route: "/chapter6/gate2",
    },
    {
      id: "gate3",
      title: "隨機化演算法",
      description: "理解隨機性在演算法中的力量，簡化問題或找到近似最優解",
      route: "/chapter6/gate3",
    },
    {
      id: "gate4",
      title: "綜合挑戰與 Boss 戰",
      description: "檢驗知識的遷移與應用能力，挑戰綜合性難題",
      route: "/chapter6/gate4",
    },
  ];

  const gateOrder = gates.map((g) => g.id);
  const progress = Math.round((getCompletedGatesCount() / gates.length) * 100);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse at top, hsl(30, 20%, 6%) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-temple-gold hover:text-temple-gold/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>

          <div className="text-center mb-8">
            <h1
              className="font-cinzel text-5xl md:text-7xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              整合神殿
            </h1>
            <p className="font-inter text-xl text-foreground/70 mb-2">Temple of Unity</p>
            <p className="font-inter text-base text-foreground/60 max-w-2xl mx-auto">融合所有知識，達至圓滿</p>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground/70">章節進度</span>
              <span className="text-sm font-semibold text-temple-gold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Gates grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gates.map((gate, index) => {
            const isUnlocked = isGateUnlocked(gate.id, gateOrder);
            const isCompleted = isGateCompleted(gate.id);

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <Card
                  onClick={() => {
                    if (isUnlocked) {
                      navigate(gate.route);
                    }
                  }}
                  className={`relative p-6 transition-all duration-300 ${
                    isUnlocked
                      ? "cursor-pointer hover:scale-105 bg-card/50 backdrop-blur-sm border-temple-gold/30"
                      : "opacity-60 cursor-not-allowed bg-card/30"
                  }`}
                  style={{
                    boxShadow: isUnlocked ? "0 0 20px rgba(212, 175, 55, 0.3)" : "none",
                  }}
                >
                  {/* Lock/Complete indicator */}
                  <div className="absolute top-4 right-4">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-temple-gold" />
                    ) : !isUnlocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-cinzel text-2xl font-bold text-temple-gold">{gate.title}</h3>
                    <p className="font-inter text-sm text-foreground/70 line-clamp-2">{gate.description}</p>

                    {isUnlocked && !isCompleted && (
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs text-primary font-medium pt-2"
                      >
                        點擊進入 →
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chapter6Hub;
