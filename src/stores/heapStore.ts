import { create } from 'zustand';

export interface HeapNode {
  id: string;
  value: number;
  index: number;
  status: 'idle' | 'comparing' | 'swapping' | 'new' | 'extracted' | 'violated';
}

interface HeapState {
  heap: HeapNode[];
  isMaxHeap: boolean;
  isAnimating: boolean;
  currentStep: string;
  stepLog: string[];
  highlightIndices: number[];
  
  // Actions
  initHeap: (values: number[]) => void;
  push: (value: number) => Promise<void>;
  pop: () => Promise<void>;
  setIsMaxHeap: (isMax: boolean) => void;
  siftUp: (index: number) => Promise<void>;
  siftDown: (index: number) => Promise<void>;
  reset: () => void;
  setNodeStatus: (index: number, status: HeapNode['status']) => void;
  clearHighlights: () => void;
  buildHeap: () => Promise<void>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createNode = (value: number, index: number): HeapNode => ({
  id: `node-${index}-${Date.now()}`,
  value,
  index,
  status: 'idle',
});

export const useHeapStore = create<HeapState>((set, get) => ({
  heap: [],
  isMaxHeap: true,
  isAnimating: false,
  currentStep: '',
  stepLog: [],
  highlightIndices: [],

  initHeap: (values: number[]) => {
    const nodes = values.map((v, i) => createNode(v, i));
    set({ 
      heap: nodes, 
      stepLog: ['初始化堆積'],
      currentStep: '堆積已初始化',
      highlightIndices: [],
    });
  },

  push: async (value: number) => {
    const { heap, siftUp, isAnimating } = get();
    if (isAnimating) return;
    
    set({ isAnimating: true });
    
    const newIndex = heap.length;
    const newNode = createNode(value, newIndex);
    newNode.status = 'new';
    
    set(state => ({
      heap: [...state.heap, newNode],
      currentStep: `插入新元素 ${value} 到索引 ${newIndex}`,
      stepLog: [...state.stepLog, `Push: ${value}`],
    }));
    
    await delay(500);
    
    await siftUp(newIndex);
    
    set({ isAnimating: false });
  },

  pop: async () => {
    const { heap, siftDown, isAnimating } = get();
    if (isAnimating || heap.length === 0) return;
    
    set({ isAnimating: true });
    
    const extractedValue = heap[0].value;
    
    set(state => {
      const newHeap = [...state.heap];
      newHeap[0] = { ...newHeap[0], status: 'extracted' };
      return {
        heap: newHeap,
        currentStep: `提取頂端元素 ${extractedValue}`,
        stepLog: [...state.stepLog, `Pop: ${extractedValue}`],
      };
    });
    
    await delay(600);
    
    if (heap.length === 1) {
      set({ heap: [], isAnimating: false, currentStep: '堆積已清空' });
      return;
    }
    
    // Move last element to root
    set(state => {
      const newHeap = state.heap.slice(0, -1);
      const lastValue = state.heap[state.heap.length - 1].value;
      newHeap[0] = createNode(lastValue, 0);
      newHeap[0].status = 'new';
      // Update indices
      return {
        heap: newHeap.map((n, i) => ({ ...n, index: i })),
        currentStep: `將末端元素 ${lastValue} 移至頂端`,
      };
    });
    
    await delay(500);
    
    await siftDown(0);
    
    set({ isAnimating: false });
  },

  setIsMaxHeap: (isMax: boolean) => {
    set({ isMaxHeap: isMax });
  },

  siftUp: async (index: number) => {
    const { heap, isMaxHeap } = get();
    if (index === 0) {
      set(state => ({
        heap: state.heap.map((n, i) => i === index ? { ...n, status: 'idle' } : n),
      }));
      return;
    }
    
    const parentIndex = Math.floor((index - 1) / 2);
    const current = heap[index];
    const parent = heap[parentIndex];
    
    set(state => ({
      heap: state.heap.map((n, i) => {
        if (i === index || i === parentIndex) return { ...n, status: 'comparing' };
        return n;
      }),
      highlightIndices: [index, parentIndex],
      currentStep: `比較 ${current.value} 與父節點 ${parent.value}`,
    }));
    
    await delay(600);
    
    const shouldSwap = isMaxHeap 
      ? current.value > parent.value 
      : current.value < parent.value;
    
    if (shouldSwap) {
      set(state => ({
        heap: state.heap.map((n, i) => {
          if (i === index || i === parentIndex) return { ...n, status: 'swapping' };
          return n;
        }),
        currentStep: `交換 ${current.value} 與 ${parent.value}`,
        stepLog: [...state.stepLog, `Swap: ${current.value} ↔ ${parent.value}`],
      }));
      
      await delay(600);
      
      set(state => {
        const newHeap = [...state.heap];
        const tempValue = newHeap[index].value;
        newHeap[index] = { ...newHeap[index], value: newHeap[parentIndex].value, status: 'idle' };
        newHeap[parentIndex] = { ...newHeap[parentIndex], value: tempValue, status: 'idle' };
        return { heap: newHeap, highlightIndices: [] };
      });
      
      await delay(300);
      
      await get().siftUp(parentIndex);
    } else {
      set(state => ({
        heap: state.heap.map((n, i) => ({ ...n, status: 'idle' })),
        highlightIndices: [],
        currentStep: `${current.value} 已在正確位置`,
      }));
    }
  },

  siftDown: async (index: number) => {
    const { heap, isMaxHeap } = get();
    const heapSize = heap.length;
    
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let targetIndex = index;
    
    // Highlight current and children
    const indicesToHighlight = [index];
    if (leftChild < heapSize) indicesToHighlight.push(leftChild);
    if (rightChild < heapSize) indicesToHighlight.push(rightChild);
    
    set(state => ({
      heap: state.heap.map((n, i) => {
        if (indicesToHighlight.includes(i)) return { ...n, status: 'comparing' };
        return n;
      }),
      highlightIndices: indicesToHighlight,
      currentStep: `檢查節點 ${heap[index].value} 與子節點`,
    }));
    
    await delay(600);
    
    if (isMaxHeap) {
      if (leftChild < heapSize && heap[leftChild].value > heap[targetIndex].value) {
        targetIndex = leftChild;
      }
      if (rightChild < heapSize && heap[rightChild].value > heap[targetIndex].value) {
        targetIndex = rightChild;
      }
    } else {
      if (leftChild < heapSize && heap[leftChild].value < heap[targetIndex].value) {
        targetIndex = leftChild;
      }
      if (rightChild < heapSize && heap[rightChild].value < heap[targetIndex].value) {
        targetIndex = rightChild;
      }
    }
    
    if (targetIndex !== index) {
      set(state => ({
        heap: state.heap.map((n, i) => {
          if (i === index || i === targetIndex) return { ...n, status: 'swapping' };
          return { ...n, status: 'idle' };
        }),
        currentStep: `交換 ${heap[index].value} 與 ${heap[targetIndex].value}`,
        stepLog: [...state.stepLog, `Swap: ${heap[index].value} ↔ ${heap[targetIndex].value}`],
      }));
      
      await delay(600);
      
      set(state => {
        const newHeap = [...state.heap];
        const tempValue = newHeap[index].value;
        newHeap[index] = { ...newHeap[index], value: newHeap[targetIndex].value, status: 'idle' };
        newHeap[targetIndex] = { ...newHeap[targetIndex], value: tempValue, status: 'idle' };
        return { heap: newHeap, highlightIndices: [] };
      });
      
      await delay(300);
      
      await get().siftDown(targetIndex);
    } else {
      set(state => ({
        heap: state.heap.map(n => ({ ...n, status: 'idle' })),
        highlightIndices: [],
        currentStep: `節點 ${heap[index].value} 已在正確位置`,
      }));
    }
  },

  reset: () => {
    set({
      heap: [],
      isAnimating: false,
      currentStep: '',
      stepLog: [],
      highlightIndices: [],
    });
  },

  setNodeStatus: (index: number, status: HeapNode['status']) => {
    set(state => ({
      heap: state.heap.map((n, i) => i === index ? { ...n, status } : n),
    }));
  },

  clearHighlights: () => {
    set(state => ({
      heap: state.heap.map(n => ({ ...n, status: 'idle' })),
      highlightIndices: [],
    }));
  },

  buildHeap: async () => {
    const { heap, siftDown, isAnimating } = get();
    if (isAnimating || heap.length === 0) return;
    
    set({ isAnimating: true, stepLog: ['開始建構堆積'] });
    
    // Start from last non-leaf node
    const startIndex = Math.floor(heap.length / 2) - 1;
    
    for (let i = startIndex; i >= 0; i--) {
      set({ currentStep: `Heapify 節點索引 ${i}` });
      await siftDown(i);
      await delay(300);
    }
    
    set(state => ({
      isAnimating: false,
      currentStep: '堆積建構完成',
      stepLog: [...state.stepLog, '堆積建構完成'],
    }));
  },
}));
