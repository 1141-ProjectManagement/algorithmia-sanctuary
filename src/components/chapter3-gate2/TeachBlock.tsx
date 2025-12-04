import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, GitBranch, Search, ArrowDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<"property" | "search" | "insert" | "warning">("property");

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
          <GitBranch className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-4">
          二元搜尋樹 (BST)
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          一種特殊的二元樹，它的每個節點都遵循嚴格的排序規則：
          <span className="text-primary font-semibold">左子樹 {"<"} 根 {"<"} 右子樹</span>。
          這個簡單的規則讓搜尋效率從 O(n) 提升到 O(log n)。
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { id: "property", label: "核心性質", icon: GitBranch },
          { id: "search", label: "搜尋操作", icon: Search },
          { id: "insert", label: "插入操作", icon: ArrowDown },
          { id: "warning", label: "退化警告", icon: AlertTriangle },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card/60 border border-primary/20 rounded-lg p-6"
      >
        {activeTab === "property" && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-primary">BST 的核心性質</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  對於 BST 中的任意節點 N：
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">◀</span>
                    <span>左子樹中<span className="text-cyan-400">所有</span>節點的值 {"<"} N 的值</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">▶</span>
                    <span>右子樹中<span className="text-amber-400">所有</span>節點的值 {">"} N 的值</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">
                    💡 這意味著：BST 的中序遍歷會產生有序序列！
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <svg viewBox="0 0 200 140" className="w-full max-w-xs h-auto">
                  {/* Edges */}
                  <line x1="100" y1="25" x2="50" y2="65" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                  <line x1="100" y1="25" x2="150" y2="65" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                  <line x1="50" y1="65" x2="25" y2="105" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                  <line x1="50" y1="65" x2="75" y2="105" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                  <line x1="150" y1="65" x2="125" y2="105" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                  <line x1="150" y1="65" x2="175" y2="105" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                  
                  {/* Nodes with values */}
                  <circle cx="100" cy="25" r="18" fill="hsl(var(--primary))" />
                  <text x="100" y="30" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12" fontWeight="bold">50</text>
                  
                  <circle cx="50" cy="65" r="15" fill="#22d3ee" opacity="0.8" />
                  <text x="50" y="70" textAnchor="middle" fill="black" fontSize="11" fontWeight="bold">30</text>
                  
                  <circle cx="150" cy="65" r="15" fill="#fbbf24" opacity="0.8" />
                  <text x="150" y="70" textAnchor="middle" fill="black" fontSize="11" fontWeight="bold">70</text>
                  
                  <circle cx="25" cy="105" r="12" fill="#22d3ee" opacity="0.6" />
                  <text x="25" y="109" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">20</text>
                  
                  <circle cx="75" cy="105" r="12" fill="#22d3ee" opacity="0.6" />
                  <text x="75" y="109" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">40</text>
                  
                  <circle cx="125" cy="105" r="12" fill="#fbbf24" opacity="0.6" />
                  <text x="125" y="109" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">60</text>
                  
                  <circle cx="175" cy="105" r="12" fill="#fbbf24" opacity="0.6" />
                  <text x="175" y="109" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">80</text>
                  
                  {/* Labels */}
                  <text x="30" y="135" textAnchor="middle" fill="#22d3ee" fontSize="9">左子樹 {"<"} 50</text>
                  <text x="170" y="135" textAnchor="middle" fill="#fbbf24" fontSize="9">右子樹 {">"} 50</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-primary">搜尋操作 O(log n)</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  搜尋就像在迷宮中根據路牌導航：
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>從根節點開始</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>目標 {"<"} 當前值？往<span className="text-cyan-400">左</span>走</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>目標 {">"} 當前值？往<span className="text-amber-400">右</span>走</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>目標 === 當前值？<span className="text-emerald-400">找到了！</span></span>
                  </li>
                </ol>
              </div>
              <div>
                <pre className="bg-black/50 rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`function search(node, target) {
  if (!node) return null;
  
  if (target === node.value) {
    return node; // 找到了！
  }
  
  if (target < node.value) {
    return search(node.left, target);
  } else {
    return search(node.right, target);
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "insert" && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-primary">插入操作 O(log n)</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  插入邏輯與搜尋類似，但目標是找到空位：
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>從根節點開始比較</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>新值 {"<"} 當前值？往<span className="text-cyan-400">左</span>子樹</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>新值 {"≥"} 當前值？往<span className="text-amber-400">右</span>子樹</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>遇到空位？<span className="text-emerald-400">插入新節點！</span></span>
                  </li>
                </ol>
              </div>
              <div>
                <pre className="bg-black/50 rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`function insert(node, value) {
  if (!node) {
    return new Node(value);
  }
  
  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }
  
  return node;
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "warning" && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              退化警告：當 BST 變成鏈結串列
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  如果插入的數據已經排序（如 1, 2, 3, 4, 5），BST 會退化成一條直線！
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-sm text-emerald-400">
                      ✅ 隨機數據：樹高 ≈ log(n)<br />
                      時間複雜度：O(log n)
                    </p>
                  </div>
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">
                      ❌ 排序數據：樹高 = n<br />
                      時間複雜度退化：O(n)
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  💡 解決方案：使用自平衡樹（AVL、紅黑樹）
                </p>
              </div>
              <div className="flex justify-center items-center">
                <svg viewBox="0 0 180 160" className="w-full max-w-xs h-auto">
                  {/* Degenerated tree (linked list) */}
                  <line x1="30" y1="25" x2="50" y2="50" stroke="#ef4444" strokeWidth="2" />
                  <line x1="50" y1="50" x2="70" y2="75" stroke="#ef4444" strokeWidth="2" />
                  <line x1="70" y1="75" x2="90" y2="100" stroke="#ef4444" strokeWidth="2" />
                  <line x1="90" y1="100" x2="110" y2="125" stroke="#ef4444" strokeWidth="2" />
                  
                  <circle cx="30" cy="25" r="12" fill="#ef4444" />
                  <text x="30" y="29" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
                  
                  <circle cx="50" cy="50" r="12" fill="#ef4444" opacity="0.9" />
                  <text x="50" y="54" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                  
                  <circle cx="70" cy="75" r="12" fill="#ef4444" opacity="0.8" />
                  <text x="70" y="79" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
                  
                  <circle cx="90" cy="100" r="12" fill="#ef4444" opacity="0.7" />
                  <text x="90" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">4</text>
                  
                  <circle cx="110" cy="125" r="12" fill="#ef4444" opacity="0.6" />
                  <text x="110" y="129" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">5</text>
                  
                  <text x="70" y="155" textAnchor="middle" fill="#ef4444" fontSize="10">插入 1,2,3,4,5 → O(n)</text>
                </svg>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Time Complexity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-card/40 border border-border/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">搜尋</p>
          <p className="text-xl font-mono text-primary">O(log n)</p>
          <p className="text-xs text-muted-foreground">平均情況</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">插入</p>
          <p className="text-xl font-mono text-primary">O(log n)</p>
          <p className="text-xs text-muted-foreground">平均情況</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">最壞情況</p>
          <p className="text-xl font-mono text-destructive">O(n)</p>
          <p className="text-xs text-muted-foreground">退化時</p>
        </div>
      </motion.div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleComplete}
          size="lg"
          className="gap-2"
          disabled={completed}
        >
          {completed ? (
            <>
              <CheckCircle className="w-5 h-5" />
              已完成學習
            </>
          ) : (
            "我理解了，開始探索聖樹"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
