import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, Zap, Target } from "lucide-react";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set(["concept"]));

  const handleTabChange = (value: string) => {
    const newViewed = new Set(viewedTabs);
    newViewed.add(value);
    setViewedTabs(newViewed);

    if (newViewed.size >= 4) {
      onComplete();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">貪婪演算法核心概念</span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          貪婪策略就像一位「活在當下」的獵手——不考慮森林盡頭有什麼，
          只抓取眼前看起來最肥美的獵物。
        </p>
      </motion.div>

      <Tabs defaultValue="concept" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/60">
          <TabsTrigger value="concept" className="data-[state=active]:bg-primary/20">
            核心思想
            {viewedTabs.has("concept") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">
            活動選擇
            {viewedTabs.has("activity") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="coin" className="data-[state=active]:bg-primary/20">
            找零問題
            {viewedTabs.has("coin") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-primary/20">
            適用條件
            {viewedTabs.has("limits") && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concept" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">什麼是貪婪演算法？</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  貪婪演算法是一種在每一步選擇中都採取
                  <span className="text-primary font-semibold">當前狀態下最好的選擇</span>
                  的策略。
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">核心原則：</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary mt-0.5" />
                      <span>每一步都選擇局部最優解 (Local Optimum)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary mt-0.5" />
                      <span>不回溯、不考慮未來影響</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary mt-0.5" />
                      <span>期望局部最優能導向全域最優</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">比喻：貪婪獵手</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  <div>
                    <p className="font-medium">局部最優</p>
                    <p className="text-sm text-muted-foreground">眼前最肥美的獵物</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="font-medium">全域最優</p>
                    <p className="text-sm text-muted-foreground">一天內捕獲最多獵物</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-yellow-500/10 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    ⚠️
                  </div>
                  <div>
                    <p className="font-medium">風險</p>
                    <p className="text-sm text-muted-foreground">眼前最好 ≠ 整體最好</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">活動選擇問題</h3>
              <p className="text-foreground/80 mb-4">
                給定多個活動，每個活動有開始和結束時間。目標是選擇最多數量的不重疊活動。
              </p>
              
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm mb-4">
                <pre className="text-green-400">{`// 貪婪策略：選擇最早結束的活動
function activitySelection(activities) {
  // 按結束時間排序
  activities.sort((a, b) => a.end - b.end);
  
  const selected = [activities[0]];
  let lastEnd = activities[0].end;
  
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i].end;
    }
  }
  return selected;
}`}</pre>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <p className="text-sm text-red-400">❌ 按開始時間</p>
                  <p className="text-xs text-muted-foreground">可能選到太長的活動</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <p className="text-sm text-red-400">❌ 按持續時間</p>
                  <p className="text-xs text-muted-foreground">短活動可能衝突多</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <p className="text-sm text-green-400">✅ 按結束時間</p>
                  <p className="text-xs text-muted-foreground">留最多空間給後續</p>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="coin" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">找零錢問題</h3>
              <p className="text-foreground/80 mb-4">
                給定一組硬幣面額和目標金額，找出使用最少硬幣數量的組合。
              </p>
              
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm mb-4">
                <pre className="text-green-400">{`// 貪婪策略：總是選最大面額
function greedyCoinChange(coins, amount) {
  coins.sort((a, b) => b - a); // 大到小排序
  let count = 0;
  
  for (const coin of coins) {
    while (amount >= coin) {
      amount -= coin;
      count++;
    }
  }
  return count;
}`}</pre>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">✅ 成功案例</h4>
                  <p className="text-sm">幣值 [1, 5, 10, 25]，目標 36</p>
                  <p className="text-sm text-muted-foreground">25 + 10 + 1 = 3 枚（最優）</p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> 失敗案例
                  </h4>
                  <p className="text-sm">幣值 [1, 3, 4]，目標 6</p>
                  <p className="text-sm text-muted-foreground">貪婪：4+1+1=3枚</p>
                  <p className="text-sm text-primary">最優：3+3=2枚</p>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="limits" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card/40 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-['Cinzel'] text-primary mb-4">貪婪演算法的適用條件</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">1. 貪婪選擇性質</h4>
                  <p className="text-sm text-foreground/80">
                    通過做出局部最優選擇，可以得到全域最優解。
                    每一步的選擇不會影響後續選擇的最優性。
                  </p>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">2. 最優子結構</h4>
                  <p className="text-sm text-foreground/80">
                    問題的最優解包含其子問題的最優解。
                    做出一個選擇後，剩餘的子問題獨立於其他選擇。
                  </p>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> 重要警告
                  </h4>
                  <p className="text-sm text-foreground/80">
                    貪婪演算法不總是正確的！當問題不滿足上述條件時，
                    需要使用動態規劃 (DP) 或回溯等方法來確保找到全域最優解。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-card/60 rounded-lg">
                    <p className="text-2xl mb-1">O(n log n)</p>
                    <p className="text-xs text-muted-foreground">時間複雜度（含排序）</p>
                  </div>
                  <div className="text-center p-3 bg-card/60 rounded-lg">
                    <p className="text-2xl mb-1">O(1)</p>
                    <p className="text-xs text-muted-foreground">空間複雜度</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Progress indicator */}
      <div className="text-center text-sm text-muted-foreground">
        已瀏覽 {viewedTabs.size} / 4 個知識點
        {viewedTabs.size >= 4 && (
          <span className="text-green-500 ml-2">✓ 知識學習完成</span>
        )}
      </div>
    </div>
  );
};

export default TeachBlock;
