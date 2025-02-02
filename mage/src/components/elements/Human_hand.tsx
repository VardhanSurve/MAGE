"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload, OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Mesh } from 'three';

type ModelProps = JSX.IntrinsicElements['group'];

const Model: React.FC<ModelProps> = (props) => {
  const { nodes, materials } = useGLTF('/human_hand/human_hand.gltf') as any; 
  const ref = useRef<Mesh>(null!);
  
  useFrame((state) => {
    if (ref.current) {
      const elapsedTime = state.clock.getElapsedTime();
      
      // Oscillation values for levitation
      const amplitudeY = 0.1; // Maximum distance the model moves up and down
      const frequencyY = 1; // Speed of vertical oscillation
      const amplitudeX = 0.05; // Maximum tilt left and right
      const frequencyX = 2; // Speed of horizontal tilt

      // Move up and down to create levitation effect
      ref.current.position.y = Math.sin(elapsedTime * frequencyY) * amplitudeY; // Up and down motion

      // Tilt left and right
      ref.current.rotation.y = Math.sin(elapsedTime * frequencyX) * amplitudeX; // Side to side tilt
    }
  });

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.hands.geometry} material={materials.hands} position={[0.305, 0, -0.055]} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
    </group>
  )
}

useGLTF.preload('/human_hand/human_hand.gltf')

const HumanCanva: React.FC = () => {
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
        <Model scale={isMobile ? 0.02 : 17.03} />
        <Preload all />
        <OrbitControls
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
};

export default HumanCanva;

