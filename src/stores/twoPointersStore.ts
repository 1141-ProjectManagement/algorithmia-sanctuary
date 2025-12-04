import { create } from 'zustand';

export interface StoneData {
  index: number;
  value: number;
  status: 'idle' | 'left' | 'right' | 'target' | 'excluded';
}

interface TwoPointersState {
  stones: StoneData[];
  left: number;
  right: number;
  target: number;
  currentSum: number;
  isAnimating: boolean;
  found: boolean;
  stepLog: string[];
  currentStep: string;
  moveCount: number;

  // Actions
  initStones: (values: number[], target: number) => void;
  moveLeft: () => void;
  moveRight: () => void;
  reset: () => void;
  autoSolve: () => Promise<void>;
  setTarget: (target: number) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useTwoPointersStore = create<TwoPointersState>((set, get) => ({
  stones: [],
  left: 0,
  right: 0,
  target: 15,
  currentSum: 0,
  isAnimating: false,
  found: false,
  stepLog: [],
  currentStep: '',
  moveCount: 0,

  initStones: (values: number[], target: number) => {
    const sorted = [...values].sort((a, b) => a - b);
    const stones: StoneData[] = sorted.map((value, index) => ({
      index,
      value,
      status: 'idle' as const,
    }));
    
    const left = 0;
    const right = stones.length - 1;
    stones[left].status = 'left';
    stones[right].status = 'right';
    
    set({
      stones,
      left,
      right,
      target,
      currentSum: stones[left].value + stones[right].value,
      found: false,
      stepLog: [`初始化: L=${left}, R=${right}, Target=${target}`],
      currentStep: `目標和: ${target}`,
      moveCount: 0,
    });
  },

  moveLeft: () => {
    const { left, right, stones, target, found, isAnimating } = get();
    if (found || isAnimating || left >= right - 1) return;
    
    const newStones = [...stones];
    newStones[left].status = 'excluded';
    
    const newLeft = left + 1;
    newStones[newLeft].status = 'left';
    
    const newSum = newStones[newLeft].value + newStones[right].value;
    const isFound = newSum === target;
    
    if (isFound) {
      newStones[newLeft].status = 'target';
      newStones[right].status = 'target';
    }
    
    set(state => ({
      stones: newStones,
      left: newLeft,
      currentSum: newSum,
      found: isFound,
      moveCount: state.moveCount + 1,
      stepLog: [...state.stepLog, `L++: stones[${newLeft}]=${newStones[newLeft].value}, Sum=${newSum}`],
      currentStep: isFound 
        ? `找到了！stones[${newLeft}] + stones[${right}] = ${newSum}` 
        : `Sum=${newSum} ${newSum < target ? '< Target (太小)' : '> Target (太大)'}`,
    }));
  },

  moveRight: () => {
    const { left, right, stones, target, found, isAnimating } = get();
    if (found || isAnimating || right <= left + 1) return;
    
    const newStones = [...stones];
    newStones[right].status = 'excluded';
    
    const newRight = right - 1;
    newStones[newRight].status = 'right';
    
    const newSum = newStones[left].value + newStones[newRight].value;
    const isFound = newSum === target;
    
    if (isFound) {
      newStones[left].status = 'target';
      newStones[newRight].status = 'target';
    }
    
    set(state => ({
      stones: newStones,
      right: newRight,
      currentSum: newSum,
      found: isFound,
      moveCount: state.moveCount + 1,
      stepLog: [...state.stepLog, `R--: stones[${newRight}]=${newStones[newRight].value}, Sum=${newSum}`],
      currentStep: isFound 
        ? `找到了！stones[${left}] + stones[${newRight}] = ${newSum}` 
        : `Sum=${newSum} ${newSum < target ? '< Target (太小)' : '> Target (太大)'}`,
    }));
  },

  reset: () => {
    const { target } = get();
    get().initStones([1, 2, 4, 6, 8, 9, 11, 15], target);
  },

  autoSolve: async () => {
    const { isAnimating } = get();
    if (isAnimating) return;
    
    set({ isAnimating: true });
    
    while (true) {
      const { left, right, currentSum, target, found } = get();
      
      if (found || left >= right) break;
      
      await delay(800);
      
      if (currentSum < target) {
        get().moveLeft();
      } else if (currentSum > target) {
        get().moveRight();
      }
    }
    
    set({ isAnimating: false });
  },

  setTarget: (target: number) => {
    set({ target });
    get().reset();
  },
}));
