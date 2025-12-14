import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CursorLightProps {
  color?: string;
  intensity?: number;
  distance?: number;
  decay?: number;
}

const CursorLight = ({ 
  color = "#d4af37", 
  intensity = 2, 
  distance = 15,
  decay = 2 
}: CursorLightProps) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      // Convert normalized mouse coordinates to world space
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      
      // Smooth interpolation for fluid movement
      lightRef.current.position.x += (x - lightRef.current.position.x) * 0.1;
      lightRef.current.position.y += (y - lightRef.current.position.y) * 0.1;
      lightRef.current.position.z = 4; // Keep light in front of scene
    }

    if (glowRef.current) {
      glowRef.current.position.copy(lightRef.current!.position);
      // Subtle pulsing effect
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      glowRef.current.scale.setScalar(pulse * 0.3);
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={distance}
        decay={decay}
        castShadow
      />
      {/* Visual orb representing the light source */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </>
  );
};

export default CursorLight;
