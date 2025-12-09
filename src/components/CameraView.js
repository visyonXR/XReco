// CameraView.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Billboard, PivotControls } from '@react-three/drei';
import { Vector3, Quaternion, Euler } from 'three';
import { TextureLoader } from 'three';
import { debounce } from 'lodash';

const CameraView = ({ index, position, rotation, updatePositionRotationCamera, target, cameraName, selectedCamera, setSelectedCamera, setIsManipulating, transformGizmoSize = 1 }) => {

  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [currentTarget, setCurrentTarget] = useState(target);
  const [texture, setTexture] = useState(null);

  const cameraRef = useRef();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      `${process.env.PUBLIC_URL}/camera.png`,
      (loadedTexture) => {
        // Essential texture configuration for PNG display
        loadedTexture.flipY = false;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        console.log("Camera texture loaded successfully");
      },
      undefined,
      (error) => console.error("Error loading texture:", error)
    );
  }, []);

  useEffect(() => {
    setCurrentPosition(position);
    setCurrentRotation(rotation);
    setCurrentTarget(target);
  }, [position, rotation, target]);
  
  const handleCameraDrag = (l, dl, w, dw) => {
    const newPosition = new Vector3();
    const rotation = new Quaternion();
    w.decompose(newPosition, rotation, new Vector3());

    setCurrentPosition(newPosition.toArray());

    const eulerRotation = new Euler().setFromQuaternion(rotation);
    setCurrentRotation([eulerRotation.x, eulerRotation.y, eulerRotation.z]);
  };

  const handleCameraDragEnd = () => {
    if (cameraRef.current) {
      const finalPosition = cameraRef.current.position;
      const finalQuaternion = cameraRef.current.quaternion;
      const finalEuler = new Euler().setFromQuaternion(finalQuaternion);
    
      updatePositionRotationCamera(index, finalPosition.toArray(), finalEuler.toArray());
    }
  };
  
  const debouncedCameraOnClick = useCallback(
    debounce((e) => {
      e.stopPropagation();
      setSelectedCamera({ index, currentPosition, currentTarget, cameraName });
    }, 100),
    [index, cameraName, currentPosition, currentTarget]
  );

  return (
    <group
      ref={cameraRef}
      position={currentPosition} 
      rotation={currentRotation}
      onClick={debouncedCameraOnClick}
    >
      <PivotControls anchor={[0, 0, 0]} scale={transformGizmoSize / 64} lineWidth={3.5}
        onDrag={handleCameraDrag}
        onDragStart={() => setIsManipulating && setIsManipulating(true)}
        onDragEnd={() => {
          handleCameraDragEnd();
          setIsManipulating && setIsManipulating(false);
        }}
        enabled={selectedCamera?.index === index}
        disableRotations={true}
        disableScaling={true} >
        <Billboard>
          <mesh
            key={index}
          >
            <planeGeometry args={[1, 1]} />
            {texture ? (
              <meshBasicMaterial 
                map={texture} 
                transparent={true} 
                alphaTest={0.1}
              />
            ) : (
              <meshBasicMaterial transparent={true} opacity={0} />
            )}
          </mesh>
        </Billboard>
      </PivotControls>
    </group>
  );
};

export default CameraView;
