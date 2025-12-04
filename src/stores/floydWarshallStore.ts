import { create } from "zustand";

export interface FWNode {
  id: string;
  x: number;
  y: number;
  z: number;
  status: "idle" | "intermediate" | "source" | "target";
}

export interface FWEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  active: boolean;
}

interface FloydWarshallState {
  nodes: FWNode[];
  edges: FWEdge[];
  distMatrix: number[][];
  prevDistMatrix: number[][];
  nodeIds: string[];
  
  // Algorithm state
  currentK: number;
  currentI: number;
  currentJ: number;
  isPlaying: boolean;
  isComplete: boolean;
  stepLog: string[];
  speed: number;
  
  // Updated cells tracking
  updatedCells: { i: number; j: number; oldVal: number; newVal: number }[];
  
  // Actions
  initGraph: () => void;
  resetAlgorithm: () => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (playing: boolean) => void;
  
  // Algorithm steps
  processNextStep: () => { updated: boolean; finished: boolean };
  
  // Direct state updates
  updateEdgeWeight: (edgeId: string, weight: number) => void;
  setNodeStatus: (nodeId: string, status: FWNode["status"]) => void;
  setEdgeActive: (edgeId: string, active: boolean) => void;
  addStepLog: (log: string) => void;
  
  // Manual control
  setKValue: (k: number) => void;
  skipToK: (k: number) => void;
}

const INF = 999;

const createInitialGraph = (): { nodes: FWNode[]; edges: FWEdge[] } => {
  const nodes: FWNode[] = [
    { id: "A", x: 0, y: 1.5, z: 0, status: "idle" },
    { id: "B", x: -2, y: 0, z: 0.5, status: "idle" },
    { id: "C", x: 2, y: 0, z: 0.5, status: "idle" },
    { id: "D", x: -1, y: -1.5, z: -0.5, status: "idle" },
    { id: "E", x: 1, y: -1.5, z: -0.5, status: "idle" },
  ];
  
  const edges: FWEdge[] = [
    { id: "AB", source: "A", target: "B", weight: 3, active: false },
    { id: "AC", source: "A", target: "C", weight: 8, active: false },
    { id: "AE", source: "A", target: "E", weight: -4, active: false },
    { id: "BC", source: "B", target: "C", weight: 1, active: false },
    { id: "BD", source: "B", target: "D", weight: 1, active: false },
    { id: "CB", source: "C", target: "B", weight: 4, active: false },
    { id: "CD", source: "C", target: "D", weight: -5, active: false },
    { id: "DA", source: "D", target: "A", weight: 2, active: false },
    { id: "DC", source: "D", target: "C", weight: 6, active: false },
    { id: "ED", source: "E", target: "D", weight: 8, active: false },
  ];
  
  return { nodes, edges };
};

const initDistMatrix = (nodes: FWNode[], edges: FWEdge[]): number[][] => {
  const n = nodes.length;
  const nodeIds = nodes.map(n => n.id);
  const matrix: number[][] = [];
  
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        const edge = edges.find(e => 
          e.source === nodeIds[i] && e.target === nodeIds[j]
        );
        matrix[i][j] = edge ? edge.weight : INF;
      }
    }
  }
  
  return matrix;
};

export const useFloydWarshallStore = create<FloydWarshallState>((set, get) => {
  const initialGraph = createInitialGraph();
  const nodeIds = initialGraph.nodes.map(n => n.id);
  const initialMatrix = initDistMatrix(initialGraph.nodes, initialGraph.edges);
  
  return {
    nodes: initialGraph.nodes,
    edges: initialGraph.edges,
    distMatrix: initialMatrix.map(row => [...row]),
    prevDistMatrix: initialMatrix.map(row => [...row]),
    nodeIds,
    
    currentK: -1,
    currentI: 0,
    currentJ: 0,
    isPlaying: false,
    isComplete: false,
    stepLog: [],
    speed: 500,
    updatedCells: [],
    
    initGraph: () => {
      const graph = createInitialGraph();
      const nodeIds = graph.nodes.map(n => n.id);
      const matrix = initDistMatrix(graph.nodes, graph.edges);
      
      set({
        nodes: graph.nodes,
        edges: graph.edges,
        distMatrix: matrix.map(row => [...row]),
        prevDistMatrix: matrix.map(row => [...row]),
        nodeIds,
        currentK: -1,
        currentI: 0,
        currentJ: 0,
        isPlaying: false,
        isComplete: false,
        stepLog: [],
        updatedCells: [],
      });
    },
    
    resetAlgorithm: () => {
      const { nodes, edges } = get();
      const matrix = initDistMatrix(nodes, edges);
      
      set({
        distMatrix: matrix.map(row => [...row]),
        prevDistMatrix: matrix.map(row => [...row]),
        nodes: nodes.map(n => ({ ...n, status: "idle" })),
        edges: edges.map(e => ({ ...e, active: false })),
        currentK: -1,
        currentI: 0,
        currentJ: 0,
        isPlaying: false,
        isComplete: false,
        stepLog: [],
        updatedCells: [],
      });
    },
    
    setSpeed: (speed) => set({ speed }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    
    processNextStep: () => {
      const { distMatrix, nodeIds, currentK, currentI, currentJ, nodes } = get();
      const n = nodeIds.length;
      
      let k = currentK;
      let i = currentI;
      let j = currentJ;
      
      // Initial step - start the algorithm
      if (k === -1) {
        k = 0;
        i = 0;
        j = 0;
        get().addStepLog(`🚀 Floyd-Warshall 開始！嘗試以 ${nodeIds[0]} 為中轉站`);
        set({ 
          currentK: k, 
          currentI: i, 
          currentJ: j,
          nodes: nodes.map(n => ({
            ...n,
            status: n.id === nodeIds[k] ? "intermediate" : "idle"
          }))
        });
        return { updated: false, finished: false };
      }
      
      // Save previous matrix state
      const prevMatrix = distMatrix.map(row => [...row]);
      const newMatrix = distMatrix.map(row => [...row]);
      
      // Process current (i, j) with intermediate k
      const throughK = newMatrix[i][k] + newMatrix[k][j];
      let updated = false;
      
      if (throughK < newMatrix[i][j] && newMatrix[i][k] !== INF && newMatrix[k][j] !== INF) {
        const oldVal = newMatrix[i][j];
        newMatrix[i][j] = throughK;
        updated = true;
        
        get().addStepLog(
          `✨ D[${nodeIds[i]}][${nodeIds[j]}] = min(${oldVal === INF ? '∞' : oldVal}, ${newMatrix[i][k]} + ${newMatrix[k][j]}) = ${throughK}`
        );
        
        set({
          updatedCells: [{ i, j, oldVal, newVal: throughK }],
          edges: get().edges.map(e => ({
            ...e,
            active: (e.source === nodeIds[i] && e.target === nodeIds[k]) ||
                   (e.source === nodeIds[k] && e.target === nodeIds[j])
          }))
        });
      } else {
        set({ 
          updatedCells: [],
          edges: get().edges.map(e => ({ ...e, active: false }))
        });
      }
      
      // Update node statuses
      set({
        nodes: nodes.map(n => ({
          ...n,
          status: n.id === nodeIds[k] ? "intermediate" :
                  n.id === nodeIds[i] ? "source" :
                  n.id === nodeIds[j] ? "target" : "idle"
        }))
      });
      
      // Move to next (i, j)
      j++;
      if (j >= n) {
        j = 0;
        i++;
      }
      if (i >= n) {
        i = 0;
        k++;
        if (k < n) {
          get().addStepLog(`🔄 切換中轉站: ${nodeIds[k]}`);
        }
      }
      
      // Check if finished
      if (k >= n) {
        set({
          distMatrix: newMatrix,
          prevDistMatrix: prevMatrix,
          isComplete: true,
          isPlaying: false,
          currentK: k,
          currentI: i,
          currentJ: j,
          nodes: nodes.map(n => ({ ...n, status: "idle" })),
          edges: get().edges.map(e => ({ ...e, active: false }))
        });
        get().addStepLog("🎉 演算法完成！所有最短路徑已計算");
        return { updated, finished: true };
      }
      
      set({
        distMatrix: newMatrix,
        prevDistMatrix: prevMatrix,
        currentK: k,
        currentI: i,
        currentJ: j,
      });
      
      return { updated, finished: false };
    },
    
    updateEdgeWeight: (edgeId, weight) => {
      const edges = get().edges.map(e =>
        e.id === edgeId ? { ...e, weight } : e
      );
      set({ edges });
      
      // Reinitialize matrix with new weights
      const { nodes } = get();
      const matrix = initDistMatrix(nodes, edges);
      set({ 
        distMatrix: matrix.map(row => [...row]),
        prevDistMatrix: matrix.map(row => [...row])
      });
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
    
    addStepLog: (log) => {
      set({ stepLog: [...get().stepLog.slice(-9), log] });
    },
    
    setKValue: (k) => {
      const { nodeIds, nodes } = get();
      set({
        currentK: k,
        currentI: 0,
        currentJ: 0,
        nodes: nodes.map(n => ({
          ...n,
          status: n.id === nodeIds[k] ? "intermediate" : "idle"
        }))
      });
      get().addStepLog(`⏩ 跳轉到中轉站: ${nodeIds[k]}`);
    },
    
    skipToK: (targetK) => {
      const { nodeIds, nodes, edges } = get();
      const n = nodeIds.length;
      
      // Reset and process up to targetK
      const matrix = initDistMatrix(nodes, edges);
      
      for (let k = 0; k < targetK; k++) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const throughK = matrix[i][k] + matrix[k][j];
            if (throughK < matrix[i][j] && matrix[i][k] !== INF && matrix[k][j] !== INF) {
              matrix[i][j] = throughK;
            }
          }
        }
      }
      
      set({
        distMatrix: matrix.map(row => [...row]),
        prevDistMatrix: matrix.map(row => [...row]),
        currentK: targetK,
        currentI: 0,
        currentJ: 0,
        nodes: nodes.map(node => ({
          ...node,
          status: targetK < nodeIds.length && node.id === nodeIds[targetK] ? "intermediate" : "idle"
        })),
        isComplete: targetK >= nodeIds.length,
      });
      
      if (targetK < n) {
        get().addStepLog(`⏩ 快進到中轉站: ${nodeIds[targetK]}`);
      } else {
        get().addStepLog("🎉 演算法完成！");
      }
    },
  };
});
