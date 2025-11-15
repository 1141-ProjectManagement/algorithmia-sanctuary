import { useState, useEffect } from "react";

export interface GateProgress {
  gateId: string;
  completed: boolean;
  completedAt?: number;
}

export interface ChapterProgress {
  chapterId: string;
  gates: GateProgress[];
  badges: string[];
  completedAt?: number;
}

const STORAGE_KEY = "algorithmia_chapter_progress";

export const useChapterProgress = (chapterId: string) => {
  const [progress, setProgress] = useState<ChapterProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      return allProgress[chapterId] || {
        chapterId,
        gates: [],
        badges: [],
      };
    }
    return {
      chapterId,
      gates: [],
      badges: [],
    };
  });

  const saveProgress = (newProgress: ChapterProgress) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    allProgress[chapterId] = newProgress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    setProgress(newProgress);
  };

  const completeGate = (gateId: string) => {
    const existingGate = progress.gates.find((g) => g.gateId === gateId);
    if (existingGate?.completed) return; // Already completed

    const updatedGates = progress.gates.filter((g) => g.gateId !== gateId);
    updatedGates.push({
      gateId,
      completed: true,
      completedAt: Date.now(),
    });

    saveProgress({
      ...progress,
      gates: updatedGates,
    });
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

  const addBadge = (badgeId: string) => {
    if (progress.badges.includes(badgeId)) return;
    
    saveProgress({
      ...progress,
      badges: [...progress.badges, badgeId],
    });
  };

  const hasBadge = (badgeId: string): boolean => {
    return progress.badges.includes(badgeId);
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
    addBadge,
    hasBadge,
    getCompletedGatesCount,
    isChapterCompleted,
  };
};
