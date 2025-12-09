// Rectangle.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Rectangle({ height, width, depth, position, rotationX, rotationY, rotationZ}) {
  const meshRef = useRef();
  const widthMeters = width; 
  const heightMeters = height; 
  const depthMeters = depth; 
  const scale = 0.01;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationX;
      meshRef.current.rotation.x = rotationY;
      meshRef.current.rotation.z = rotationZ;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[widthMeters, heightMeters, depthMeters]} />
        <meshBasicMaterial color="gray" transparent depthTest={false} opacity={0.35} />
      </mesh>
    </group>
  );
}

export default Rectangle;
