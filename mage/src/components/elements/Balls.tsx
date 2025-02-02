"use client";

import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshPhysicalMaterial } from "three"; // Import MeshPhysicalMaterial for metallic properties

export function Ballls(props) {
  const { nodes } = useGLTF("/ball/ball.glb");

  // Log the structure of nodes to see what's inside
  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  // Create a shiny, metallic material with black and white properties
  const metallicMaterial = new MeshPhysicalMaterial({
    color: 0xffffff, // Base color: black
    metalness: 1, // Full metallic
    roughness: 0.1, // Very smooth, making it shiny
    reflectivity: 1, // Maximum reflectivity
    clearcoat: 1, // Clearcoat to add gloss
    clearcoatRoughness: 0.1, // Very little roughness for the clearcoat
    envMapIntensity: 2, // Enhances reflections
  });

  return (
    <group {...props} dispose={null}>
      {/* Replace "hands" with the actual node name after inspecting */}
      <mesh
        geometry={nodes.hands?.geometry} // Change "hands" to the correct node name after inspection
        material={metallicMaterial} // Apply the metallic material here
        rotation={[Math.PI / 2, 0, 0]}
        scale={2}
      />
    </group>
  );
}

useGLTF.preload("/ball/ball.glb");
