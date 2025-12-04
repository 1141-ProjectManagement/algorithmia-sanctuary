import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { DPCell } from "@/stores/dpStore";

interface CrystalProps {
  cell: DPCell;
  position: [number, number, number];
  onHover: (cell: { row: number; col: number } | null) => void;
  isHovered: boolean;
  showDependency: boolean;
}

const Crystal = ({ cell, position, onHover, isHovered, showDependency }: CrystalProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    if (cell.isOnPath) return "#d4af37"; // Gold for optimal path
    if (cell.isHighlighted) return "#22c55e"; // Green for current
    if (cell.isSource) return "#3b82f6"; // Blue for source
    if (cell.computed) return "#8b5cf6"; // Purple for computed
    return "#374151"; // Gray for uncomputed
  }, [cell]);

  const emissiveIntensity = useMemo(() => {
    if (cell.isHighlighted || cell.isOnPath) return 0.8;
    if (cell.isSource) return 0.5;
    if (cell.computed) return 0.2;
    return 0;
  }, [cell]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(new THREE.Color(color), 0.1);
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        emissiveIntensity,
        0.1
      );
      
      // Pulse effect for highlighted
      if (cell.isHighlighted) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    
    if (glowRef.current && (cell.isHighlighted || cell.isOnPath)) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      {(cell.isHighlighted || cell.isOnPath) && (
        <mesh ref={glowRef}>
          <octahedronGeometry args={[0.35]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Crystal body */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover({ row: cell.row, col: cell.col })}
        onPointerLeave={() => onHover(null)}
      >
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={cell.computed ? 0.9 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Value text */}
      {cell.computed && (
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.15}
          color={cell.isHighlighted || cell.isOnPath ? "#ffffff" : "#888888"}
          anchorX="center"
          anchorY="middle"
        >
          {cell.value.toString()}
        </Text>
      )}
    </group>
  );
};

interface DependencyLineProps {
  from: [number, number, number];
  to: [number, number, number];
}

const DependencyLine = ({ from, to }: DependencyLineProps) => {
  const points = useMemo(() => [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  ], [from, to]);

  return (
    <Line
      points={points}
      color="#3b82f6"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
};

interface AxisLabelsProps {
  items: { name: string }[];
  capacity: number;
}

const AxisLabels = ({ items, capacity }: AxisLabelsProps) => {
  return (
    <group>
      {/* Row labels (items) */}
      {items.map((item, i) => (
        <Text
          key={`row-${i}`}
          position={[-1.5, (items.length / 2 - i - 1) * 0.8, 0]}
          fontSize={0.12}
          color="#888888"
          anchorX="right"
        >
          {item.name}
        </Text>
      ))}
      
      {/* Column labels (capacity) */}
      {Array.from({ length: capacity + 1 }, (_, w) => (
        <Text
          key={`col-${w}`}
          position={[(w - capacity / 2) * 0.8, (items.length / 2 + 0.5) * 0.8, 0]}
          fontSize={0.12}
          color="#888888"
          anchorX="center"
        >
          {w.toString()}
        </Text>
      ))}
      
      {/* Axis titles */}
      <Text
        position={[-2.5, 0, 0]}
        fontSize={0.15}
        color="#d4af37"
        anchorX="center"
        rotation={[0, 0, Math.PI / 2]}
      >
        物品
      </Text>
      <Text
        position={[0, (items.length / 2 + 1.2) * 0.8, 0]}
        fontSize={0.15}
        color="#d4af37"
        anchorX="center"
      >
        容量
      </Text>
    </group>
  );
};

interface CrystalMatrixSceneProps {
  dpTable: DPCell[][];
  items: { name: string; weight: number; value: number }[];
  capacity: number;
  hoveredCell: { row: number; col: number } | null;
  onHoverCell: (cell: { row: number; col: number } | null) => void;
}

const CrystalMatrixScene = ({ 
  dpTable, 
  items, 
  capacity, 
  hoveredCell, 
  onHoverCell 
}: CrystalMatrixSceneProps) => {
  const rows = dpTable.length;
  const cols = dpTable[0]?.length || 0;

  // Calculate dependency lines
  const dependencyLines = useMemo(() => {
    if (!hoveredCell || hoveredCell.row === 0) return [];
    
    const lines: { from: [number, number, number]; to: [number, number, number] }[] = [];
    const { row, col } = hoveredCell;
    
    // Source 1: directly above
    if (row > 0) {
      lines.push({
        from: [(col - capacity / 2) * 0.8, ((rows - 1) / 2 - row) * 0.8, 0],
        to: [(col - capacity / 2) * 0.8, ((rows - 1) / 2 - (row - 1)) * 0.8, 0]
      });
    }
    
    // Source 2: diagonally above-left (if item was taken)
    if (row > 0 && col >= items[row - 1]?.weight) {
      const prevCol = col - items[row - 1].weight;
      lines.push({
        from: [(col - capacity / 2) * 0.8, ((rows - 1) / 2 - row) * 0.8, 0],
        to: [(prevCol - capacity / 2) * 0.8, ((rows - 1) / 2 - (row - 1)) * 0.8, 0]
      });
    }
    
    return lines;
  }, [hoveredCell, rows, capacity, items]);

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#8b5cf6" />
      
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <group>
          {/* Crystal matrix */}
          {dpTable.map((row, i) =>
            row.map((cell, j) => (
              <Crystal
                key={`${i}-${j}`}
                cell={cell}
                position={[
                  (j - capacity / 2) * 0.8,
                  ((rows - 1) / 2 - i) * 0.8,
                  0
                ]}
                onHover={onHoverCell}
                isHovered={hoveredCell?.row === i && hoveredCell?.col === j}
                showDependency={false}
              />
            ))
          )}
          
          {/* Dependency lines */}
          {dependencyLines.map((line, idx) => (
            <DependencyLine key={idx} from={line.from} to={line.to} />
          ))}
          
          {/* Axis labels */}
          <AxisLabels items={items} capacity={capacity} />
        </group>
      </Float>
    </Canvas>
  );
};

export default CrystalMatrixScene;
