// DefaultModel.js

import React from 'react';
import { useGLTF } from '@react-three/drei';

function DefaultModel({ gltf, scale, position }) {
  const { scene } = useGLTF(gltf);
  scene.scale.set(scale, scale, scale);
  scene.position.set(position[0], position[1], position[2]);
  return (
    <primitive object={scene} />
  );
}

export default DefaultModel;
