import { create } from 'zustand';

export interface SortStep {
  array: number[];
  comparing: [number, number] | null;
  swapped: boolean;
  sorted: number[];
  description: string;
}

interface BubbleSortState {
  array: number[];
  steps: SortStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  comparator: '>' | '<';
  
  // Actions
  setArray: (arr: number[]) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setComparator: (comp: '>' | '<') => void;
  goToStep: (step: number) => void;
}

function generateBubbleSortSteps(arr: number[], comparator: '>' | '<'): SortStep[] {
  const steps: SortStep[] = [];
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  steps.push({
    array: [...array],
    comparing: null,
    swapped: false,
    sorted: [],
    description: '初始陣列，準備開始排序',
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapped: false,
        sorted: [...sorted],
        description: `比較 arr[${j}]=${array[j]} 和 arr[${j + 1}]=${array[j + 1]}`,
      });

      const shouldSwap = comparator === '>' 
        ? array[j] > array[j + 1]
        : array[j] < array[j + 1];

      if (shouldSwap) {
        // Swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapped: true,
          sorted: [...sorted],
          description: `交換！${array[j + 1]} ${comparator} ${array[j]}，位置互換`,
        });
      }
    }
    // Mark as sorted
    sorted.unshift(n - i - 1);
    steps.push({
      array: [...array],
      comparing: null,
      swapped: false,
      sorted: [...sorted],
      description: `第 ${i + 1} 輪完成，位置 ${n - i - 1} 已確定`,
    });
  }

  sorted.unshift(0);
  steps.push({
    array: [...array],
    comparing: null,
    swapped: false,
    sorted: [...sorted],
    description: '排序完成！所有元素已就位',
  });

  return steps;
}

export const useBubbleSortStore = create<BubbleSortState>((set, get) => ({
  array: [64, 34, 25, 12, 22, 11, 90],
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1000,
  comparator: '>',

  setArray: (arr) => {
    set({ array: arr, currentStep: 0, steps: [] });
    get().generateSteps();
  },

  generateSteps: () => {
    const { array, comparator } = get();
    const steps = generateBubbleSortSteps(array, comparator);
    set({ steps, currentStep: 0 });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
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

  setComparator: (comp) => {
    set({ comparator: comp, currentStep: 0 });
    get().generateSteps();
  },

  goToStep: (step) => {
    const { steps } = get();
    if (step >= 0 && step < steps.length) {
      set({ currentStep: step });
    }
  },
}));
