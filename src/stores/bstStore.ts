import { create } from "zustand";

export interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x?: number;
  y?: number;
  depth?: number;
}

export interface BSTStep {
  nodeId: string;
  action: "compare" | "go_left" | "go_right" | "insert" | "found" | "not_found";
  description: string;
  currentCode: number;
  comparisonResult?: "less" | "greater" | "equal";
}

interface BSTState {
  tree: BSTNode | null;
  steps: BSTStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  visitedNodes: Set<string>;
  currentNodeId: string | null;
  insertingValue: number | null;
  searchTarget: number | null;
  mode: "insert" | "search";
  pathHistory: string[];

  setTree: (tree: BSTNode | null) => void;
  insertValue: (value: number) => void;
  searchValue: (target: number) => void;
  generateInsertSteps: (value: number) => void;
  generateSearchSteps: (target: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
  resetTree: () => void;
}

// Create a default BST
const createDefaultTree = (): BSTNode => {
  const root: BSTNode = {
    id: "n50",
    value: 50,
    left: {
      id: "n30",
      value: 30,
      left: {
        id: "n20",
        value: 20,
        left: null,
        right: null,
      },
      right: {
        id: "n40",
        value: 40,
        left: null,
        right: null,
      },
    },
    right: {
      id: "n70",
      value: 70,
      left: {
        id: "n60",
        value: 60,
        left: null,
        right: null,
      },
      right: {
        id: "n80",
        value: 80,
        left: null,
        right: null,
      },
    },
  };
  return root;
};

// Assign positions to tree nodes for visualization
const assignPositions = (
  node: BSTNode | null,
  x: number,
  y: number,
  depth: number,
  spread: number
): void => {
  if (!node) return;
  node.x = x;
  node.y = y;
  node.depth = depth;
  const childSpread = spread * 0.55;
  assignPositions(node.left, x - spread, y - 1.8, depth + 1, childSpread);
  assignPositions(node.right, x + spread, y - 1.8, depth + 1, childSpread);
};

// Clone tree for immutability
const cloneTree = (node: BSTNode | null): BSTNode | null => {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
};

// Insert into BST
const insertIntoBST = (
  root: BSTNode | null,
  value: number
): BSTNode => {
  if (!root) {
    return {
      id: `n${value}`,
      value,
      left: null,
      right: null,
    };
  }

  const newRoot = cloneTree(root)!;
  
  const insert = (node: BSTNode): void => {
    if (value < node.value) {
      if (node.left === null) {
        node.left = {
          id: `n${value}`,
          value,
          left: null,
          right: null,
        };
      } else {
        insert(node.left);
      }
    } else {
      if (node.right === null) {
        node.right = {
          id: `n${value}`,
          value,
          left: null,
          right: null,
        };
      } else {
        insert(node.right);
      }
    }
  };

  insert(newRoot);
  return newRoot;
};

// Build insert steps
const buildInsertSteps = (root: BSTNode | null, value: number): BSTStep[] => {
  const steps: BSTStep[] = [];
  
  if (!root) {
    steps.push({
      nodeId: `n${value}`,
      action: "insert",
      description: `樹為空，建立根節點 ${value}`,
      currentCode: 0,
    });
    return steps;
  }

  const traverse = (node: BSTNode): void => {
    steps.push({
      nodeId: node.id,
      action: "compare",
      description: `比較 ${value} 與節點 ${node.value}`,
      currentCode: 1,
      comparisonResult: value < node.value ? "less" : "greater",
    });

    if (value < node.value) {
      steps.push({
        nodeId: node.id,
        action: "go_left",
        description: `${value} < ${node.value}，往左走`,
        currentCode: 2,
        comparisonResult: "less",
      });
      if (node.left) {
        traverse(node.left);
      } else {
        steps.push({
          nodeId: `n${value}`,
          action: "insert",
          description: `找到空位，插入節點 ${value}`,
          currentCode: 3,
        });
      }
    } else {
      steps.push({
        nodeId: node.id,
        action: "go_right",
        description: `${value} >= ${node.value}，往右走`,
        currentCode: 4,
        comparisonResult: "greater",
      });
      if (node.right) {
        traverse(node.right);
      } else {
        steps.push({
          nodeId: `n${value}`,
          action: "insert",
          description: `找到空位，插入節點 ${value}`,
          currentCode: 5,
        });
      }
    }
  };

  traverse(root);
  return steps;
};

// Build search steps
const buildSearchSteps = (root: BSTNode | null, target: number): BSTStep[] => {
  const steps: BSTStep[] = [];
  
  if (!root) {
    steps.push({
      nodeId: "",
      action: "not_found",
      description: `樹為空，找不到 ${target}`,
      currentCode: 0,
    });
    return steps;
  }

  const traverse = (node: BSTNode | null): void => {
    if (!node) {
      steps.push({
        nodeId: "",
        action: "not_found",
        description: `到達空節點，找不到 ${target}`,
        currentCode: 6,
      });
      return;
    }

    steps.push({
      nodeId: node.id,
      action: "compare",
      description: `比較目標 ${target} 與節點 ${node.value}`,
      currentCode: 1,
      comparisonResult: target === node.value ? "equal" : target < node.value ? "less" : "greater",
    });

    if (target === node.value) {
      steps.push({
        nodeId: node.id,
        action: "found",
        description: `找到目標！${target} === ${node.value}`,
        currentCode: 2,
        comparisonResult: "equal",
      });
    } else if (target < node.value) {
      steps.push({
        nodeId: node.id,
        action: "go_left",
        description: `${target} < ${node.value}，搜尋左子樹`,
        currentCode: 3,
        comparisonResult: "less",
      });
      traverse(node.left);
    } else {
      steps.push({
        nodeId: node.id,
        action: "go_right",
        description: `${target} > ${node.value}，搜尋右子樹`,
        currentCode: 4,
        comparisonResult: "greater",
      });
      traverse(node.right);
    }
  };

  traverse(root);
  return steps;
};

export const useBSTStore = create<BSTState>((set, get) => {
  const defaultTree = createDefaultTree();
  assignPositions(defaultTree, 0, 3, 0, 3);

  return {
    tree: defaultTree,
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 1,
    visitedNodes: new Set(),
    currentNodeId: null,
    insertingValue: null,
    searchTarget: null,
    mode: "insert",
    pathHistory: [],

    setTree: (tree) => {
      if (tree) {
        assignPositions(tree, 0, 3, 0, 3);
      }
      set({ tree });
    },

    insertValue: (value) => {
      const { tree } = get();
      const newTree = insertIntoBST(tree, value);
      assignPositions(newTree, 0, 3, 0, 3);
      set({ tree: newTree });
    },

    searchValue: (target) => {
      set({ searchTarget: target, mode: "search" });
      get().generateSearchSteps(target);
    },

    generateInsertSteps: (value) => {
      const { tree } = get();
      const steps = buildInsertSteps(tree, value);
      set({
        steps,
        currentStep: 0,
        visitedNodes: new Set(),
        currentNodeId: null,
        insertingValue: value,
        mode: "insert",
        pathHistory: [],
      });
    },

    generateSearchSteps: (target) => {
      const { tree } = get();
      const steps = buildSearchSteps(tree, target);
      set({
        steps,
        currentStep: 0,
        visitedNodes: new Set(),
        currentNodeId: null,
        searchTarget: target,
        mode: "search",
        pathHistory: [],
      });
    },

    nextStep: () => {
      const { steps, currentStep, visitedNodes, pathHistory } = get();
      if (currentStep >= steps.length) return;

      const step = steps[currentStep];
      const newVisited = new Set(visitedNodes);
      const newPath = [...pathHistory];

      if (step.nodeId) {
        newVisited.add(step.nodeId);
        if (!newPath.includes(step.nodeId)) {
          newPath.push(step.nodeId);
        }
      }

      set({
        currentStep: currentStep + 1,
        visitedNodes: newVisited,
        currentNodeId: step.nodeId,
        pathHistory: newPath,
      });
    },

    prevStep: () => {
      const { currentStep, steps } = get();
      if (currentStep <= 0) return;

      const targetStep = currentStep - 1;
      const newVisited = new Set<string>();
      const newPath: string[] = [];
      let lastNodeId: string | null = null;

      for (let i = 0; i < targetStep; i++) {
        const step = steps[i];
        if (step.nodeId) {
          newVisited.add(step.nodeId);
          if (!newPath.includes(step.nodeId)) {
            newPath.push(step.nodeId);
          }
          lastNodeId = step.nodeId;
        }
      }

      set({
        currentStep: targetStep,
        visitedNodes: newVisited,
        currentNodeId: lastNodeId,
        pathHistory: newPath,
      });
    },

    reset: () => {
      set({
        currentStep: 0,
        visitedNodes: new Set(),
        currentNodeId: null,
        isPlaying: false,
        pathHistory: [],
      });
    },

    setPlaying: (playing) => set({ isPlaying: playing }),
    setSpeed: (speed) => set({ speed }),

    goToStep: (step) => {
      const { steps } = get();
      if (step < 0 || step > steps.length) return;

      const newVisited = new Set<string>();
      const newPath: string[] = [];
      let lastNodeId: string | null = null;

      for (let i = 0; i < step; i++) {
        const s = steps[i];
        if (s.nodeId) {
          newVisited.add(s.nodeId);
          if (!newPath.includes(s.nodeId)) {
            newPath.push(s.nodeId);
          }
          lastNodeId = s.nodeId;
        }
      }

      set({
        currentStep: step,
        visitedNodes: newVisited,
        currentNodeId: lastNodeId,
        pathHistory: newPath,
      });
    },

    resetTree: () => {
      const defaultTree = createDefaultTree();
      assignPositions(defaultTree, 0, 3, 0, 3);
      set({
        tree: defaultTree,
        steps: [],
        currentStep: 0,
        visitedNodes: new Set(),
        currentNodeId: null,
        pathHistory: [],
        isPlaying: false,
      });
    },
  };
});
