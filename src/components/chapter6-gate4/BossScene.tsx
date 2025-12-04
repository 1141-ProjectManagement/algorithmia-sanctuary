import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { useBossStore } from "@/stores/bossStore";

const Shield = ({ 
  radius, 
  color, 
  health, 
  status,
  rotationSpeed 
}: { 
  radius: number; 
  color: string; 
  health: number;
  status: string;
  rotationSpeed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const opacity = status === 'completed' ? 0.1 : (health / 100) * 0.6 + 0.2;

  useFrame((state) => {
    if (meshRef.current && status !== 'completed') {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.15, 16, 100]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={status === 'active' ? 0.5 : 0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const BossCore = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const { showVictory } = useBossStore();

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial
          color={showVictory ? "#00ff88" : "#8b5cf6"}
          emissive={showVictory ? "#00ff88" : "#8b5cf6"}
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={showVictory ? "#00ff88" : "#ffffff"}
          emissive={showVictory ? "#00ff88" : "#d4af37"}
          emissiveIntensity={1}
        />
      </mesh>
    </Float>
  );
};

const DataParticles = ({ shieldType, radius }: { shieldType: string; radius: number }) => {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.5;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    return positions;
  }, [radius]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
    }
  });

  const color = shieldType === 'sorting' ? '#ef4444' : shieldType === 'graph' ? '#3b82f6' : '#d4af37';

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={color} transparent opacity={0.8} />
    </points>
  );
};

const BossSceneContent = () => {
  const { shields } = useBossStore();

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} intensity={1} angle={0.3} color="#ffffff" />

      <BossCore />

      {shields.map((shield, index) => (
        <group key={shield.type}>
          <Shield
            radius={2.5 + index * 1.2}
            color={shield.color}
            health={shield.health}
            status={shield.status}
            rotationSpeed={0.003 * (index + 1) * (index % 2 === 0 ? 1 : -1)}
          />
          <DataParticles shieldType={shield.type} radius={2.5 + index * 1.2} />
        </group>
      ))}

      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
};

const BossScene = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-black/50">
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <BossSceneContent />
      </Canvas>
    </div>
  );
};

export default BossScene;
