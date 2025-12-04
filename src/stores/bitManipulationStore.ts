import { create } from 'zustand';

interface BitState {
  valueA: number;
  valueB: number;
  result: number;
  operation: '&' | '|' | '^' | '~' | '<<' | '>>';
  shiftAmount: number;
  animatingBits: number[];
  isAnimating: boolean;
  
  // Actions
  setValueA: (value: number) => void;
  setValueB: (value: number) => void;
  setOperation: (op: '&' | '|' | '^' | '~' | '<<' | '>>') => void;
  setShiftAmount: (amount: number) => void;
  calculate: () => void;
  animateCalculation: () => Promise<void>;
  reset: () => void;
}

export const useBitManipulationStore = create<BitState>((set, get) => ({
  valueA: 10, // 1010 in binary
  valueB: 6,  // 0110 in binary
  result: 0,
  operation: '&',
  shiftAmount: 1,
  animatingBits: [],
  isAnimating: false,

  setValueA: (value: number) => {
    set({ valueA: Math.max(0, Math.min(255, value)) });
    get().calculate();
  },

  setValueB: (value: number) => {
    set({ valueB: Math.max(0, Math.min(255, value)) });
    get().calculate();
  },

  setOperation: (op) => {
    set({ operation: op });
    get().calculate();
  },

  setShiftAmount: (amount: number) => {
    set({ shiftAmount: Math.max(0, Math.min(7, amount)) });
    get().calculate();
  },

  calculate: () => {
    const { valueA, valueB, operation, shiftAmount } = get();
    let result = 0;
    
    switch (operation) {
      case '&':
        result = valueA & valueB;
        break;
      case '|':
        result = valueA | valueB;
        break;
      case '^':
        result = valueA ^ valueB;
        break;
      case '~':
        result = (~valueA) & 0xFF; // Keep 8 bits
        break;
      case '<<':
        result = (valueA << shiftAmount) & 0xFF;
        break;
      case '>>':
        result = valueA >> shiftAmount;
        break;
    }
    
    set({ result });
  },

  animateCalculation: async () => {
    set({ isAnimating: true, animatingBits: [] });
    
    // Animate each bit position
    for (let i = 7; i >= 0; i--) {
      set({ animatingBits: [...get().animatingBits, i] });
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isAnimating: false, animatingBits: [] });
  },

  reset: () => {
    set({
      valueA: 10,
      valueB: 6,
      result: 0,
      operation: '&',
      shiftAmount: 1,
      animatingBits: [],
      isAnimating: false,
    });
    get().calculate();
  },
}));

// Helper functions
export const toBinaryString = (num: number, bits: number = 8): string => {
  return num.toString(2).padStart(bits, '0');
};

export const getBit = (num: number, position: number): number => {
  return (num >> position) & 1;
};
