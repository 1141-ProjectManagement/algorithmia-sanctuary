import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { TreeNode } from "@/stores/divideConquerStore";

interface TreeNodeMeshProps {
  node: TreeNode;
  position: [number, number, number];
  isActive: boolean;
  algorithm: 'merge' | 'quick';
}

const TreeNodeMesh = ({ node, position, isActive, algorithm }: TreeNodeMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isActive) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        if (glowRef.current) {
          glowRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
        }
      }
    }
  });

  const getColor = () => {
    if (isActive) return "#d4af37";
    switch (node.status) {
      case 'complete':
      case 'merged':
        return "#00a86b";
      case 'dividing':
        return "#4a90d9";
      case 'sorting':
        return "#ff6b6b";
      default:
        return "#6b7280";
    }
  };

  const color = getColor();
  const scale = isActive ? 1.2 : 1;

  return (
    <group position={position}>
      {/* Main node */}
      <Float speed={isActive ? 2 : 0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={meshRef} scale={scale}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Glow effect for active node */}
      {isActive && (
        <pointLight ref={glowRef} color={color} intensity={2} distance={3} />
      )}

      {/* Array values text */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`[${node.array.slice(0, 4).join(',')}${node.array.length > 4 ? '...' : ''}]`}
      </Text>

      {/* Pivot indicator for Quick Sort */}
      {algorithm === 'quick' && node.pivot !== undefined && (
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.2}
          color="#d4af37"
          anchorX="center"
        >
          {`P=${node.pivot}`}
        </Text>
      )}

      {/* Status indicator */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
      >
        {node.status === 'complete' ? '✓' : 
         node.status === 'merged' ? '⟳' :
         node.status === 'dividing' ? '÷' :
         node.status === 'sorting' ? '⇄' : '○'}
      </Text>
    </group>
  );
};

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
}

const ConnectionLine = ({ start, end, isActive }: ConnectionLineProps) => {
  const points = useMemo(() => {
    return [start, end] as [number, number, number][];
  }, [start, end]);

  return (
    <Line
      points={points}
      color={isActive ? "#d4af37" : "#4a90d9"}
      lineWidth={isActive ? 2 : 1}
      opacity={isActive ? 1 : 0.5}
      transparent
    />
  );
};

interface RecursiveTreeProps {
  tree: TreeNode;
  activeNodeId: string | null;
  algorithm: 'merge' | 'quick';
}

const RecursiveTree = ({ tree, activeNodeId, algorithm }: RecursiveTreeProps) => {
  const positions = useMemo(() => {
    const pos: Map<string, [number, number, number]> = new Map();
    
    function calculatePositions(
      node: TreeNode, 
      x: number, 
      y: number, 
      spread: number
    ) {
      pos.set(node.id, [x, y, 0]);
      
      if (node.left) {
        calculatePositions(node.left, x - spread, y - 2, spread * 0.6);
      }
      if (node.right) {
        calculatePositions(node.right, x + spread, y - 2, spread * 0.6);
      }
    }
    
    calculatePositions(tree, 0, 3, 3);
    return pos;
  }, [tree]);

  const renderNode = (node: TreeNode): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const position = positions.get(node.id);
    
    if (position) {
      elements.push(
        <TreeNodeMesh
          key={node.id}
          node={node}
          position={position}
          isActive={node.id === activeNodeId}
          algorithm={algorithm}
        />
      );

      if (node.left) {
        const leftPos = positions.get(node.left.id);
        if (leftPos) {
          elements.push(
            <ConnectionLine
              key={`line-${node.id}-left`}
              start={[position[0], position[1] - 0.5, position[2]]}
              end={[leftPos[0], leftPos[1] + 0.5, leftPos[2]]}
              isActive={node.id === activeNodeId || node.left.id === activeNodeId}
            />
          );
        }
        elements.push(...renderNode(node.left));
      }

      if (node.right) {
        const rightPos = positions.get(node.right.id);
        if (rightPos) {
          elements.push(
            <ConnectionLine
              key={`line-${node.id}-right`}
              start={[position[0], position[1] - 0.5, position[2]]}
              end={[rightPos[0], rightPos[1] + 0.5, rightPos[2]]}
              isActive={node.id === activeNodeId || node.right.id === activeNodeId}
            />
          );
        }
        elements.push(...renderNode(node.right));
      }
    }

    return elements;
  };

  return <>{renderNode(tree)}</>;
};

interface RecursiveTreeSceneProps {
  tree: TreeNode;
  activeNodeId: string | null;
  algorithm: 'merge' | 'quick';
}

const RecursiveTreeScene = ({ tree, activeNodeId, algorithm }: RecursiveTreeSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4a90d9" />
      
      
      <RecursiveTree tree={tree} activeNodeId={activeNodeId} algorithm={algorithm} />
      
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        autoRotate={false}
      />
    </Canvas>
  );
};

export default RecursiveTreeScene;
