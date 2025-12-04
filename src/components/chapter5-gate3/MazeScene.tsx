import { motion } from "framer-motion";
import { MazeCell } from "@/stores/backtrackingStore";

interface MazeSceneProps {
  maze: MazeCell[][];
  className?: string;
}

const MazeScene = ({ maze, className = "" }: MazeSceneProps) => {
  const getCellColor = (cell: MazeCell) => {
    if (cell.type === "wall") return "bg-zinc-800";
    if (cell.type === "start") return "bg-green-500";
    if (cell.type === "end") return "bg-primary";
    if (cell.onPath) return "bg-primary/60";
    if (cell.exploring) return "bg-blue-500";
    if (cell.visited) return "bg-red-400/50";
    return "bg-zinc-700/50";
  };

  const getCellBorder = (cell: MazeCell) => {
    if (cell.exploring) return "border-blue-400 border-2";
    if (cell.onPath) return "border-primary border-2";
    return "border-zinc-600/30 border";
  };

  return (
    <div className={`grid gap-1 ${className}`} style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 5}, 1fr)` }}>
      {maze.map((row, i) =>
        row.map((cell, j) => (
          <motion.div
            key={`${i}-${j}`}
            className={`aspect-square rounded-sm ${getCellColor(cell)} ${getCellBorder(cell)} flex items-center justify-center text-xs font-bold`}
            animate={{
              scale: cell.exploring ? 1.1 : 1,
              boxShadow: cell.onPath ? "0 0 10px rgba(212,175,55,0.6)" : "none",
            }}
            transition={{ duration: 0.2 }}
          >
            {cell.type === "start" && "S"}
            {cell.type === "end" && "E"}
            {cell.type === "wall" && "▓"}
            {cell.exploring && cell.type === "empty" && "👤"}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default MazeScene;
