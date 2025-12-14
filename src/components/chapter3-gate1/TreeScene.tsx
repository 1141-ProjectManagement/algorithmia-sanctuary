import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { TreeNode } from "@/stores/treeTraversalStore";
import CursorLight from "@/components/3d/CursorLight";

interface TreeNodeMeshProps {
  node: TreeNode;
  isVisited: boolean;
  isProcessed: boolean;
  isCurrent: boolean;
}

const TreeNodeMesh = ({ node, isVisited, isProcessed, isCurrent }: TreeNodeMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isCurrent) {
        meshRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
    if (glowRef.current && isCurrent) {
      glowRef.current.scale.setScalar(2 + Math.sin(state.clock.elapsedTime * 3) * 0.3);
    }
  });

  const color = useMemo(() => {
    if (isProcessed) return "#d4af37"; // Gold for processed
    if (isCurrent) return "#00ff88"; // Green for current
    if (isVisited) return "#4488ff"; // Blue for visited
    return "#666666"; // Gray for unvisited
  }, [isVisited, isProcessed, isCurrent]);

  const emissiveIntensity = isCurrent ? 0.8 : isProcessed ? 0.5 : isVisited ? 0.2 : 0;

  return (
    <group position={[node.x || 0, node.y || 0, 0]}>
      {/* Glow effect for current node */}
      {isCurrent && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Main node sphere */}
      <Float speed={2} rotationIntensity={0} floatIntensity={isProcessed ? 0.3 : 0}>
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Float>
      
      {/* Node value label */}
      <Text
        position={[0, 0, 0.4]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.value.toString()}
      </Text>
    </group>
  );
};

interface TreeEdgeProps {
  from: TreeNode;
  to: TreeNode;
  isActive: boolean;
}

const TreeEdge = ({ from, to, isActive }: TreeEdgeProps) => {
  const points = useMemo(() => [
    new THREE.Vector3(from.x || 0, from.y || 0, 0),
    new THREE.Vector3(to.x || 0, to.y || 0, 0),
  ], [from, to]);

  return (
    <Line
      points={points}
      color={isActive ? "#d4af37" : "#444444"}
      lineWidth={isActive ? 3 : 2}
      transparent
      opacity={isActive ? 1 : 0.5}
    />
  );
};

// Particle that follows the traversal
const TraversalParticle = ({ position }: { position: [number, number, number] | null }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.2);
    }
  });

  if (!position) return null;

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

interface TreeVisualizationProps {
  tree: TreeNode;
  visitedNodes: Set<string>;
  processedNodes: Set<string>;
  currentNodeId: string | null;
}

const TreeVisualization = ({ tree, visitedNodes, processedNodes, currentNodeId }: TreeVisualizationProps) => {
  // Collect all nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodes: TreeNode[] = [];
    const edges: { from: TreeNode; to: TreeNode }[] = [];

    const collect = (node: TreeNode | null) => {
      if (!node) return;
      nodes.push(node);
      if (node.left) {
        edges.push({ from: node, to: node.left });
        collect(node.left);
      }
      if (node.right) {
        edges.push({ from: node, to: node.right });
        collect(node.right);
      }
    };

    collect(tree);
    return { nodes, edges };
  }, [tree]);

  // Find current node position for particle
  const currentPosition = useMemo(() => {
    if (!currentNodeId) return null;
    const node = nodes.find(n => n.id === currentNodeId);
    if (!node) return null;
    return [node.x || 0, node.y || 0, 0.5] as [number, number, number];
  }, [nodes, currentNodeId]);

  return (
    <>
      {/* Render edges first */}
      {edges.map((edge, index) => (
        <TreeEdge
          key={`edge-${index}`}
          from={edge.from}
          to={edge.to}
          isActive={processedNodes.has(edge.from.id) && processedNodes.has(edge.to.id)}
        />
      ))}

      {/* Render nodes */}
      {nodes.map((node) => (
        <TreeNodeMesh
          key={node.id}
          node={node}
          isVisited={visitedNodes.has(node.id)}
          isProcessed={processedNodes.has(node.id)}
          isCurrent={currentNodeId === node.id}
        />
      ))}

      {/* Traversal particle */}
      <TraversalParticle position={currentPosition} />
    </>
  );
};

interface TreeSceneProps {
  tree: TreeNode;
  visitedNodes: Set<string>;
  processedNodes: Set<string>;
  currentNodeId: string | null;
}

const TreeScene = ({ tree, visitedNodes, processedNodes, currentNodeId }: TreeSceneProps) => {
  return (
    <div className="w-full h-[400px] bg-black/40 rounded-lg border border-primary/20 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4488ff" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.6}
          color="#d4af37"
        />
        
        {/* Cursor-following torch light */}
        <CursorLight color="#00ff88" intensity={2} distance={10} />

        <TreeVisualization
          tree={tree}
          visitedNodes={visitedNodes}
          processedNodes={processedNodes}
          currentNodeId={currentNodeId}
        />
      </Canvas>
    </div>
  );
};

export default TreeScene;
