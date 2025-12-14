import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Float } from "@react-three/drei";
import * as THREE from "three";
import { GraphNode, GraphEdge } from "@/stores/graphTraversalStore";

interface GraphNodeMeshProps {
  node: GraphNode;
  onClick?: () => void;
}

const GraphNodeMesh = ({ node, onClick }: GraphNodeMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (node.isStart) return "#22c55e";
    if (node.isTarget) return "#d4af37";
    if (node.isTrap) return "#ef4444";
    if (node.visiting) return "#3b82f6";
    if (node.visited) return "#8b5cf6";
    return "#6b7280";
  }, [node]);

  useFrame((state) => {
    if (meshRef.current && node.visiting) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.15);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }

    if (glowRef.current && (node.visiting || node.isStart || node.isTarget)) {
      glowRef.current.scale.setScalar(1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
  });

  return (
    <group position={[node.x, node.y, node.z]} onClick={onClick}>
      {/* Glow effect */}
      {(node.visiting || node.visited || node.isStart || node.isTarget) && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Main node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={node.visiting ? 0.8 : node.visited ? 0.4 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.25}
        color={node.visiting ? "#ffffff" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
      >
        {node.id}
      </Text>

      {/* Distance label for BFS */}
      {node.distance >= 0 && (
        <Text
          position={[0.35, -0.1, 0]}
          fontSize={0.15}
          color="#d4af37"
        >
          d={node.distance}
        </Text>
      )}

      {/* Target/Trap indicator */}
      {node.isTarget && (
        <Text position={[0, -0.45, 0]} fontSize={0.15} color="#d4af37">
          🎯
        </Text>
      )}
      {node.isTrap && (
        <Text position={[0, -0.45, 0]} fontSize={0.15} color="#ef4444">
          ⚠️
        </Text>
      )}
    </group>
  );
};

interface GraphEdgeLineProps {
  edge: GraphEdge;
  nodes: GraphNode[];
  mode: "bfs" | "dfs";
}

const GraphEdgeLine = ({ edge, nodes, mode }: GraphEdgeLineProps) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  const points = [
    new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
    new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z),
  ];

  const color = edge.active 
    ? (mode === "bfs" ? "#3b82f6" : "#ef4444") 
    : "#4b5563";

  return (
    <Line
      points={points}
      color={color}
      lineWidth={edge.active ? 3 : 1}
      transparent
      opacity={edge.active ? 1 : 0.4}
    />
  );
};

interface GraphSceneProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  mode: "bfs" | "dfs";
  onNodeClick?: (nodeId: string) => void;
}

const GraphScene = ({ nodes, edges, mode, onNodeClick }: GraphSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color={mode === "bfs" ? "#3b82f6" : "#ef4444"} />
      

      <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.05}>
        <group>
          {/* Edges */}
          {edges.map((edge, idx) => (
            <GraphEdgeLine key={idx} edge={edge} nodes={nodes} mode={mode} />
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <GraphNodeMesh
              key={node.id}
              node={node}
              onClick={() => onNodeClick?.(node.id)}
            />
          ))}
        </group>
      </Float>

      {/* Mode indicator */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color={mode === "bfs" ? "#3b82f6" : "#ef4444"}
      >
        {mode === "bfs" ? "🌊 BFS - 波紋術" : "🔥 DFS - 深淵術"}
      </Text>
    </Canvas>
  );
};

export default GraphScene;
