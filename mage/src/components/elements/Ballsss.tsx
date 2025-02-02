import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload, OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Mesh, PointLight, MeshStandardMaterial } from 'three';

type ModelProps = JSX.IntrinsicElements['group'];

const Model: React.FC<ModelProps> = (props) => {
  const { nodes } = useGLTF('/ballsss/ballsss.gltf') as any; 
  const ref = useRef<Mesh>(null!);
  const lightRef = useRef<PointLight>(null!); // Create a reference for the light

  useFrame((state) => {
    if (ref.current && lightRef.current) {
      const elapsedTime = state.clock.getElapsedTime();

      // Oscillation for levitation
      const amplitudeY = 0.01; // Maximum distance the model moves up and down
      const frequencyY = 1; // Speed of vertical oscillation
      ref.current.position.y = Math.sin(elapsedTime * frequencyY) * amplitudeY; // Up and down motion

      // Pulsing light effect
      const pulseSpeed = 1; // Adjust the speed of the pulse
      const pulseIntensity = 1; // Maximum intensity
      lightRef.current.intensity = (Math.sin(elapsedTime * pulseSpeed) + 1) / 2 * pulseIntensity * 1000; // Pulse intensity between 0 and max
    }
  });

  return (
    <group {...props} dispose={null}>
      {/* Glowing Ball */}
      <mesh ref={ref} geometry={nodes.pCube1.geometry} scale={0.022}>
        <meshStandardMaterial
          color="white"
          emissive="white" // Emissive color for glowing effect
          emissiveIntensity={100} // High intensity for glowing
          transparent
          opacity={0.9} // Adjust for slight transparency
          metalness={50.1} // Low metallic effect
          roughness={0.1} // Slight roughness to avoid mirror-like finish
        />
      </mesh>

      {/* PointLight to simulate the glow in all directions */}
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={10000} distance={10} decay={2} color="white" />
    </group>
  );
};

useGLTF.preload('/ballsss/ballsss.gltf')

const BallssCanve: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [-5, 9, 6], fov: 50, near: 0.1, far: 200 }}>
        <ambientLight intensity={0.3} />
        <Environment preset="city" />
        <Model scale={isMobile ? 0.02 : 30.03} />
        <Preload all />
        <OrbitControls
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
};

export default BallssCanve;
