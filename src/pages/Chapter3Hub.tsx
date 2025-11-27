import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle, ChevronRight, Scroll, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chapter3Hub = () => {
  const { isGateCompleted, isGateUnlocked, getCompletedGatesCount, isChapterCompleted } = useChapterProgress("chapter3");
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [showLoreDialog, setShowLoreDialog] = useState(false);

  const gates = [
    {
      id: "gate1",
      title: "第一道門扉：遍歷之森",
      description: "三種古老的訪問路徑——前序、中序、後序。選擇不同的路徑，你會得到不同的訪問順序。前序用於複製樹，中序用於排序，後序用於清理。每種路徑都有其用途。",
      narrative: "古老的樹林在眼前展開。樹的每個節點都閃爍著不同的光芒。「這是『遍歷之森』。」「在樹形結構中，訪問每個節點有不同的方式。前序、中序、後序——三種古老的訪問路徑。」「選擇不同的路徑，你會得到不同的訪問順序。」「這不只是學術練習。不同的遍歷順序對應著不同的問題解法。前序用於複製樹，中序用於排序，後序用於清理。」「每種路徑都有其用途。」",
      route: "/chapter3/gate1",
    },
    {
      id: "gate2",
      title: "第二道門扉：搜尋聖樹",
      description: "一種自帶排序功能的結構。與普通的排序陣列不同，二元搜尋樹允許高效的插入與刪除，動態地維持著秩序。但要小心——如果插入的數據已排序，樹會退化成一條線。",
      narrative: "一棵特殊的樹出現在眼前。它的結構看起來是有序的——左邊的節點更小，右邊的節點更大。「這是『搜尋聖樹』——一種自帶排序功能的結構。」「與普通的排序陣列不同，二元搜尋樹允許高效的插入與刪除。它動態地維持著秩序。」「但要小心。如果插入的數據已經是排序的，樹會退化成一條線。秩序的維持需要平衡。」「古人後來發明了平衡樹來解決這個問題。但那是另一個故事了。」",
      route: "/chapter3/gate2",
    },
    {
      id: "gate3",
      title: "第三道門扉：優先峰頂",
      description: "金字塔形的結構，最重要的任務始終在頂端。當新任務被加入時，結構會自動調整，最優先的任務始終浮上表面。Heapify 的過程就像一場無聲的芭蕾——每個元素都在尋找自己的位置。",
      narrative: "一個金字塔形的結構出現了。最重要的任務始終在頂端。「這是『優先峰頂』。」「堆積是一種特殊的樹形結構，它維持著一個簡單但強大的不變量：父節點的優先級永遠高於子節點。」「當新任務被加入時，結構會自動調整。最優先的任務始終浮上表面。」「Heapify 的過程就像一場無聲的芭蕾——每個元素在找到自己的位置前都會上下移動。」「看著金色光芒流動。感受秩序在自我維持。」",
      route: "/chapter3/gate3",
    },
    {
      id: "gate4",
      title: "第四道門扉：編碼卷軸",
      description: "根據符文的使用頻率來分配編碼長度，常用的符文用短碼，罕見的符文用長碼。編碼樹會根據頻率動態生成，看著樹如何根據數據的特性自我調整。這是最優化的經典例子。",
      narrative: "古老的卷軸展開，上面是密集的符文。「這是『霍夫曼編碼卷軸』。」「古人發現，如果根據符文的使用頻率來分配編碼長度，就能壓縮信息。常用的符文用短碼，罕見的符文用長碼。」「編碼樹會根據頻率動態生成。看著樹如何根據數據的特性自我調整。」「這是最優化的經典例子——給定約束條件，找到最佳的編碼方案。」",
      route: "/chapter3/gate4",
    },
    {
      id: "gate5",
      title: "第五道門扉：雙指引路",
      description: "兩個指針可以從不同方向逼近目標。一個快速，一個緩慢。一個從左，一個從右。他們會在某個地方相遇。不必使用嵌套迴圈，這個簡單但強大的技巧在許多高級演算法中都有應用。",
      narrative: "兩個發光的指針在陣列上移動。「『雙指引路』是一個簡單但強大的技巧。」「當你需要在陣列中找到特定的組合時，不必使用嵌套迴圈。兩個指針可以從不同方向逼近目標。」「一個快速，一個緩慢。一個從左，一個從右。他們會在某個地方相遇。」「這個技巧在許多高級演算法中都有應用。記住這個簡單但優雅的想法。」",
      route: "/chapter3/gate5",
    },
  ];

  const gateOrder = gates.map((g) => g.id);
  const totalGates = gates.length;
  const chapterCompleted = isChapterCompleted(totalGates);

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
            階層聖域
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-4"
          >
            第三章：結構與關係
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            從線性到分層，管理「父子關係」與「優先級」。
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button
              variant="outline"
              onClick={() => setShowStoryDialog(true)}
              className="gap-2"
            >
              <Scroll className="w-4 h-4" />
              閱讀開場故事
            </Button>
            {chapterCompleted && (
              <Button
                variant="default"
                onClick={() => setShowLoreDialog(true)}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                查看古籍碎片
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Opening Story Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Cinzel'] text-primary flex items-center gap-2">
              <Scroll className="w-6 h-6" />
              古老卷軸：階層聖域
            </DialogTitle>
            <DialogDescription className="sr-only">
              第三章開場故事
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>穿越秩序神殿的大門後，景色驟然改變。</p>
              <p>你不再面對簡單的線性世界。眼前是一片古老的樹林，樹木彼此相連，形成了複雜的網絡。樹枝向四面八方延伸，樹根深深扎入地下。</p>
              <p>一位長者現身。他的聲音在樹林中迴盪：</p>
              <p className="pl-4 border-l-2 border-primary/50 italic">
                「歡迎來到階層聖域。」
              </p>
              <p className="pl-4 border-l-2 border-primary/50 italic">
                「你已經掌握了線性的秩序。但現實遠比一條直線複雜。」
              </p>
              <p className="pl-4 border-l-2 border-primary/50 italic">
                「在這裡，知識以樹的形式生長。每個節點都有父親與孩子。每條路徑都代表著不同的邏輯分支。」
              </p>
              <p className="pl-4 border-l-2 border-primary/50 italic">
                「要深入 Algorithmia 的秘密，你必須學會在樹的世界中導航。」
              </p>
              <p className="pl-4 border-l-2 border-primary/50 italic">
                「準備好了嗎？」
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Lore Fragment Dialog */}
      <Dialog open={showLoreDialog} onOpenChange={setShowLoreDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Cinzel'] text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              古籍碎片：權力經——階層篇
            </DialogTitle>
            <DialogDescription className="sr-only">
              第三章古籍碎片
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p className="font-semibold text-primary">【《權力經——階層篇》】</p>
              <p>「樹形結構的誕生改變了我們的政治結構。」</p>
              <p>「如果說排序創造了水平的不平等，那麼樹形結構則創造了垂直的等級制度。」</p>
              <p>「每個知識領域都被組織成一棵樹。樹根是基礎概念，樹幹是進階知識，樹葉是具體應用。」</p>
              <p>「那些掌握樹根的人——也就是理論家——開始成為新的統治者。」</p>
              <p>「而最危險的是，這個結構內置了『權力集中』的傾向。根節點擁有的權力最大，越往外圍的葉節點權力越小。」</p>
              <p>「我們創造的結構正在反過來塑造我們的社會。」</p>
              <p>「更恐怖的是，有人開始提議用『最優堆積』的邏輯來安排政治等級——最優先的人應該永遠在頂端。」</p>
              <p>「文明變得更高效，但也變得更不公平。」</p>
              <p className="text-muted-foreground italic">「我開始懷疑，我們到底是在進化還是在自毀？」</p>
              <p className="text-right text-sm text-muted-foreground mt-6">
                —— Algorithmia 文明紀元 45 年，哲學家手記
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Chapter Completion Message */}
      {chapterCompleted && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/10 border-2 border-primary/30 rounded-lg p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-4">
                階層聖域已完成
              </h2>
              <div className="space-y-3 text-foreground/80 leading-relaxed mb-6">
                <p>古老樹林的謎題已被破解。當你成功地遍歷了所有的樹，優先級堆完美地排列，編碼卷軸展開了它的秘密時，樹林中發出了溫暖的光芒。</p>
                <p className="italic text-muted-foreground">長者點了點頭：</p>
                <p className="pl-4 border-l-2 border-primary/50">
                  「你已經開始理解複雜的結構。但記住——樹只是開始。在不久的將來，你會發現樹之間也可以相連。」
                </p>
                <p className="pl-4 border-l-2 border-primary/50">
                  「當樹失去了其樹的限制，成為圖時，複雜性會達到全新的高度。」
                </p>
                <p className="mt-4">地面第三次裂開。這次的寶箱裝飾得更加精美，彷彿暗示著更深層的秘密即將揭示。</p>
                <p className="font-semibold text-primary">第三段古籍碎片正在召喚你...</p>
              </div>
              <Button
                onClick={() => setShowLoreDialog(true)}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                閱讀古籍碎片
              </Button>
            </motion.div>
          </div>
        </section>
      )}

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
