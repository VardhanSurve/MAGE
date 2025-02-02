"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload, OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Mesh } from 'three';

type ModelProps = JSX.IntrinsicElements['group'];

const Model: React.FC<ModelProps> = (props) => {
  const { nodes, materials } = useGLTF('/robot_hand/robot_hand.gltf') as any;
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
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
      <mesh geometry={nodes.pCube19.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube20.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube21.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube22.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube23.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube24.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube25.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube26.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube27.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube34.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube35.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube36.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube37.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube41.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pCube43.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface1.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface12.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface17.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface19.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface28.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface3.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface30.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface31.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface32.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface33.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface34.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface35.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.polySurface39.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pPipe10.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pPipe11.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pPipe12.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pPipe13.geometry} position={[0.042, -0.011, 0.012]} rotation={[0, 0, -0.116]}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pPipe14.geometry} position={[0.044, -0.02, 0]} rotation={[0, 0, -0.116]}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pPipe9.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pSphere2.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
        <mesh geometry={nodes.pSphere5.geometry}>
          <meshStandardMaterial {...materials.lambert3} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/robot_hand/robot_hand.gltf')

const RobotCanve: React.FC = () => {
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
      <Canvas camera={{ position: [-5, 9, 6], fov: 50, near: 0.1, far: 100 }}>
        <Environment preset="city" />
        <Model scale={isMobile ? 0.02 : 20.3} />
        <Preload all />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};


export default RobotCanve;
