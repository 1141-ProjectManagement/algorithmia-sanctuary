import { create } from 'zustand';

export type DivideAlgorithm = 'merge' | 'quick';

export interface TreeNode {
  id: string;
  array: number[];
  left?: TreeNode;
  right?: TreeNode;
  depth: number;
  status: 'pending' | 'dividing' | 'sorting' | 'merged' | 'complete';
  pivot?: number;
}

export interface DivideStep {
  tree: TreeNode;
  activeNodeId: string | null;
  description: string;
  phase: 'divide' | 'conquer';
  highlightIndices?: number[];
}

interface DivideConquerState {
  array: number[];
  steps: DivideStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  algorithm: DivideAlgorithm;
  
  setArray: (arr: number[]) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setAlgorithm: (algo: DivideAlgorithm) => void;
  goToStep: (step: number) => void;
}

let nodeIdCounter = 0;
const generateNodeId = () => `node-${nodeIdCounter++}`;

function buildMergeSortSteps(arr: number[]): DivideStep[] {
  nodeIdCounter = 0;
  const steps: DivideStep[] = [];
  
  function createNode(array: number[], depth: number): TreeNode {
    return {
      id: generateNodeId(),
      array: [...array],
      depth,
      status: 'pending'
    };
  }

  function cloneTree(node: TreeNode): TreeNode {
    return {
      ...node,
      array: [...node.array],
      left: node.left ? cloneTree(node.left) : undefined,
      right: node.right ? cloneTree(node.right) : undefined
    };
  }

  function findAndUpdate(root: TreeNode, targetId: string, updater: (node: TreeNode) => void): TreeNode {
    const cloned = cloneTree(root);
    function find(node: TreeNode): boolean {
      if (node.id === targetId) {
        updater(node);
        return true;
      }
      if (node.left && find(node.left)) return true;
      if (node.right && find(node.right)) return true;
      return false;
    }
    find(cloned);
    return cloned;
  }

  const rootNode = createNode(arr, 0);
  steps.push({
    tree: cloneTree(rootNode),
    activeNodeId: rootNode.id,
    description: `初始陣列 [${arr.join(', ')}]，準備開始 Merge Sort`,
    phase: 'divide'
  });

  function divide(node: TreeNode, currentTree: TreeNode): TreeNode {
    if (node.array.length <= 1) {
      const updated = findAndUpdate(currentTree, node.id, n => {
        n.status = 'complete';
      });
      steps.push({
        tree: updated,
        activeNodeId: node.id,
        description: `基礎情況：[${node.array.join(', ')}] 已是最小單位`,
        phase: 'divide'
      });
      return updated;
    }

    const mid = Math.floor(node.array.length / 2);
    const leftArr = node.array.slice(0, mid);
    const rightArr = node.array.slice(mid);

    let updated = findAndUpdate(currentTree, node.id, n => {
      n.status = 'dividing';
      n.left = createNode(leftArr, n.depth + 1);
      n.right = createNode(rightArr, n.depth + 1);
    });

    steps.push({
      tree: cloneTree(updated),
      activeNodeId: node.id,
      description: `分割 [${node.array.join(', ')}] → 左 [${leftArr.join(', ')}] 右 [${rightArr.join(', ')}]`,
      phase: 'divide'
    });

    const leftNode = updated.id === node.id ? updated.left! : findNode(updated, node.id)!.left!;
    const rightNode = updated.id === node.id ? updated.right! : findNode(updated, node.id)!.right!;

    updated = divide(leftNode, updated);
    updated = divide(rightNode, updated);

    return merge(node.id, updated);
  }

  function findNode(root: TreeNode, id: string): TreeNode | null {
    if (root.id === id) return root;
    if (root.left) {
      const found = findNode(root.left, id);
      if (found) return found;
    }
    if (root.right) {
      const found = findNode(root.right, id);
      if (found) return found;
    }
    return null;
  }

  function merge(nodeId: string, currentTree: TreeNode): TreeNode {
    const node = findNode(currentTree, nodeId);
    if (!node || !node.left || !node.right) return currentTree;

    let updated = findAndUpdate(currentTree, nodeId, n => {
      n.status = 'sorting';
    });

    steps.push({
      tree: cloneTree(updated),
      activeNodeId: nodeId,
      description: `合併 [${node.left.array.join(', ')}] 和 [${node.right.array.join(', ')}]`,
      phase: 'conquer'
    });

    const merged: number[] = [];
    const left = [...node.left.array];
    const right = [...node.right.array];
    
    while (left.length && right.length) {
      if (left[0] <= right[0]) {
        merged.push(left.shift()!);
      } else {
        merged.push(right.shift()!);
      }
    }
    merged.push(...left, ...right);

    updated = findAndUpdate(updated, nodeId, n => {
      n.array = merged;
      n.status = 'merged';
    });

    steps.push({
      tree: cloneTree(updated),
      activeNodeId: nodeId,
      description: `合併完成：[${merged.join(', ')}]`,
      phase: 'conquer'
    });

    return updated;
  }

  divide(rootNode, rootNode);

  return steps;
}

function buildQuickSortSteps(arr: number[]): DivideStep[] {
  nodeIdCounter = 0;
  const steps: DivideStep[] = [];
  
  function createNode(array: number[], depth: number, pivot?: number): TreeNode {
    return {
      id: generateNodeId(),
      array: [...array],
      depth,
      status: 'pending',
      pivot
    };
  }

  function cloneTree(node: TreeNode): TreeNode {
    return {
      ...node,
      array: [...node.array],
      left: node.left ? cloneTree(node.left) : undefined,
      right: node.right ? cloneTree(node.right) : undefined
    };
  }

  function findAndUpdate(root: TreeNode, targetId: string, updater: (node: TreeNode) => void): TreeNode {
    const cloned = cloneTree(root);
    function find(node: TreeNode): boolean {
      if (node.id === targetId) {
        updater(node);
        return true;
      }
      if (node.left && find(node.left)) return true;
      if (node.right && find(node.right)) return true;
      return false;
    }
    find(cloned);
    return cloned;
  }

  const rootNode = createNode(arr, 0);
  steps.push({
    tree: cloneTree(rootNode),
    activeNodeId: rootNode.id,
    description: `初始陣列 [${arr.join(', ')}]，準備開始 Quick Sort`,
    phase: 'divide'
  });

  function quickSort(node: TreeNode, currentTree: TreeNode): TreeNode {
    if (node.array.length <= 1) {
      const updated = findAndUpdate(currentTree, node.id, n => {
        n.status = 'complete';
      });
      if (node.array.length === 1) {
        steps.push({
          tree: updated,
          activeNodeId: node.id,
          description: `基礎情況：[${node.array.join(', ')}] 已排序`,
          phase: 'divide'
        });
      }
      return updated;
    }

    const pivot = node.array[node.array.length - 1];
    const left: number[] = [];
    const right: number[] = [];
    
    for (let i = 0; i < node.array.length - 1; i++) {
      if (node.array[i] < pivot) {
        left.push(node.array[i]);
      } else {
        right.push(node.array[i]);
      }
    }

    let updated = findAndUpdate(currentTree, node.id, n => {
      n.status = 'dividing';
      n.pivot = pivot;
      if (left.length > 0) n.left = createNode(left, n.depth + 1);
      if (right.length > 0) n.right = createNode(right, n.depth + 1);
    });

    steps.push({
      tree: cloneTree(updated),
      activeNodeId: node.id,
      description: `選擇 Pivot=${pivot}，分區：左 [${left.join(', ') || '空'}] | ${pivot} | 右 [${right.join(', ') || '空'}]`,
      phase: 'divide',
      highlightIndices: [node.array.length - 1]
    });

    const currentNode = findNode(updated, node.id);
    if (currentNode?.left) {
      updated = quickSort(currentNode.left, updated);
    }
    if (currentNode?.right) {
      updated = quickSort(findNode(updated, node.id)!.right!, updated);
    }

    // Combine results
    const finalNode = findNode(updated, node.id);
    if (finalNode) {
      const sortedArray = [
        ...(finalNode.left?.array || []),
        pivot,
        ...(finalNode.right?.array || [])
      ];

      updated = findAndUpdate(updated, node.id, n => {
        n.array = sortedArray;
        n.status = 'complete';
      });

      steps.push({
        tree: cloneTree(updated),
        activeNodeId: node.id,
        description: `合併完成：[${sortedArray.join(', ')}]`,
        phase: 'conquer'
      });
    }

    return updated;
  }

  function findNode(root: TreeNode, id: string): TreeNode | null {
    if (root.id === id) return root;
    if (root.left) {
      const found = findNode(root.left, id);
      if (found) return found;
    }
    if (root.right) {
      const found = findNode(root.right, id);
      if (found) return found;
    }
    return null;
  }

  quickSort(rootNode, rootNode);

  return steps;
}

export const useDivideConquerStore = create<DivideConquerState>((set, get) => ({
  array: [38, 27, 43, 3, 9, 82, 10],
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1500,
  algorithm: 'merge',

  setArray: (arr) => {
    set({ array: arr, currentStep: 0, steps: [] });
    get().generateSteps();
  },

  generateSteps: () => {
    const { array, algorithm } = get();
    const steps = algorithm === 'merge'
      ? buildMergeSortSteps(array)
      : buildQuickSortSteps(array);
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
