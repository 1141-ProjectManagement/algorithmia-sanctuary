import { useState, useCallback } from "react";
import { useSubscription } from "./useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseAITutorOptions {
  context?: string;
}

// AI quotas per subscription tier
const AI_QUOTAS: Record<string, number> = {
  explorer: 0,
  adventurer: 15,
  master: -1,
};

export const useAITutor = (options: UseAITutorOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState<number | null>(null);
  const { subscription, isPremium } = useSubscription();
  const { toast } = useToast();

  const tier = subscription?.tier || "explorer";
  const quota = AI_QUOTAS[tier] ?? 0;
  const hasAccess = quota !== 0;
  const isUnlimited = quota === -1;

  // Fetch remaining queries for today
  const fetchRemainingQueries = useCallback(async () => {
    if (!isPremium || isUnlimited) {
      setRemainingQueries(isUnlimited ? -1 : 0);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("ai_usage")
        .select("query_count")
        .eq("user_id", session.user.id)
        .eq("usage_date", today)
        .single();

      const used = data?.query_count || 0;
      setRemainingQueries(Math.max(0, quota - used));
    } catch {
      setRemainingQueries(quota);
    }
  }, [isPremium, isUnlimited, quota]);

  // Send message and stream response
  const sendMessage = useCallback(async (content: string) => {
    if (!hasAccess) {
      toast({
        title: "升級解鎖 AI 助教",
        description: "AI 助教功能僅限冒險家方案使用",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "請先登入",
          description: "使用 AI 助教功能需要登入帳號",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            context: options.context,
          }),
        }
      );

      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.error === "upgrade_required") {
          toast({
            title: "升級解鎖 AI 助教",
            description: errorData.message,
            variant: "destructive",
          });
        } else if (errorData.error === "quota_exceeded") {
          toast({
            title: "今日次數已達上限",
            description: errorData.message,
          });
          setRemainingQueries(0);
        } else {
          toast({
            title: "AI 助教暫時無法使用",
            description: errorData.message || "請稍後再試",
            variant: "destructive",
          });
        }
        
        // Remove the user message if failed
        setMessages(prev => prev.slice(0, -1));
        setIsLoading(false);
        return;
      }

      // Stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content;
            if (chunk) updateAssistant(chunk);
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Update remaining queries
      if (!isUnlimited) {
        setRemainingQueries(prev => prev !== null && prev > 0 ? prev - 1 : 0);
      }

    } catch (error) {
      console.error("AI tutor error:", error);
      toast({
        title: "發送失敗",
        description: "請檢查網路連線後再試",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, hasAccess, options.context, toast, isUnlimited]);

  // Clear conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    hasAccess,
    isUnlimited,
    remainingQueries,
    fetchRemainingQueries,
    quota,
  };
};
