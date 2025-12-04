import { create } from "zustand";

export interface Island {
  id: string;
  x: number;
  y: number;
  z: number;
  visited: boolean;
  inMST: boolean;
}

export interface Bridge {
  id: string;
  source: string;
  target: string;
  weight: number;
  status: "potential" | "selected" | "rejected" | "candidate";
  inMST: boolean;
}

export interface UnionFindState {
  parent: Record<string, string>;
  rank: Record<string, number>;
}

interface MSTState {
  islands: Island[];
  bridges: Bridge[];
  mode: "kruskal" | "prim";
  sortedEdges: Bridge[];
  currentEdgeIndex: number;
  mstEdges: Bridge[];
  totalWeight: number;
  isPlaying: boolean;
  isComplete: boolean;
  unionFind: UnionFindState;
  visitedSet: Set<string>;
  candidateEdges: Bridge[];
  
  // Actions
  setMode: (mode: "kruskal" | "prim") => void;
  initGraph: () => void;
  resetMST: () => void;
  setIsPlaying: (playing: boolean) => void;
  
  // Kruskal actions
  sortEdges: () => void;
  processNextEdgeKruskal: () => { edge: Bridge; accepted: boolean } | null;
  
  // Prim actions
  startPrim: (startId: string) => void;
  processNextEdgePrim: () => { edge: Bridge; accepted: boolean } | null;
  
  // Union-Find
  find: (x: string) => string;
  union: (x: string, y: string) => boolean;
  
  // Direct state setters for visualization
  setBridgeStatus: (bridgeId: string, status: Bridge["status"]) => void;
  addToMST: (bridgeId: string) => void;
  setIslandVisited: (islandId: string, visited: boolean) => void;
  updateBridgeWeight: (bridgeId: string, weight: number) => void;
  setIsComplete: (complete: boolean) => void;
}

const createInitialGraph = (): { islands: Island[]; bridges: Bridge[] } => {
  const islands: Island[] = [
    { id: "A", x: 0, y: 0, z: 0, visited: false, inMST: false },
    { id: "B", x: -3, y: 0.5, z: 1, visited: false, inMST: false },
    { id: "C", x: 3, y: -0.3, z: 0.5, visited: false, inMST: false },
    { id: "D", x: -2, y: 0.2, z: -2, visited: false, inMST: false },
    { id: "E", x: 2, y: -0.5, z: -2.5, visited: false, inMST: false },
    { id: "F", x: 0, y: 0.3, z: -3.5, visited: false, inMST: false },
  ];
  
  const bridges: Bridge[] = [
    { id: "AB", source: "A", target: "B", weight: 4, status: "potential", inMST: false },
    { id: "AC", source: "A", target: "C", weight: 2, status: "potential", inMST: false },
    { id: "AD", source: "A", target: "D", weight: 5, status: "potential", inMST: false },
    { id: "BC", source: "B", target: "C", weight: 6, status: "potential", inMST: false },
    { id: "BD", source: "B", target: "D", weight: 3, status: "potential", inMST: false },
    { id: "CE", source: "C", target: "E", weight: 4, status: "potential", inMST: false },
    { id: "DE", source: "D", target: "E", weight: 2, status: "potential", inMST: false },
    { id: "DF", source: "D", target: "F", weight: 6, status: "potential", inMST: false },
    { id: "EF", source: "E", target: "F", weight: 3, status: "potential", inMST: false },
  ];
  
  return { islands, bridges };
};

const initUnionFind = (islands: Island[]): UnionFindState => {
  const parent: Record<string, string> = {};
  const rank: Record<string, number> = {};
  islands.forEach(island => {
    parent[island.id] = island.id;
    rank[island.id] = 0;
  });
  return { parent, rank };
};

export const useMSTStore = create<MSTState>((set, get) => ({
  islands: createInitialGraph().islands,
  bridges: createInitialGraph().bridges,
  mode: "kruskal",
  sortedEdges: [],
  currentEdgeIndex: 0,
  mstEdges: [],
  totalWeight: 0,
  isPlaying: false,
  isComplete: false,
  unionFind: initUnionFind(createInitialGraph().islands),
  visitedSet: new Set(),
  candidateEdges: [],

  setMode: (mode) => {
    set({ mode });
    get().resetMST();
  },

  initGraph: () => {
    const graph = createInitialGraph();
    set({
      islands: graph.islands,
      bridges: graph.bridges,
      unionFind: initUnionFind(graph.islands),
      sortedEdges: [],
      currentEdgeIndex: 0,
      mstEdges: [],
      totalWeight: 0,
      isComplete: false,
      visitedSet: new Set(),
      candidateEdges: [],
    });
  },

  resetMST: () => {
    const { islands, bridges } = get();
    set({
      islands: islands.map(i => ({ ...i, visited: false, inMST: false })),
      bridges: bridges.map(b => ({ ...b, status: "potential", inMST: false })),
      unionFind: initUnionFind(islands),
      sortedEdges: [],
      currentEdgeIndex: 0,
      mstEdges: [],
      totalWeight: 0,
      isPlaying: false,
      isComplete: false,
      visitedSet: new Set(),
      candidateEdges: [],
    });
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  sortEdges: () => {
    const { bridges } = get();
    const sorted = [...bridges].sort((a, b) => a.weight - b.weight);
    set({ sortedEdges: sorted, currentEdgeIndex: 0 });
  },

  find: (x: string): string => {
    const { unionFind } = get();
    if (unionFind.parent[x] !== x) {
      // Path compression
      const root = get().find(unionFind.parent[x]);
      unionFind.parent[x] = root;
      return root;
    }
    return x;
  },

  union: (x: string, y: string): boolean => {
    const { unionFind } = get();
    const rootX = get().find(x);
    const rootY = get().find(y);
    
    if (rootX === rootY) return false; // Already connected (cycle)
    
    // Union by rank
    if (unionFind.rank[rootX] < unionFind.rank[rootY]) {
      unionFind.parent[rootX] = rootY;
    } else if (unionFind.rank[rootX] > unionFind.rank[rootY]) {
      unionFind.parent[rootY] = rootX;
    } else {
      unionFind.parent[rootY] = rootX;
      unionFind.rank[rootX]++;
    }
    
    set({ unionFind: { ...unionFind } });
    return true;
  },

  processNextEdgeKruskal: () => {
    const { sortedEdges, currentEdgeIndex, mstEdges, totalWeight, islands } = get();
    
    if (currentEdgeIndex >= sortedEdges.length || mstEdges.length >= islands.length - 1) {
      set({ isComplete: true, isPlaying: false });
      return null;
    }
    
    const edge = sortedEdges[currentEdgeIndex];
    const accepted = get().union(edge.source, edge.target);
    
    if (accepted) {
      get().addToMST(edge.id);
      set({
        mstEdges: [...mstEdges, edge],
        totalWeight: totalWeight + edge.weight,
      });
    } else {
      get().setBridgeStatus(edge.id, "rejected");
    }
    
    set({ currentEdgeIndex: currentEdgeIndex + 1 });
    
    // Check completion
    if (mstEdges.length + (accepted ? 1 : 0) >= islands.length - 1) {
      set({ isComplete: true, isPlaying: false });
    }
    
    return { edge, accepted };
  },

  startPrim: (startId: string) => {
    const { bridges } = get();
    const visited = new Set([startId]);
    
    // Find candidate edges from start
    const candidates = bridges.filter(
      b => (b.source === startId || b.target === startId)
    ).map(b => ({ ...b, status: "candidate" as const }));
    
    set({
      visitedSet: visited,
      candidateEdges: candidates,
    });
    
    get().setIslandVisited(startId, true);
    candidates.forEach(c => get().setBridgeStatus(c.id, "candidate"));
  },

  processNextEdgePrim: () => {
    const { candidateEdges, visitedSet, mstEdges, totalWeight, islands, bridges } = get();
    
    if (candidateEdges.length === 0 || visitedSet.size >= islands.length) {
      set({ isComplete: true, isPlaying: false });
      return null;
    }
    
    // Find minimum weight candidate
    const minEdge = candidateEdges.reduce((min, e) => 
      e.weight < min.weight ? e : min
    );
    
    // Determine new island
    const newIsland = visitedSet.has(minEdge.source) ? minEdge.target : minEdge.source;
    
    // Add to MST
    get().addToMST(minEdge.id);
    get().setIslandVisited(newIsland, true);
    
    const newVisited = new Set(visitedSet);
    newVisited.add(newIsland);
    
    // Update candidate edges
    const newCandidates = bridges.filter(b => {
      if (b.inMST || b.status === "rejected") return false;
      const srcIn = newVisited.has(b.source);
      const tgtIn = newVisited.has(b.target);
      return (srcIn && !tgtIn) || (!srcIn && tgtIn);
    });
    
    // Mark old candidates that are now internal as rejected
    candidateEdges.forEach(c => {
      if (c.id !== minEdge.id) {
        const srcIn = newVisited.has(c.source);
        const tgtIn = newVisited.has(c.target);
        if (srcIn && tgtIn) {
          get().setBridgeStatus(c.id, "rejected");
        }
      }
    });
    
    newCandidates.forEach(c => get().setBridgeStatus(c.id, "candidate"));
    
    set({
      visitedSet: newVisited,
      candidateEdges: newCandidates,
      mstEdges: [...mstEdges, minEdge],
      totalWeight: totalWeight + minEdge.weight,
    });
    
    // Check completion
    if (newVisited.size >= islands.length) {
      set({ isComplete: true, isPlaying: false });
    }
    
    return { edge: minEdge, accepted: true };
  },

  setBridgeStatus: (bridgeId, status) => {
    const bridges = get().bridges.map(b =>
      b.id === bridgeId ? { ...b, status } : b
    );
    set({ bridges });
  },

  addToMST: (bridgeId) => {
    const bridges = get().bridges.map(b =>
      b.id === bridgeId ? { ...b, status: "selected" as const, inMST: true } : b
    );
    set({ bridges });
  },

  setIslandVisited: (islandId, visited) => {
    const islands = get().islands.map(i =>
      i.id === islandId ? { ...i, visited, inMST: visited } : i
    );
    set({ islands });
  },

  updateBridgeWeight: (bridgeId, weight) => {
    const bridges = get().bridges.map(b =>
      b.id === bridgeId ? { ...b, weight } : b
    );
    set({ bridges });
  },

  setIsComplete: (complete) => set({ isComplete: complete }),
}));
