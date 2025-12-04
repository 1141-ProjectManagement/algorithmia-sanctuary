import { create } from "zustand";

export interface Queen {
  row: number;
  col: number;
  status: "placing" | "valid" | "conflict" | "removing";
}

export interface MazeCell {
  row: number;
  col: number;
  type: "empty" | "wall" | "start" | "end";
  visited: boolean;
  onPath: boolean;
  exploring: boolean;
}

interface BacktrackingState {
  // N-Queens
  boardSize: number;
  queens: Queen[];
  currentRow: number;
  currentCol: number;
  isPlaying: boolean;
  solutions: Queen[][];
  foundSolution: boolean;
  checkDiagonal: boolean;
  
  // Maze
  maze: MazeCell[][];
  mazePath: { row: number; col: number }[];
  mazeFound: boolean;
  
  // Actions
  setBoardSize: (size: number) => void;
  setCheckDiagonal: (check: boolean) => void;
  resetQueens: () => void;
  placeQueen: (row: number, col: number) => void;
  removeQueen: (row: number) => void;
  setQueenStatus: (row: number, status: Queen["status"]) => void;
  addSolution: () => void;
  setFoundSolution: (found: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentPosition: (row: number, col: number) => void;
  
  // Maze actions
  initMaze: () => void;
  setMazeCellVisited: (row: number, col: number, visited: boolean) => void;
  setMazeCellExploring: (row: number, col: number, exploring: boolean) => void;
  setMazeCellOnPath: (row: number, col: number, onPath: boolean) => void;
  setMazeFound: (found: boolean) => void;
  resetMaze: () => void;
}

const createEmptyMaze = (): MazeCell[][] => {
  const maze: MazeCell[][] = [];
  const layout = [
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];
  
  for (let r = 0; r < 5; r++) {
    maze[r] = [];
    for (let c = 0; c < 5; c++) {
      maze[r][c] = {
        row: r,
        col: c,
        type: r === 0 && c === 0 ? "start" : r === 4 && c === 4 ? "end" : layout[r][c] === 1 ? "wall" : "empty",
        visited: false,
        onPath: false,
        exploring: false,
      };
    }
  }
  return maze;
};

export const useBacktrackingStore = create<BacktrackingState>((set, get) => ({
  boardSize: 4,
  queens: [],
  currentRow: 0,
  currentCol: 0,
  isPlaying: false,
  solutions: [],
  foundSolution: false,
  checkDiagonal: true,
  
  maze: createEmptyMaze(),
  mazePath: [],
  mazeFound: false,

  setBoardSize: (size) => set({ boardSize: size, queens: [], solutions: [], foundSolution: false }),
  
  setCheckDiagonal: (check) => set({ checkDiagonal: check }),
  
  resetQueens: () => set({ queens: [], currentRow: 0, currentCol: 0, solutions: [], foundSolution: false }),
  
  placeQueen: (row, col) => {
    const queens = [...get().queens];
    const existingIndex = queens.findIndex(q => q.row === row);
    if (existingIndex >= 0) {
      queens[existingIndex] = { row, col, status: "placing" };
    } else {
      queens.push({ row, col, status: "placing" });
    }
    set({ queens });
  },
  
  removeQueen: (row) => {
    const queens = get().queens.filter(q => q.row !== row);
    set({ queens });
  },
  
  setQueenStatus: (row, status) => {
    const queens = get().queens.map(q => 
      q.row === row ? { ...q, status } : q
    );
    set({ queens });
  },
  
  addSolution: () => {
    const solutions = [...get().solutions, [...get().queens]];
    set({ solutions, foundSolution: true });
  },
  
  setFoundSolution: (found) => set({ foundSolution: found }),
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setCurrentPosition: (row, col) => set({ currentRow: row, currentCol: col }),

  initMaze: () => set({ maze: createEmptyMaze(), mazePath: [], mazeFound: false }),
  
  setMazeCellVisited: (row, col, visited) => {
    const maze = get().maze.map(r => r.map(c => ({ ...c })));
    if (maze[row]?.[col]) {
      maze[row][col].visited = visited;
    }
    set({ maze });
  },
  
  setMazeCellExploring: (row, col, exploring) => {
    const maze = get().maze.map(r => r.map(c => ({ ...c })));
    if (maze[row]?.[col]) {
      maze[row][col].exploring = exploring;
    }
    set({ maze });
  },
  
  setMazeCellOnPath: (row, col, onPath) => {
    const maze = get().maze.map(r => r.map(c => ({ ...c })));
    if (maze[row]?.[col]) {
      maze[row][col].onPath = onPath;
    }
    set({ maze });
  },
  
  setMazeFound: (found) => set({ mazeFound: found }),
  
  resetMaze: () => set({ maze: createEmptyMaze(), mazePath: [], mazeFound: false }),
}));
