import { create } from "zustand";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  z: number;
  visited: boolean;
  visiting: boolean;
  distance: number; // For BFS layers
  isStart: boolean;
  isTarget: boolean;
  isTrap: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  active: boolean;
}

interface GraphTraversalState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  mode: "bfs" | "dfs";
  queue: string[]; // For BFS
  stack: string[]; // For DFS
  visited: Set<string>;
  currentNode: string | null;
  isPlaying: boolean;
  speed: number;
  traversalOrder: string[];
  isComplete: boolean;
  
  // Actions
  setMode: (mode: "bfs" | "dfs") => void;
  initGraph: (type: "simple" | "complex") => void;
  resetTraversal: () => void;
  visitNode: (nodeId: string) => void;
  setNodeVisiting: (nodeId: string, visiting: boolean) => void;
  addToQueue: (nodeId: string) => void;
  removeFromQueue: () => string | undefined;
  addToStack: (nodeId: string) => void;
  removeFromStack: () => string | undefined;
  setEdgeActive: (source: string, target: string, active: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setCurrentNode: (nodeId: string | null) => void;
  addToTraversalOrder: (nodeId: string) => void;
  setIsComplete: (complete: boolean) => void;
  markVisited: (nodeId: string) => void;
}

const createSimpleGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    { id: "A", x: 0, y: 0, z: 0, visited: false, visiting: false, distance: -1, isStart: true, isTarget: false, isTrap: false },
    { id: "B", x: -2, y: -1.5, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
    { id: "C", x: 2, y: -1.5, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
    { id: "D", x: -3, y: -3, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
    { id: "E", x: 0, y: -3, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: true, isTrap: false },
    { id: "F", x: 3, y: -3, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
  ];
  
  const edges: GraphEdge[] = [
    { source: "A", target: "B", active: false },
    { source: "A", target: "C", active: false },
    { source: "B", target: "D", active: false },
    { source: "B", target: "E", active: false },
    { source: "C", target: "E", active: false },
    { source: "C", target: "F", active: false },
  ];
  
  return { nodes, edges };
};

const createComplexGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    { id: "A", x: 0, y: 1, z: 0, visited: false, visiting: false, distance: -1, isStart: true, isTarget: false, isTrap: false },
    { id: "B", x: -2, y: 0, z: 1, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
    { id: "C", x: 2, y: 0, z: -1, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
    { id: "D", x: -1, y: -1.5, z: -1, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: true },
    { id: "E", x: 1, y: -1.5, z: 1, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
    { id: "F", x: 0, y: -3, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: true, isTrap: false },
    { id: "G", x: -3, y: -2, z: 0, visited: false, visiting: false, distance: -1, isStart: false, isTarget: false, isTrap: false },
  ];
  
  const edges: GraphEdge[] = [
    { source: "A", target: "B", active: false },
    { source: "A", target: "C", active: false },
    { source: "B", target: "D", active: false },
    { source: "B", target: "G", active: false },
    { source: "C", target: "D", active: false },
    { source: "C", target: "E", active: false },
    { source: "D", target: "F", active: false },
    { source: "E", target: "F", active: false },
    { source: "G", target: "D", active: false }, // Creates a cycle path
  ];
  
  return { nodes, edges };
};

export const useGraphTraversalStore = create<GraphTraversalState>((set, get) => ({
  nodes: createSimpleGraph().nodes,
  edges: createSimpleGraph().edges,
  mode: "bfs",
  queue: [],
  stack: [],
  visited: new Set(),
  currentNode: null,
  isPlaying: false,
  speed: 500,
  traversalOrder: [],
  isComplete: false,

  setMode: (mode) => set({ mode }),
  
  initGraph: (type) => {
    const graph = type === "simple" ? createSimpleGraph() : createComplexGraph();
    set({ 
      nodes: graph.nodes, 
      edges: graph.edges,
      queue: [],
      stack: [],
      visited: new Set(),
      currentNode: null,
      traversalOrder: [],
      isComplete: false,
    });
  },
  
  resetTraversal: () => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.map(n => ({ ...n, visited: false, visiting: false, distance: -1 })),
      edges: edges.map(e => ({ ...e, active: false })),
      queue: [],
      stack: [],
      visited: new Set(),
      currentNode: null,
      traversalOrder: [],
      isComplete: false,
      isPlaying: false,
    });
  },
  
  visitNode: (nodeId) => {
    const nodes = get().nodes.map(n => 
      n.id === nodeId ? { ...n, visited: true, visiting: false } : n
    );
    set({ nodes });
  },
  
  setNodeVisiting: (nodeId, visiting) => {
    const nodes = get().nodes.map(n => 
      n.id === nodeId ? { ...n, visiting } : n
    );
    set({ nodes });
  },
  
  addToQueue: (nodeId) => {
    set({ queue: [...get().queue, nodeId] });
  },
  
  removeFromQueue: () => {
    const queue = [...get().queue];
    const node = queue.shift();
    set({ queue });
    return node;
  },
  
  addToStack: (nodeId) => {
    set({ stack: [...get().stack, nodeId] });
  },
  
  removeFromStack: () => {
    const stack = [...get().stack];
    const node = stack.pop();
    set({ stack });
    return node;
  },
  
  setEdgeActive: (source, target, active) => {
    const edges = get().edges.map(e => 
      (e.source === source && e.target === target) || (e.source === target && e.target === source)
        ? { ...e, active }
        : e
    );
    set({ edges });
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setSpeed: (speed) => set({ speed }),
  
  setCurrentNode: (nodeId) => set({ currentNode: nodeId }),
  
  addToTraversalOrder: (nodeId) => {
    set({ traversalOrder: [...get().traversalOrder, nodeId] });
  },
  
  setIsComplete: (complete) => set({ isComplete: complete }),
  
  markVisited: (nodeId) => {
    const visited = new Set(get().visited);
    visited.add(nodeId);
    set({ visited });
  },
}));
