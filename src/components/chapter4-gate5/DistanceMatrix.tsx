import { motion } from "framer-motion";
import { useMemo } from "react";

interface DistanceMatrixProps {
  matrix: number[][];
  nodeIds: string[];
  currentK: number;
  currentI: number;
  currentJ: number;
  updatedCells: { i: number; j: number; oldVal: number; newVal: number }[];
}

const INF = 999;

const DistanceMatrix = ({
  matrix,
  nodeIds,
  currentK,
  currentI,
  currentJ,
  updatedCells,
}: DistanceMatrixProps) => {
  const getCellColor = (value: number): string => {
    if (value === INF) return "hsl(0, 0%, 20%)";
    if (value === 0) return "hsl(220, 50%, 30%)";
    
    // Map distance to color (green = close, red = far)
    const maxVal = 20;
    const normalized = Math.min(Math.abs(value) / maxVal, 1);
    
    if (value < 0) {
      // Negative values: purple gradient
      const hue = 280;
      const lightness = 30 + (1 - normalized) * 20;
      return `hsl(${hue}, 60%, ${lightness}%)`;
    }
    
    // Positive values: red (far) to green (close)
    const hue = 120 - normalized * 120; // 120 (green) to 0 (red)
    const saturation = 50 + normalized * 20;
    const lightness = 35 + (1 - normalized) * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const isUpdatedCell = (i: number, j: number) => {
    return updatedCells.some(cell => cell.i === i && cell.j === j);
  };

  const isCurrentCell = (i: number, j: number) => {
    return currentK >= 0 && currentI === i && currentJ === j;
  };

  const isInvolvedRow = (i: number) => currentK >= 0 && currentI === i;
  const isInvolvedCol = (j: number) => currentK >= 0 && currentJ === j;
  const isKRow = (i: number) => currentK >= 0 && currentK === i;
  const isKCol = (j: number) => currentK >= 0 && currentK === j;

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground text-center mb-2">
        距離矩陣 D[i][j]
      </div>
      
      <div className="overflow-x-auto">
        <table className="border-collapse mx-auto">
          <thead>
            <tr>
              <th className="w-10 h-10 text-xs text-muted-foreground"></th>
              {nodeIds.map((id, j) => (
                <th 
                  key={id} 
                  className={`w-10 h-10 text-xs font-bold ${
                    isKCol(j) ? "text-primary bg-primary/20" :
                    isInvolvedCol(j) ? "text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td 
                  className={`w-10 h-10 text-xs font-bold text-center ${
                    isKRow(i) ? "text-primary bg-primary/20" :
                    isInvolvedRow(i) ? "text-blue-400" : "text-muted-foreground"
                  }`}
                >
                  {nodeIds[i]}
                </td>
                {row.map((value, j) => {
                  const updated = isUpdatedCell(i, j);
                  const current = isCurrentCell(i, j);
                  const bgColor = getCellColor(value);
                  
                  return (
                    <td key={j} className="p-0.5">
                      <motion.div
                        className={`w-9 h-9 flex items-center justify-center text-xs font-mono rounded ${
                          current ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
                        }`}
                        style={{ backgroundColor: bgColor }}
                        animate={updated ? {
                          scale: [1, 1.3, 1],
                          boxShadow: [
                            "0 0 0px rgba(212, 175, 55, 0)",
                            "0 0 20px rgba(212, 175, 55, 0.8)",
                            "0 0 0px rgba(212, 175, 55, 0)"
                          ]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <span className={`${value === INF ? "text-muted-foreground" : "text-white"}`}>
                          {value === INF ? "∞" : value}
                        </span>
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(120, 50%, 35%)" }} />
          <span>近</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(60, 60%, 40%)" }} />
          <span>中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(0, 70%, 40%)" }} />
          <span>遠</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(0, 0%, 20%)" }} />
          <span>∞</span>
        </div>
      </div>

      {/* Current operation display */}
      {currentK >= 0 && currentK < nodeIds.length && (
        <div className="mt-4 p-3 bg-card/60 rounded-lg border border-primary/30">
          <div className="text-sm text-center">
            <span className="text-muted-foreground">檢查: </span>
            <span className="text-blue-400 font-mono">D[{nodeIds[currentI]}][{nodeIds[currentJ]}]</span>
            <span className="text-muted-foreground"> vs </span>
            <span className="text-blue-400 font-mono">D[{nodeIds[currentI]}][{nodeIds[currentK]}]</span>
            <span className="text-primary"> + </span>
            <span className="text-emerald-400 font-mono">D[{nodeIds[currentK]}][{nodeIds[currentJ]}]</span>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-1">
            經過中轉站 <span className="text-primary font-bold">{nodeIds[currentK]}</span> 是否更短？
          </div>
        </div>
      )}
    </div>
  );
};

export default DistanceMatrix;
