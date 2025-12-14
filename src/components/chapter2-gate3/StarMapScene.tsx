import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
  position: [number, number, number];
  value: number;
  index: number;
  isLow: boolean;
  isMid: boolean;
  isHigh: boolean;
  isEliminated: boolean;
  isFound: boolean;
}

const Planet = ({ position, value, index, isLow, isMid, isHigh, isEliminated, isFound }: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isFound) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 2;
        if (glowRef.current) {
          glowRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 5) * 1;
        }
      } else if (isMid) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      }
    }
  });

  const getColor = () => {
    if (isFound) return "#d4af37";
    if (isEliminated) return "#3a3a3a";
    if (isMid) return "#d4af37";
    return "#4a90d9";
  };

  const getEmissive = () => {
    if (isFound) return "#d4af37";
    if (isEliminated) return "#1a1a1a";
    if (isMid) return "#d4af37";
    return "#2a4a6a";
  };

  const opacity = isEliminated ? 0.3 : 1;
  const scale = isFound ? 1.5 : isMid ? 1.2 : 1;

  return (
    <group position={position}>
      <Float speed={isEliminated ? 0 : 1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={meshRef} scale={scale}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={getColor()}
            emissive={getEmissive()}
            emissiveIntensity={isFound ? 0.8 : isMid ? 0.5 : 0.2}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={opacity}
          />
        </mesh>
      </Float>

      {/* Value label */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.3}
        color={isEliminated ? "#555" : "#fff"}
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Index label */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.2}
        color={isEliminated ? "#444" : "#888"}
        anchorX="center"
      >
        [{index}]
      </Text>

      {/* Pointer indicators */}
      {isLow && !isEliminated && (
        <group position={[0, 1.3, 0]}>
          <mesh>
            <coneGeometry args={[0.15, 0.3, 8]} />
            <meshStandardMaterial color="#4a90d9" emissive="#4a90d9" emissiveIntensity={0.5} />
          </mesh>
          <Text position={[0, 0.4, 0]} fontSize={0.2} color="#4a90d9" anchorX="center">
            Low
          </Text>
        </group>
      )}

      {isHigh && !isEliminated && (
        <group position={[0, 1.3, 0]}>
          <mesh>
            <coneGeometry args={[0.15, 0.3, 8]} />
            <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.5} />
          </mesh>
          <Text position={[0, 0.4, 0]} fontSize={0.2} color="#e74c3c" anchorX="center">
            High
          </Text>
        </group>
      )}

      {isMid && (
        <group position={[0, 1.8, 0]}>
          <mesh>
            <coneGeometry args={[0.2, 0.4, 8]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 0.5, 0]} fontSize={0.25} color="#d4af37" anchorX="center">
            Mid
          </Text>
        </group>
      )}

      {/* Glow for found/mid */}
      {(isFound || isMid) && (
        <pointLight 
          ref={glowRef} 
          color={isFound ? "#d4af37" : "#d4af37"} 
          intensity={isFound ? 3 : 1.5} 
          distance={3} 
        />
      )}

      {/* Found particle effect */}
      {isFound && (
        <>
          {[...Array(8)].map((_, i) => (
            <Sphere
              key={i}
              args={[0.05, 8, 8]}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 0.8,
                Math.sin((i / 8) * Math.PI * 2) * 0.8,
                0
              ]}
            >
              <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1} />
            </Sphere>
          ))}
        </>
      )}
    </group>
  );
};

interface StarMapSceneProps {
  array: number[];
  low: number;
  high: number;
  mid: number;
  eliminated: number[];
  found: boolean;
}

const StarMapScene = ({ array, low, high, mid, eliminated, found }: StarMapSceneProps) => {
  const spacing = 1.5;
  const offset = (array.length - 1) * spacing / 2;

  return (
    <Canvas camera={{ position: [0, 2, 15], fov: 50 }}>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#4a90d9" />
      

      {/* Stars background */}
      {useMemo(() => (
        [...Array(100)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 30,
              -10 - Math.random() * 20
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))
      ), [])}

      {/* Planets */}
      {array.map((value, index) => (
        <Planet
          key={index}
          position={[index * spacing - offset, 0, 0]}
          value={value}
          index={index}
          isLow={index === low}
          isMid={index === mid}
          isHigh={index === high}
          isEliminated={eliminated.includes(index)}
          isFound={found && index === mid}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default StarMapScene;
