import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import CursorLight from "@/components/3d/CursorLight";

export interface TreeNode {
  id: string;
  values: number[];
  left?: TreeNode;
  right?: TreeNode;
  depth: number;
  status: "pending" | "dividing" | "base" | "merging" | "complete";
}

interface CrystalNodeProps {
  node: TreeNode;
  position: [number, number, number];
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  onHover: (id: string | null) => void;
}

const CrystalNode = ({ node, position, activeNodeId, hoveredNodeId, onHover }: CrystalNodeProps) => {
  const meshRef = useRef<THREE.Group>(null);
  
  const color = useMemo(() => {
    switch (node.status) {
      case "pending": return "#dc2626";
      case "dividing": return "#3b82f6";
      case "base": return "#ffffff";
      case "merging": return "#f59e0b";
      case "complete": return "#d4af37";
      default: return "#6b7280";
    }
  }, [node.status]);

  const isActive = node.id === activeNodeId;
  const isHovered = node.id === hoveredNodeId;
  const scale = isActive ? 1.2 : isHovered ? 1.1 : 1;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + node.depth) * 0.05;
      
      if (node.status === "base" || isActive) {
        meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 4) * 0.05);
      }
    }
  });

  const nodeWidth = Math.max(0.8, node.values.length * 0.25);

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => onHover(node.id)}
      onPointerOut={() => onHover(null)}
    >
      <mesh scale={[nodeWidth, 0.4, 0.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 : node.status === "base" ? 0.6 : 0.3}
          transparent
          opacity={0.85}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[0, 0, 0.25]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        [{node.values.join(", ")}]
      </Text>

      {isActive && (
        <pointLight color={color} intensity={2} distance={2} />
      )}
    </group>
  );
};

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
}

const ConnectionLine = ({ start, end, active }: ConnectionLineProps) => {
  return (
    <Line
      points={[start, end]}
      color={active ? "#d4af37" : "#4b5563"}
      lineWidth={2}
      transparent
      opacity={active ? 1 : 0.5}
    />
  );
};

interface RecursionTreeProps {
  tree: TreeNode | null;
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  onHover: (id: string | null) => void;
}

const RecursionTree = ({ tree, activeNodeId, hoveredNodeId, onHover }: RecursionTreeProps) => {
  const renderNode = (
    node: TreeNode | undefined,
    x: number,
    y: number,
    spread: number
  ): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];
    const position: [number, number, number] = [x, y, 0];

    elements.push(
      <CrystalNode
        key={node.id}
        node={node}
        position={position}
        activeNodeId={activeNodeId}
        hoveredNodeId={hoveredNodeId}
        onHover={onHover}
      />
    );

    if (node.left) {
      const leftX = x - spread;
      const leftY = y - 1.2;
      elements.push(
        <ConnectionLine
          key={`line-${node.id}-left`}
          start={position}
          end={[leftX, leftY, 0]}
          active={node.status === "dividing" || node.status === "merging"}
        />
      );
      elements.push(...renderNode(node.left, leftX, leftY, spread * 0.55));
    }

    if (node.right) {
      const rightX = x + spread;
      const rightY = y - 1.2;
      elements.push(
        <ConnectionLine
          key={`line-${node.id}-right`}
          start={position}
          end={[rightX, rightY, 0]}
          active={node.status === "dividing" || node.status === "merging"}
        />
      );
      elements.push(...renderNode(node.right, rightX, rightY, spread * 0.55));
    }

    return elements;
  };

  if (!tree) return null;

  return <group>{renderNode(tree, 0, 2, 3)}</group>;
};

interface RecursionTreeSceneProps {
  tree: TreeNode | null;
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  onHover: (id: string | null) => void;
}

const RecursionTreeScene = ({ tree, activeNodeId, hoveredNodeId, onHover }: RecursionTreeSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#8b5cf6" />
      
      {/* Cursor-following torch light */}
      <CursorLight color="#d4af37" intensity={2} distance={12} />
      
      <Float speed={0.3} rotationIntensity={0.02} floatIntensity={0.05}>
        <RecursionTree
          tree={tree}
          activeNodeId={activeNodeId}
          hoveredNodeId={hoveredNodeId}
          onHover={onHover}
        />
      </Float>
    </Canvas>
  );
};

export default RecursionTreeScene;
