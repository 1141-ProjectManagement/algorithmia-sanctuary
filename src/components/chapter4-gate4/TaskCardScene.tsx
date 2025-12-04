import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { TaskNode, DependencyEdge } from '@/stores/topologicalSortStore';

interface TaskCardMeshProps {
  node: TaskNode;
}

const TaskCardMesh = ({ node }: TaskCardMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const getColor = () => {
    switch (node.status) {
      case 'completed': return '#d4af37';
      case 'ready': return '#4ade80';
      case 'processing': return '#fbbf24';
      default: return '#4a5568';
    }
  };

  const getEmissive = () => {
    switch (node.status) {
      case 'completed': return '#d4af37';
      case 'ready': return '#22c55e';
      case 'processing': return '#f59e0b';
      default: return '#000000';
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      if (node.status === 'ready' || node.status === 'processing') {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
    if (glowRef.current) {
      const scale = node.status === 'ready' ? 1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 1;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float
      speed={node.status === 'locked' ? 0.5 : 2}
      rotationIntensity={node.status === 'completed' ? 0 : 0.2}
      floatIntensity={0.5}
    >
      <group position={node.position}>
        {/* Glow effect for ready nodes */}
        {(node.status === 'ready' || node.status === 'processing') && (
          <mesh ref={glowRef}>
            <boxGeometry args={[1.6, 1.1, 0.15]} />
            <meshBasicMaterial color={getColor()} transparent opacity={0.3} />
          </mesh>
        )}

        {/* Main card */}
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[1.4, 0.9, 0.1]} />
          <meshStandardMaterial
            color={getColor()}
            emissive={getEmissive()}
            emissiveIntensity={node.status === 'locked' ? 0 : 0.5}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Task label */}
        <Text
          position={[0, 0.15, 0.06]}
          fontSize={0.15}
          color={node.status === 'locked' ? '#9ca3af' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>

        {/* Indegree badge */}
        <mesh position={[0.5, -0.25, 0.06]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial 
            color={node.indegree === 0 ? '#22c55e' : '#ef4444'} 
            transparent 
            opacity={0.9} 
          />
        </mesh>
        <Text
          position={[0.5, -0.25, 0.07]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {node.indegree}
        </Text>
      </group>
    </Float>
  );
};

interface DependencyArrowProps {
  edge: DependencyEdge;
  nodes: TaskNode[];
}

const DependencyArrow = ({ edge, nodes }: DependencyArrowProps) => {
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  const start = new THREE.Vector3(...fromNode.position);
  const end = new THREE.Vector3(...toNode.position);
  
  const direction = end.clone().sub(start);
  direction.normalize();

  const offsetStart = start.clone().add(direction.clone().multiplyScalar(0.8));
  const offsetEnd = end.clone().sub(direction.clone().multiplyScalar(0.8));

  const points: [number, number, number][] = [
    [offsetStart.x, offsetStart.y, offsetStart.z],
    [offsetEnd.x, offsetEnd.y, offsetEnd.z]
  ];

  // Arrow head position
  const arrowPos = offsetEnd.clone().sub(direction.clone().multiplyScalar(0.15));
  const arrowRotation = Math.atan2(direction.y, direction.x);

  return (
    <group>
      <Line
        points={points}
        color={edge.active ? '#d4af37' : '#374151'}
        lineWidth={2}
        transparent
        opacity={edge.active ? 0.8 : 0.3}
      />
      {/* Arrow head */}
      <mesh position={arrowPos} rotation={[0, 0, arrowRotation - Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshBasicMaterial 
          color={edge.active ? '#d4af37' : '#374151'} 
          transparent 
          opacity={edge.active ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  );
};

interface TaskCardSceneProps {
  nodes: TaskNode[];
  edges: DependencyEdge[];
  hasCycle: boolean;
}

const TaskCardScene = ({ nodes, edges, hasCycle }: TaskCardSceneProps) => {
  return (
    <div className="w-full h-[400px] bg-black/20 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4af37" />

        {/* Warning light for cycle detection */}
        {hasCycle && (
          <pointLight position={[0, 0, 5]} intensity={2} color="#ef4444" />
        )}

        {/* Render edges first (behind nodes) */}
        {edges.map((edge, idx) => (
          <DependencyArrow key={`${edge.from}-${edge.to}-${idx}`} edge={edge} nodes={nodes} />
        ))}

        {/* Render nodes */}
        {nodes.map(node => (
          <TaskCardMesh key={node.id} node={node} />
        ))}

        {/* Cycle warning text */}
        {hasCycle && (
          <Text
            position={[0, -3.5, 0]}
            fontSize={0.3}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            ⚠️ 循環依賴檢測！
          </Text>
        )}
      </Canvas>
    </div>
  );
};

export default TaskCardScene;
