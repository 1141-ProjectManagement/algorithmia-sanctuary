import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface Node {
  id: number;
  parent: number;
  rank: number;
  x: number;
  y: number;
  z: number;
}

interface UnionFindSceneProps {
  nodes: Node[];
  parent: number[];
  highlightPath: number[];
  activeNodes: number[];
}

// Color palette for different sets
const SET_COLORS = [
  "#d4af37", // Gold
  "#2832c2", // Blue
  "#00a86b", // Green
  "#c23232", // Red
  "#8b32c2", // Purple
  "#32c2b8", // Cyan
  "#c28b32", // Orange
  "#c232a8", // Pink
];

const getSetColor = (rootId: number): string => {
  return SET_COLORS[rootId % SET_COLORS.length];
};

const NodeSphere = ({ 
  node, 
  parent,
  allParent,
  isHighlighted, 
  isActive,
}: { 
  node: Node; 
  parent: number;
  allParent: number[];
  isHighlighted: boolean; 
  isActive: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Find root for color
  const root = useMemo(() => {
    let current = node.id;
    let steps = 0;
    while (allParent[current] !== current && steps < 100) {
      current = allParent[current];
      steps++;
    }
    return current;
  }, [node.id, allParent]);
  
  const color = useMemo(() => getSetColor(root), [root]);
  const isRoot = node.id === parent;
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = isActive ? 1.4 : isHighlighted ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive 
        ? 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.3
        : isHighlighted ? 0.4 : 0;
    }
  });
  
  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0} 
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isRoot ? 0.5 : isHighlighted ? 0.3 : 0.1}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Crown for root nodes */}
      {isRoot && (
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.15, 0.25, 6]} />
          <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* Node label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {node.id}
      </Text>
    </group>
  );
};

const ConnectionLine = ({
  start,
  end,
  isHighlighted,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
}) => {
  const color = isHighlighted ? "#d4af37" : "#4a5568";
  
  // Calculate arrow direction
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  ).normalize();
  
  const arrowPos: [number, number, number] = [
    end[0] - direction.x * 0.4,
    end[1] - direction.y * 0.4,
    end[2] - direction.z * 0.4,
  ];
  
  // Create line using mesh with tube geometry for visibility
  const curve = useMemo(() => {
    return new THREE.LineCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    );
  }, [start, end]);
  
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 8, isHighlighted ? 0.03 : 0.015, 8, false]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isHighlighted ? 1 : 0.5}
        />
      </mesh>
      {/* Arrow head */}
      <mesh position={arrowPos}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const Scene = ({ nodes, parent, highlightPath, activeNodes }: UnionFindSceneProps) => {
  // Generate connections based on parent array
  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    parent.forEach((p, i) => {
      if (p !== i) {
        conns.push({ from: i, to: p });
      }
    });
    return conns;
  }, [parent]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2832c2" />
      
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group>
          {/* Connection lines */}
          {connections.map(({ from, to }) => {
            const fromNode = nodes[from];
            const toNode = nodes[to];
            if (!fromNode || !toNode) return null;
            
            const isHighlighted = highlightPath.includes(from) && highlightPath.includes(to);
            
            return (
              <ConnectionLine
                key={`${from}-${to}`}
                start={[fromNode.x, fromNode.y, fromNode.z]}
                end={[toNode.x, toNode.y, toNode.z]}
                isHighlighted={isHighlighted}
              />
            );
          })}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <NodeSphere
              key={node.id}
              node={node}
              parent={parent[node.id]}
              allParent={parent}
              isHighlighted={highlightPath.includes(node.id)}
              isActive={activeNodes.includes(node.id)}
            />
          ))}
        </group>
      </Float>
      
      {/* Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#d4af37"
        anchorX="center"
      >
        併查集視覺化
      </Text>
    </>
  );
};

const UnionFindScene = (props: UnionFindSceneProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-black/30">
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
};

export default UnionFindScene;
