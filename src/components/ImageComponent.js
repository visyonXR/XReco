// ImageComponent.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { PivotControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import { Vector3, Quaternion, Euler } from 'three';
import * as THREE from 'three';
import { debounce } from 'lodash';

function ImageComponent({ position, index, imageFile, modelName, scale, rotation, selectedModel, setSelectedModel, setModelFiles, setIsManipulating, transformGizmoSize = 1 }) {
  const [texture, setTexture] = useState(null);  
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [currentScale, setCurrentScale] = useState(scale);
  const [aspectRatio, setAspectRatio] = useState(1);

  const imageRef = useRef();

  useEffect(() => {
    if (!imageFile) return;

    const loader = new TextureLoader();
    loader.load(
      imageFile,
      (loadedTexture) => {
        setTexture(loadedTexture);
        const { width, height } = loadedTexture.image;
        setAspectRatio(width / height);
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageFile]);

  useEffect(() => {
    if (selectedModel && selectedModel.index === index) {
      setCurrentPosition(selectedModel.currentPosition);
      setCurrentRotation(selectedModel.currentRotation);
      setCurrentScale(selectedModel.currentScale);
    }
  }, [selectedModel, index]);

  const handleModelDrag = (l, dl, w, dw) => {
    const newPosition = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    w.decompose(newPosition, rotation, scale);

    setCurrentPosition(newPosition.toArray());

    const eulerRotation = new Euler().setFromQuaternion(rotation);
    setCurrentRotation([eulerRotation.x, eulerRotation.y, eulerRotation.z]);
    setCurrentScale(scale.toArray());
  };

  const handleDragEnd = () => {
    const finalPosition = new Vector3();
    imageRef.current.position.toArray(finalPosition);

    const finalQuaternion = new Quaternion();
    imageRef.current.quaternion.toArray(finalQuaternion);
    const finalEuler = new Euler().setFromQuaternion(finalQuaternion);
  };

  const debouncedOnClick = useCallback(
    debounce((e) => {
      e.stopPropagation();
      setSelectedModel({ index, currentPosition, currentRotation, currentScale, modelName });
      setModelFiles(prevModelFiles => {
        const updatedModelFiles = [...prevModelFiles];
        updatedModelFiles[index] = {
          ...updatedModelFiles[index],
          position: currentPosition,
          scale: currentScale,
          rotation: currentRotation
        };
        return updatedModelFiles;
      });
    }, 100),
    [currentPosition, currentRotation, currentScale, index, modelName, setSelectedModel, setModelFiles]
  );

  return (
    <group 
      ref={imageRef}
      position={currentPosition}
      scale={currentScale}
      rotation={currentRotation}
      onClick={debouncedOnClick}
    >
      <PivotControls 
        anchor={[0, -1, 0]} 
        scale={transformGizmoSize / 64} 
        lineWidth={3.5}
        onDrag={handleModelDrag}
        onDragStart={() => setIsManipulating && setIsManipulating(true)}
        onDragEnd={() => {
          handleDragEnd();
          setIsManipulating && setIsManipulating(false);
        }}
        enabled={selectedModel?.index === index}
      >
          <mesh>
            <planeGeometry args={[2 * aspectRatio, 2]} />
            <meshBasicMaterial 
              attach="material" 
              map={texture} 
              transparent
              side={THREE.DoubleSide}
           />
          </mesh>
      </PivotControls>
    </group>
  );
}

export default ImageComponent;
