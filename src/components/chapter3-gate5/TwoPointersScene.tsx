import { Canvas } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { useMemo } from "react";
import type { StoneData } from "@/stores/twoPointersStore";

interface StoneMeshProps {
  stone: StoneData;
  position: [number, number, number];
}

const StoneMesh = ({ stone, position }: StoneMeshProps) => {
  const color = useMemo(() => {
    switch (stone.status) {
      case 'left': return '#3b82f6';
      case 'right': return '#ef4444';
      case 'target': return '#22c55e';
      case 'excluded': return '#4b5563';
      default: return '#d4af37';
    }
  }, [stone.status]);

  const opacity = stone.status === 'excluded' ? 0.3 : 1;
  const scale = stone.status === 'target' ? 1.2 : stone.status === 'left' || stone.status === 'right' ? 1.1 : 1;
  const emissive = stone.status === 'target' ? 0.8 : stone.status !== 'idle' && stone.status !== 'excluded' ? 0.4 : 0.1;

  return (
    <group position={position}>
      {/* Stone platform */}
      <mesh scale={[scale, 0.3, scale]}>
        <boxGeometry args={[0.9, 1, 0.9]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissive}
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Value label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {stone.value}
      </Text>
      
      {/* Index label */}
      <Text
        position={[0, -0.4, 0.5]}
        fontSize={0.15}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        [{stone.index}]
      </Text>
      
      {/* Pointer indicators */}
      {stone.status === 'left' && (
        <group position={[0, 1.2, 0]}>
          <mesh>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.25} color="#3b82f6" anchorX="center">
            L
          </Text>
        </group>
      )}
      
      {stone.status === 'right' && (
        <group position={[0, 1.2, 0]}>
          <mesh>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.25} color="#ef4444" anchorX="center">
            R
          </Text>
        </group>
      )}
      
      {/* Success glow */}
      {stone.status === 'target' && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#22c55e" 
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

interface TwoPointersSceneProps {
  stones: StoneData[];
  currentSum: number;
  target: number;
  found: boolean;
}

const TwoPointersScene = ({ stones, currentSum, target, found }: TwoPointersSceneProps) => {
  const stonePositions = useMemo(() => {
    return stones.map((_, i) => {
      const x = (i - stones.length / 2 + 0.5) * 1.2;
      return [x, 0, 0] as [number, number, number];
    });
  }, [stones.length]);

  return (
    <Canvas camera={{ position: [0, 4, 8], fov: 50 }} style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 8, 5]} intensity={0.6} />
      <pointLight position={[-5, 8, 5]} intensity={0.3} />
      
      
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <group>
          {stones.map((stone, i) => (
            <StoneMesh
              key={stone.index}
              stone={stone}
              position={stonePositions[i]}
            />
          ))}
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
        雙指引路 - Two Pointers
      </Text>
      
      {/* Current sum display */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.5}
        color={found ? '#22c55e' : currentSum === target ? '#22c55e' : currentSum < target ? '#3b82f6' : '#ef4444'}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {found ? `✓ 找到！Sum = ${currentSum}` : `Sum = ${currentSum}`}
      </Text>
      
      {/* Target display */}
      <Text
        position={[0, 2.3, 0]}
        fontSize={0.3}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        Target = {target}
      </Text>
      
      {/* Hint */}
      {!found && (
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.25}
          color={currentSum < target ? '#3b82f6' : '#ef4444'}
          anchorX="center"
          anchorY="middle"
        >
          {currentSum < target ? '← 太小了，左指針應右移' : '太大了，右指針應左移 →'}
        </Text>
      )}
    </Canvas>
  );
};

export default TwoPointersScene;
