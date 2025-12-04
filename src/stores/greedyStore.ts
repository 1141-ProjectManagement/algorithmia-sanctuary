import { create } from "zustand";

export interface Activity {
  id: string;
  name: string;
  start: number;
  end: number;
  duration: number;
  selected: boolean;
  conflicted: boolean;
}

export interface Coin {
  id: string;
  value: number;
  x: number;
  y: number;
  dropped: boolean;
}

export interface GreedyStep {
  type: "scan" | "select" | "conflict" | "complete";
  activityId?: string;
  scanPosition?: number;
  message: string;
  selectedCount?: number;
}

export interface CoinStep {
  type: "select" | "drop" | "complete" | "fail";
  coinValue?: number;
  remaining?: number;
  count?: number;
  message: string;
}

interface GreedyState {
  // Activity Selection
  activities: Activity[];
  activitySteps: GreedyStep[];
  currentActivityStep: number;
  scanPosition: number;
  lastSelectedEnd: number;
  sortStrategy: "start" | "duration" | "end";
  
  // Coin Change
  coins: Coin[];
  coinSteps: CoinStep[];
  currentCoinStep: number;
  denominations: number[];
  targetAmount: number;
  remainingAmount: number;
  coinCount: number;
  
  // Playback
  isPlaying: boolean;
  playbackSpeed: number;
  
  // Actions
  setActivities: (activities: Activity[]) => void;
  setSortStrategy: (strategy: "start" | "duration" | "end") => void;
  generateActivitySteps: () => void;
  nextActivityStep: () => void;
  prevActivityStep: () => void;
  resetActivityDemo: () => void;
  
  setDenominations: (denoms: number[]) => void;
  setTargetAmount: (amount: number) => void;
  generateCoinSteps: () => void;
  nextCoinStep: () => void;
  resetCoinDemo: () => void;
  
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
}

const defaultActivities: Activity[] = [
  { id: "a1", name: "活動 A", start: 1, end: 4, duration: 3, selected: false, conflicted: false },
  { id: "a2", name: "活動 B", start: 3, end: 5, duration: 2, selected: false, conflicted: false },
  { id: "a3", name: "活動 C", start: 0, end: 6, duration: 6, selected: false, conflicted: false },
  { id: "a4", name: "活動 D", start: 5, end: 7, duration: 2, selected: false, conflicted: false },
  { id: "a5", name: "活動 E", start: 3, end: 9, duration: 6, selected: false, conflicted: false },
  { id: "a6", name: "活動 F", start: 5, end: 9, duration: 4, selected: false, conflicted: false },
  { id: "a7", name: "活動 G", start: 6, end: 10, duration: 4, selected: false, conflicted: false },
  { id: "a8", name: "活動 H", start: 8, end: 11, duration: 3, selected: false, conflicted: false },
];

const sortActivities = (activities: Activity[], strategy: "start" | "duration" | "end"): Activity[] => {
  const sorted = [...activities];
  switch (strategy) {
    case "start":
      sorted.sort((a, b) => a.start - b.start);
      break;
    case "duration":
      sorted.sort((a, b) => a.duration - b.duration);
      break;
    case "end":
      sorted.sort((a, b) => a.end - b.end);
      break;
  }
  return sorted;
};

export const useGreedyStore = create<GreedyState>((set, get) => ({
  activities: defaultActivities,
  activitySteps: [],
  currentActivityStep: -1,
  scanPosition: 0,
  lastSelectedEnd: 0,
  sortStrategy: "end",
  
  coins: [],
  coinSteps: [],
  currentCoinStep: -1,
  denominations: [25, 10, 5, 1],
  targetAmount: 36,
  remainingAmount: 36,
  coinCount: 0,
  
  isPlaying: false,
  playbackSpeed: 1000,
  
  setActivities: (activities) => set({ activities }),
  
  setSortStrategy: (strategy) => {
    const { activities } = get();
    const sorted = sortActivities(
      activities.map(a => ({ ...a, selected: false, conflicted: false })),
      strategy
    );
    set({ 
      sortStrategy: strategy, 
      activities: sorted,
      currentActivityStep: -1,
      activitySteps: [],
      scanPosition: 0,
      lastSelectedEnd: 0
    });
  },
  
  generateActivitySteps: () => {
    const { activities, sortStrategy } = get();
    const sorted = sortActivities(
      activities.map(a => ({ ...a, selected: false, conflicted: false })),
      sortStrategy
    );
    
    const steps: GreedyStep[] = [];
    let lastEnd = 0;
    let selectedCount = 0;
    
    steps.push({
      type: "scan",
      scanPosition: 0,
      message: `開始貪婪選擇（按${sortStrategy === "end" ? "結束時間" : sortStrategy === "start" ? "開始時間" : "持續時間"}排序）`
    });
    
    sorted.forEach((activity, index) => {
      if (activity.start >= lastEnd) {
        selectedCount++;
        steps.push({
          type: "select",
          activityId: activity.id,
          scanPosition: activity.end,
          selectedCount,
          message: `選擇「${activity.name}」(${activity.start}-${activity.end})，不與已選活動衝突`
        });
        lastEnd = activity.end;
      } else {
        steps.push({
          type: "conflict",
          activityId: activity.id,
          scanPosition: activity.start,
          message: `跳過「${activity.name}」(${activity.start}-${activity.end})，與已選活動時間衝突`
        });
      }
    });
    
    steps.push({
      type: "complete",
      selectedCount,
      message: `貪婪選擇完成！共選擇 ${selectedCount} 個活動${sortStrategy === "end" ? "（最優解）" : "（非最優）"}`
    });
    
    set({ activitySteps: steps, activities: sorted, currentActivityStep: -1, scanPosition: 0, lastSelectedEnd: 0 });
  },
  
  nextActivityStep: () => {
    const { currentActivityStep, activitySteps, activities } = get();
    const nextStep = currentActivityStep + 1;
    
    if (nextStep >= activitySteps.length) return;
    
    const step = activitySteps[nextStep];
    const updatedActivities = [...activities];
    
    if (step.type === "select" && step.activityId) {
      const idx = updatedActivities.findIndex(a => a.id === step.activityId);
      if (idx !== -1) {
        updatedActivities[idx] = { ...updatedActivities[idx], selected: true };
      }
    } else if (step.type === "conflict" && step.activityId) {
      const idx = updatedActivities.findIndex(a => a.id === step.activityId);
      if (idx !== -1) {
        updatedActivities[idx] = { ...updatedActivities[idx], conflicted: true };
      }
    }
    
    set({ 
      currentActivityStep: nextStep, 
      activities: updatedActivities,
      scanPosition: step.scanPosition || get().scanPosition,
      lastSelectedEnd: step.type === "select" ? (step.scanPosition || 0) : get().lastSelectedEnd
    });
  },
  
  prevActivityStep: () => {
    const { currentActivityStep } = get();
    if (currentActivityStep <= 0) return;
    get().resetActivityDemo();
    for (let i = 0; i < currentActivityStep - 1; i++) {
      get().nextActivityStep();
    }
  },
  
  resetActivityDemo: () => {
    const { activities, sortStrategy } = get();
    const reset = activities.map(a => ({ ...a, selected: false, conflicted: false }));
    const sorted = sortActivities(reset, sortStrategy);
    set({ 
      activities: sorted, 
      currentActivityStep: -1, 
      scanPosition: 0, 
      lastSelectedEnd: 0,
      activitySteps: []
    });
  },
  
  setDenominations: (denoms) => set({ denominations: denoms.sort((a, b) => b - a) }),
  
  setTargetAmount: (amount) => set({ targetAmount: amount, remainingAmount: amount }),
  
  generateCoinSteps: () => {
    const { denominations, targetAmount } = get();
    const steps: CoinStep[] = [];
    let remaining = targetAmount;
    let count = 0;
    const sortedDenoms = [...denominations].sort((a, b) => b - a);
    
    steps.push({
      type: "select",
      remaining: targetAmount,
      count: 0,
      message: `目標金額：${targetAmount}，開始貪婪找零`
    });
    
    for (const coin of sortedDenoms) {
      while (remaining >= coin) {
        remaining -= coin;
        count++;
        steps.push({
          type: "drop",
          coinValue: coin,
          remaining,
          count,
          message: `使用 ${coin} 元硬幣，剩餘 ${remaining} 元（已用 ${count} 枚）`
        });
      }
    }
    
    if (remaining === 0) {
      steps.push({
        type: "complete",
        count,
        message: `找零完成！共使用 ${count} 枚硬幣`
      });
    } else {
      steps.push({
        type: "fail",
        remaining,
        count,
        message: `無法完成找零，剩餘 ${remaining} 元`
      });
    }
    
    set({ coinSteps: steps, currentCoinStep: -1, coins: [], remainingAmount: targetAmount, coinCount: 0 });
  },
  
  nextCoinStep: () => {
    const { currentCoinStep, coinSteps, coins } = get();
    const nextStep = currentCoinStep + 1;
    
    if (nextStep >= coinSteps.length) return;
    
    const step = coinSteps[nextStep];
    
    if (step.type === "drop" && step.coinValue) {
      const newCoin: Coin = {
        id: `coin-${coins.length}`,
        value: step.coinValue,
        x: (Math.random() - 0.5) * 2,
        y: coins.length * 0.3,
        dropped: true
      };
      set({ 
        coins: [...coins, newCoin],
        remainingAmount: step.remaining || 0,
        coinCount: step.count || 0
      });
    }
    
    set({ currentCoinStep: nextStep });
  },
  
  resetCoinDemo: () => {
    const { targetAmount } = get();
    set({ 
      coins: [], 
      currentCoinStep: -1, 
      coinSteps: [],
      remainingAmount: targetAmount,
      coinCount: 0
    });
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));
