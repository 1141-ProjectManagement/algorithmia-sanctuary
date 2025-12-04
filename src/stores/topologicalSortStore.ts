import { create } from 'zustand';

export interface TaskNode {
  id: string;
  label: string;
  indegree: number;
  position: [number, number, number];
  status: 'locked' | 'ready' | 'processing' | 'completed';
}

export interface DependencyEdge {
  from: string;
  to: string;
  active: boolean;
}

interface TopologicalSortState {
  nodes: TaskNode[];
  edges: DependencyEdge[];
  queue: string[];
  result: string[];
  currentNode: string | null;
  hasCycle: boolean;
  isRunning: boolean;
  stepLog: string[];
  
  // Actions
  initGraph: () => void;
  setCustomGraph: (deps: [number, number][]) => void;
  step: () => boolean;
  reset: () => void;
  removeEdge: (from: string, to: string) => void;
}

const DEFAULT_NODES: TaskNode[] = [
  { id: '0', label: '編譯核心', indegree: 0, position: [-3, 2, 0], status: 'ready' },
  { id: '1', label: '載入模組', indegree: 1, position: [0, 2, 0], status: 'locked' },
  { id: '2', label: '初始化DB', indegree: 1, position: [3, 2, 0], status: 'locked' },
  { id: '3', label: '啟動服務', indegree: 2, position: [-1.5, 0, 0], status: 'locked' },
  { id: '4', label: '連接網路', indegree: 1, position: [1.5, 0, 0], status: 'locked' },
  { id: '5', label: '系統就緒', indegree: 2, position: [0, -2, 0], status: 'locked' },
];

const DEFAULT_EDGES: DependencyEdge[] = [
  { from: '0', to: '1', active: true },
  { from: '0', to: '3', active: true },
  { from: '1', to: '2', active: true },
  { from: '1', to: '3', active: true },
  { from: '2', to: '4', active: true },
  { from: '3', to: '5', active: true },
  { from: '4', to: '5', active: true },
];

export const useTopologicalSortStore = create<TopologicalSortState>((set, get) => ({
  nodes: JSON.parse(JSON.stringify(DEFAULT_NODES)),
  edges: JSON.parse(JSON.stringify(DEFAULT_EDGES)),
  queue: ['0'],
  result: [],
  currentNode: null,
  hasCycle: false,
  isRunning: false,
  stepLog: [],

  initGraph: () => {
    const nodes = JSON.parse(JSON.stringify(DEFAULT_NODES));
    const edges = JSON.parse(JSON.stringify(DEFAULT_EDGES));
    const readyNodes = nodes.filter((n: TaskNode) => n.indegree === 0).map((n: TaskNode) => n.id);
    
    set({
      nodes,
      edges,
      queue: readyNodes,
      result: [],
      currentNode: null,
      hasCycle: false,
      isRunning: false,
      stepLog: ['初始化圖形，入度為 0 的節點加入佇列'],
    });
  },

  setCustomGraph: (deps: [number, number][]) => {
    const nodeCount = Math.max(...deps.flat()) + 1;
    const indegrees: number[] = new Array(nodeCount).fill(0);
    
    deps.forEach(([from, to]) => {
      indegrees[to]++;
    });

    const positions: [number, number, number][] = [];
    const cols = Math.ceil(Math.sqrt(nodeCount));
    for (let i = 0; i < nodeCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      positions.push([
        (col - (cols - 1) / 2) * 2.5,
        (1 - row) * 2,
        0
      ]);
    }

    const nodes: TaskNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: String(i),
        label: `任務 ${i}`,
        indegree: indegrees[i],
        position: positions[i],
        status: indegrees[i] === 0 ? 'ready' : 'locked',
      });
    }

    const edges: DependencyEdge[] = deps.map(([from, to]) => ({
      from: String(from),
      to: String(to),
      active: true,
    }));

    const readyNodes = nodes.filter(n => n.indegree === 0).map(n => n.id);

    set({
      nodes,
      edges,
      queue: readyNodes,
      result: [],
      currentNode: null,
      hasCycle: false,
      isRunning: true,
      stepLog: [`自訂圖形：${nodeCount} 個節點，${deps.length} 條邊`],
    });
  },

  step: () => {
    const { nodes, edges, queue, result, stepLog } = get();
    
    if (queue.length === 0) {
      const allCompleted = result.length === nodes.length;
      if (!allCompleted) {
        set({ 
          hasCycle: true, 
          isRunning: false,
          stepLog: [...stepLog, '⚠️ 檢測到循環依賴！無法完成拓撲排序'],
        });
      } else {
        set({ 
          isRunning: false,
          stepLog: [...stepLog, `✅ 拓撲排序完成：[${result.join(' → ')}]`],
        });
      }
      return false;
    }

    const currentId = queue[0];
    const newQueue = queue.slice(1);
    const newResult = [...result, currentId];

    const newNodes = nodes.map(n => {
      if (n.id === currentId) {
        return { ...n, status: 'completed' as const };
      }
      return n;
    });

    const newEdges = edges.map(e => {
      if (e.from === currentId) {
        return { ...e, active: false };
      }
      return e;
    });

    const outgoingEdges = edges.filter(e => e.from === currentId && e.active);
    const newReadyNodes: string[] = [];

    outgoingEdges.forEach(edge => {
      const targetIdx = newNodes.findIndex(n => n.id === edge.to);
      if (targetIdx !== -1) {
        newNodes[targetIdx] = {
          ...newNodes[targetIdx],
          indegree: newNodes[targetIdx].indegree - 1,
        };
        if (newNodes[targetIdx].indegree === 0) {
          newNodes[targetIdx].status = 'ready';
          newReadyNodes.push(edge.to);
        }
      }
    });

    const currentLabel = nodes.find(n => n.id === currentId)?.label || currentId;
    const newLog = [`處理節點 ${currentLabel}，移除 ${outgoingEdges.length} 條出邊`];
    if (newReadyNodes.length > 0) {
      const labels = newReadyNodes.map(id => newNodes.find(n => n.id === id)?.label || id);
      newLog.push(`新就緒節點：${labels.join(', ')}`);
    }

    set({
      nodes: newNodes,
      edges: newEdges,
      queue: [...newQueue, ...newReadyNodes],
      result: newResult,
      currentNode: currentId,
      stepLog: [...stepLog, ...newLog],
    });

    return true;
  },

  reset: () => {
    get().initGraph();
  },

  removeEdge: (from: string, to: string) => {
    const { nodes, edges, stepLog } = get();
    
    const newEdges = edges.filter(e => !(e.from === from && e.to === to));
    
    const newNodes = nodes.map(n => {
      if (n.id === to) {
        const newIndegree = n.indegree - 1;
        return { 
          ...n, 
          indegree: newIndegree,
          status: newIndegree === 0 ? 'ready' as const : n.status,
        };
      }
      return n;
    });

    const readyNodes = newNodes.filter(n => n.status === 'ready' || n.indegree === 0).map(n => n.id);

    set({
      nodes: newNodes,
      edges: newEdges,
      queue: readyNodes,
      hasCycle: false,
      stepLog: [...stepLog, `移除邊 ${from} → ${to}`],
    });
  },
}));
