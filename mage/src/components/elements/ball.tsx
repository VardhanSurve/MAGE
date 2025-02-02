"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Preload, OrbitControls, useGLTF, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { useControls } from 'leva';
import { Mesh, PerspectiveCamera } from 'three';
import * as THREE from 'three';

// Define types for props if needed
type ModelProps = JSX.IntrinsicElements['group'];

const Model: React.FC<ModelProps> = (props) => {
  const { nodes } = useGLTF('/ball/ball.gltf') as any; // Use 'as any' or define a type for the GLTF result
  const ref = useRef<Mesh>(null!); // Specify that ref is of type Mesh

  // Animation using useFrame
  useFrame((state) => {
    if (ref.current) {
      const { pointer } = state;

      // Calculate tilt based on mouse position
      const tiltX = pointer.y * 0.5; // Adjust the multiplier for the desired tilt intensity on the X-axis
      const tiltY = -pointer.x * 0.5; // Adjust the multiplier for the desired tilt intensity on the Y-axis

      // Apply tilt to the model's rotation
      ref.current.rotation.x = tiltX;
      ref.current.rotation.y = tiltY;

      // Optional: You can still have the model rotate over time if you want
      const elapsedTime = state.clock.getElapsedTime();
      ref.current.rotation.z = elapsedTime * 0.1; // Rotate around Z axis

      const amplitude = 10; // Maximum distance the model moves up and down
      const frequency = 2; // Speed of oscillation
      ref.current.position.y = Math.sin(elapsedTime * frequency) * amplitude;
    }
  });

  // Leva controls for material properties


  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        geometry={nodes.polySurface14.geometry}
        scale={15.5}
      >
        <MeshTransmissionMaterial/>
      </mesh>
    </group>
  );
};

// type BillboardTextProps = {
//   camera: PerspectiveCamera | null;
// };

// const BillboardText: React.FC<BillboardTextProps> = ({ camera }) => {
//   const textRef = useRef<THREE.Mesh>(null!); // Use appropriate ref type

//   // Make the text always face the camera
//   useFrame(() => {
//     if (textRef.current && camera) {
//       textRef.current.lookAt(camera.position);
//     }
//   });

//   return (
//     <Text
//       ref={textRef}
//       position={[0, 0, -10]} // Position text directly behind the model
//       fontSize={3} // Adjust font size relative to the model scale
//       rotation={[0, 0, 0]} // Ensure text is facing forward
//       scale={[1, 1, 1]} // Adjust scale if needed
//     >
//       EXEDEV
//     </Text>
//   );
// };

useGLTF.preload('/ball/ball.gltf');

const ModelCanvas: React.FC = () => {
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
      <Canvas camera={{ position: [-5, 3, 6], fov: 50, near: 0.1, far: 200 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 0, 2]} intensity={10.5} />
        <Environment preset="city" />
        <Model scale={isMobile ? 0.02 : 0.03} />
        {/* <BillboardText camera={null} /> */}
        <Preload all />
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 15}
          maxAzimuthAngle={Math.PI / 15}
        />
      </Canvas>
    </div>
  );
};

export default ModelCanvas;