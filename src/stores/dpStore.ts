import { create } from "zustand";

export interface DPCell {
  row: number;
  col: number;
  value: number;
  computed: boolean;
  isHighlighted: boolean;
  isSource: boolean;
  isOnPath: boolean;
}

export interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export interface DPStep {
  row: number;
  col: number;
  value: number;
  message: string;
  sources: { row: number; col: number }[];
  formula: string;
}

interface DPState {
  // DP Table
  dpTable: DPCell[][];
  items: Item[];
  capacity: number;
  
  // Animation
  steps: DPStep[];
  currentStep: number;
  isPlaying: boolean;
  playbackSpeed: number;
  
  // Hover state
  hoveredCell: { row: number; col: number } | null;
  
  // Path
  optimalPath: { row: number; col: number }[];
  
  // Actions
  setItems: (items: Item[]) => void;
  setCapacity: (capacity: number) => void;
  initializeTable: () => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetDemo: () => void;
  setHoveredCell: (cell: { row: number; col: number } | null) => void;
  setIsPlaying: (playing: boolean) => void;
  computeOptimalPath: () => void;
}

const defaultItems: Item[] = [
  { id: 1, name: "寶石", weight: 2, value: 3 },
  { id: 2, name: "金幣", weight: 3, value: 4 },
  { id: 3, name: "水晶", weight: 4, value: 5 },
  { id: 4, name: "神器", weight: 5, value: 6 },
];

const createEmptyTable = (rows: number, cols: number): DPCell[][] => {
  const table: DPCell[][] = [];
  for (let i = 0; i <= rows; i++) {
    table[i] = [];
    for (let j = 0; j <= cols; j++) {
      table[i][j] = {
        row: i,
        col: j,
        value: 0,
        computed: i === 0 || j === 0, // First row and column are base cases
        isHighlighted: false,
        isSource: false,
        isOnPath: false,
      };
    }
  }
  return table;
};

export const useDPStore = create<DPState>((set, get) => ({
  dpTable: createEmptyTable(4, 7),
  items: defaultItems,
  capacity: 7,
  steps: [],
  currentStep: -1,
  isPlaying: false,
  playbackSpeed: 800,
  hoveredCell: null,
  optimalPath: [],

  setItems: (items) => set({ items }),
  
  setCapacity: (capacity) => set({ capacity }),

  initializeTable: () => {
    const { items, capacity } = get();
    const table = createEmptyTable(items.length, capacity);
    set({ dpTable: table, currentStep: -1, steps: [], optimalPath: [] });
  },

  generateSteps: () => {
    const { items, capacity } = get();
    const n = items.length;
    const steps: DPStep[] = [];
    
    // Create a fresh table for computation
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    steps.push({
      row: 0,
      col: 0,
      value: 0,
      message: "初始化 DP 表格：第一行和第一列都為 0（沒有物品或容量為 0）",
      sources: [],
      formula: "dp[0][*] = dp[*][0] = 0"
    });

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      for (let w = 1; w <= capacity; w++) {
        const notTake = dp[i - 1][w];
        
        if (item.weight <= w) {
          const take = dp[i - 1][w - item.weight] + item.value;
          dp[i][w] = Math.max(notTake, take);
          
          const chose = dp[i][w] === take;
          steps.push({
            row: i,
            col: w,
            value: dp[i][w],
            message: chose 
              ? `選擇「${item.name}」(重量${item.weight}, 價值${item.value})：${take} > ${notTake}`
              : `不選「${item.name}」：${notTake} ≥ ${take}`,
            sources: [
              { row: i - 1, col: w },
              { row: i - 1, col: w - item.weight }
            ],
            formula: `dp[${i}][${w}] = max(${notTake}, ${dp[i - 1][w - item.weight]} + ${item.value}) = ${dp[i][w]}`
          });
        } else {
          dp[i][w] = notTake;
          steps.push({
            row: i,
            col: w,
            value: dp[i][w],
            message: `「${item.name}」太重(${item.weight} > ${w})，跳過`,
            sources: [{ row: i - 1, col: w }],
            formula: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`
          });
        }
      }
    }

    steps.push({
      row: n,
      col: capacity,
      value: dp[n][capacity],
      message: `最優解：背包最大價值為 ${dp[n][capacity]}`,
      sources: [],
      formula: `最終答案 = dp[${n}][${capacity}] = ${dp[n][capacity]}`
    });

    get().initializeTable();
    set({ steps });
  },

  nextStep: () => {
    const { currentStep, steps, dpTable, items, capacity } = get();
    const nextIdx = currentStep + 1;
    
    if (nextIdx >= steps.length) return;
    
    const step = steps[nextIdx];
    const newTable = dpTable.map(row => row.map(cell => ({
      ...cell,
      isHighlighted: false,
      isSource: false,
    })));
    
    // Mark current cell as computed and highlighted
    if (step.row > 0 && step.col > 0) {
      newTable[step.row][step.col] = {
        ...newTable[step.row][step.col],
        value: step.value,
        computed: true,
        isHighlighted: true,
      };
    }
    
    // Mark source cells
    step.sources.forEach(src => {
      if (src.row >= 0 && src.col >= 0) {
        newTable[src.row][src.col] = {
          ...newTable[src.row][src.col],
          isSource: true,
        };
      }
    });

    set({ currentStep: nextIdx, dpTable: newTable });
    
    // Compute optimal path on last step
    if (nextIdx === steps.length - 1) {
      setTimeout(() => get().computeOptimalPath(), 500);
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep <= 0) return;
    
    // Reset and replay to previous step
    get().initializeTable();
    get().generateSteps();
    
    const targetStep = currentStep - 1;
    for (let i = 0; i <= targetStep; i++) {
      get().nextStep();
    }
  },

  resetDemo: () => {
    get().initializeTable();
    set({ steps: [], currentStep: -1, optimalPath: [] });
  },

  setHoveredCell: (cell) => set({ hoveredCell: cell }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  computeOptimalPath: () => {
    const { dpTable, items, capacity } = get();
    const path: { row: number; col: number }[] = [];
    
    let i = items.length;
    let w = capacity;
    
    while (i > 0 && w > 0) {
      path.push({ row: i, col: w });
      
      if (dpTable[i][w].value !== dpTable[i - 1][w].value) {
        // Item i was included
        w -= items[i - 1].weight;
      }
      i--;
    }
    
    const newTable = dpTable.map(row => row.map(cell => ({
      ...cell,
      isOnPath: path.some(p => p.row === cell.row && p.col === cell.col),
    })));
    
    set({ optimalPath: path, dpTable: newTable });
  },
}));
