import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, ArrowRight, Sparkles, Scroll, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChapterProgress } from "@/hooks/useChapterProgress";

const gates = [
  {
    id: "gate1",
    name: "泡泡與交換之池",
    subtitle: "Bubble & Insertion Sort",
    route: "/chapter2/gate1",
    description: "靜謐的水晶池中，五彩的寶石在漂浮。它們互相撞擊，發出清脆的聲音。古人稱之為『泡泡術』和『插入術』——通過一次次的比較與交換，讓無序的寶石逐漸上浮到正確的位置。",
    narrative: "「看著它們。寶石正在緩慢地重新排列自己。這個過程緩慢卻直觀。你會看到每一次交換，每一次調整。當寶石最終排成一列時，你會欣賞到純粹的秩序之美。但要小心。這種方法的代價會在數據增多時暴露出來。」"
  },
  {
    id: "gate2",
    name: "分治殿堂",
    subtitle: "Merge & Quick Sort",
    route: "/chapter2/gate2",
    description: "進入下一個房間，你看到一個巨大的樹狀光束構造。這裡展示的是一種古老而強大的秘術——『分而治之』。複雜的問題被遞迴地分裂成小問題。每個小問題被解決後，再從底部向上合併，最終形成完美的秩序。",
    narrative: "「這是高效與優雅的結合。觀察光束的分裂與匯聚。理解遞迴的力量。」"
  },
  {
    id: "gate3",
    name: "折半星圖",
    subtitle: "Binary Search",
    route: "/chapter2/gate3",
    description: "一幅星圖在眼前展開，星球按順序排列。在已排序的星圖上，我們可以使用『折半術』——最古老的加速法。不要逐一檢查每顆星球。而要從中點開始。系統會告訴你『太遠』或『太近』，然後你消除一半的搜尋空間。",
    narrative: "「比較第一章的線性搜尋。這次，你會體驗到排序帶來的奇蹟——O(n) 的搜尋變成了 O(log n)。這就是秩序的威力。」"
  },
  {
    id: "gate4",
    name: "映射密室",
    subtitle: "Hash Table",
    route: "/chapter2/gate4",
    description: "一間充滿寶箱的密室出現在你眼前。古人發現了一個魔法：用一個魔法函數，可以直接將鑰匙對應到寶箱。不需要搜尋，不需要等待。只需一個計算，寶箱立即開啟。這就是 Hash Table 的秘密——平均情況下，查找速度是 O(1)。瞬間的。",
    narrative: "「但要小心。當鑰匙碰撞時會發生什麼？當寶箱溢滿時又會如何？古人解決了這些問題，但代價是什麼？」"
  },
  {
    id: "gate5",
    name: "滑動之窗",
    subtitle: "Sliding Window",
    route: "/chapter2/gate5",
    description: "一個半透明的窗格在陣列上滑動。『滑動之窗』是一個優雅的技巧。當你需要在連續數據中找到最優區段時，不需要重新計算每個位置。只要將窗口向前移動，添加新數據，移除舊數據。",
    narrative: "「觀察窗格移動時留下的金色軌跡。最優解的位置會被標記為星芒。這個技巧在許多領域都有應用。記住它。」"
  },
];

const gateOrder = gates.map((g) => g.id);

export default function Chapter2Hub() {
  const navigate = useNavigate();
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [showLoreDialog, setShowLoreDialog] = useState(false);
  
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
      {/* Opening Story Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-sm border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-['Cinzel'] text-primary">
              <Scroll className="w-7 h-7" />
              古老卷軸：秩序神殿
            </DialogTitle>
            <DialogDescription className="sr-only">
              第二章開場故事
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p className="text-lg">
                穿過啟程之殿的大門，你進入了秩序神殿。
              </p>
              <p>
                這裡與之前的遺跡截然不同。牆壁展現著從混亂到有序的壯美變化——一端是雜亂無章的色彩碎片，另一端是井然有序的彩虹光譜。
              </p>
              <p>
                一位優雅而嚴厲的守殿者現身。她的聲音帶著絕對的權威：
              </p>
              <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                <p className="italic mb-2">「歡迎來到秩序神殿。」</p>
                <p className="italic mb-2">「在這裡，混亂會被轉化為秩序。這不是選擇，而是必然。」</p>
                <p className="italic mb-2">「排序是一切力量的基礎。掌握它，你將能駕馭數據的力量；掌握不了，你將被混亂吞沒。」</p>
                <p className="italic">「你準備好了嗎？」</p>
              </blockquote>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowStoryDialog(false)} className="bg-primary hover:bg-primary/90">
              開始探索
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lore Fragment Dialog */}
      <Dialog open={showLoreDialog} onOpenChange={setShowLoreDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] bg-card/95 backdrop-blur-sm border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-['Cinzel'] text-primary">
              <BookOpen className="w-7 h-7" />
              古籍碎片：《秩序紀年誌》第二卷
            </DialogTitle>
            <DialogDescription className="sr-only">
              章節結束古籍碎片
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-4">
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground mb-2">Algorithmia 文明紀元 15 年</p>
                <h3 className="text-lg font-semibold mb-4 text-primary">歷史學家記載</h3>
                
                <div className="space-y-4">
                  <p>「排序技術的發明改變了一切。」</p>
                  <p>「現在，所有的知識都被組織得井然有序。檢索變得迅速。高效者開始掌握更多的資源。」</p>
                  <p>「但一個意想不到的現象出現了：社會開始分化。」</p>
                  <p>「那些掌握了排序與搜尋技巧的人成為了統治階級。他們能更快地存取最重要的信息，因此做出更快的決策。」</p>
                  <p>「而那些仍在使用線性搜尋的人逐漸被邊緣化。他們的決策速度太慢，無法跟上新時代。」</p>
                  <p>「我曾希望排序會讓所有人受益。但現在我明白，<span className="text-primary font-semibold">效率本身就是一種權力。它不是中立的。</span>」</p>
                  <p>「更快的算法不只是工具，它們是權力的分配器。」</p>
                  <p>「文明開始出現裂痕。我們創造的秩序，正在創造不公平。」</p>
                </div>
              </div>
              
              <div className="pt-4 text-sm text-muted-foreground italic text-center">
                — 秩序神殿的警示 —
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowLoreDialog(false)} variant="outline">
              關閉
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
              <span className="text-sm font-medium text-primary">秩序神殿</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-['Cinzel']">
              第二章：排序與加速
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              理解「排序」的力量，掌握「最適化」的藝術。從混亂到秩序，體驗演算法效率帶來的革命性轉變。
            </p>
            
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowStoryDialog(true)}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Scroll className="w-4 h-4 mr-2" />
                閱讀開場故事
              </Button>
              {chapterCompleted && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoreDialog(true)}
                  className="border-accent/30 hover:bg-accent/10"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  查看古籍碎片
                </Button>
              )}
            </div>
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
            className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/30 text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground font-['Cinzel']">
                🎉 秩序神殿已被征服
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                秩序神殿的最後考驗已被通過。當所有的寶石、星球、寶箱都井然有序時，整座神殿的牆面開始發出耀眼的金光。
              </p>
              <blockquote className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg max-w-2xl mx-auto text-left">
                <p className="text-foreground/90 italic mb-2">
                  「你已經理解了排序的力量。」
                </p>
                <p className="text-foreground/80 text-sm">
                  「但記住——排序本身需要時間。先排序後搜尋的策略，適用於需要多次搜尋的場景。如果只搜尋一次，線性搜尋反而更快。」
                </p>
                <p className="text-primary font-semibold text-sm mt-2">
                  「這就是演算法選擇的藝術。沒有絕對的勝者，只有適用於特定場景的最優解。」
                </p>
              </blockquote>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setShowLoreDialog(true)}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                閱讀古籍碎片
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90"
              >
                返回章節選單
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
