import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "explorer" | "adventurer";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "expired";

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  isPremium: boolean;
  purchasedAt?: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in - default to explorer
        setSubscription({
          tier: "explorer",
          status: "active",
          isPremium: false,
        });
        return;
      }

      const { data, error: funcError } = await supabase.functions.invoke("check-subscription");
      
      if (funcError) {
        console.error("Error checking subscription:", funcError);
        setError(funcError.message);
        // Default to explorer on error
        setSubscription({
          tier: "explorer",
          status: "active",
          isPremium: false,
        });
        return;
      }

      setSubscription(data as Subscription);
    } catch (err) {
      console.error("Subscription check failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setSubscription({
        tier: "explorer",
        status: "active",
        isPremium: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [checkSubscription]);

  const isPremium = subscription?.isPremium ?? false;

  const canAccessChapter = useCallback((chapterNumber: number): boolean => {
    if (chapterNumber === 1) return true; // Chapter 1 always free
    return isPremium;
  }, [isPremium]);

  const canUseTTS = useCallback((): boolean => {
    return isPremium;
  }, [isPremium]);

  const canAccessDashboard = useCallback((): boolean => {
    return isPremium;
  }, [isPremium]);

  const startCheckout = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("請先登入以購買冒險家方案");
      }

      const { data, error } = await supabase.functions.invoke("create-payment");
      
      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      throw err;
    }
  }, []);

  const verifyPayment = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { session_id: sessionId },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        await checkSubscription();
      }

      return data;
    } catch (err) {
      console.error("Payment verification failed:", err);
      throw err;
    }
  }, [checkSubscription]);

  return {
    subscription,
    isLoading,
    error,
    isPremium,
    canAccessChapter,
    canUseTTS,
    canAccessDashboard,
    checkSubscription,
    startCheckout,
    verifyPayment,
  };
};
