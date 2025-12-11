import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProgress, saveSectionProgress, type Progress, type SectionType } from "@/lib/auth";

export interface SectionProgress {
  teach: boolean;
  demo: boolean;
  test: boolean;
}

export interface GateProgress {
  gateId: string;
  completed: boolean;
  completedAt?: number;
  sections: SectionProgress;
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
            sections: {
              teach: p.teach_completed,
              demo: p.demo_completed,
              test: p.test_completed,
            },
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
            const chapterData = allProgress[chapterId];
            if (chapterData) {
              // Ensure sections exist in legacy data
              const gates = (chapterData.gates || []).map((g: any) => ({
                ...g,
                sections: g.sections || { teach: g.completed, demo: g.completed, test: g.completed },
              }));
              setProgress({ ...chapterData, gates });
            } else {
              setProgress({ chapterId, gates: [] });
            }
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

  // Complete a specific section (teach, demo, or test)
  const completeSection = async (gateId: string, section: SectionType) => {
    const existingGate = progress.gates.find((g) => g.gateId === gateId);
    
    // Check if section is already completed
    if (existingGate?.sections[section]) return;

    // Calculate new section state
    const currentSections = existingGate?.sections || { teach: false, demo: false, test: false };
    const newSections = { ...currentSections, [section]: true };
    const isFullyCompleted = newSections.teach && newSections.demo && newSections.test;

    const updatedGates = progress.gates.filter((g) => g.gateId !== gateId);
    updatedGates.push({
      gateId,
      completed: isFullyCompleted,
      completedAt: isFullyCompleted ? Date.now() : existingGate?.completedAt,
      sections: newSections,
    });

    const newProgress = {
      ...progress,
      gates: updatedGates,
    };

    setProgress(newProgress);

    // Save to database if user is logged in, otherwise localStorage
    if (currentUserId) {
      try {
        await saveSectionProgress(currentUserId, chapterId, gateId, section);
      } catch (error) {
        console.error("Error saving section progress to database:", error);
        // Fallback to localStorage on error
        saveProgressLocal(newProgress);
      }
    } else {
      saveProgressLocal(newProgress);
    }
  };

  // Legacy: Complete entire gate at once
  const completeGate = async (gateId: string) => {
    await completeSection(gateId, "teach");
    await completeSection(gateId, "demo");
    await completeSection(gateId, "test");
  };

  const isGateCompleted = (gateId: string): boolean => {
    return progress.gates.some((g) => g.gateId === gateId && g.completed);
  };

  const isSectionCompleted = (gateId: string, section: SectionType): boolean => {
    const gate = progress.gates.find((g) => g.gateId === gateId);
    return gate?.sections?.[section] ?? false;
  };

  const getGateSections = (gateId: string): SectionProgress => {
    const gate = progress.gates.find((g) => g.gateId === gateId);
    return gate?.sections ?? { teach: false, demo: false, test: false };
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

  // Get overall section completion stats for the chapter
  const getChapterSectionStats = () => {
    const stats = {
      teachCompleted: 0,
      demoCompleted: 0,
      testCompleted: 0,
      totalGates: progress.gates.length,
    };

    progress.gates.forEach((gate) => {
      if (gate.sections.teach) stats.teachCompleted++;
      if (gate.sections.demo) stats.demoCompleted++;
      if (gate.sections.test) stats.testCompleted++;
    });

    return stats;
  };

  return {
    progress,
    completeGate,
    completeSection,
    isGateCompleted,
    isSectionCompleted,
    getGateSections,
    isGateUnlocked,
    getCompletedGatesCount,
    isChapterCompleted,
    getChapterSectionStats,
    isLoading,
  };
};
