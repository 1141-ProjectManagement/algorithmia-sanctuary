import { Canvas } from "@react-three/fiber";
import { Float, Text, Line } from "@react-three/drei";
import { useMemo } from "react";
import type { HeapNode } from "@/stores/heapStore";

interface HeapNodeMeshProps {
  node: HeapNode;
  position: [number, number, number];
}

const HeapNodeMesh = ({ node, position }: HeapNodeMeshProps) => {
  const color = useMemo(() => {
    switch (node.status) {
      case 'comparing': return '#3b82f6';
      case 'swapping': return '#f59e0b';
      case 'new': return '#22c55e';
      case 'extracted': return '#ef4444';
      case 'violated': return '#dc2626';
      default: return '#d4af37';
    }
  }, [node.status]);

  const scale = node.status === 'comparing' || node.status === 'swapping' ? 1.2 : 1;
  const emissiveIntensity = node.status !== 'idle' ? 0.5 : 0.2;

  return (
    <group position={position}>
      <mesh scale={scale}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {node.value}
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        [{node.index}]
      </Text>
    </group>
  );
};

interface HeapEdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
}

const HeapEdge = ({ start, end, isHighlighted }: HeapEdgeProps) => {
  return (
    <Line
      points={[start, end]}
      color={isHighlighted ? '#f59e0b' : '#4a4a4a'}
      lineWidth={isHighlighted ? 3 : 1.5}
      opacity={isHighlighted ? 1 : 0.6}
      transparent
    />
  );
};

interface HeapSceneProps {
  heap: HeapNode[];
  highlightIndices: number[];
}

const HeapScene = ({ heap, highlightIndices }: HeapSceneProps) => {
  // Calculate positions for pyramid layout
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    let level = 0;
    let indexInLevel = 0;
    let nodesInLevel = 1;
    
    for (let i = 0; i < heap.length; i++) {
      const levelWidth = nodesInLevel * 1.5;
      const startX = -levelWidth / 2 + 0.75;
      const x = startX + indexInLevel * 1.5;
      const y = 3 - level * 1.5;
      
      pos.push([x, y, 0]);
      
      indexInLevel++;
      if (indexInLevel >= nodesInLevel) {
        level++;
        indexInLevel = 0;
        nodesInLevel *= 2;
      }
    }
    
    return pos;
  }, [heap.length]);

  // Calculate edges
  const edges = useMemo(() => {
    const e: { start: [number, number, number]; end: [number, number, number]; highlighted: boolean }[] = [];
    
    for (let i = 0; i < heap.length; i++) {
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;
      
      if (leftChild < heap.length && positions[i] && positions[leftChild]) {
        const highlighted = highlightIndices.includes(i) && highlightIndices.includes(leftChild);
        e.push({ start: positions[i], end: positions[leftChild], highlighted });
      }
      
      if (rightChild < heap.length && positions[i] && positions[rightChild]) {
        const highlighted = highlightIndices.includes(i) && highlightIndices.includes(rightChild);
        e.push({ start: positions[i], end: positions[rightChild], highlighted });
      }
    }
    
    return e;
  }, [heap.length, positions, highlightIndices]);

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
      
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group>
          {/* Render edges first */}
          {edges.map((edge, i) => (
            <HeapEdge
              key={`edge-${i}`}
              start={edge.start}
              end={edge.end}
              isHighlighted={edge.highlighted}
            />
          ))}
          
          {/* Render nodes */}
          {heap.map((node, i) => (
            <HeapNodeMesh
              key={node.id}
              node={node}
              position={positions[i] || [0, 0, 0]}
            />
          ))}
        </group>
      </Float>
      
      {/* Title */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.4}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
      >
        優先峰頂 - Heap
      </Text>
    </Canvas>
  );
};

export default HeapScene;
