import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { Suspense } from 'react';

interface CyberSceneProps {
  children?: React.ReactNode;
}

export const CyberScene = ({ children }: CyberSceneProps) => {
  return (
    <div className="three-canvas">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.3}
          />

          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />

          {/* Colored point lights */}
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00aa" />
          <pointLight position={[0, 5, 0]} intensity={0.3} color="#8b00ff" />

          {/* Particle background */}
          <ParticleField count={1600} size={0.25} />

          {/* Grid floor */}
          <gridHelper
            args={[50, 50, '#00f5ff', '#1a1a2e']}
            position={[0, -5, 0]}
            rotation={[0, 0, 0]}
          />

          {children}

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};
