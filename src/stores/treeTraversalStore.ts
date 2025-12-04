import { create } from "zustand";

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  depth?: number;
}

export interface TraversalStep {
  nodeId: string;
  action: "visit" | "process" | "return";
  description: string;
  sequence: number[];
  currentCode: number;
}

export type TraversalOrder = "preorder" | "inorder" | "postorder";

interface TreeTraversalState {
  tree: TreeNode | null;
  steps: TraversalStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  traversalOrder: TraversalOrder;
  codeOrder: [string, string, string];
  visitedNodes: Set<string>;
  processedNodes: Set<string>;
  currentNodeId: string | null;
  sequence: number[];
  
  setTree: (tree: TreeNode) => void;
  setTraversalOrder: (order: TraversalOrder) => void;
  setCodeOrder: (order: [string, string, string]) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
}

// Create a default binary tree
const createDefaultTree = (): TreeNode => ({
  id: "root",
  value: 1,
  left: {
    id: "l1",
    value: 2,
    left: {
      id: "l2",
      value: 4,
      left: null,
      right: null,
    },
    right: {
      id: "l3",
      value: 5,
      left: null,
      right: null,
    },
  },
  right: {
    id: "r1",
    value: 3,
    left: {
      id: "r2",
      value: 6,
      left: null,
      right: null,
    },
    right: {
      id: "r3",
      value: 7,
      left: null,
      right: null,
    },
  },
});

// Assign positions to tree nodes for visualization
const assignPositions = (node: TreeNode | null, x: number, y: number, depth: number, spread: number): void => {
  if (!node) return;
  node.x = x;
  node.y = y;
  node.depth = depth;
  const childSpread = spread * 0.6;
  assignPositions(node.left, x - spread, y - 1.5, depth + 1, childSpread);
  assignPositions(node.right, x + spread, y - 1.5, depth + 1, childSpread);
};

const getCodeOrderFromTraversal = (order: TraversalOrder): [string, string, string] => {
  switch (order) {
    case "preorder":
      return ["process", "left", "right"];
    case "inorder":
      return ["left", "process", "right"];
    case "postorder":
      return ["left", "right", "process"];
  }
};

const buildTraversalSteps = (
  tree: TreeNode | null,
  codeOrder: [string, string, string]
): TraversalStep[] => {
  const steps: TraversalStep[] = [];
  const sequence: number[] = [];

  const traverse = (node: TreeNode | null) => {
    if (!node) return;

    steps.push({
      nodeId: node.id,
      action: "visit",
      description: `訪問節點 ${node.value}`,
      sequence: [...sequence],
      currentCode: -1,
    });

    for (let i = 0; i < codeOrder.length; i++) {
      const action = codeOrder[i];
      
      if (action === "process") {
        sequence.push(node.value);
        steps.push({
          nodeId: node.id,
          action: "process",
          description: `處理節點 ${node.value}`,
          sequence: [...sequence],
          currentCode: i,
        });
      } else if (action === "left") {
        steps.push({
          nodeId: node.id,
          action: "visit",
          description: `遞迴左子樹`,
          sequence: [...sequence],
          currentCode: i,
        });
        traverse(node.left);
      } else if (action === "right") {
        steps.push({
          nodeId: node.id,
          action: "visit",
          description: `遞迴右子樹`,
          sequence: [...sequence],
          currentCode: i,
        });
        traverse(node.right);
      }
    }

    steps.push({
      nodeId: node.id,
      action: "return",
      description: `從節點 ${node.value} 返回`,
      sequence: [...sequence],
      currentCode: -1,
    });
  };

  traverse(tree);
  return steps;
};

export const useTreeTraversalStore = create<TreeTraversalState>((set, get) => {
  const defaultTree = createDefaultTree();
  assignPositions(defaultTree, 0, 2, 0, 2.5);

  return {
    tree: defaultTree,
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 1,
    traversalOrder: "preorder",
    codeOrder: ["process", "left", "right"],
    visitedNodes: new Set(),
    processedNodes: new Set(),
    currentNodeId: null,
    sequence: [],

    setTree: (tree) => {
      assignPositions(tree, 0, 2, 0, 2.5);
      set({ tree, steps: [], currentStep: 0 });
    },

    setTraversalOrder: (order) => {
      const codeOrder = getCodeOrderFromTraversal(order);
      set({ traversalOrder: order, codeOrder });
      get().generateSteps();
    },

    setCodeOrder: (order) => {
      set({ codeOrder: order });
      get().generateSteps();
    },

    generateSteps: () => {
      const { tree, codeOrder } = get();
      const steps = buildTraversalSteps(tree, codeOrder);
      set({ 
        steps, 
        currentStep: 0, 
        visitedNodes: new Set(), 
        processedNodes: new Set(),
        currentNodeId: null,
        sequence: [],
      });
    },

    nextStep: () => {
      const { steps, currentStep, visitedNodes, processedNodes } = get();
      if (currentStep >= steps.length) return;

      const step = steps[currentStep];
      const newVisited = new Set(visitedNodes);
      const newProcessed = new Set(processedNodes);

      newVisited.add(step.nodeId);
      if (step.action === "process") {
        newProcessed.add(step.nodeId);
      }

      set({
        currentStep: currentStep + 1,
        visitedNodes: newVisited,
        processedNodes: newProcessed,
        currentNodeId: step.nodeId,
        sequence: step.sequence,
      });
    },

    prevStep: () => {
      const { currentStep } = get();
      if (currentStep <= 0) return;
      
      // Rebuild state from beginning to currentStep - 1
      const { steps } = get();
      const targetStep = currentStep - 1;
      const newVisited = new Set<string>();
      const newProcessed = new Set<string>();
      let lastNodeId: string | null = null;
      let lastSequence: number[] = [];

      for (let i = 0; i < targetStep; i++) {
        const step = steps[i];
        newVisited.add(step.nodeId);
        if (step.action === "process") {
          newProcessed.add(step.nodeId);
        }
        lastNodeId = step.nodeId;
        lastSequence = step.sequence;
      }

      set({
        currentStep: targetStep,
        visitedNodes: newVisited,
        processedNodes: newProcessed,
        currentNodeId: lastNodeId,
        sequence: lastSequence,
      });
    },

    reset: () => {
      set({
        currentStep: 0,
        visitedNodes: new Set(),
        processedNodes: new Set(),
        currentNodeId: null,
        sequence: [],
        isPlaying: false,
      });
    },

    setPlaying: (playing) => set({ isPlaying: playing }),
    setSpeed: (speed) => set({ speed }),
    goToStep: (step) => {
      const { steps } = get();
      if (step < 0 || step > steps.length) return;
      
      const newVisited = new Set<string>();
      const newProcessed = new Set<string>();
      let lastNodeId: string | null = null;
      let lastSequence: number[] = [];

      for (let i = 0; i < step; i++) {
        const s = steps[i];
        newVisited.add(s.nodeId);
        if (s.action === "process") {
          newProcessed.add(s.nodeId);
        }
        lastNodeId = s.nodeId;
        lastSequence = s.sequence;
      }

      set({
        currentStep: step,
        visitedNodes: newVisited,
        processedNodes: newProcessed,
        currentNodeId: lastNodeId,
        sequence: lastSequence,
      });
    },
  };
});
