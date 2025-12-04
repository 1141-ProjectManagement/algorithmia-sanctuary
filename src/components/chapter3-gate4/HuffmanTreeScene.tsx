import { Canvas } from "@react-three/fiber";
import { Float, Text, Line } from "@react-three/drei";
import { useMemo } from "react";
import type { HuffmanNode } from "@/stores/huffmanStore";

interface NodeMeshProps {
  node: HuffmanNode;
  isHighlighted: boolean;
}

const NodeMesh = ({ node, isHighlighted }: NodeMeshProps) => {
  const color = useMemo(() => {
    if (isHighlighted) return '#22c55e';
    switch (node.status) {
      case 'candidate': return '#3b82f6';
      case 'merging': return '#f59e0b';
      case 'merged': return '#6b7280';
      case 'highlight': return '#22c55e';
      default: return node.char ? '#d4af37' : '#8b5cf6';
    }
  }, [node.status, node.char, isHighlighted]);

  // Size based on frequency (normalized)
  const size = Math.max(0.3, Math.min(0.6, node.freq / 50 + 0.2));
  const scale = node.status === 'candidate' || node.status === 'merging' ? 1.3 : 1;

  return (
    <group position={[node.x, node.y, 0]}>
      <mesh scale={scale}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 0.8 : node.status !== 'idle' ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={node.status === 'merged' ? 0.5 : 1}
        />
      </mesh>
      
      {/* Character label */}
      {node.char && (
        <Text
          position={[0, 0, size + 0.1]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {node.char}
        </Text>
      )}
      
      {/* Frequency label */}
      <Text
        position={[0, -size - 0.3, 0]}
        fontSize={0.18}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {node.freq}
      </Text>
      
      {/* Code label (if available) */}
      {node.code && node.char && (
        <Text
          position={[0, size + 0.4, 0]}
          fontSize={0.15}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          {node.code}
        </Text>
      )}
    </group>
  );
};

interface TreeEdgeProps {
  parent: HuffmanNode;
  child: HuffmanNode;
  isLeft: boolean;
  isHighlighted: boolean;
}

const TreeEdge = ({ parent, child, isLeft, isHighlighted }: TreeEdgeProps) => {
  const midPoint: [number, number, number] = [
    (parent.x + child.x) / 2,
    (parent.y + child.y) / 2,
    0,
  ];

  return (
    <group>
      <Line
        points={[
          [parent.x, parent.y, 0],
          [child.x, child.y, 0],
        ]}
        color={isHighlighted ? '#22c55e' : '#4a4a4a'}
        lineWidth={isHighlighted ? 3 : 1.5}
        opacity={isHighlighted ? 1 : 0.6}
        transparent
      />
      {/* Edge label (0 or 1) */}
      <Text
        position={midPoint}
        fontSize={0.2}
        color={isHighlighted ? '#22c55e' : '#666666'}
        anchorX="center"
        anchorY="middle"
      >
        {isLeft ? '0' : '1'}
      </Text>
    </group>
  );
};

// Recursive component to render tree
const TreeNode = ({ 
  node, 
  highlightedNodes 
}: { 
  node: HuffmanNode; 
  highlightedNodes: string[];
}) => {
  const isHighlighted = highlightedNodes.includes(node.id);

  return (
    <group>
      <NodeMesh node={node} isHighlighted={isHighlighted} />
      
      {node.left && (
        <>
          <TreeEdge 
            parent={node} 
            child={node.left} 
            isLeft={true}
            isHighlighted={isHighlighted && highlightedNodes.includes(node.left.id)}
          />
          <TreeNode node={node.left} highlightedNodes={highlightedNodes} />
        </>
      )}
      
      {node.right && (
        <>
          <TreeEdge 
            parent={node} 
            child={node.right} 
            isLeft={false}
            isHighlighted={isHighlighted && highlightedNodes.includes(node.right.id)}
          />
          <TreeNode node={node.right} highlightedNodes={highlightedNodes} />
        </>
      )}
    </group>
  );
};

interface HuffmanTreeSceneProps {
  nodes: HuffmanNode[];
  tree: HuffmanNode | null;
  highlightedNodes: string[];
  buildComplete: boolean;
}

const HuffmanTreeScene = ({ 
  nodes, 
  tree, 
  highlightedNodes,
  buildComplete,
}: HuffmanTreeSceneProps) => {
  return (
    <Canvas camera={{ position: [0, -2, 10], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
      
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
        <group>
          {/* Render tree if complete, otherwise render node pool */}
          {buildComplete && tree ? (
            <TreeNode node={tree} highlightedNodes={highlightedNodes} />
          ) : (
            nodes.map(node => (
              <NodeMesh 
                key={node.id} 
                node={node} 
                isHighlighted={highlightedNodes.includes(node.id)}
              />
            ))
          )}
        </group>
      </Float>
      
      {/* Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.4}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
      >
        編碼卷軸 - Huffman Tree
      </Text>
    </Canvas>
  );
};

export default HuffmanTreeScene;
