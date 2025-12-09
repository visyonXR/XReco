import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const OrbitGizmo = {
  radius: 100,
  handleSize: 10,
  axisThickness: 3,
  centerSize: 5,
  colors: {
    x: '#ff0000', // Red
    y: '#00ff00', // Green  
    z: '#0000ff', // Blue
    hover: '#ffff00' // Yellow
  }
};

const OrbitGizmo3D = ({ orbitControlsRef, position = [0, 0, 0], scale = 0.3 }) => {
  const { camera, size } = useThree();
  const groupRef = useRef();
  const [hoveredAxis, setHoveredAxis] = useState(null);
  
  // Update gizmo position to stay in bottom-right corner, but don't rotate with camera
  useFrame(() => {
    if (groupRef.current && camera) {
      // Calculate position in world space for bottom-right corner
      const aspect = size.width / size.height;
      const fov = camera.fov * Math.PI / 180;
      const distance = 8; // Distance from camera
      
      // Bottom-right corner in normalized device coordinates
      const x = aspect * Math.tan(fov / 2) * distance * 0.6;
      const y = -Math.tan(fov / 2) * distance * 0.6;
      const z = -distance;
      
      // Transform to world space
      const gizmoPosition = new Vector3(x, y, z);
      gizmoPosition.applyMatrix4(camera.matrixWorld);
      
      groupRef.current.position.copy(gizmoPosition);
      
      // Keep gizmo orientation fixed (don't rotate with camera)
      groupRef.current.rotation.set(0, 0, 0);
    }
  });
  
  const handleAxisClick = (axis) => {
    if (!orbitControlsRef?.current) return;
    
    const controls = orbitControlsRef.current;
    const distance = camera.position.distanceTo(controls.target);
    
    let newPosition;
    switch (axis) {
      case 'x':
        newPosition = new Vector3(distance, 0, 0).add(controls.target);
        break;
      case 'y':
        newPosition = new Vector3(0, distance, 0).add(controls.target);
        break;
      case 'z':
        newPosition = new Vector3(0, 0, distance).add(controls.target);
        break;
      case '-x':
        newPosition = new Vector3(-distance, 0, 0).add(controls.target);
        break;
      case '-y':
        newPosition = new Vector3(0, -distance, 0).add(controls.target);
        break;
      case '-z':
        newPosition = new Vector3(0, 0, -distance).add(controls.target);
        break;
      default:
        return;
    }
    
    camera.position.copy(newPosition);
    camera.lookAt(controls.target);
    controls.update();
  };

  return (
    <group ref={groupRef} scale={scale}>
      {/* X Axis */}
      <group>
        {/* X axis line */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial color={OrbitGizmo.colors.x} />
        </mesh>
        
        {/* Positive X sphere */}
        <mesh
          position={[1, 0, 0]}
          onPointerEnter={() => setHoveredAxis('x')}
          onPointerLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('x')}
        >
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial 
            color={hoveredAxis === 'x' ? OrbitGizmo.colors.hover : OrbitGizmo.colors.x} 
          />
        </mesh>
        
        {/* Negative X sphere */}
        <mesh
          position={[-1, 0, 0]}
          onPointerEnter={() => setHoveredAxis('-x')}
          onPointerLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('-x')}
        >
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial 
            color={hoveredAxis === '-x' ? OrbitGizmo.colors.hover : OrbitGizmo.colors.x} 
            opacity={0.7}
            transparent
          />
        </mesh>
      </group>

      {/* Y Axis */}
      <group>
        {/* Y axis line */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial color={OrbitGizmo.colors.y} />
        </mesh>
        
        {/* Positive Y sphere */}
        <mesh
          position={[0, 1, 0]}
          onPointerEnter={() => setHoveredAxis('y')}
          onPointerLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('y')}
        >
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial 
            color={hoveredAxis === 'y' ? OrbitGizmo.colors.hover : OrbitGizmo.colors.y} 
          />
        </mesh>
        
        {/* Negative Y sphere */}
        <mesh
          position={[0, -1, 0]}
          onPointerEnter={() => setHoveredAxis('-y')}
          onPointerLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('-y')}
        >
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial 
            color={hoveredAxis === '-y' ? OrbitGizmo.colors.hover : OrbitGizmo.colors.y} 
            opacity={0.7}
            transparent
          />
        </mesh>
      </group>

      {/* Z Axis */}
      <group>
        {/* Z axis line */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial color={OrbitGizmo.colors.z} />
        </mesh>
        
        {/* Positive Z sphere */}
        <mesh
          position={[0, 0, 1]}
          onPointerEnter={() => setHoveredAxis('z')}
          onPointerLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('z')}
        >
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial 
            color={hoveredAxis === 'z' ? OrbitGizmo.colors.hover : OrbitGizmo.colors.z} 
          />
        </mesh>
        
        {/* Negative Z sphere */}
        <mesh
          position={[0, 0, -1]}
          onPointerEnter={() => setHoveredAxis('-z')}
          onPointerLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('-z')}
        >
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial 
            color={hoveredAxis === '-z' ? OrbitGizmo.colors.hover : OrbitGizmo.colors.z} 
            opacity={0.7}
            transparent
          />
        </mesh>
      </group>

      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
};

export default OrbitGizmo3D;
