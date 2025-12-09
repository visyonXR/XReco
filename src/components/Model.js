// Model.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGLTF, PivotControls } from '@react-three/drei';
import { Vector3, Quaternion, Euler } from 'three';
import { debounce } from 'lodash';

const Model = React.memo (({ position, index, modelFile, modelName, scale, rotation, selectedModel, setSelectedModel, setModelFiles, setIsManipulating, transformGizmoSize = 64 }) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [currentScale, setCurrentScale] = useState(scale);
  
  const meshRef = useRef();

  const { scene } = useGLTF(modelFile);
  
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if (mat.map) mat.map.dispose();
                  if (mat.lightMap) mat.lightMap.dispose();
                  if (mat.bumpMap) mat.bumpMap.dispose();
                  if (mat.normalMap) mat.normalMap.dispose();
                  if (mat.aoMap) mat.aoMap.dispose();
                  if (mat.emissiveMap) mat.emissiveMap.dispose();
                  if (mat.metalnessMap) mat.metalnessMap.dispose();
                  if (mat.roughnessMap) mat.roughnessMap.dispose();
                  mat.dispose();
                });
              } else {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [scene]); 

  useEffect(() => {
    if (selectedModel && selectedModel.index === index) {
      setCurrentPosition(selectedModel.currentPosition);
      setCurrentRotation(selectedModel.currentRotation);
      setCurrentScale(selectedModel.currentScale);
    }
  }, [selectedModel, index]);

  const handleModelDrag = (l, dl, w, dw) => {
    if (!scene) return;

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
    meshRef.current.position.toArray(finalPosition);

    const finalQuaternion = new Quaternion();
    meshRef.current.quaternion.toArray(finalQuaternion);
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
      ref={meshRef}
      position={currentPosition}
      scale={currentScale}
      rotation={currentRotation}
      onClick={debouncedOnClick}
    >  
      <PivotControls
        depthTest={false}
        anchor={[0, 0, 0]}
        scale={transformGizmoSize}
        lineWidth={3.5}
        onDrag={handleModelDrag}
        onDragStart={() => setIsManipulating && setIsManipulating(true)}
        onDragEnd={() => {
          handleDragEnd();
          setIsManipulating && setIsManipulating(false);
        }}
        fixed={true}
        autoTransform={true}
        enabled={selectedModel?.index === index}
      >
        <primitive object={scene} />
      </PivotControls>
    </group>
  );
});

export default Model;
