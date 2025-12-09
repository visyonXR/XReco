// GhostObject.js

import React from 'react';
import { PivotControls } from '@react-three/drei';
import { Box, Edges } from '@react-three/drei';

const GhostObject = () => {
  const position = [0, 0.75, 0];
  const scale = 1;
  const color = "#cccccc";
  const edgeColor = "#ccc";
  const opacity = 0.85;

  return (
    <group position={position}>
      <PivotControls anchor={[0, 1, 0]} scale={0.5} lineWidth={3.5}>
        <Box
          scale={scale}
          args={[2, 1.5, 1]}
        >
          <meshBasicMaterial attach="material" color={color} opacity={opacity} transparent />
          <Edges>
            <lineBasicMaterial attach="material" color={edgeColor} linewidth={1} />
          </Edges>
        </Box>
      </PivotControls>
    </group>
  );
};

export default GhostObject;
