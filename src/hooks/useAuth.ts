import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signOut, getProfile, unlockAllGates, getPendingMasterKey, type Profile } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch and master key processing with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfileAndProcessMasterKey(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfileAndProcessMasterKey(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileAndProcessMasterKey = async (userId: string) => {
    const profileData = await getProfile(userId);
    setProfile(profileData);

    // Check for pending master key (from OAuth redirect)
    const pendingKey = getPendingMasterKey();
    if (pendingKey === "ABAB") {
      try {
        await unlockAllGates(userId);
        toast({
          title: "🔓 通關密鑰已驗證！",
          description: "所有關卡已解鎖，盡情探索吧！",
        });
      } catch (error) {
        console.error("Error unlocking gates:", error);
      }
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
};
