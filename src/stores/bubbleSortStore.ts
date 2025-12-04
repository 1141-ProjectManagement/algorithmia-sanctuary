import { create } from 'zustand';

export type SortAlgorithm = 'bubble' | 'insertion';

export interface SortStep {
  array: number[];
  comparing: [number, number] | null;
  swapped: boolean;
  sorted: number[];
  description: string;
  // For insertion sort: the "key" being inserted
  insertingIndex?: number;
}

interface SortState {
  array: number[];
  steps: SortStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  comparator: '>' | '<';
  algorithm: SortAlgorithm;
  
  // Actions
  setArray: (arr: number[]) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setComparator: (comp: '>' | '<') => void;
  setAlgorithm: (algo: SortAlgorithm) => void;
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
    description: '初始陣列，準備開始 Bubble Sort',
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
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

function generateInsertionSortSteps(arr: number[], comparator: '>' | '<'): SortStep[] {
  const steps: SortStep[] = [];
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [0]; // First element is already "sorted"

  steps.push({
    array: [...array],
    comparing: null,
    swapped: false,
    sorted: [0],
    description: '初始陣列，第一個元素視為已排序',
    insertingIndex: undefined,
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    // Show picking up the key
    steps.push({
      array: [...array],
      comparing: null,
      swapped: false,
      sorted: [...sorted],
      description: `拿起 arr[${i}]=${key}，準備插入已排序區`,
      insertingIndex: i,
    });

    // Compare and shift
    while (j >= 0) {
      const shouldShift = comparator === '>'
        ? array[j] > key
        : array[j] < key;

      steps.push({
        array: [...array],
        comparing: [j, i],
        swapped: false,
        sorted: [...sorted],
        description: `比較 arr[${j}]=${array[j]} 和 key=${key}`,
        insertingIndex: i,
      });

      if (shouldShift) {
        array[j + 1] = array[j];
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapped: true,
          sorted: [...sorted],
          description: `${array[j]} ${comparator} ${key}，向右移動`,
          insertingIndex: j,
        });
        j--;
      } else {
        break;
      }
    }

    // Insert the key
    array[j + 1] = key;
    sorted.push(i);
    
    steps.push({
      array: [...array],
      comparing: null,
      swapped: false,
      sorted: [...sorted],
      description: `將 ${key} 插入位置 ${j + 1}，前 ${i + 1} 個元素已排序`,
      insertingIndex: undefined,
    });
  }

  steps.push({
    array: [...array],
    comparing: null,
    swapped: false,
    sorted: Array.from({ length: n }, (_, i) => i),
    description: '排序完成！所有元素已就位',
  });

  return steps;
}

export const useBubbleSortStore = create<SortState>((set, get) => ({
  array: [64, 34, 25, 12, 22, 11, 90],
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1000,
  comparator: '>',
  algorithm: 'bubble',

  setArray: (arr) => {
    set({ array: arr, currentStep: 0, steps: [] });
    get().generateSteps();
  },

  generateSteps: () => {
    const { array, comparator, algorithm } = get();
    const steps = algorithm === 'bubble'
      ? generateBubbleSortSteps(array, comparator)
      : generateInsertionSortSteps(array, comparator);
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

  setAlgorithm: (algo) => {
    set({ algorithm: algo, currentStep: 0, isPlaying: false });
    get().generateSteps();
  },

  goToStep: (step) => {
    const { steps } = get();
    if (step >= 0 && step < steps.length) {
      set({ currentStep: step });
    }
  },
}));
