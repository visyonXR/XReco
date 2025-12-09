// Cylinder.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Cylinder({ height, radius, position}) {
  const meshRef = useRef();
  const rotationX = Math.PI;
  const heightMeters = height;
  const radiusMeters = radius;
  const scale = 0.01;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationX;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[radiusMeters, radiusMeters, heightMeters, 32]} />
        <meshBasicMaterial color="gray" />
      </mesh>
    </group>
  );
}

export default Cylinder;