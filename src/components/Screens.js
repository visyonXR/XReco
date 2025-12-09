// Screens.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Screens({ height, width, position, rotationY}) {
  const meshRef = useRef();
  const rotationX = Math.PI;
  const widthMeters = width; 
  const heightMeters = height; 
  const depthMeters = 0.01; 
  const scale = 0.01;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationX;
      meshRef.current.rotation.y = rotationY;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[widthMeters, heightMeters, depthMeters]} />
        <meshBasicMaterial color="gray" />
      </mesh>
    </group>
  );
}

export default Screens;
