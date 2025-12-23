import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCardProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
  color?: string;
  glowColor?: string;
  onClick?: () => void;
  delay?: number;
}

export const FloatingCard = ({
  position,
  title,
  subtitle,
  color = '#0a0a12',
  glowColor = '#00f5ff',
  onClick,
  delay = 0,
}: FloatingCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const initialY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      const floatOffset = Math.sin(state.clock.elapsedTime + delay) * 0.1;
      meshRef.current.position.y = initialY + floatOffset;
      
      // Hover scale
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.05;
    }
  });
  
  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[2.5, 1.5, 0.2]}
        radius={0.1}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={hovered ? glowColor : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </RoundedBox>
      
      {/* Glow effect */}
      <RoundedBox
        args={[2.6, 1.6, 0.1]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, -0.1]}
      >
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.15 : 0.05}
        />
      </RoundedBox>
      
      {/* Title text */}
      <Text
        position={[0, 0.2, 0.15]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        font="/fonts/orbitron.woff"
      >
        {title}
      </Text>
      
      {/* Subtitle */}
      {subtitle && (
        <Text
          position={[0, -0.2, 0.15]}
          fontSize={0.12}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {subtitle}
        </Text>
      )}
      
      {/* Edge glow lines */}
      <lineSegments position={[0, 0, 0.11]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.5, 1.5, 0.01)]} />
        <lineBasicMaterial color={glowColor} transparent opacity={hovered ? 0.8 : 0.3} />
      </lineSegments>
    </group>
  );
};
