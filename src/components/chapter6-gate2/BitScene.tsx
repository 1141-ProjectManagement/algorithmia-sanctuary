import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { getBit } from "@/stores/bitManipulationStore";

interface BitSceneProps {
  valueA: number;
  valueB: number;
  result: number;
  operation: string;
  animatingBits: number[];
  showB?: boolean;
}

const BitSphere = ({
  position,
  isOn,
  isAnimating,
  label,
}: {
  position: [number, number, number];
  isOn: boolean;
  isAnimating: boolean;
  label?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isAnimating ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      if (isOn) {
        mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      } else {
        mat.opacity = 0;
      }
    }
  });

  return (
    <group position={position}>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color={isOn ? "#d4af37" : "#333"}
          transparent
          opacity={0}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={isOn ? "#d4af37" : "#1a1a2e"}
          emissive={isOn ? "#d4af37" : "#000"}
          emissiveIntensity={isOn ? 0.8 : 0}
          metalness={0.3}
          roughness={0.4}
          transparent={!isOn}
          opacity={isOn ? 1 : 0.4}
        />
      </mesh>
      
      {/* Bit label */}
      {label && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.2}
          color={isOn ? "#d4af37" : "#666"}
          anchorX="center"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const BitRow = ({
  value,
  yPosition,
  label,
  animatingBits,
  color,
}: {
  value: number;
  yPosition: number;
  label: string;
  animatingBits: number[];
  color: string;
}) => {
  return (
    <group position={[0, yPosition, 0]}>
      {/* Row label */}
      <Text
        position={[-4.5, 0, 0]}
        fontSize={0.35}
        color={color}
        anchorX="right"
      >
        {label}
      </Text>
      
      {/* Bit spheres */}
      {Array.from({ length: 8 }, (_, i) => {
        const bitPosition = 7 - i;
        const isOn = getBit(value, bitPosition) === 1;
        const isAnimating = animatingBits.includes(bitPosition);
        
        return (
          <BitSphere
            key={i}
            position={[-3.5 + i * 1, 0, 0]}
            isOn={isOn}
            isAnimating={isAnimating}
            label={bitPosition.toString()}
          />
        );
      })}
      
      {/* Decimal value */}
      <Text
        position={[5.5, 0, 0]}
        fontSize={0.3}
        color="#888"
        anchorX="left"
      >
        = {value}
      </Text>
    </group>
  );
};

const OperationSymbol = ({
  operation,
  position,
}: {
  operation: string;
  position: [number, number, number];
}) => {
  const symbolMap: Record<string, string> = {
    '&': 'AND',
    '|': 'OR',
    '^': 'XOR',
    '~': 'NOT',
    '<<': '<<',
    '>>': '>>',
  };
  
  return (
    <Text
      position={position}
      fontSize={0.4}
      color="#d4af37"
      anchorX="center"
    >
      {symbolMap[operation] || operation}
    </Text>
  );
};

const ConnectionBeams = ({
  valueA,
  valueB,
  result,
  operation,
  animatingBits,
}: {
  valueA: number;
  valueB: number;
  result: number;
  operation: string;
  animatingBits: number[];
}) => {
  const beams = useMemo(() => {
    const beamList: { from: [number, number, number]; to: [number, number, number]; color: string }[] = [];
    
    animatingBits.forEach((bitPos) => {
      const xPos = -3.5 + (7 - bitPos) * 1;
      const bitA = getBit(valueA, bitPos);
      const bitB = getBit(valueB, bitPos);
      const bitResult = getBit(result, bitPos);
      
      if (operation !== '~' && operation !== '<<' && operation !== '>>') {
        // Draw beams from A and B to result
        if (bitA === 1) {
          beamList.push({
            from: [xPos, 2, 0],
            to: [xPos, -2, 0],
            color: '#d4af37',
          });
        }
        if (bitB === 1) {
          beamList.push({
            from: [xPos, 0.5, 0],
            to: [xPos, -2, 0],
            color: '#2832c2',
          });
        }
      }
    });
    
    return beamList;
  }, [valueA, valueB, result, operation, animatingBits]);

  return (
    <>
      {beams.map((beam, i) => {
        const curve = new THREE.LineCurve3(
          new THREE.Vector3(...beam.from),
          new THREE.Vector3(...beam.to)
        );
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 8, 0.02, 8, false]} />
            <meshBasicMaterial color={beam.color} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </>
  );
};

const Scene = ({ valueA, valueB, result, operation, animatingBits, showB = true }: BitSceneProps) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, 5]} intensity={0.3} color="#2832c2" />
      
      
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group>
          {/* Value A row */}
          <BitRow
            value={valueA}
            yPosition={2}
            label="A"
            animatingBits={animatingBits}
            color="#d4af37"
          />
          
          {/* Value B row (conditional) */}
          {showB && operation !== '~' && operation !== '<<' && operation !== '>>' && (
            <BitRow
              value={valueB}
              yPosition={0.5}
              label="B"
              animatingBits={animatingBits}
              color="#2832c2"
            />
          )}
          
          {/* Operation symbol */}
          <OperationSymbol operation={operation} position={[-5.5, showB ? -0.75 : 0, 0]} />
          
          {/* Divider line */}
          <mesh position={[0, -1.2, 0]}>
            <boxGeometry args={[10, 0.02, 0.02]} />
            <meshBasicMaterial color="#444" />
          </mesh>
          
          {/* Result row */}
          <BitRow
            value={result}
            yPosition={-2}
            label="="
            animatingBits={[]}
            color="#00a86b"
          />
          
          {/* Connection beams */}
          <ConnectionBeams
            valueA={valueA}
            valueB={valueB}
            result={result}
            operation={operation}
            animatingBits={animatingBits}
          />
        </group>
      </Float>
      
      {/* Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#d4af37"
        anchorX="center"
      >
        位元運算視覺化
      </Text>
    </>
  );
};

const BitScene = (props: BitSceneProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-black/30">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
};

export default BitScene;
