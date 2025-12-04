import { create } from 'zustand';

export interface HuffmanNode {
  id: string;
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  code: string;
  depth: number;
  x: number;
  y: number;
  status: 'idle' | 'candidate' | 'merging' | 'merged' | 'highlight';
}

interface HuffmanState {
  nodes: HuffmanNode[];
  tree: HuffmanNode | null;
  freqMap: Record<string, number>;
  isAnimating: boolean;
  currentStep: string;
  stepLog: string[];
  highlightedNodes: string[];
  encodingResult: Record<string, string>;
  buildComplete: boolean;

  // Actions
  initFromFreqMap: (freqMap: Record<string, number>) => void;
  stepMerge: () => Promise<boolean>;
  autoBuild: () => Promise<void>;
  reset: () => void;
  setFreqMap: (freqMap: Record<string, number>) => void;
  highlightPath: (char: string) => void;
  clearHighlights: () => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let nodeIdCounter = 0;
const createNode = (char: string | null, freq: number, depth: number = 0): HuffmanNode => ({
  id: `node-${nodeIdCounter++}`,
  char,
  freq,
  left: null,
  right: null,
  code: '',
  depth,
  x: 0,
  y: 0,
  status: 'idle',
});

const assignCodes = (node: HuffmanNode | null, code: string = ''): Record<string, string> => {
  if (!node) return {};
  
  node.code = code;
  
  if (node.char !== null) {
    return { [node.char]: code || '0' };
  }
  
  return {
    ...assignCodes(node.left, code + '0'),
    ...assignCodes(node.right, code + '1'),
  };
};

const calculatePositions = (node: HuffmanNode | null, depth: number = 0, x: number = 0, spread: number = 4): void => {
  if (!node) return;
  
  node.depth = depth;
  node.x = x;
  node.y = -depth * 1.5;
  
  const childSpread = spread / 2;
  if (node.left) {
    calculatePositions(node.left, depth + 1, x - childSpread, childSpread);
  }
  if (node.right) {
    calculatePositions(node.right, depth + 1, x + childSpread, childSpread);
  }
};

export const useHuffmanStore = create<HuffmanState>((set, get) => ({
  nodes: [],
  tree: null,
  freqMap: { 'A': 5, 'B': 9, 'C': 12, 'D': 13, 'E': 16, 'F': 45 },
  isAnimating: false,
  currentStep: '',
  stepLog: [],
  highlightedNodes: [],
  encodingResult: {},
  buildComplete: false,

  initFromFreqMap: (freqMap: Record<string, number>) => {
    nodeIdCounter = 0;
    const nodes = Object.entries(freqMap).map(([char, freq]) => 
      createNode(char, freq, 0)
    );
    
    // Arrange nodes in a line initially
    nodes.forEach((node, i) => {
      node.x = (i - nodes.length / 2) * 1.5;
      node.y = 0;
    });
    
    set({
      nodes,
      tree: null,
      freqMap,
      stepLog: ['初始化符文節點'],
      currentStep: `已載入 ${nodes.length} 個符文`,
      highlightedNodes: [],
      encodingResult: {},
      buildComplete: false,
    });
  },

  stepMerge: async () => {
    const { nodes, isAnimating } = get();
    if (isAnimating || nodes.length <= 1) return false;
    
    set({ isAnimating: true });
    
    // Sort by frequency
    const sortedNodes = [...nodes].sort((a, b) => a.freq - b.freq);
    const left = sortedNodes[0];
    const right = sortedNodes[1];
    
    // Highlight candidates
    set(state => ({
      nodes: state.nodes.map(n => ({
        ...n,
        status: n.id === left.id || n.id === right.id ? 'candidate' : 'idle',
      })),
      highlightedNodes: [left.id, right.id],
      currentStep: `選取最小兩節點: ${left.char || '⊕'}(${left.freq}) + ${right.char || '⊕'}(${right.freq})`,
    }));
    
    await delay(800);
    
    // Merging animation
    set(state => ({
      nodes: state.nodes.map(n => ({
        ...n,
        status: n.id === left.id || n.id === right.id ? 'merging' : n.status,
      })),
      currentStep: `合併中...`,
    }));
    
    await delay(600);
    
    // Create new parent node
    const newNode = createNode(null, left.freq + right.freq, 0);
    newNode.left = { ...left, status: 'merged' };
    newNode.right = { ...right, status: 'merged' };
    newNode.status = 'highlight';
    
    // Remove merged nodes and add new node
    const remainingNodes = nodes.filter(n => n.id !== left.id && n.id !== right.id);
    const newNodes = [...remainingNodes, newNode];
    
    // Reposition
    newNodes.forEach((node, i) => {
      node.x = (i - newNodes.length / 2) * 1.5;
      node.y = 0;
    });
    
    const isComplete = newNodes.length === 1;
    
    if (isComplete) {
      // Calculate final positions and codes
      calculatePositions(newNode);
      const codes = assignCodes(newNode);
      
      set({
        nodes: newNodes,
        tree: newNode,
        encodingResult: codes,
        buildComplete: true,
        stepLog: [...get().stepLog, `合併完成！新節點頻率: ${newNode.freq}`, '霍夫曼樹建構完成！'],
        currentStep: '霍夫曼樹建構完成！',
        isAnimating: false,
        highlightedNodes: [],
      });
    } else {
      set({
        nodes: newNodes,
        stepLog: [...get().stepLog, `合併: ${left.char || '⊕'}(${left.freq}) + ${right.char || '⊕'}(${right.freq}) = ${newNode.freq}`],
        currentStep: `剩餘 ${newNodes.length} 個節點`,
        isAnimating: false,
        highlightedNodes: [],
      });
    }
    
    await delay(300);
    
    // Reset status
    set(state => ({
      nodes: state.nodes.map(n => ({ ...n, status: 'idle' })),
    }));
    
    return !isComplete;
  },

  autoBuild: async () => {
    const { isAnimating, stepMerge } = get();
    if (isAnimating) return;
    
    let canContinue = true;
    while (canContinue) {
      canContinue = await stepMerge();
      await delay(500);
    }
  },

  reset: () => {
    const { freqMap, initFromFreqMap } = get();
    initFromFreqMap(freqMap);
  },

  setFreqMap: (freqMap: Record<string, number>) => {
    set({ freqMap });
    get().initFromFreqMap(freqMap);
  },

  highlightPath: (char: string) => {
    const { tree } = get();
    if (!tree) return;
    
    const findPath = (node: HuffmanNode | null, target: string, path: string[] = []): string[] | null => {
      if (!node) return null;
      
      const currentPath = [...path, node.id];
      
      if (node.char === target) return currentPath;
      
      const leftPath = findPath(node.left, target, currentPath);
      if (leftPath) return leftPath;
      
      return findPath(node.right, target, currentPath);
    };
    
    const path = findPath(tree, char, []);
    if (path) {
      set({ highlightedNodes: path });
    }
  },

  clearHighlights: () => {
    set({ highlightedNodes: [] });
  },
}));
