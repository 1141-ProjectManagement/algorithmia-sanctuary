import { create } from "zustand";

export interface SearchStep {
  low: number;
  high: number;
  mid: number;
  comparison: 'less' | 'greater' | 'equal' | 'init';
  description: string;
  found: boolean;
  eliminated: number[]; // indices that have been eliminated
}

interface BinarySearchState {
  array: number[];
  target: number;
  steps: SearchStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  comparator: '<' | '>';
  
  setArray: (arr: number[]) => void;
  setTarget: (target: number) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
  setComparator: (comp: '<' | '>') => void;
}

const generateSortedArray = (size: number): number[] => {
  const arr: number[] = [];
  let current = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(current);
    current += Math.floor(Math.random() * 8) + 2;
  }
  return arr;
};

const generateBinarySearchSteps = (
  array: number[], 
  target: number,
  comparator: '<' | '>'
): SearchStep[] => {
  const steps: SearchStep[] = [];
  let low = 0;
  let high = array.length - 1;
  const eliminated: number[] = [];

  steps.push({
    low,
    high,
    mid: Math.floor((low + high) / 2),
    comparison: 'init',
    description: `初始化搜尋範圍：[${low}, ${high}]，目標值：${target}`,
    found: false,
    eliminated: [...eliminated]
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = array[mid];

    if (midValue === target) {
      steps.push({
        low,
        high,
        mid,
        comparison: 'equal',
        description: `找到目標！arr[${mid}] = ${midValue} = ${target}`,
        found: true,
        eliminated: [...eliminated]
      });
      break;
    }

    const condition = comparator === '<' 
      ? midValue < target 
      : midValue > target;

    if (condition) {
      // Eliminate left half
      for (let i = low; i <= mid; i++) {
        if (!eliminated.includes(i)) eliminated.push(i);
      }
      steps.push({
        low,
        high,
        mid,
        comparison: 'less',
        description: `arr[${mid}] = ${midValue} ${comparator === '<' ? '<' : '>'} ${target}，排除左半邊，low = ${mid + 1}`,
        found: false,
        eliminated: [...eliminated]
      });
      low = mid + 1;
    } else {
      // Eliminate right half
      for (let i = mid; i <= high; i++) {
        if (!eliminated.includes(i)) eliminated.push(i);
      }
      steps.push({
        low,
        high,
        mid,
        comparison: 'greater',
        description: `arr[${mid}] = ${midValue} ${comparator === '<' ? '>=' : '<='} ${target}，排除右半邊，high = ${mid - 1}`,
        found: false,
        eliminated: [...eliminated]
      });
      high = mid - 1;
    }
  }

  if (steps[steps.length - 1]?.found !== true) {
    steps.push({
      low,
      high,
      mid: -1,
      comparison: 'init',
      description: `搜尋結束：目標值 ${target} 不存在於陣列中`,
      found: false,
      eliminated: [...eliminated]
    });
  }

  return steps;
};

export const useBinarySearchStore = create<BinarySearchState>((set, get) => ({
  array: generateSortedArray(15),
  target: 0,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1500,
  comparator: '<',

  setArray: (arr) => {
    set({ array: arr });
    get().generateSteps();
  },

  setTarget: (target) => {
    set({ target });
    get().generateSteps();
  },

  generateSteps: () => {
    const { array, target, comparator } = get();
    const steps = generateBinarySearchSteps(array, target, comparator);
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

  setComparator: (comp) => {
    set({ comparator: comp });
    get().generateSteps();
  },
}));
