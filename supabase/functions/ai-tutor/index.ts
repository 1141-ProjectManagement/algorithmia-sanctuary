import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AI quotas per subscription tier
const AI_QUOTAS: Record<string, number> = {
  explorer: 0,      // Free: No AI
  adventurer: 15,   // Paid: 15 per day
  master: -1,       // Unlimited (-1 = unlimited)
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "請先登入以使用 AI 助教功能" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for quota management
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify user token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "認證失敗，請重新登入" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user subscription tier
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("tier, status")
      .eq("user_id", user.id)
      .single();

    const tier = subscription?.tier || "explorer";
    const quota = AI_QUOTAS[tier] ?? 0;

    // Check if user has AI access
    if (quota === 0) {
      return new Response(
        JSON.stringify({ 
          error: "upgrade_required",
          message: "AI 助教功能僅限冒險家方案使用，升級即可解鎖！" 
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get today's usage (if quota is not unlimited)
    const today = new Date().toISOString().split("T")[0];
    
    if (quota > 0) {
      const { data: usage } = await supabaseClient
        .from("ai_usage")
        .select("query_count")
        .eq("user_id", user.id)
        .eq("usage_date", today)
        .single();

      const currentCount = usage?.query_count || 0;

      if (currentCount >= quota) {
        return new Response(
          JSON.stringify({ 
            error: "quota_exceeded",
            message: `今日 AI 提問次數已達上限 (${quota} 次)，明天再來吧！`,
            remaining: 0
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Increment usage count (upsert)
      await supabaseClient
        .from("ai_usage")
        .upsert(
          { 
            user_id: user.id, 
            usage_date: today, 
            query_count: currentCount + 1 
          },
          { onConflict: "user_id,usage_date" }
        );
    }

    // Build system prompt for algorithm tutor
    const systemPrompt = `你是「Algorithmia 探險」的 AI 助教，專精演算法教學。

角色設定：
- 你是一位友善、有耐心的演算法導師
- 使用繁體中文回答
- 以古文明探險的隱喻來解釋演算法概念
- 回答要簡潔但完整，適合學習者理解

教學風格：
- 先理解問題本質，再循序漸進解釋
- 使用具體例子和視覺化描述
- 鼓勵學習者思考，給予正面回饋
- 必要時提供程式碼範例（使用 TypeScript/JavaScript）

${context ? `當前學習情境：${context}` : ""}

回答限制：
- 保持回答在 300 字以內
- 使用 Markdown 格式
- 程式碼區塊使用 \`\`\`typescript 標記`;

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI 服務繁忙，請稍後再試" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 服務額度不足，請聯繫管理員" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI 服務暫時無法使用" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AI tutor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
