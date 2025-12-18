import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAITutor, Message } from "@/hooks/useAITutor";

interface AITutorChatProps {
  context?: string;
  onClose: () => void;
}

// Quick prompts based on context keywords
const QUICK_PROMPTS: Record<string, string[]> = {
  // Chapter 1 - Basics
  "Big O": [
    "什麼是時間複雜度？",
    "O(n) 和 O(n²) 有什麼差別？",
    "如何判斷演算法的效率？",
  ],
  "陣列": [
    "陣列和鏈結串列有什麼不同？",
    "什麼時候該用陣列？",
    "如何遍歷陣列？",
  ],
  "堆疊": [
    "堆疊的 LIFO 是什麼意思？",
    "堆疊有哪些實際應用？",
    "如何用堆疊實作括號配對？",
  ],
  "佇列": [
    "佇列的 FIFO 是什麼意思？",
    "佇列和堆疊有什麼差別？",
    "什麼時候該用佇列？",
  ],
  "線性搜尋": [
    "線性搜尋的時間複雜度是多少？",
    "線性搜尋有什麼優缺點？",
    "如何優化線性搜尋？",
  ],
  // Chapter 2 - Sorting & Searching
  "泡泡": [
    "泡泡排序怎麼運作？",
    "泡泡排序的時間複雜度？",
    "為什麼泡泡排序效率不高？",
  ],
  "分治": [
    "什麼是分治法？",
    "Merge Sort 怎麼運作？",
    "Quick Sort 的 pivot 怎麼選？",
  ],
  "二元搜尋": [
    "二元搜尋為什麼要先排序？",
    "二元搜尋的時間複雜度？",
    "如何處理 mid overflow？",
  ],
  "雜湊": [
    "什麼是雜湊表？",
    "如何處理雜湊碰撞？",
    "雜湊表的時間複雜度？",
  ],
  "滑動視窗": [
    "什麼是滑動視窗技巧？",
    "滑動視窗適合什麼問題？",
    "如何決定視窗大小？",
  ],
  // Chapter 3 - Trees
  "遍歷": [
    "前序、中序、後序有什麼差別？",
    "什麼時候用哪種遍歷？",
    "如何用迴圈實作遍歷？",
  ],
  "BST": [
    "什麼是二元搜尋樹？",
    "BST 的搜尋效率是多少？",
    "BST 可能退化成什麼？",
  ],
  "堆積": [
    "什麼是堆積資料結構？",
    "Max Heap 和 Min Heap 差別？",
    "堆積排序怎麼運作？",
  ],
  "Huffman": [
    "Huffman 編碼是什麼？",
    "為什麼用貪婪法建樹？",
    "如何計算壓縮率？",
  ],
  "雙指針": [
    "什麼是雙指針技巧？",
    "快慢指針怎麼用？",
    "雙指針適合什麼問題？",
  ],
  // Chapter 4 - Graphs
  "BFS": [
    "BFS 怎麼運作？",
    "BFS 和 DFS 有什麼差別？",
    "BFS 適合找最短路徑嗎？",
  ],
  "MST": [
    "什麼是最小生成樹？",
    "Kruskal 和 Prim 差別？",
    "MST 有什麼應用？",
  ],
  "Dijkstra": [
    "Dijkstra 演算法怎麼運作？",
    "為什麼不能處理負權邊？",
    "時間複雜度是多少？",
  ],
  "拓撲": [
    "什麼是拓撲排序？",
    "如何偵測環？",
    "拓撲排序有什麼應用？",
  ],
  "Floyd": [
    "Floyd-Warshall 怎麼運作？",
    "和 Dijkstra 有什麼差別？",
    "時間複雜度是多少？",
  ],
  // Chapter 5 - Advanced
  "貪婪": [
    "什麼是貪婪演算法？",
    "貪婪法什麼時候有效？",
    "如何證明貪婪解是最佳？",
  ],
  "動態規劃": [
    "什麼是動態規劃？",
    "如何找出狀態轉移方程？",
    "DP 和遞迴有什麼關係？",
  ],
  "回溯": [
    "什麼是回溯法？",
    "回溯和 DFS 有什麼關係？",
    "如何剪枝優化？",
  ],
  // Chapter 6 - Synthesis
  "Union-Find": [
    "什麼是 Union-Find？",
    "路徑壓縮怎麼做？",
    "Union-Find 有什麼應用？",
  ],
  "位元": [
    "什麼是位元運算？",
    "XOR 有什麼特性？",
    "位元運算有什麼應用？",
  ],
  // Default prompts
  default: [
    "這個演算法的時間複雜度是多少？",
    "可以給我一個簡單的例子嗎？",
    "這在實際應用中怎麼用？",
  ],
};

// Get quick prompts based on context
const getQuickPrompts = (context?: string): string[] => {
  if (!context) return QUICK_PROMPTS.default;
  
  for (const [keyword, prompts] of Object.entries(QUICK_PROMPTS)) {
    if (context.includes(keyword)) {
      return prompts;
    }
  }
  return QUICK_PROMPTS.default;
};

export const AITutorChat = ({ context, onClose }: AITutorChatProps) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    remainingQueries,
    fetchRemainingQueries,
    isUnlimited,
  } = useAITutor({ context });

  // Get context-aware quick prompts
  const quickPrompts = useMemo(() => getQuickPrompts(context), [context]);

  // Handle quick prompt click
  const handleQuickPrompt = (prompt: string) => {
    if (isLoading || (remainingQueries === 0 && !isUnlimited)) return;
    sendMessage(prompt);
  };

  // Fetch remaining queries on mount
  useEffect(() => {
    fetchRemainingQueries();
  }, [fetchRemainingQueries]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user";
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
      >
        <div
          className={`
            max-w-[85%] rounded-2xl px-4 py-2.5 text-sm
            ${isUser 
              ? "bg-primary text-primary-foreground rounded-br-md" 
              : "bg-muted text-foreground rounded-bl-md"
            }
          `}
        >
          {/* Simple markdown rendering */}
          <div className="whitespace-pre-wrap">
            {message.content.split("```").map((part, i) => {
              if (i % 2 === 1) {
                // Code block
                const lines = part.split("\n");
                const language = lines[0];
                const code = lines.slice(1).join("\n");
                return (
                  <pre 
                    key={i} 
                    className="bg-black/30 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono"
                  >
                    <code>{code || part}</code>
                  </pre>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)]"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">AI 助教</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Remaining queries badge */}
            {remainingQueries !== null && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                {isUnlimited ? "∞" : `${remainingQueries} 次`}
              </span>
            )}
            {/* Clear button */}
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={clearMessages}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center px-2">
              <Sparkles className="w-10 h-10 text-primary/50 mb-3" />
              <p className="text-sm font-medium">你好！我是 AI 助教</p>
              <p className="text-xs mt-1 opacity-70">
                有任何演算法問題都可以問我喔！
              </p>
              {context && (
                <p className="text-xs mt-2 bg-primary/10 px-3 py-1.5 rounded-lg">
                  📚 當前主題：{context}
                </p>
              )}
              
              {/* Quick Prompts */}
              <div className="mt-4 w-full">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>快速提問</span>
                </div>
                <div className="flex flex-col gap-2">
                  {quickPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleQuickPrompt(prompt)}
                      disabled={isLoading || (remainingQueries === 0 && !isUnlimited)}
                      className="text-left text-xs px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          
          {/* Loading indicator */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-3"
            >
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </motion.div>
          )}
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-border p-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入你的問題..."
              disabled={isLoading || (remainingQueries === 0 && !isUnlimited)}
              className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || (remainingQueries === 0 && !isUnlimited)}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quota warning */}
          {remainingQueries === 0 && !isUnlimited && (
            <p className="text-xs text-destructive mt-2 text-center">
              今日次數已用完，明天再來吧！
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
};
