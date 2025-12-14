import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import CursorLight from "@/components/3d/CursorLight";

interface GemProps {
  position: [number, number, number];
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  index: number;
}

const Gem = ({ position, value, isComparing, isSwapping, isSorted }: GemProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useRef(position[1]);
  
  // Determine color based on state
  const color = useMemo(() => {
    if (isSorted) return "#00a86b"; // Jade green
    if (isSwapping) return "#ff6b6b"; // Red for swap
    if (isComparing) return "#d4af37"; // Gold for comparing
    return "#4a90d9"; // Default blue
  }, [isComparing, isSwapping, isSorted]);

  // Scale based on value
  const scale = 0.3 + (value / 100) * 0.5;

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle floating animation
    meshRef.current.position.y = initialY.current + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    
    // Rotation
    meshRef.current.rotation.y += 0.01;
    
    // Swap animation - bounce up
    if (isSwapping) {
      meshRef.current.position.y = initialY.current + Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.5;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} scale={scale}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            color={color}
            thickness={0.5}
            roughness={0.1}
            transmission={0.9}
            ior={1.5}
            chromaticAberration={0.03}
            backside
          />
        </mesh>
        
        {/* Value label */}
        <Text
          position={[0, -1.2 * scale, 0]}
          fontSize={0.3}
          color={isComparing || isSwapping ? "#d4af37" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      </Float>
      
      {/* Spotlight for comparing gems */}
      {isComparing && (
        <spotLight
          position={[0, 3, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          color="#d4af37"
          target-position={[0, 0, 0]}
        />
      )}
    </group>
  );
};

interface GemSceneProps {
  array: number[];
  comparing: [number, number] | null;
  swapped: boolean;
  sorted: number[];
}

const GemScene = ({ array, comparing, swapped, sorted }: GemSceneProps) => {
  const spacing = 1.5;
  const startX = -((array.length - 1) * spacing) / 2;

  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
      <color attach="background" args={["#0a0a0a"]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, 10, -10]} intensity={0.3} color="#2832c2" />
      
      {/* Cursor-following torch light */}
      <CursorLight color="#d4af37" intensity={3} distance={12} />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Pool surface effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Gems */}
      {array.map((value, index) => {
        const isComparing = comparing !== null && (comparing[0] === index || comparing[1] === index);
        const isSwapping = swapped && isComparing;
        const isSorted = sorted.includes(index);
        
        return (
          <Gem
            key={`${index}-${value}`}
            position={[startX + index * spacing, 0, 0]}
            value={value}
            index={index}
            isComparing={isComparing}
            isSwapping={isSwapping}
            isSorted={isSorted}
          />
        );
      })}
      
      {/* Index markers */}
      {array.map((_, index) => (
        <Text
          key={`index-${index}`}
          position={[startX + index * spacing, -2, 0]}
          fontSize={0.2}
          color="#666666"
          anchorX="center"
        >
          [{index}]
        </Text>
      ))}
    </Canvas>
  );
};

export default GemScene;
