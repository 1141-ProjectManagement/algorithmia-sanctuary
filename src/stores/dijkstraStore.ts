import { create } from "zustand";

export interface StarNode {
  id: string;
  x: number;
  y: number;
  z: number;
  distance: number;
  status: "unvisited" | "visiting" | "settled";
  previous: string | null;
}

export interface StarEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  active: boolean;
  onPath: boolean;
}

interface DijkstraState {
  nodes: StarNode[];
  edges: StarEdge[];
  sourceNode: string | null;
  targetNode: string | null;
  priorityQueue: { id: string; distance: number }[];
  currentNode: string | null;
  isPlaying: boolean;
  isComplete: boolean;
  shortestPath: string[];
  stepLog: string[];
  
  // Actions
  initGraph: () => void;
  resetDijkstra: () => void;
  setSourceNode: (nodeId: string) => void;
  setTargetNode: (nodeId: string) => void;
  setIsPlaying: (playing: boolean) => void;
  
  // Algorithm steps
  startDijkstra: () => void;
  processNextNode: () => { node: StarNode; relaxedEdges: string[] } | null;
  
  // State updates
  updateNodeDistance: (nodeId: string, distance: number, previous: string | null) => void;
  setNodeStatus: (nodeId: string, status: StarNode["status"]) => void;
  setEdgeActive: (edgeId: string, active: boolean) => void;
  setEdgeOnPath: (edgeId: string, onPath: boolean) => void;
  updateEdgeWeight: (edgeId: string, weight: number) => void;
  addToQueue: (nodeId: string, distance: number) => void;
  popFromQueue: () => { id: string; distance: number } | null;
  setIsComplete: (complete: boolean) => void;
  addStepLog: (log: string) => void;
  reconstructPath: () => void;
}

const createInitialGraph = (): { nodes: StarNode[]; edges: StarEdge[] } => {
  const nodes: StarNode[] = [
    { id: "A", x: 0, y: 0, z: 0, distance: Infinity, status: "unvisited", previous: null },
    { id: "B", x: -2.5, y: 1, z: 1, distance: Infinity, status: "unvisited", previous: null },
    { id: "C", x: 2.5, y: 0.5, z: 0.5, distance: Infinity, status: "unvisited", previous: null },
    { id: "D", x: -1.5, y: -1.5, z: -1, distance: Infinity, status: "unvisited", previous: null },
    { id: "E", x: 1.5, y: -1, z: -1.5, distance: Infinity, status: "unvisited", previous: null },
    { id: "F", x: 0, y: -2.5, z: -2, distance: Infinity, status: "unvisited", previous: null },
  ];
  
  const edges: StarEdge[] = [
    { id: "AB", source: "A", target: "B", weight: 4, active: false, onPath: false },
    { id: "AC", source: "A", target: "C", weight: 2, active: false, onPath: false },
    { id: "AD", source: "A", target: "D", weight: 5, active: false, onPath: false },
    { id: "BC", source: "B", target: "C", weight: 1, active: false, onPath: false },
    { id: "BD", source: "B", target: "D", weight: 2, active: false, onPath: false },
    { id: "CE", source: "C", target: "E", weight: 3, active: false, onPath: false },
    { id: "DE", source: "D", target: "E", weight: 1, active: false, onPath: false },
    { id: "DF", source: "D", target: "F", weight: 4, active: false, onPath: false },
    { id: "EF", source: "E", target: "F", weight: 2, active: false, onPath: false },
  ];
  
  return { nodes, edges };
};

export const useDijkstraStore = create<DijkstraState>((set, get) => ({
  nodes: createInitialGraph().nodes,
  edges: createInitialGraph().edges,
  sourceNode: null,
  targetNode: "F",
  priorityQueue: [],
  currentNode: null,
  isPlaying: false,
  isComplete: false,
  shortestPath: [],
  stepLog: [],

  initGraph: () => {
    const graph = createInitialGraph();
    set({
      nodes: graph.nodes,
      edges: graph.edges,
      sourceNode: null,
      priorityQueue: [],
      currentNode: null,
      isComplete: false,
      shortestPath: [],
      stepLog: [],
    });
  },

  resetDijkstra: () => {
    const { nodes, edges, sourceNode } = get();
    set({
      nodes: nodes.map(n => ({
        ...n,
        distance: n.id === sourceNode ? 0 : Infinity,
        status: "unvisited",
        previous: null,
      })),
      edges: edges.map(e => ({ ...e, active: false, onPath: false })),
      priorityQueue: sourceNode ? [{ id: sourceNode, distance: 0 }] : [],
      currentNode: null,
      isPlaying: false,
      isComplete: false,
      shortestPath: [],
      stepLog: [],
    });
  },

  setSourceNode: (nodeId) => {
    const { nodes } = get();
    set({
      sourceNode: nodeId,
      nodes: nodes.map(n => ({
        ...n,
        distance: n.id === nodeId ? 0 : Infinity,
        status: "unvisited",
        previous: null,
      })),
      priorityQueue: [{ id: nodeId, distance: 0 }],
      stepLog: [`🚀 設定起點: ${nodeId}`],
    });
  },

  setTargetNode: (nodeId) => set({ targetNode: nodeId }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  startDijkstra: () => {
    const { sourceNode } = get();
    if (!sourceNode) return;
    
    get().resetDijkstra();
    get().addStepLog(`🚀 Dijkstra 開始：從 ${sourceNode} 出發`);
    set({ isPlaying: true });
  },

  processNextNode: () => {
    const { priorityQueue, nodes, edges, targetNode } = get();
    
    // Pop minimum distance node
    const current = get().popFromQueue();
    if (!current) {
      set({ isComplete: true, isPlaying: false });
      return null;
    }
    
    const currentNodeData = nodes.find(n => n.id === current.id);
    if (!currentNodeData || currentNodeData.status === "settled") {
      return get().processNextNode(); // Skip already settled nodes
    }
    
    // Mark as visiting
    get().setNodeStatus(current.id, "visiting");
    set({ currentNode: current.id });
    get().addStepLog(`📍 訪問節點 ${current.id} (距離: ${current.distance})`);
    
    // Check if reached target
    if (current.id === targetNode) {
      get().setNodeStatus(current.id, "settled");
      get().reconstructPath();
      set({ isComplete: true, isPlaying: false });
      get().addStepLog(`🎯 到達目標 ${targetNode}！最短距離: ${current.distance}`);
      return { node: currentNodeData, relaxedEdges: [] };
    }
    
    // Relax neighbors
    const relaxedEdges: string[] = [];
    const neighborEdges = edges.filter(
      e => e.source === current.id || e.target === current.id
    );
    
    neighborEdges.forEach(edge => {
      const neighborId = edge.source === current.id ? edge.target : edge.source;
      const neighborNode = nodes.find(n => n.id === neighborId);
      
      if (neighborNode && neighborNode.status !== "settled") {
        const newDist = current.distance + edge.weight;
        
        if (newDist < neighborNode.distance) {
          get().updateNodeDistance(neighborId, newDist, current.id);
          get().addToQueue(neighborId, newDist);
          get().setEdgeActive(edge.id, true);
          relaxedEdges.push(edge.id);
          get().addStepLog(`   ↳ 鬆弛 ${neighborId}: ${neighborNode.distance === Infinity ? "∞" : neighborNode.distance} → ${newDist}`);
        }
      }
    });
    
    // Mark current as settled
    setTimeout(() => {
      get().setNodeStatus(current.id, "settled");
    }, 300);
    
    return { node: currentNodeData, relaxedEdges };
  },

  updateNodeDistance: (nodeId, distance, previous) => {
    const nodes = get().nodes.map(n =>
      n.id === nodeId ? { ...n, distance, previous } : n
    );
    set({ nodes });
  },

  setNodeStatus: (nodeId, status) => {
    const nodes = get().nodes.map(n =>
      n.id === nodeId ? { ...n, status } : n
    );
    set({ nodes });
  },

  setEdgeActive: (edgeId, active) => {
    const edges = get().edges.map(e =>
      e.id === edgeId ? { ...e, active } : e
    );
    set({ edges });
  },

  setEdgeOnPath: (edgeId, onPath) => {
    const edges = get().edges.map(e =>
      e.id === edgeId ? { ...e, onPath } : e
    );
    set({ edges });
  },

  updateEdgeWeight: (edgeId, weight) => {
    const edges = get().edges.map(e =>
      e.id === edgeId ? { ...e, weight } : e
    );
    set({ edges });
  },

  addToQueue: (nodeId, distance) => {
    const queue = [...get().priorityQueue, { id: nodeId, distance }];
    queue.sort((a, b) => a.distance - b.distance);
    set({ priorityQueue: queue });
  },

  popFromQueue: () => {
    const queue = [...get().priorityQueue];
    const node = queue.shift();
    set({ priorityQueue: queue });
    return node || null;
  },

  setIsComplete: (complete) => set({ isComplete: complete }),

  addStepLog: (log) => {
    set({ stepLog: [...get().stepLog.slice(-8), log] });
  },

  reconstructPath: () => {
    const { nodes, edges, targetNode, sourceNode } = get();
    const path: string[] = [];
    let current = targetNode;
    
    while (current) {
      path.unshift(current);
      const node = nodes.find(n => n.id === current);
      if (!node || node.id === sourceNode) break;
      current = node.previous;
    }
    
    // Highlight path edges
    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(e =>
        (e.source === path[i] && e.target === path[i + 1]) ||
        (e.target === path[i] && e.source === path[i + 1])
      );
      if (edge) {
        get().setEdgeOnPath(edge.id, true);
      }
    }
    
    set({ shortestPath: path });
    get().addStepLog(`🛤️ 最短路徑: ${path.join(" → ")}`);
  },
}));
