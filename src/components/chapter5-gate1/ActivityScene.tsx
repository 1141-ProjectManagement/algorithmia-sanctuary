import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { Activity } from "@/stores/greedyStore";
import CursorLight from "@/components/3d/CursorLight";

interface ActivityBarProps {
  activity: Activity;
  index: number;
  totalActivities: number;
  scanPosition: number;
}

const ActivityBar = ({ activity, index, totalActivities, scanPosition }: ActivityBarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const width = (activity.end - activity.start) * 0.5;
  const xPos = (activity.start + activity.end) / 2 * 0.5 - 2.5;
  const yPos = (totalActivities / 2 - index) * 0.6;
  
  const color = useMemo(() => {
    if (activity.selected) return "#22c55e"; // Green for selected
    if (activity.conflicted) return "#ef4444"; // Red for conflicted
    return "#3b82f6"; // Blue for default
  }, [activity.selected, activity.conflicted]);
  
  const opacity = useMemo(() => {
    if (activity.conflicted) return 0.3;
    if (activity.selected) return 1;
    return 0.6;
  }, [activity.selected, activity.conflicted]);

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = opacity;
      material.color.lerp(new THREE.Color(color), 0.1);
      
      if (activity.selected) {
        material.emissive = new THREE.Color(color);
        material.emissiveIntensity = 0.3;
      } else {
        material.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group position={[xPos, yPos, 0]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[width, 0.4, 0.2]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          emissive={color}
          emissiveIntensity={activity.selected ? 0.3 : 0}
        />
      </mesh>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {activity.name}
      </Text>
      <Text
        position={[0, -0.25, 0.15]}
        fontSize={0.1}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {`${activity.start}-${activity.end}`}
      </Text>
    </group>
  );
};

interface ScanLineProps {
  position: number;
  maxTime: number;
}

const ScanLine = ({ position, maxTime }: ScanLineProps) => {
  const lineRef = useRef<THREE.Mesh>(null);
  const targetX = position * 0.5 - 2.5;
  
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.position.x = THREE.MathUtils.lerp(
        lineRef.current.position.x,
        targetX,
        0.1
      );
    }
  });

  return (
    <mesh ref={lineRef} position={[targetX, 0, 0.1]}>
      <planeGeometry args={[0.05, 6]} />
      <meshBasicMaterial color="#d4af37" transparent opacity={0.8} />
    </mesh>
  );
};

const TimeAxis = () => {
  const ticks = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <group position={[0, -3.2, 0]}>
      {/* Main axis line */}
      <mesh>
        <boxGeometry args={[6, 0.02, 0.02]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
      
      {/* Ticks and labels */}
      {ticks.map(tick => (
        <group key={tick} position={[tick * 0.5 - 2.5, 0, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.15, 0.02]} />
            <meshBasicMaterial color="#666666" />
          </mesh>
          <Text
            position={[0, -0.15, 0]}
            fontSize={0.12}
            color="#888888"
            anchorX="center"
          >
            {tick.toString()}
          </Text>
        </group>
      ))}
      
      <Text
        position={[3.2, 0, 0]}
        fontSize={0.12}
        color="#888888"
        anchorX="left"
      >
        時間
      </Text>
    </group>
  );
};

interface ActivitySceneProps {
  activities: Activity[];
  scanPosition: number;
}

const ActivityScene = ({ activities, scanPosition }: ActivitySceneProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Cursor-following torch light */}
      <CursorLight color="#22c55e" intensity={2} distance={10} />
      
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <group>
          {activities.map((activity, index) => (
            <ActivityBar
              key={activity.id}
              activity={activity}
              index={index}
              totalActivities={activities.length}
              scanPosition={scanPosition}
            />
          ))}
          
          <ScanLine position={scanPosition} maxTime={12} />
          <TimeAxis />
        </group>
      </Float>
    </Canvas>
  );
};

export default ActivityScene;
