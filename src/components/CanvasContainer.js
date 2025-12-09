// CanvasContainer.js

import React from 'react';
import { Canvas } from '@react-three/fiber';

function CanvasContainer({ children, width, height }) {
  const canvasStyle = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
  };

  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={canvasStyle}>
      {children}
    </Canvas>
  );
}

export default CanvasContainer;