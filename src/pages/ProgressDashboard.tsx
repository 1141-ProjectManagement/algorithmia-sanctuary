import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Play, CheckCircle, Lock, Trophy, Flame, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { getCurrentUser } from "@/lib/auth";

interface ChapterStats {
  chapterId: string;
  chapterName: string;
  chapterNameEn: string;
  totalGates: number;
  completedGates: number;
  teachCompleted: number;
  demoCompleted: number;
  testCompleted: number;
  path: string;
}

const CHAPTERS_CONFIG: Omit<ChapterStats, 'completedGates' | 'teachCompleted' | 'demoCompleted' | 'testCompleted'>[] = [
  { chapterId: "chapter1", chapterName: "起源聖殿", chapterNameEn: "Origin Temple", totalGates: 5, path: "/chapter1" },
  { chapterId: "chapter2", chapterName: "秩序神殿", chapterNameEn: "Order Temple", totalGates: 5, path: "/chapter2" },
  { chapterId: "chapter3", chapterName: "迴聲神殿", chapterNameEn: "Echo Temple", totalGates: 5, path: "/chapter3" },
  { chapterId: "chapter4", chapterName: "織徑神殿", chapterNameEn: "Weaving Temple", totalGates: 5, path: "/chapter4" },
  { chapterId: "chapter5", chapterName: "抉擇神殿", chapterNameEn: "Choice Temple", totalGates: 4, path: "/chapter5" },
  { chapterId: "chapter6", chapterName: "整合神殿", chapterNameEn: "Unity Temple", totalGates: 4, path: "/chapter6" },
];

const ProgressDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chaptersStats, setChaptersStats] = useState<ChapterStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress for all chapters
  const chapter1Progress = useChapterProgress("chapter1");
  const chapter2Progress = useChapterProgress("chapter2");
  const chapter3Progress = useChapterProgress("chapter3");
  const chapter4Progress = useChapterProgress("chapter4");
  const chapter5Progress = useChapterProgress("chapter5");
  const chapter6Progress = useChapterProgress("chapter6");

  const allProgressHooks = [
    chapter1Progress,
    chapter2Progress,
    chapter3Progress,
    chapter4Progress,
    chapter5Progress,
    chapter6Progress,
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const allLoaded = allProgressHooks.every(p => !p.isLoading);
    if (allLoaded) {
      const stats = CHAPTERS_CONFIG.map((config, index) => {
        const progress = allProgressHooks[index];
        const sectionStats = progress.getChapterSectionStats();
        return {
          ...config,
          completedGates: progress.getCompletedGatesCount(),
          teachCompleted: sectionStats.teachCompleted,
          demoCompleted: sectionStats.demoCompleted,
          testCompleted: sectionStats.testCompleted,
        };
      });
      setChaptersStats(stats);
      setIsLoading(false);
    }
  }, [
    chapter1Progress.isLoading,
    chapter2Progress.isLoading,
    chapter3Progress.isLoading,
    chapter4Progress.isLoading,
    chapter5Progress.isLoading,
    chapter6Progress.isLoading,
  ]);

  const totalGates = CHAPTERS_CONFIG.reduce((sum, c) => sum + c.totalGates, 0);
  const totalCompleted = chaptersStats.reduce((sum, c) => sum + c.completedGates, 0);
  const totalTeach = chaptersStats.reduce((sum, c) => sum + c.teachCompleted, 0);
  const totalDemo = chaptersStats.reduce((sum, c) => sum + c.demoCompleted, 0);
  const totalTest = chaptersStats.reduce((sum, c) => sum + c.testCompleted, 0);
  const overallProgress = totalGates > 0 ? (totalCompleted / totalGates) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 flex items-center justify-center"
        style={{
          background: "radial-gradient(ellipse at center, hsl(30, 15%, 8%) 0%, hsl(240, 10%, 4%) 100%)"
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-foreground/70 hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回首頁
        </Button>

        <div className="text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-2"
          >
            探索進度
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 font-inter"
          >
            Progress Dashboard
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center"
          >
            <p className="text-foreground/80">
              登入後可在雲端同步你的學習進度
            </p>
          </motion.div>
        )}

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-card/40 border border-primary/20 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <h2 className="font-cinzel text-2xl text-primary">總體進度</h2>
              </div>
              <span className="text-3xl font-bold text-primary">
                {overallProgress.toFixed(0)}%
              </span>
            </div>
            
            <Progress value={overallProgress} className="h-4 mb-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-foreground/60 text-sm">完成關卡</span>
                </div>
                <p className="text-2xl font-bold text-primary">{totalCompleted}/{totalGates}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-foreground/60 text-sm">教學完成</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">{totalTeach}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Play className="w-5 h-5 text-emerald-400" />
                  <span className="text-foreground/60 text-sm">演示完成</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400">{totalDemo}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-foreground/60 text-sm">測驗完成</span>
                </div>
                <p className="text-2xl font-bold text-orange-400">{totalTest}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-card/20 rounded-xl h-48 animate-pulse" />
            ))
          ) : (
            chaptersStats.map((chapter, index) => {
              const chapterProgress = chapter.totalGates > 0 
                ? (chapter.completedGates / chapter.totalGates) * 100 
                : 0;
              const isCompleted = chapter.completedGates === chapter.totalGates;

              return (
                <motion.div
                  key={chapter.chapterId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card/40 border border-primary/20 rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => navigate(chapter.path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-cinzel text-xl text-primary mb-1">
                        {chapter.chapterName}
                      </h3>
                      <p className="text-sm text-foreground/50">{chapter.chapterNameEn}</p>
                    </div>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : chapter.completedGates > 0 ? (
                      <div className="text-sm text-primary font-bold">
                        {chapterProgress.toFixed(0)}%
                      </div>
                    ) : (
                      <Lock className="w-5 h-5 text-foreground/30" />
                    )}
                  </div>

                  <Progress value={chapterProgress} className="h-2 mb-4" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">
                      {chapter.completedGates}/{chapter.totalGates} 關卡
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-blue-400/70">
                        <BookOpen className="w-3 h-3" />
                        {chapter.teachCompleted}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400/70">
                        <Play className="w-3 h-3" />
                        {chapter.demoCompleted}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400/70">
                        <Flame className="w-3 h-3" />
                        {chapter.testCompleted}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
