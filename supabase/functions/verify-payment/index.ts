import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { session_id } = await req.json();
    if (!session_id) {
      throw new Error("session_id is required");
    }
    logStep("Session ID received", { session_id });

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    logStep("User authenticated", { userId: user.id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    logStep("Session retrieved", { 
      status: session.payment_status,
      customerId: session.customer 
    });

    if (session.payment_status === "paid") {
      // Update subscription in database
      const { error: upsertError } = await supabaseClient
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          tier: "adventurer",
          status: "active",
          stripe_customer_id: session.customer as string,
          stripe_payment_intent_id: session.payment_intent as string,
          purchased_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id"
        });

      if (upsertError) {
        logStep("Database update error", { error: upsertError.message });
        throw new Error("Failed to update subscription");
      }

      logStep("Subscription upgraded to adventurer", { userId: user.id });

      return new Response(JSON.stringify({ 
        success: true, 
        tier: "adventurer",
        message: "Payment verified and subscription upgraded"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      logStep("Payment not completed", { status: session.payment_status });
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Payment not completed"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    // Sanitize error messages
    let safeMessage = "An error occurred verifying your payment";
    if (error instanceof Error) {
      const msg = error.message;
      if (msg.includes("not authenticated")) {
        safeMessage = "Authentication required";
      } else if (msg === "session_id is required") {
        safeMessage = msg;
      } else if (msg === "Failed to update subscription") {
        safeMessage = msg;
      }
    }
    
    return new Response(JSON.stringify({ error: safeMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
