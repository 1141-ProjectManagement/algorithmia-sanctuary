import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Float } from "@react-three/drei";
import * as THREE from "three";
import { FWNode, FWEdge } from "@/stores/floydWarshallStore";

interface NodeMeshProps {
  node: FWNode;
  label: string;
}

const NodeMesh = ({ node, label }: NodeMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (node.status) {
      case "intermediate": return "#d4af37"; // Gold for k
      case "source": return "#3b82f6"; // Blue for i
      case "target": return "#22c55e"; // Green for j
      default: return "#6b7280";
    }
  }, [node.status]);

  useFrame((state) => {
    if (meshRef.current) {
      if (node.status === "intermediate") {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      } else if (node.status !== "idle") {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }

    if (glowRef.current && node.status !== "idle") {
      glowRef.current.scale.setScalar(1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Glow effect */}
      {node.status !== "idle" && (
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
          emissiveIntensity={node.status === "intermediate" ? 0.8 : node.status !== "idle" ? 0.5 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Node label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
};

interface EdgeLineProps {
  edge: FWEdge;
  nodes: FWNode[];
  nodeIds: string[];
}

const EdgeLine = ({ edge, nodes, nodeIds }: EdgeLineProps) => {
  const sourceIdx = nodeIds.indexOf(edge.source);
  const targetIdx = nodeIds.indexOf(edge.target);
  const sourceNode = nodes[sourceIdx];
  const targetNode = nodes[targetIdx];

  if (!sourceNode || !targetNode) return null;

  const start = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
  const end = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);
  
  // Offset for arrow direction
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const adjustedEnd = new THREE.Vector3().addVectors(
    end,
    direction.multiplyScalar(-0.3)
  );
  const adjustedStart = new THREE.Vector3().addVectors(
    start,
    direction.normalize().multiplyScalar(0.3)
  );

  const midPoint = new THREE.Vector3().lerpVectors(adjustedStart, adjustedEnd, 0.5);
  // Offset midpoint perpendicular to the line for label visibility
  const perpOffset = new THREE.Vector3(-direction.z * 0.2, 0.15, direction.x * 0.2);
  midPoint.add(perpOffset);

  const { color, lineWidth, opacity } = useMemo(() => {
    if (edge.active) {
      return { color: "#d4af37", lineWidth: 3, opacity: 1 };
    }
    return { color: "#4b5563", lineWidth: 1.5, opacity: 0.5 };
  }, [edge.active]);

  return (
    <group>
      <Line
        points={[adjustedStart, adjustedEnd]}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />
      
      {/* Arrow head */}
      <mesh position={adjustedEnd.toArray()} rotation={[0, 0, Math.atan2(direction.y, direction.x)]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      
      {/* Weight label */}
      <Text
        position={[midPoint.x, midPoint.y, midPoint.z]}
        fontSize={0.12}
        color={edge.active ? "#d4af37" : "#888888"}
        anchorX="center"
      >
        {edge.weight}
      </Text>
    </group>
  );
};

// Path visualization beam
interface PathBeamProps {
  sourceNode: FWNode;
  intermediateNode: FWNode;
  targetNode: FWNode;
}

const PathBeam = ({ sourceNode, intermediateNode, targetNode }: PathBeamProps) => {
  const lineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.children.forEach((child, idx) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + idx) * 0.3;
        }
      });
    }
  });

  const startPos = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
  const midPos = new THREE.Vector3(intermediateNode.x, intermediateNode.y, intermediateNode.z);
  const endPos = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);

  return (
    <group ref={lineRef}>
      {/* i -> k beam */}
      <Line
        points={[startPos, midPos]}
        color="#3b82f6"
        lineWidth={2}
        transparent
        opacity={0.6}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      {/* k -> j beam */}
      <Line
        points={[midPos, endPos]}
        color="#22c55e"
        lineWidth={2}
        transparent
        opacity={0.6}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
    </group>
  );
};

interface NetworkSceneProps {
  nodes: FWNode[];
  edges: FWEdge[];
  nodeIds: string[];
  currentK: number;
  currentI: number;
  currentJ: number;
}

const NetworkScene = ({ nodes, edges, nodeIds, currentK, currentI, currentJ }: NetworkSceneProps) => {
  const showPathBeam = currentK >= 0 && currentK < nodes.length && 
                       currentI !== currentK && currentJ !== currentK &&
                       currentI !== currentJ;

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#d4af37" />

      {/* Background */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[20, 15]} />
        <meshBasicMaterial color="#0a0a12" />
      </mesh>

      <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.03}>
        <group>
          {/* Edges */}
          {edges.map((edge) => (
            <EdgeLine key={edge.id} edge={edge} nodes={nodes} nodeIds={nodeIds} />
          ))}

          {/* Nodes */}
          {nodes.map((node, idx) => (
            <NodeMesh key={node.id} node={node} label={nodeIds[idx]} />
          ))}

          {/* Path beam visualization */}
          {showPathBeam && (
            <PathBeam
              sourceNode={nodes[currentI]}
              intermediateNode={nodes[currentK]}
              targetNode={nodes[currentJ]}
            />
          )}
        </group>
      </Float>

      {/* Title */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.18}
        color="#d4af37"
        anchorX="center"
      >
        City Network - Floyd-Warshall
      </Text>

      {/* Legend */}
      <group position={[-3, -2.2, 0]}>
        <Text position={[0, 0.3, 0]} fontSize={0.1} color="#d4af37" anchorX="left">
          ● k (中轉站)
        </Text>
        <Text position={[0, 0.1, 0]} fontSize={0.1} color="#3b82f6" anchorX="left">
          ● i (起點)
        </Text>
        <Text position={[0, -0.1, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          ● j (終點)
        </Text>
      </group>
    </Canvas>
  );
};

export default NetworkScene;
