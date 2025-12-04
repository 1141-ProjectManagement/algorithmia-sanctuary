import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { Queen } from "@/stores/backtrackingStore";

interface ChessBoardProps {
  size: number;
  queens: Queen[];
  currentRow: number;
  currentCol: number;
}

const ChessBoard = ({ size, queens, currentRow, currentCol }: ChessBoardProps) => {
  const cellSize = 0.8;
  const boardOffset = ((size - 1) * cellSize) / 2;

  return (
    <group>
      {/* Board cells */}
      {Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => {
          const isLight = (row + col) % 2 === 0;
          const isCurrentCell = row === currentRow && col === currentCol;
          
          return (
            <mesh
              key={`${row}-${col}`}
              position={[
                col * cellSize - boardOffset,
                -0.1,
                row * cellSize - boardOffset,
              ]}
            >
              <boxGeometry args={[cellSize * 0.95, 0.1, cellSize * 0.95]} />
              <meshStandardMaterial
                color={isCurrentCell ? "#d4af37" : isLight ? "#8b7355" : "#5d4e37"}
                emissive={isCurrentCell ? "#d4af37" : "#000000"}
                emissiveIntensity={isCurrentCell ? 0.3 : 0}
              />
            </mesh>
          );
        })
      )}

      {/* Queens */}
      {queens.map((queen) => (
        <QueenPiece
          key={`queen-${queen.row}`}
          position={[
            queen.col * cellSize - boardOffset,
            0.3,
            queen.row * cellSize - boardOffset,
          ]}
          status={queen.status}
        />
      ))}

      {/* Row/Col labels */}
      {Array.from({ length: size }, (_, i) => (
        <group key={`label-${i}`}>
          <Text
            position={[-boardOffset - 0.6, 0, i * cellSize - boardOffset]}
            fontSize={0.2}
            color="#888888"
          >
            {i + 1}
          </Text>
          <Text
            position={[i * cellSize - boardOffset, 0, boardOffset + 0.6]}
            fontSize={0.2}
            color="#888888"
          >
            {String.fromCharCode(65 + i)}
          </Text>
        </group>
      ))}
    </group>
  );
};

interface QueenPieceProps {
  position: [number, number, number];
  status: Queen["status"];
}

const QueenPiece = ({ position, status }: QueenPieceProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (status) {
      case "placing":
        return "#3b82f6"; // Blue
      case "valid":
        return "#22c55e"; // Green
      case "conflict":
        return "#ef4444"; // Red
      case "removing":
        return "#f97316"; // Orange
      default:
        return "#8b5cf6";
    }
  }, [status]);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse animation for placing status
      if (status === "placing") {
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      } else if (status === "conflict") {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 10) * 0.2;
      } else if (status === "removing") {
        meshRef.current.scale.setScalar(
          Math.max(0, 1 - (state.clock.elapsedTime % 1) * 2)
        );
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.rotation.y = 0;
      }
    }

    if (glowRef.current && (status === "valid" || status === "placing")) {
      glowRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      {(status === "valid" || status === "placing") && (
        <mesh ref={glowRef}>
          <cylinderGeometry args={[0.25, 0.3, 0.1, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Queen piece (simplified crown shape) */}
      <mesh ref={meshRef}>
        {/* Base */}
        <cylinderGeometry args={[0.25, 0.3, 0.15, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Crown top */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.15, 0.3, 5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Status indicator */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
      >
        {status === "conflict" ? "⚠" : status === "valid" ? "✓" : ""}
      </Text>
    </group>
  );
};

interface NQueensSceneProps {
  boardSize: number;
  queens: Queen[];
  currentRow: number;
  currentCol: number;
  foundSolution: boolean;
}

const NQueensScene = ({
  boardSize,
  queens,
  currentRow,
  currentCol,
  foundSolution,
}: NQueensSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 5, 6], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />
      
      {/* Solution glow */}
      {foundSolution && (
        <pointLight position={[0, 3, 0]} intensity={2} color="#d4af37" />
      )}

      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <ChessBoard
          size={boardSize}
          queens={queens}
          currentRow={currentRow}
          currentCol={currentCol}
        />
      </Float>

      {/* Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color={foundSolution ? "#d4af37" : "#888888"}
      >
        {foundSolution ? "✨ Solution Found!" : `${boardSize}-Queens`}
      </Text>
    </Canvas>
  );
};

export default NQueensScene;
