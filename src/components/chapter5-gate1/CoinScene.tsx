import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { Coin } from "@/stores/greedyStore";

interface CoinMeshProps {
  coin: Coin;
  index: number;
}

const CoinMesh = ({ coin, index }: CoinMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetY = -2 + index * 0.25;
  
  const color = useMemo(() => {
    if (coin.value >= 25) return "#d4af37"; // Gold
    if (coin.value >= 10) return "#c0c0c0"; // Silver
    if (coin.value >= 5) return "#cd7f32"; // Bronze
    return "#8b4513"; // Copper
  }, [coin.value]);

  useFrame((state) => {
    if (meshRef.current) {
      // Drop animation
      if (coin.dropped) {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          targetY,
          0.08
        );
      }
      // Subtle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={[coin.x, coin.dropped ? 3 : targetY, 0]}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[coin.x, targetY, 0.1]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {coin.value.toString()}
      </Text>
    </group>
  );
};

interface TreasureChestProps {
  isOpen: boolean;
}

const TreasureChest = ({ isOpen }: TreasureChestProps) => {
  const lidRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (lidRef.current) {
      const targetRotation = isOpen ? -Math.PI / 3 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetRotation,
        0.05
      );
    }
  });

  return (
    <group position={[0, -2.5, -0.5]}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Lid */}
      <mesh ref={lidRef} position={[0, 0.4, -0.5]}>
        <boxGeometry args={[2, 0.3, 1]} />
        <meshStandardMaterial color="#A0522D" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Gold trim */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[1.8, 0.1, 0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

interface CoinSceneProps {
  coins: Coin[];
  targetAmount: number;
  remainingAmount: number;
  isComplete: boolean;
}

const CoinScene = ({ coins, targetAmount, remainingAmount, isComplete }: CoinSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#d4af37" />
      <spotLight
        position={[0, 5, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        color="#d4af37"
      />
      
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <group>
          {/* Target display */}
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.3}
            color="#d4af37"
            anchorX="center"
          >
            {`目標: ${targetAmount} 元`}
          </Text>
          
          <Text
            position={[0, 2, 0]}
            fontSize={0.2}
            color={remainingAmount === 0 ? "#22c55e" : "#888888"}
            anchorX="center"
          >
            {remainingAmount === 0 
              ? `✓ 完成! 共 ${coins.length} 枚硬幣`
              : `剩餘: ${remainingAmount} 元`
            }
          </Text>
          
          {/* Coins */}
          {coins.map((coin, index) => (
            <CoinMesh key={coin.id} coin={coin} index={index} />
          ))}
          
          {/* Treasure chest */}
          <TreasureChest isOpen={coins.length > 0} />
        </group>
      </Float>
    </Canvas>
  );
};

export default CoinScene;
