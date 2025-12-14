import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Float } from "@react-three/drei";
import * as THREE from "three";
import { StarNode, StarEdge } from "@/stores/dijkstraStore";
import CursorLight from "@/components/3d/CursorLight";

interface StarMeshProps {
  node: StarNode;
  onClick?: () => void;
}

const StarMesh = ({ node, onClick }: StarMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (node.status) {
      case "visiting": return "#d4af37";
      case "settled": return "#22c55e";
      default: return "#3b82f6";
    }
  }, [node.status]);

  useFrame((state) => {
    if (meshRef.current) {
      if (node.status === "visiting") {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }

    if (ringRef.current && node.status === "visiting") {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
    }

    if (glowRef.current && node.status !== "unvisited") {
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <group position={[node.x, node.y, node.z]} onClick={onClick}>
      {/* Glow effect */}
      {node.status !== "unvisited" && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Visiting ring */}
      {node.status === "visiting" && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.03, 8, 32]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
      )}

      {/* Main star */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={node.status === "visiting" ? 0.8 : node.status === "settled" ? 0.5 : 0.2}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Node label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
      >
        {node.id}
      </Text>

      {/* Distance label */}
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.15}
        color={node.distance === Infinity ? "#666666" : "#d4af37"}
        anchorX="center"
      >
        {node.distance === Infinity ? "∞" : node.distance}
      </Text>
    </group>
  );
};

interface StarEdgeLineProps {
  edge: StarEdge;
  nodes: StarNode[];
}

const StarEdgeLine = ({ edge, nodes }: StarEdgeLineProps) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  const start = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
  const end = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);
  const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);

  const { color, lineWidth, opacity } = useMemo(() => {
    if (edge.onPath) {
      return { color: "#d4af37", lineWidth: 4, opacity: 1 };
    }
    if (edge.active) {
      return { color: "#22c55e", lineWidth: 2, opacity: 0.8 };
    }
    return { color: "#4b5563", lineWidth: 1, opacity: 0.3 };
  }, [edge.active, edge.onPath]);

  return (
    <group>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />
      
      {/* Weight label */}
      <Text
        position={[midPoint.x, midPoint.y + 0.2, midPoint.z]}
        fontSize={0.12}
        color={edge.onPath ? "#d4af37" : edge.active ? "#22c55e" : "#888888"}
        anchorX="center"
      >
        {edge.weight}
      </Text>
    </group>
  );
};

interface StarSceneProps {
  nodes: StarNode[];
  edges: StarEdge[];
  onNodeClick?: (nodeId: string) => void;
}

const StarScene = ({ nodes, edges, onNodeClick }: StarSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 2, 7], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#d4af37" />
      
      {/* Cursor-following torch light */}
      <CursorLight color="#d4af37" intensity={2.5} distance={12} />

      {/* Background */}
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[25, 20]} />
        <meshBasicMaterial color="#050510" />
      </mesh>

      <Float speed={0.3} rotationIntensity={0.01} floatIntensity={0.05}>
        <group>
          {/* Edges */}
          {edges.map((edge) => (
            <StarEdgeLine key={edge.id} edge={edge} nodes={nodes} />
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <StarMesh
              key={node.id}
              node={node}
              onClick={() => onNodeClick?.(node.id)}
            />
          ))}
        </group>
      </Float>

      {/* Title */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.25}
        color="#d4af37"
      >
        🌌 導航星盤 - Dijkstra
      </Text>
    </Canvas>
  );
};

export default StarScene;
