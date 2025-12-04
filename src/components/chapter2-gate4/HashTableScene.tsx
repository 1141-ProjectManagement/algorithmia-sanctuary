import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";
import { HashEntry } from "@/stores/hashTableStore";

interface TreasureChestProps {
  position: [number, number, number];
  index: number;
  entry: HashEntry | null;
  isTarget: boolean;
  hasCollision: boolean;
  isResolved: boolean;
}

const TreasureChest = ({ position, index, entry, isTarget, hasCollision, isResolved }: TreasureChestProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (hasCollision) {
        // Shake effect for collision
        meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 20) * 0.05;
      } else {
        meshRef.current.position.x = position[0];
      }
      
      if (isTarget && glowRef.current) {
        glowRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
      }
    }
  });

  const getChestColor = () => {
    if (hasCollision) return "#ef4444";
    if (isResolved) return "#22c55e";
    if (isTarget) return "#d4af37";
    if (entry) return "#4a90d9";
    return "#6b7280";
  };

  const color = getChestColor();

  return (
    <group ref={meshRef} position={position}>
      <Float speed={entry ? 2 : 0.5} rotationIntensity={0.1} floatIntensity={0.1}>
        {/* Chest base */}
        <RoundedBox args={[0.8, 0.5, 0.6]} radius={0.05} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isTarget ? 0.5 : 0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Chest lid */}
        <RoundedBox args={[0.8, 0.3, 0.6]} radius={0.05} position={[0, 0.35, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isTarget ? 0.5 : 0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Lock/decoration */}
        <mesh position={[0, 0.15, 0.31]}>
          <boxGeometry args={[0.15, 0.2, 0.05]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      {/* Index label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.25}
        color="#d4af37"
        anchorX="center"
      >
        #{index}
      </Text>

      {/* Content label */}
      {entry && (
        <Text
          position={[0, 0.9, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
        >
          {entry.value}
        </Text>
      )}

      {/* Glow effect */}
      {(isTarget || hasCollision) && (
        <pointLight
          ref={glowRef}
          color={hasCollision ? "#ef4444" : "#d4af37"}
          intensity={2}
          distance={2}
        />
      )}
    </group>
  );
};

interface FlyingKeyProps {
  targetIndex: number;
  bucketSize: number;
  value: string;
  phase: string;
  collision: boolean;
}

const FlyingKey = ({ targetIndex, bucketSize, value, phase, collision }: FlyingKeyProps) => {
  const keyRef = useRef<THREE.Group>(null);
  const spacing = 1.5;
  const offset = ((bucketSize - 1) * spacing) / 2;
  const targetX = targetIndex * spacing - offset;

  useFrame((state) => {
    if (keyRef.current && phase === 'hash') {
      // Animate key flying to target
      const t = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2;
      keyRef.current.position.y = 2 - t * 1.5;
      keyRef.current.position.x = targetX * t;
      keyRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  if (phase === 'complete' || phase === 'insert') return null;

  return (
    <group ref={keyRef} position={[0, 2, 0]}>
      {/* Key shape */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.5}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.12, 0.04, 8, 16]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.5}
          metalness={0.8}
        />
      </mesh>

      {/* Value label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
      >
        {value}
      </Text>

      {/* Trail effect */}
      <pointLight color={collision ? "#ef4444" : "#d4af37"} intensity={3} distance={2} />
    </group>
  );
};

interface HashTableSceneProps {
  buckets: (HashEntry | null)[];
  currentStep: {
    targetIndex: number;
    value: string;
    phase: string;
    collision: boolean;
    collisionResolution?: number;
  } | null;
}

const HashTableScene = ({ buckets, currentStep }: HashTableSceneProps) => {
  const spacing = 1.5;
  const offset = ((buckets.length - 1) * spacing) / 2;

  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#4a90d9" />

      {/* Background particles */}
      {useMemo(() => (
        [...Array(50)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 10,
              -5 - Math.random() * 10
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#d4af37" />
          </mesh>
        ))
      ), [])}

      {/* Treasure Chests */}
      {buckets.map((entry, index) => {
        const isTarget = currentStep?.targetIndex === index;
        const hasCollision = isTarget && currentStep?.collision && currentStep?.phase === 'check';
        const isResolved = currentStep?.collisionResolution === index;

        return (
          <TreasureChest
            key={index}
            position={[index * spacing - offset, 0, 0]}
            index={index}
            entry={entry}
            isTarget={isTarget}
            hasCollision={hasCollision}
            isResolved={isResolved}
          />
        );
      })}

      {/* Flying Key */}
      {currentStep && currentStep.phase !== 'complete' && (
        <FlyingKey
          targetIndex={currentStep.targetIndex}
          bucketSize={buckets.length}
          value={currentStep.value}
          phase={currentStep.phase}
          collision={currentStep.collision}
        />
      )}

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default HashTableScene;
