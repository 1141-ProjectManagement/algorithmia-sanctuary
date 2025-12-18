import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAITutor, Message } from "@/hooks/useAITutor";

interface AITutorChatProps {
  context?: string;
  onClose: () => void;
}

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
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center px-4">
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
