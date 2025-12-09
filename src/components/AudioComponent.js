// AudioComponent.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { AudioListener, Audio, AudioLoader } from 'three';
import { PivotControls, Html } from '@react-three/drei';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward  } from '@fortawesome/free-solid-svg-icons';
import { TextureLoader } from 'three';
import { Vector3, Quaternion, Euler } from 'three';
import * as THREE from 'three';
import { debounce } from 'lodash';

function AudioComponent({ position, index, audioFile, modelName, scale, rotation, selectedModel, setSelectedModel, setModelFiles, setIsManipulating, transformGizmoSize = 1 }) {
  const listener = useRef(new AudioListener());
  const audio = useRef(new Audio(listener.current));
  const [isPlaying, setIsPlaying] = useState(false);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!audioFile) return;
  
    const loader = new AudioLoader();
    loader.load(audioFile, (buffer) => {
      audio.current.setBuffer(buffer);
      audio.current.setLoop(true);
    }, 
    undefined, 
    (err) => console.error("Error loading audio:", err));
  }, [audioFile]);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      `${process.env.PUBLIC_URL}/audio.png`,
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      (error) => console.error("Error loading texture:", error)
    );
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    audio.current.stop();
    audio.current.play();
    setIsPlaying(true);
  };

  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [currentScale, setCurrentScale] = useState(scale);
  
  const audioRef = useRef();

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
    audioRef.current.position.toArray(finalPosition);

    const finalQuaternion = new Quaternion();
    audioRef.current.quaternion.toArray(finalQuaternion);
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
      ref={audioRef}
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
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial 
              attach="material" 
              map={texture} 
              transparent
              side={THREE.DoubleSide}
           />
          </mesh>
        <Html position={[0, 1, 0]}>
        <div>
          <button
            style={{
              padding: '5px 10px',
              fontSize: '12px', 
              backgroundColor: isPlaying ? '#ff5733' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '3px',
            }}
            onClick={handlePlayPause}
          >
            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
          </button>
          <button
            style={{
              padding: '5px 10px',
              fontSize: '12px', 
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '3px',
            }}
            onClick={handleRestart}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
        </div>
      </Html>
      </PivotControls>
    </group>
  );
}

export default AudioComponent;
