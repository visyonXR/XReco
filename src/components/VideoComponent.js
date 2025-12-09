// VideoComponent.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { Vector3, Quaternion, Euler } from 'three';
import { Suspense } from 'react';
import { useVideoTexture, PivotControls, Html } from '@react-three/drei';
import { Center } from '@react-three/drei';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faVolumeHigh, faVolumeOff } from '@fortawesome/free-solid-svg-icons';
import * as THREE from 'three';
import { debounce } from 'lodash';

function VideoComponent({ position, index, videoFile, modelName, scale, rotation, selectedModel, setSelectedModel, setModelFiles, setIsManipulating, transformGizmoSize = 1 }) {
  const texture = useVideoTexture(videoFile);

  const videoElement = texture.image;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [currentScale, setCurrentScale] = useState(scale);
  
  const videoRef = useRef();

  useEffect(() => {
    if (videoElement) {
      videoElement.addEventListener("play", () => setIsPlaying(true));
      videoElement.addEventListener("pause", () => setIsPlaying(false));
  
      return () => {
        videoElement.removeEventListener("play", () => setIsPlaying(true));
        videoElement.removeEventListener("pause", () => setIsPlaying(false));
      };
    }
  }, [videoElement]);
  
  useEffect(() => {
    if (selectedModel && selectedModel.index === index) {
      setCurrentPosition(selectedModel.currentPosition);
      setCurrentRotation(selectedModel.currentRotation);
      setCurrentScale(selectedModel.currentScale);
    }
  }, [selectedModel, index]);

  const handlePlayPause = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    const videoElement = texture.image;
    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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
    videoRef.current.position.toArray(finalPosition);

    const finalQuaternion = new Quaternion();
    videoRef.current.quaternion.toArray(finalQuaternion);
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
      ref={videoRef}
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
        <Center top>
          <Suspense fallback={<meshStandardMaterial side={THREE.DoubleSide} wireframe />}>
            <VideoScreen texture={texture} />
          </Suspense>
        </Center>
        <Html position={[0, 2, 0]}>
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                backgroundColor: isPlaying ? "#ff5733" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handlePlayPause}
            >
              {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
            </button>
            <button
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleRestart}
            >
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                backgroundColor: isMuted ? "#dc3545" : "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleMuteToggle}
            >
              <FontAwesomeIcon icon={isMuted ? faVolumeOff : faVolumeHigh} />
            </button>
          </div>
        </Html>
      </PivotControls>
    </group>
  );
}

function VideoScreen({ texture }) {
  return (
    <mesh>
      <planeGeometry args={[5, 3]} />
      <meshStandardMaterial
        map={texture}
        toneMapped={false}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default VideoComponent;

