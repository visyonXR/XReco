// TruncatedPyramid.js

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TruncatedPyramid = ({ bottomRadius, topRadius, height, position, rotation }) => {
  const meshRef = useRef();

  const updatedPosition = [
    position[0],
    position[1],
    position[2]-1.5
  ];

  const createTruncatedPyramid = (bottomRadius, topRadius, height, radialSegments = 4) => {
    const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, radialSegments, 1, true);
    geometry.rotateX(Math.PI / 2);
    return geometry;
  };

  useEffect(() => {
    if (meshRef.current) {
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const geometry = createTruncatedPyramid(bottomRadius, topRadius, height);
      meshRef.current.geometry = geometry;
      meshRef.current.material = material;
      meshRef.current.rotation.set(0, 0, Math.PI/4);
    }
  }, [bottomRadius, topRadius, height]);


  return (
    <mesh ref={meshRef} 
    position={updatedPosition}       
    rotation={rotation}>
    </mesh>
  );
};

export default TruncatedPyramid;
