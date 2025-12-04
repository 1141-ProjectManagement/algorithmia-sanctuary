import { create } from 'zustand';

interface Node {
  id: number;
  parent: number;
  rank: number;
  x: number;
  y: number;
  z: number;
}

interface StepLog {
  action: string;
  details: string;
}

interface UnionFindState {
  nodes: Node[];
  parent: number[];
  rank: number[];
  highlightPath: number[];
  activeNodes: number[];
  isAnimating: boolean;
  usePathCompression: boolean;
  stepLogs: StepLog[];
  queryCount: number;
  
  // Actions
  initializeNodes: (count: number) => void;
  find: (x: number) => number;
  findWithAnimation: (x: number) => Promise<number>;
  union: (a: number, b: number) => void;
  unionWithAnimation: (a: number, b: number) => Promise<void>;
  setUsePathCompression: (value: boolean) => void;
  reset: () => void;
  clearHighlight: () => void;
}

const generateNodePositions = (count: number): Node[] => {
  const nodes: Node[] = [];
  const radius = 4;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const layerOffset = Math.floor(i / 6) * 1.5;
    nodes.push({
      id: i,
      parent: i,
      rank: 0,
      x: Math.cos(angle) * (radius - layerOffset * 0.3),
      y: layerOffset - 1,
      z: Math.sin(angle) * (radius - layerOffset * 0.3),
    });
  }
  return nodes;
};

export const useUnionFindStore = create<UnionFindState>((set, get) => ({
  nodes: [],
  parent: [],
  rank: [],
  highlightPath: [],
  activeNodes: [],
  isAnimating: false,
  usePathCompression: true,
  stepLogs: [],
  queryCount: 0,

  initializeNodes: (count: number) => {
    const nodes = generateNodePositions(count);
    const parent = Array.from({ length: count }, (_, i) => i);
    const rank = Array(count).fill(0);
    
    set({
      nodes,
      parent,
      rank,
      highlightPath: [],
      activeNodes: [],
      stepLogs: [{ action: '初始化', details: `創建 ${count} 個獨立節點` }],
      queryCount: 0,
    });
  },

  find: (x: number) => {
    const { parent, usePathCompression } = get();
    let queryCount = get().queryCount;
    
    const findRoot = (node: number): number => {
      queryCount++;
      if (parent[node] === node) return node;
      
      if (usePathCompression) {
        const root = findRoot(parent[node]);
        parent[node] = root;
        return root;
      }
      return findRoot(parent[node]);
    };
    
    const root = findRoot(x);
    set({ parent: [...parent], queryCount });
    return root;
  },

  findWithAnimation: async (x: number) => {
    const { parent, usePathCompression } = get();
    const path: number[] = [];
    let current = x;
    let queryCount = 0;
    
    set({ isAnimating: true, highlightPath: [], activeNodes: [x] });
    
    // Trace path to root
    while (parent[current] !== current) {
      path.push(current);
      queryCount++;
      current = parent[current];
      
      set({ highlightPath: [...path], activeNodes: [current] });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    path.push(current);
    const root = current;
    
    set({ 
      highlightPath: path,
      stepLogs: [...get().stepLogs, { 
        action: 'Find', 
        details: `find(${x}) = ${root}，路徑長度: ${path.length - 1}` 
      }],
      queryCount: get().queryCount + queryCount,
    });
    
    // Path compression animation
    if (usePathCompression && path.length > 2) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      for (let i = 0; i < path.length - 1; i++) {
        parent[path[i]] = root;
      }
      
      set({ 
        parent: [...parent],
        stepLogs: [...get().stepLogs, { 
          action: '路徑壓縮', 
          details: `將路徑上所有節點直連到根節點 ${root}` 
        }],
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isAnimating: false, highlightPath: [], activeNodes: [] });
    
    return root;
  },

  union: (a: number, b: number) => {
    const { parent, rank } = get();
    const state = get();
    
    const rootA = state.find(a);
    const rootB = state.find(b);
    
    if (rootA === rootB) return;
    
    // Union by rank
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB;
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA;
    } else {
      parent[rootB] = rootA;
      rank[rootA]++;
    }
    
    set({ 
      parent: [...parent], 
      rank: [...rank],
      stepLogs: [...get().stepLogs, { 
        action: 'Union', 
        details: `union(${a}, ${b}): 合併集合 ${rootA} 和 ${rootB}` 
      }],
    });
  },

  unionWithAnimation: async (a: number, b: number) => {
    const { parent, rank } = get();
    
    set({ isAnimating: true, activeNodes: [a, b] });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find roots with highlighting
    let rootA = a;
    const pathA: number[] = [a];
    while (parent[rootA] !== rootA) {
      rootA = parent[rootA];
      pathA.push(rootA);
    }
    
    set({ highlightPath: pathA });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let rootB = b;
    const pathB: number[] = [b];
    while (parent[rootB] !== rootB) {
      rootB = parent[rootB];
      pathB.push(rootB);
    }
    
    set({ highlightPath: [...pathA, ...pathB] });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (rootA === rootB) {
      set({ 
        isAnimating: false, 
        highlightPath: [], 
        activeNodes: [],
        stepLogs: [...get().stepLogs, { 
          action: 'Union', 
          details: `${a} 和 ${b} 已在同一集合中` 
        }],
      });
      return;
    }
    
    // Union by rank
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB;
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA;
    } else {
      parent[rootB] = rootA;
      rank[rootA]++;
    }
    
    set({ 
      parent: [...parent], 
      rank: [...rank],
      stepLogs: [...get().stepLogs, { 
        action: 'Union', 
        details: `union(${a}, ${b}): 合併根節點 ${rootA} ← ${rootB}` 
      }],
    });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ isAnimating: false, highlightPath: [], activeNodes: [] });
  },

  setUsePathCompression: (value: boolean) => {
    set({ 
      usePathCompression: value,
      stepLogs: [...get().stepLogs, { 
        action: '設定', 
        details: value ? '啟用路徑壓縮' : '停用路徑壓縮' 
      }],
    });
  },

  reset: () => {
    get().initializeNodes(get().nodes.length || 8);
  },

  clearHighlight: () => {
    set({ highlightPath: [], activeNodes: [] });
  },
}));
