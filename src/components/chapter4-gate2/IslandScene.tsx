import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Float } from "@react-three/drei";
import * as THREE from "three";
import { Island, Bridge } from "@/stores/mstStore";

interface IslandMeshProps {
  island: Island;
  onClick?: () => void;
}

const IslandMesh = ({ island, onClick }: IslandMeshProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (island.inMST || island.visited) return "#d4af37";
    return "#4a5568";
  }, [island.inMST, island.visited]);

  useFrame((state) => {
    if (meshRef.current && (island.visited || island.inMST)) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (glowRef.current && island.visited) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <group position={[island.x, island.y, island.z]} onClick={onClick}>
      {/* Glow effect for visited */}
      {island.visited && (
        <mesh ref={glowRef}>
          <cylinderGeometry args={[0.6, 0.8, 0.2, 16]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Island base */}
      <group ref={meshRef}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={island.visited ? 0.5 : 0.1}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Island top (grass) */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.1, 8]} />
          <meshStandardMaterial
            color={island.visited ? "#22c55e" : "#2d4a3e"}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color={island.visited ? "#ffffff" : "#aaaaaa"}
        anchorX="center"
      >
        {island.id}
      </Text>
    </group>
  );
};

interface BridgeLineProps {
  bridge: Bridge;
  islands: Island[];
  mode: "kruskal" | "prim";
}

const BridgeLine = ({ bridge, islands, mode }: BridgeLineProps) => {
  const sourceIsland = islands.find(i => i.id === bridge.source);
  const targetIsland = islands.find(i => i.id === bridge.target);

  if (!sourceIsland || !targetIsland) return null;

  const start = new THREE.Vector3(sourceIsland.x, sourceIsland.y + 0.15, sourceIsland.z);
  const end = new THREE.Vector3(targetIsland.x, targetIsland.y + 0.15, targetIsland.z);
  const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
  midPoint.y += 0.3; // Arc the bridge slightly

  const { color, lineWidth, opacity, dashed } = useMemo(() => {
    switch (bridge.status) {
      case "selected":
        return { color: "#d4af37", lineWidth: 4, opacity: 1, dashed: false };
      case "candidate":
        return { color: mode === "prim" ? "#22d3ee" : "#10b981", lineWidth: 2, opacity: 0.8, dashed: false };
      case "rejected":
        return { color: "#6b7280", lineWidth: 1, opacity: 0.3, dashed: true };
      default:
        return { color: "#4b5563", lineWidth: 1, opacity: 0.4, dashed: false };
    }
  }, [bridge.status, mode]);

  // Create curved path
  const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
  const points = curve.getPoints(20);

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
        dashed={dashed}
        dashSize={0.1}
        gapSize={0.05}
      />
      
      {/* Weight label */}
      <Text
        position={[midPoint.x, midPoint.y + 0.2, midPoint.z]}
        fontSize={0.18}
        color={bridge.status === "selected" ? "#d4af37" : bridge.status === "candidate" ? "#22d3ee" : "#888888"}
        anchorX="center"
      >
        {bridge.weight}
      </Text>
    </group>
  );
};

interface IslandSceneProps {
  islands: Island[];
  bridges: Bridge[];
  mode: "kruskal" | "prim";
  onIslandClick?: (islandId: string) => void;
  onBridgeClick?: (bridgeId: string) => void;
}

const IslandScene = ({ islands, bridges, mode, onIslandClick }: IslandSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color={mode === "kruskal" ? "#10b981" : "#22d3ee"} />
      
      {/* Background stars */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial color="#0a0a15" />
      </mesh>

      <Float speed={0.3} rotationIntensity={0.02} floatIntensity={0.1}>
        <group>
          {/* Bridges (render first so they appear behind islands) */}
          {bridges.map((bridge) => (
            <BridgeLine 
              key={bridge.id} 
              bridge={bridge} 
              islands={islands}
              mode={mode}
            />
          ))}

          {/* Islands */}
          {islands.map((island) => (
            <IslandMesh
              key={island.id}
              island={island}
              onClick={() => onIslandClick?.(island.id)}
            />
          ))}
        </group>
      </Float>

      {/* Mode title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.3}
        color={mode === "kruskal" ? "#10b981" : "#22d3ee"}
      >
        {mode === "kruskal" ? "🌿 Kruskal - 撿邊建橋" : "🌊 Prim - 擴散連島"}
      </Text>
    </Canvas>
  );
};

export default IslandScene;
