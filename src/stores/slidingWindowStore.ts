import { create } from "zustand";

export interface SlidingStep {
  windowStart: number;
  windowEnd: number;
  windowSum: number;
  maxSum: number;
  maxStart: number;
  removedValue: number | null;
  addedValue: number | null;
  description: string;
  phase: 'init' | 'slide' | 'complete';
}

interface SlidingWindowState {
  array: number[];
  windowSize: number;
  steps: SlidingStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  
  setArray: (arr: number[]) => void;
  setWindowSize: (size: number) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
}

const generateRandomArray = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 20) - 5);
};

const generateSlidingWindowSteps = (array: number[], k: number): SlidingStep[] => {
  const steps: SlidingStep[] = [];
  
  if (k > array.length || k <= 0) return steps;

  // Initialize first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += array[i];
  }

  steps.push({
    windowStart: 0,
    windowEnd: k - 1,
    windowSum,
    maxSum: windowSum,
    maxStart: 0,
    removedValue: null,
    addedValue: null,
    description: `初始化視窗 [0, ${k-1}]，計算初始總和 = ${windowSum}`,
    phase: 'init'
  });

  let maxSum = windowSum;
  let maxStart = 0;

  // Slide the window
  for (let i = k; i < array.length; i++) {
    const removedValue = array[i - k];
    const addedValue = array[i];
    windowSum = windowSum - removedValue + addedValue;

    const isNewMax = windowSum > maxSum;
    if (isNewMax) {
      maxSum = windowSum;
      maxStart = i - k + 1;
    }

    steps.push({
      windowStart: i - k + 1,
      windowEnd: i,
      windowSum,
      maxSum,
      maxStart,
      removedValue,
      addedValue,
      description: `視窗滑動：移除 ${removedValue}，加入 ${addedValue}，當前總和 = ${windowSum}${isNewMax ? ' (新最大值！)' : ''}`,
      phase: 'slide'
    });
  }

  steps.push({
    windowStart: array.length - k,
    windowEnd: array.length - 1,
    windowSum: steps[steps.length - 1].windowSum,
    maxSum,
    maxStart,
    removedValue: null,
    addedValue: null,
    description: `搜尋完成！最大子陣列和 = ${maxSum}，位於索引 [${maxStart}, ${maxStart + k - 1}]`,
    phase: 'complete'
  });

  return steps;
};

export const useSlidingWindowStore = create<SlidingWindowState>((set, get) => ({
  array: generateRandomArray(12),
  windowSize: 4,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1200,

  setArray: (arr) => {
    set({ array: arr });
    get().generateSteps();
  },

  setWindowSize: (size) => {
    set({ windowSize: size });
    get().generateSteps();
  },

  generateSteps: () => {
    const { array, windowSize } = get();
    const steps = generateSlidingWindowSteps(array, windowSize);
    set({ steps, currentStep: 0 });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  reset: () => {
    set({ currentStep: 0, isPlaying: false });
  },

  setPlaying: (playing) => set({ isPlaying: playing }),

  setSpeed: (speed) => set({ speed }),

  goToStep: (step) => {
    const { steps } = get();
    if (step >= 0 && step < steps.length) {
      set({ currentStep: step });
    }
  },
}));
