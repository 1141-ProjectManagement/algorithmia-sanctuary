import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { BSTNode } from "@/stores/bstStore";

interface BSTNodeMeshProps {
  node: BSTNode;
  isVisited: boolean;
  isCurrent: boolean;
  comparisonResult?: "less" | "greater" | "equal";
}

const BSTNodeMesh = ({ node, isVisited, isCurrent, comparisonResult }: BSTNodeMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isCurrent) {
        meshRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
    if (glowRef.current && isCurrent) {
      glowRef.current.scale.setScalar(2.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3);
    }
  });

  const color = useMemo(() => {
    if (isCurrent) {
      if (comparisonResult === "less") return "#22d3ee"; // Cyan for going left
      if (comparisonResult === "greater") return "#fbbf24"; // Amber for going right
      if (comparisonResult === "equal") return "#22c55e"; // Green for found
      return "#00ff88";
    }
    if (isVisited) return "#d4af37"; // Gold for visited path
    return "#666666"; // Gray for unvisited
  }, [isVisited, isCurrent, comparisonResult]);

  const emissiveIntensity = isCurrent ? 1 : isVisited ? 0.4 : 0;

  return (
    <group position={[node.x || 0, node.y || 0, 0]}>
      {/* Glow effect for current node */}
      {isCurrent && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
          />
        </mesh>
      )}
      
      {/* Main node - crystal shape */}
      <Float speed={2} rotationIntensity={isCurrent ? 0.5 : 0} floatIntensity={isCurrent ? 0.5 : 0.1}>
        <mesh ref={meshRef} castShadow>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            metalness={0.5}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
      
      {/* Node value label */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.3}
        color={isCurrent ? color : isVisited ? "#d4af37" : "#888888"}
        anchorX="center"
        anchorY="middle"
      >
        {node.value.toString()}
      </Text>

      {/* Direction indicators when current */}
      {isCurrent && comparisonResult === "less" && (
        <Text
          position={[-0.8, 0, 0]}
          fontSize={0.25}
          color="#22d3ee"
          anchorX="center"
        >
          ◀
        </Text>
      )}
      {isCurrent && comparisonResult === "greater" && (
        <Text
          position={[0.8, 0, 0]}
          fontSize={0.25}
          color="#fbbf24"
          anchorX="center"
        >
          ▶
        </Text>
      )}
    </group>
  );
};

interface BSTEdgeProps {
  from: BSTNode;
  to: BSTNode;
  isPath: boolean;
  direction: "left" | "right";
}

const BSTEdge = ({ from, to, isPath, direction }: BSTEdgeProps) => {
  const points = useMemo(() => [
    new THREE.Vector3(from.x || 0, (from.y || 0) - 0.4, 0),
    new THREE.Vector3(to.x || 0, (to.y || 0) + 0.4, 0),
  ], [from, to]);

  const color = isPath 
    ? (direction === "left" ? "#22d3ee" : "#fbbf24")
    : "#333333";

  return (
    <Line
      points={points}
      color={color}
      lineWidth={isPath ? 4 : 2}
      transparent
      opacity={isPath ? 1 : 0.4}
    />
  );
};

// Energy orb that follows the search/insert path
const EnergyOrb = ({ position, active }: { position: [number, number, number] | null; active: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (ref.current && active) {
      ref.current.rotation.y = state.clock.elapsedTime * 3;
      ref.current.rotation.x = state.clock.elapsedTime * 2;
    }
    if (particlesRef.current && active) {
      particlesRef.current.rotation.y = -state.clock.elapsedTime * 2;
    }
  });

  if (!position || !active) return null;

  // Create particle positions
  const particleCount = 20;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 0.3 + Math.random() * 0.2;
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);
  }

  return (
    <group position={position}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ff88"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

interface BSTVisualizationProps {
  tree: BSTNode | null;
  visitedNodes: Set<string>;
  currentNodeId: string | null;
  pathHistory: string[];
  currentComparisonResult?: "less" | "greater" | "equal";
}

const BSTVisualization = ({ 
  tree, 
  visitedNodes, 
  currentNodeId, 
  pathHistory,
  currentComparisonResult 
}: BSTVisualizationProps) => {
  // Collect all nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodes: BSTNode[] = [];
    const edges: { from: BSTNode; to: BSTNode; direction: "left" | "right" }[] = [];

    const collect = (node: BSTNode | null) => {
      if (!node) return;
      nodes.push(node);
      if (node.left) {
        edges.push({ from: node, to: node.left, direction: "left" });
        collect(node.left);
      }
      if (node.right) {
        edges.push({ from: node, to: node.right, direction: "right" });
        collect(node.right);
      }
    };

    if (tree) collect(tree);
    return { nodes, edges };
  }, [tree]);

  // Find current node position for energy orb
  const currentPosition = useMemo(() => {
    if (!currentNodeId) return null;
    const node = nodes.find(n => n.id === currentNodeId);
    if (!node) return null;
    return [node.x || 0, (node.y || 0) + 0.5, 0.5] as [number, number, number];
  }, [nodes, currentNodeId]);

  // Check if edge is part of the path
  const isEdgeInPath = (from: BSTNode, to: BSTNode) => {
    const fromIndex = pathHistory.indexOf(from.id);
    const toIndex = pathHistory.indexOf(to.id);
    return fromIndex !== -1 && toIndex !== -1 && toIndex === fromIndex + 1;
  };

  return (
    <>
      {/* Render edges first */}
      {edges.map((edge, index) => (
        <BSTEdge
          key={`edge-${index}`}
          from={edge.from}
          to={edge.to}
          isPath={isEdgeInPath(edge.from, edge.to)}
          direction={edge.direction}
        />
      ))}

      {/* Render nodes */}
      {nodes.map((node) => (
        <BSTNodeMesh
          key={node.id}
          node={node}
          isVisited={visitedNodes.has(node.id)}
          isCurrent={currentNodeId === node.id}
          comparisonResult={currentNodeId === node.id ? currentComparisonResult : undefined}
        />
      ))}

      {/* Energy orb */}
      <EnergyOrb position={currentPosition} active={!!currentNodeId} />
    </>
  );
};

interface BSTSceneProps {
  tree: BSTNode | null;
  visitedNodes: Set<string>;
  currentNodeId: string | null;
  pathHistory: string[];
  currentComparisonResult?: "less" | "greater" | "equal";
}

const BSTScene = ({ 
  tree, 
  visitedNodes, 
  currentNodeId, 
  pathHistory,
  currentComparisonResult 
}: BSTSceneProps) => {
  return (
    <div className="w-full h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#22d3ee" />
        <pointLight position={[10, -10, 10]} intensity={0.2} color="#fbbf24" />
        <spotLight
          position={[0, 8, 5]}
          angle={0.4}
          penumbra={0.5}
          intensity={0.6}
          color="#d4af37"
        />
        

        {tree && (
          <BSTVisualization
            tree={tree}
            visitedNodes={visitedNodes}
            currentNodeId={currentNodeId}
            pathHistory={pathHistory}
            currentComparisonResult={currentComparisonResult}
          />
        )}
      </Canvas>
    </div>
  );
};

export default BSTScene;
