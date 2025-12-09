import React, { useState } from 'react';
import '../stylesheets/OrbitGizmo.css';

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

const OrbitGizmoOverlay = ({ orbitControlsRef, camera }) => {
  const [hoveredAxis, setHoveredAxis] = useState(null);
  
  const handleAxisClick = (axis) => {
    if (!orbitControlsRef?.current || !camera) return;
    
    const controls = orbitControlsRef.current;
    const distance = camera.position.distanceTo(controls.target);
    
    let newPosition = [0, 0, 0];
    switch (axis) {
      case 'x':
        newPosition = [distance, 0, 0];
        break;
      case 'y':
        newPosition = [0, distance, 0];
        break;
      case 'z':
        newPosition = [0, 0, distance];
        break;
      case '-x':
        newPosition = [-distance, 0, 0];
        break;
      case '-y':
        newPosition = [0, -distance, 0];
        break;
      case '-z':
        newPosition = [0, 0, -distance];
        break;
      default:
        return;
    }
    
    camera.position.set(
      newPosition[0] + controls.target.x,
      newPosition[1] + controls.target.y,
      newPosition[2] + controls.target.z
    );
    camera.lookAt(controls.target);
    controls.update();
  };

  const getAxisColor = (axis) => {
    return hoveredAxis === axis ? OrbitGizmo.colors.hover : OrbitGizmo.colors[axis.replace('-', '')];
  };

  return (
    <div className="orbit-gizmo-overlay">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="rgba(0, 0, 0, 0.1)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
        
        {/* Axis lines */}
        <line x1="5" y1="60" x2="115" y2="60" stroke={OrbitGizmo.colors.x} strokeWidth="2" opacity="0.6" />
        <line x1="60" y1="5" x2="60" y2="115" stroke={OrbitGizmo.colors.y} strokeWidth="2" opacity="0.6" />
        
        {/* Z axis line (diagonal to simulate depth) */}
        <line x1="20" y1="20" x2="100" y2="100" stroke={OrbitGizmo.colors.z} strokeWidth="2" opacity="0.6" />
        
        {/* Positive X axis handle */}
        <circle
          cx="105"
          cy="60"
          r={OrbitGizmo.handleSize}
          fill={getAxisColor('x')}
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredAxis('x')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('x')}
        />
        <text x="105" y="45" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">X</text>
        
        {/* Positive Y axis handle */}
        <circle
          cx="60"
          cy="15"
          r={OrbitGizmo.handleSize}
          fill={getAxisColor('y')}
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredAxis('y')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('y')}
        />
        <text x="60" y="10" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Y</text>
        
        {/* Positive Z axis handle */}
        <circle
          cx="90"
          cy="90"
          r={OrbitGizmo.handleSize}
          fill={getAxisColor('z')}
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredAxis('z')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('z')}
        />
        <text x="90" y="107" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Z</text>
        
        {/* Negative X axis handle */}
        <circle
          cx="15"
          cy="60"
          r={OrbitGizmo.handleSize}
          fill={getAxisColor('-x')}
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredAxis('-x')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('-x')}
        />
        
        {/* Negative Y axis handle */}
        <circle
          cx="60"
          cy="105"
          r={OrbitGizmo.handleSize}
          fill={getAxisColor('-y')}
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredAxis('-y')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('-y')}
        />
        
        {/* Negative Z axis handle */}
        <circle
          cx="30"
          cy="30"
          r={OrbitGizmo.handleSize}
          fill={getAxisColor('-z')}
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredAxis('-z')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('-z')}
        />
        
        {/* Center point */}
        <circle
          cx="60"
          cy="60"
          r={OrbitGizmo.centerSize}
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default OrbitGizmoOverlay;
