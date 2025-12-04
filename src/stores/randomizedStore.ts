import { create } from 'zustand';

interface ArrayElement {
  value: number;
  index: number;
  state: 'default' | 'pivot' | 'comparing' | 'sorted' | 'swapping';
}

interface RandomizedState {
  array: ArrayElement[];
  pivotIndex: number | null;
  comparingIndices: number[];
  useRandomPivot: boolean;
  isAnimating: boolean;
  stepLog: string[];
  sortedIndices: Set<number>;
  diceValue: number | null;
  isRolling: boolean;
  comparisonCount: number;
  worstCaseComparisons: number;
  expectedComparisons: number;
  
  initializeArray: (values: number[]) => void;
  setUseRandomPivot: (value: boolean) => void;
  rollDice: (low: number, high: number) => Promise<number>;
  setPivot: (index: number) => void;
  setComparing: (indices: number[]) => void;
  markSorted: (index: number) => void;
  swapElements: (i: number, j: number) => void;
  incrementComparisons: () => void;
  addLog: (message: string) => void;
  setAnimating: (value: boolean) => void;
  reset: () => void;
}

export const useRandomizedStore = create<RandomizedState>((set, get) => ({
  array: [],
  pivotIndex: null,
  comparingIndices: [],
  useRandomPivot: false,
  isAnimating: false,
  stepLog: [],
  sortedIndices: new Set(),
  diceValue: null,
  isRolling: false,
  comparisonCount: 0,
  worstCaseComparisons: 0,
  expectedComparisons: 0,

  initializeArray: (values) => {
    const n = values.length;
    set({
      array: values.map((value, index) => ({
        value,
        index,
        state: 'default'
      })),
      pivotIndex: null,
      comparingIndices: [],
      sortedIndices: new Set(),
      stepLog: ['陣列初始化完成'],
      comparisonCount: 0,
      worstCaseComparisons: (n * (n - 1)) / 2,
      expectedComparisons: Math.round(n * Math.log2(n) * 1.39)
    });
  },

  setUseRandomPivot: (value) => {
    set({ useRandomPivot: value });
    get().addLog(value ? '切換至隨機 Pivot 模式' : '切換至固定 Pivot 模式');
  },

  rollDice: async (low, high) => {
    set({ isRolling: true });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
    
    set({ 
      diceValue: randomIndex,
      isRolling: false 
    });
    
    get().addLog(`🎲 骰子擲出: 索引 ${randomIndex}`);
    
    return randomIndex;
  },

  setPivot: (index) => {
    const { array } = get();
    const newArray = array.map((el, i) => ({
      ...el,
      state: i === index ? 'pivot' : (el.state === 'sorted' ? 'sorted' : 'default')
    }));
    set({ 
      array: newArray as ArrayElement[],
      pivotIndex: index 
    });
    get().addLog(`選定 Pivot: arr[${index}] = ${array[index].value}`);
  },

  setComparing: (indices) => {
    const { array } = get();
    const newArray = array.map((el, i) => ({
      ...el,
      state: indices.includes(i) ? 'comparing' : 
             (el.state === 'pivot' ? 'pivot' : 
              el.state === 'sorted' ? 'sorted' : 'default')
    }));
    set({ 
      array: newArray as ArrayElement[],
      comparingIndices: indices 
    });
  },

  markSorted: (index) => {
    const { array, sortedIndices } = get();
    const newSorted = new Set(sortedIndices);
    newSorted.add(index);
    const newArray = array.map((el, i) => ({
      ...el,
      state: newSorted.has(i) ? 'sorted' : el.state
    }));
    set({ 
      array: newArray as ArrayElement[],
      sortedIndices: newSorted 
    });
  },

  swapElements: (i, j) => {
    const { array } = get();
    const newArray = [...array];
    const temp = newArray[i];
    newArray[i] = { ...newArray[j], index: i, state: 'swapping' };
    newArray[j] = { ...temp, index: j, state: 'swapping' };
    set({ array: newArray });
    get().addLog(`交換 arr[${i}] ↔ arr[${j}]`);
  },

  incrementComparisons: () => {
    set(state => ({ comparisonCount: state.comparisonCount + 1 }));
  },

  addLog: (message) => {
    set(state => ({ 
      stepLog: [...state.stepLog.slice(-9), message] 
    }));
  },

  setAnimating: (value) => set({ isAnimating: value }),

  reset: () => set({
    array: [],
    pivotIndex: null,
    comparingIndices: [],
    useRandomPivot: false,
    isAnimating: false,
    stepLog: [],
    sortedIndices: new Set(),
    diceValue: null,
    isRolling: false,
    comparisonCount: 0
  })
}));
