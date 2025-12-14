import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface DataCubeProps {
  position: [number, number, number];
  value: number;
  index: number;
  isInWindow: boolean;
  isRemoved: boolean;
  isAdded: boolean;
  isMaxWindow: boolean;
}

const DataCube = ({ position, value, index, isInWindow, isRemoved, isAdded, isMaxWindow }: DataCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isAdded) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      } else if (isRemoved) {
        meshRef.current.position.y = position[1] - 0.3;
      } else {
        meshRef.current.position.y = position[1];
      }
      
      if (isInWindow && glowRef.current) {
        glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      }
    }
  });

  const getColor = () => {
    if (isRemoved) return "#ef4444";
    if (isAdded) return "#22c55e";
    if (isMaxWindow) return "#d4af37";
    if (isInWindow) return "#4a90d9";
    return "#6b7280";
  };

  const color = getColor();
  const emissiveIntensity = isInWindow ? 0.4 : 0.1;
  const opacity = isRemoved ? 0.4 : 1;
  const scale = isAdded ? 1.15 : isRemoved ? 0.85 : 1;

  // Normalize value for visual representation (brightness)
  const brightness = Math.min(1, Math.max(0.3, (value + 10) / 30));

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity * brightness}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
      </mesh>

      {/* Value label */}
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Index label */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.2}
        color="#888"
        anchorX="center"
      >
        [{index}]
      </Text>

      {/* Glow for window elements */}
      {isInWindow && (
        <pointLight ref={glowRef} color={color} intensity={1.5} distance={2} />
      )}

      {/* Sparkle effect for max window */}
      {isMaxWindow && (
        <>
          {[...Array(4)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 4) * Math.PI * 2) * 0.6,
                Math.sin((i / 4) * Math.PI * 2) * 0.6,
                0.5
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#d4af37" />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

interface WindowFrameProps {
  startIndex: number;
  windowSize: number;
  spacing: number;
  offset: number;
  windowSum: number;
}

const WindowFrame = ({ startIndex, windowSize, spacing, offset, windowSum }: WindowFrameProps) => {
  const frameRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const width = windowSize * spacing - 0.2;
  const centerX = startIndex * spacing - offset + (windowSize - 1) * spacing / 2;

  return (
    <group ref={frameRef} position={[centerX, 0, 0]}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[width + 0.4, 1.4, 0.1]} />
        <meshStandardMaterial
          color="#d4af37"
          transparent
          opacity={0.2}
          emissive="#d4af37"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Frame border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width + 0.4, 1.4, 0.1)]} />
        <lineBasicMaterial color="#d4af37" linewidth={2} />
      </lineSegments>

      {/* Sum display */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.35}
        color="#d4af37"
        anchorX="center"
      >
        {`Sum: ${windowSum}`}
      </Text>
    </group>
  );
};

interface SlidingWindowSceneProps {
  array: number[];
  windowStart: number;
  windowEnd: number;
  windowSum: number;
  maxStart: number;
  windowSize: number;
  removedIndex: number | null;
  addedIndex: number | null;
}

const SlidingWindowScene = ({
  array,
  windowStart,
  windowEnd,
  windowSum,
  maxStart,
  windowSize,
  removedIndex,
  addedIndex
}: SlidingWindowSceneProps) => {
  const spacing = 1.2;
  const offset = (array.length - 1) * spacing / 2;

  return (
    <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#4a90d9" />
      

      {/* Background stars */}
      {useMemo(() => (
        [...Array(80)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 20,
              -5 - Math.random() * 15
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))
      ), [])}

      {/* Data cubes */}
      {array.map((value, index) => {
        const isInWindow = index >= windowStart && index <= windowEnd;
        const isMaxWindow = index >= maxStart && index < maxStart + windowSize;
        
        return (
          <DataCube
            key={index}
            position={[index * spacing - offset, 0, 0]}
            value={value}
            index={index}
            isInWindow={isInWindow}
            isRemoved={removedIndex === index}
            isAdded={addedIndex === index}
            isMaxWindow={isMaxWindow && windowStart > 0}
          />
        );
      })}

      {/* Sliding window frame */}
      <WindowFrame
        startIndex={windowStart}
        windowSize={windowSize}
        spacing={spacing}
        offset={offset}
        windowSum={windowSum}
      />

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default SlidingWindowScene;
