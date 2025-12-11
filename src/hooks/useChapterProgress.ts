import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProgress, saveProgress as saveProgressDB, type Progress } from "@/lib/auth";

export interface GateProgress {
  gateId: string;
  completed: boolean;
  completedAt?: number;
}

export interface ChapterProgress {
  chapterId: string;
  gates: GateProgress[];
  completedAt?: number;
}

const STORAGE_KEY = "algorithmia_chapter_progress";

export const useChapterProgress = (chapterId: string) => {
  const [progress, setProgress] = useState<ChapterProgress>({
    chapterId,
    gates: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load progress from database or localStorage
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // User is logged in, load from database
          setCurrentUserId(user.id);
          const dbProgress = await getProgress(user.id, chapterId);
          
          const gatesProgress: GateProgress[] = dbProgress.map((p: Progress) => ({
            gateId: p.gate_id,
            completed: p.completed,
            completedAt: p.completed_at ? new Date(p.completed_at).getTime() : undefined,
          }));
          
          setProgress({
            chapterId,
            gates: gatesProgress,
          });
        } else {
          // User not logged in, use localStorage as fallback
          setCurrentUserId(null);
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const allProgress = JSON.parse(stored);
            setProgress(allProgress[chapterId] || { chapterId, gates: [] });
          } else {
            setProgress({ chapterId, gates: [] });
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
        // Fallback to localStorage on error
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const allProgress = JSON.parse(stored);
          setProgress(allProgress[chapterId] || { chapterId, gates: [] });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        loadProgress();
      }
    });

    return () => subscription.unsubscribe();
  }, [chapterId]);

  const saveProgressLocal = (newProgress: ChapterProgress) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    allProgress[chapterId] = newProgress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    setProgress(newProgress);
  };

  const completeGate = async (gateId: string) => {
    const existingGate = progress.gates.find((g) => g.gateId === gateId);
    if (existingGate?.completed) return; // Already completed

    const updatedGates = progress.gates.filter((g) => g.gateId !== gateId);
    updatedGates.push({
      gateId,
      completed: true,
      completedAt: Date.now(),
    });

    const newProgress = {
      ...progress,
      gates: updatedGates,
    };

    setProgress(newProgress);

    // Save to database if user is logged in, otherwise localStorage
    if (currentUserId) {
      try {
        await saveProgressDB(currentUserId, chapterId, gateId, true);
      } catch (error) {
        console.error("Error saving progress to database:", error);
        // Fallback to localStorage on error
        saveProgressLocal(newProgress);
      }
    } else {
      saveProgressLocal(newProgress);
    }
  };

  const isGateCompleted = (gateId: string): boolean => {
    return progress.gates.some((g) => g.gateId === gateId && g.completed);
  };

  const isGateUnlocked = (gateId: string, gateOrder: string[]): boolean => {
    const index = gateOrder.indexOf(gateId);
    if (index === 0) return true; // First gate is always unlocked
    
    // Check if previous gate is completed
    const previousGate = gateOrder[index - 1];
    return isGateCompleted(previousGate);
  };

  const getCompletedGatesCount = (): number => {
    return progress.gates.filter((g) => g.completed).length;
  };

  const isChapterCompleted = (totalGates: number): boolean => {
    return getCompletedGatesCount() === totalGates;
  };

  return {
    progress,
    completeGate,
    isGateCompleted,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    isLoading,
  };
};
