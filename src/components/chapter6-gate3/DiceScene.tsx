import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import CursorLight from "@/components/3d/CursorLight";

interface ArrayElement {
  value: number;
  index: number;
  state: 'default' | 'pivot' | 'comparing' | 'sorted' | 'swapping';
}

interface DiceSceneProps {
  array: ArrayElement[];
  pivotIndex: number | null;
  isRolling: boolean;
  diceValue: number | null;
  useRandomPivot: boolean;
}

const ArrayBar = ({ 
  element, 
  position, 
  maxValue 
}: { 
  element: ArrayElement; 
  position: [number, number, number];
  maxValue: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const height = (element.value / maxValue) * 3 + 0.5;
  
  const color = useMemo(() => {
    switch (element.state) {
      case 'pivot': return '#d4af37';
      case 'comparing': return '#60a5fa';
      case 'sorted': return '#22c55e';
      case 'swapping': return '#f97316';
      default: return '#dc2626';
    }
  }, [element.state]);

  const emissiveIntensity = element.state === 'pivot' ? 0.8 : 
                           element.state === 'sorted' ? 0.3 : 0.1;

  useFrame((state) => {
    if (meshRef.current) {
      if (element.state === 'pivot') {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        meshRef.current.scale.x = 1;
        meshRef.current.scale.z = 1;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.6, height, 0.6]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.25}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
      >
        {element.value}
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        [{element.index}]
      </Text>
    </group>
  );
};

const Dice = ({ isRolling, value }: { isRolling: boolean; value: number | null }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isRolling) {
        meshRef.current.rotation.x += 0.15;
        meshRef.current.rotation.y += 0.2;
        meshRef.current.rotation.z += 0.1;
        meshRef.current.position.y = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 1.5;
      } else {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime) * 0.1;
      }
    }
  });

  return (
    <Float speed={isRolling ? 0 : 2} rotationIntensity={isRolling ? 0 : 0.2}>
      <group position={[0, 0.5, 3]}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            emissive="#d4af37"
            emissiveIntensity={isRolling ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {value !== null && !isRolling && (
          <Text
            position={[0, 0, 0.65]}
            fontSize={0.5}
            color="#d4af37"
            anchorX="center"
            anchorY="middle"
          >
            {value}
          </Text>
        )}
        <pointLight 
          position={[0, 0, 0]} 
          color="#d4af37" 
          intensity={isRolling ? 3 : 1} 
          distance={4}
        />
      </group>
    </Float>
  );
};

const ComplexityGauge = ({ 
  useRandom, 
  position 
}: { 
  useRandom: boolean;
  position: [number, number, number];
}) => {
  const needleRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRandom ? -Math.PI / 4 : Math.PI / 4;
  
  useFrame(() => {
    if (needleRef.current) {
      needleRef.current.rotation.z += (targetRotation - needleRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>
      
      <mesh position={[-0.8, 0.5, 0.1]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial 
          color="#22c55e" 
          emissive="#22c55e" 
          emissiveIntensity={useRandom ? 0.8 : 0.2} 
        />
      </mesh>
      <Text position={[-0.8, 0.9, 0.1]} fontSize={0.15} color="#22c55e">
        O(n log n)
      </Text>
      
      <mesh position={[0.8, 0.5, 0.1]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial 
          color="#dc2626" 
          emissive="#dc2626" 
          emissiveIntensity={useRandom ? 0.2 : 0.8} 
        />
      </mesh>
      <Text position={[0.8, 0.9, 0.1]} fontSize={0.15} color="#dc2626">
        O(n²)
      </Text>
      
      <mesh ref={needleRef} position={[0, 0, 0.15]}>
        <boxGeometry args={[0.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const SceneContent = ({ 
  array, 
  pivotIndex, 
  isRolling, 
  diceValue,
  useRandomPivot 
}: DiceSceneProps) => {
  const maxValue = Math.max(...array.map(el => el.value), 1);
  const startX = -(array.length - 1) * 0.8 / 2;

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} color="#d4af37" intensity={0.3} />
      
      {/* Cursor-following torch light */}
      <CursorLight color="#d4af37" intensity={2.5} distance={12} />
      
      <group position={[0, -1.5, 0]}>
        {array.map((element, i) => (
          <ArrayBar 
            key={i}
            element={element}
            position={[startX + i * 0.8, 0, 0]}
            maxValue={maxValue}
          />
        ))}
      </group>
      
      <Dice isRolling={isRolling} value={diceValue} />
      
      <ComplexityGauge useRandom={useRandomPivot} position={[4, 1, 0]} />
      
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const DiceScene = (props: DiceSceneProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-primary/30">
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
};

export default DiceScene;
