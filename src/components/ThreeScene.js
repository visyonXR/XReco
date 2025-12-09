// ThreeScene.js

import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera, Environment } from '@react-three/drei';
import { Vector3 } from 'three';
import Model from './Model';
import Rectangle from './Rectangle';
import Cylinder from './Cylinder';
import Screens from './Screens';
import DefaultModel from './DefaultModel';
import '../stylesheets/ThreeScene.css';
import CameraView from './CameraView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { EffectComposer, N8AO } from "@react-three/postprocessing";

import VideoComponent from './VideoComponent';
import AudioComponent from './AudioComponent';
import ImageComponent from './ImageComponent';
import StatusBar from './StatusBar';
import OrbitGizmo3D from './OrbitGizmo';
import { Suspense } from 'react';
import { debounce } from 'lodash';

const ThreeScene = forwardRef(({ hiddenModels, height, width, depth, deviceData, modelFiles, setModelFiles, selectedModel, setSelectedModel, 
  targetPosition, cameraPosition, dynamicCameras, setOrbitCameraPosition, setOrbitCameraTarget, cameraClickHandler, resetCamera, updatePositionRotationCamera,
  environmentFile, environmentData, setModelTriggerInfo, selectedCamera, setSelectedCamera, loading, loadingProgress, loadingMessage }, ref) => {
  const topViewPosition = [0, 50, 0];
  const frontViewPosition = [0, 0, 50];
  const sideViewPosition = [50, 0, 0];
  const [isTopView, setIsTopView] = useState(false);
  const [isFrontView, setIsFrontView] = useState(false);
  const [isSideView, setIsSideView] = useState(false);
  const [isManipulating, setIsManipulating] = useState(false);
  const [transformGizmoSize, setTransformGizmoSize] = useState(64);
  const [showTransformGizmoSize, setShowTransformGizmoSize] = useState(false);
  const [isOrthographic, setIsOrthographic] = useState(false);
  
  const orbitControlsRef = useRef(null);
  const cameraRef = useRef(null);
  const hdr1_local=`${process.env.PUBLIC_URL}/hdri/old_depot_2k.hdr`;
  const hdr2_local=`${process.env.PUBLIC_URL}/hdri/buikslotermeerplein_2k.hdr`;
  const hdr3_local=`${process.env.PUBLIC_URL}/hdri/sunset_jhbcentral_2k.hdr`;
  const hdr4_local=`${process.env.PUBLIC_URL}/hdri/zwartkops_curve_afternoon_2k.hdr`;
  const hdr5_local=`${process.env.PUBLIC_URL}/hdri/symmetrical_garden_02_2k.hdr`;
  const hdr6_local=`${process.env.PUBLIC_URL}/hdri/UnderWater_A_1k.hdr`;

  useEffect(() => {
    return () => {
      debouncedSetSelectedModelNull.cancel();
      debouncedToggleTopView.cancel();
    };
  }, []);

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(...targetPosition);
      orbitControlsRef.current.update();
    }
  }, [targetPosition]);

  const handleOrbitControlsChange = useCallback(
    debounce(() => {
      if (orbitControlsRef.current) {
        const currentCameraPosition = orbitControlsRef.current.object.position;
        const currentCameraTarget = orbitControlsRef.current.target;

        setOrbitCameraPosition([currentCameraPosition.x, currentCameraPosition.y, currentCameraPosition.z]);
        setOrbitCameraTarget([currentCameraTarget.x, currentCameraTarget.y, currentCameraTarget.z]);
      }
    }, 100),
    []
  );

  // Smooth camera transition function
  const smoothCameraTransition = useCallback((newPosition, newTarget, duration = 1000) => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const startPosition = controls.object.position.clone();
      const startTarget = controls.target.clone();
      const endPosition = new Vector3(...newPosition);
      const endTarget = new Vector3(...newTarget);
      
      let startTime = null;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate position and target
        controls.object.position.lerpVectors(startPosition, endPosition, easeProgress);
        controls.target.lerpVectors(startTarget, endTarget, easeProgress);
        controls.update();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, []);

  const debouncedSetSelectedModelNull = debounce(() => {
    setSelectedModel(null);
    setSelectedCamera(null);
  }, 100);

  const debouncedToggleTopView = debounce(() => {
    // Reset all other views when switching to top view
    setIsFrontView(false);
    setIsSideView(false);
    if (!isTopView) {
      // Smooth transition to top view
      smoothCameraTransition(topViewPosition, [0, 0, 0], 800);
    }
    setIsTopView(prevState => !prevState);
  }, 100);

  const debouncedToggleFrontView = debounce(() => {
    // Reset all other views when switching to front view
    setIsTopView(false);
    setIsSideView(false);
    if (!isFrontView) {
      // Smooth transition to front view
      smoothCameraTransition(frontViewPosition, [0, 0, 0], 800);
    }
    setIsFrontView(prevState => !prevState);
  }, 100);

  const debouncedToggleSideView = debounce(() => {
    // Reset all other views when switching to side view
    setIsTopView(false);
    setIsFrontView(false);
    if (!isSideView) {
      // Smooth transition to side view
      smoothCameraTransition(sideViewPosition, [0, 0, 0], 800);
    }
    setIsSideView(prevState => !prevState);
  }, 100);

  const debouncedToggleCamera = debounce(() => {
    // Toggle between perspective and orthographic camera
    // Reset all special views when switching camera type
    setIsTopView(false);
    setIsFrontView(false);
    setIsSideView(false);
    setIsOrthographic(prevState => !prevState);
  }, 100);

  // Expose view toggle functions to parent component
  useImperativeHandle(ref, () => ({
    toggleTopView: debouncedToggleTopView,
    toggleFrontView: debouncedToggleFrontView,
    toggleSideView: debouncedToggleSideView,
    togglePerspectiveView: debouncedToggleCamera
  }));

  const [altPressed, setAltPressed] = useState(false);
  const [controlPressed, setControlPressed] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.shiftKey) {
        event.preventDefault();
      }
      setAltPressed((prev) => event.altKey || prev);
      setControlPressed((prev) => event.ctrlKey || prev);
    };
  
    const handleKeyUp = (event) => {
      setAltPressed((prev) => (event.altKey ? prev : false));
      setControlPressed((prev) => (event.ctrlKey ? prev : false));
    };
  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);  

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field - prevent hotkeys when focusing inspector inputs
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('.object-data-container') ||
        activeElement.closest('.elements-data')
      );
      
      // Don't trigger hotkeys when typing in inspector panels
      if (isInputFocused) {
        return;
      }
      
      if (event.key === 'Delete') {
        event.preventDefault();
        if (selectedModel?.index != null) {
          const modelIndex = selectedModel.index;
  
          setModelFiles((prevModelFiles) =>
            prevModelFiles.filter((_, index) => index !== modelIndex)
          );
          
          setSelectedModel(null);
          setSelectedCamera(null);
  
          setModelTriggerInfo((prevTriggerInfo) => {
            const updatedTriggerInfo = { ...prevTriggerInfo };
            delete updatedTriggerInfo[modelIndex];
            return updatedTriggerInfo;
          });
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedModel, setModelFiles, setSelectedModel, setModelTriggerInfo]);   

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field - prevent hotkeys when focusing inspector inputs
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('.object-data-container') ||
        activeElement.closest('.elements-data')
      );
      
      // Don't trigger hotkeys when typing in inspector panels
      if (isInputFocused) {
        return;
      }
      
      if (event.key === 'F1') {
        event.preventDefault();
        debouncedToggleFrontView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [debouncedToggleFrontView]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field - prevent hotkeys when focusing inspector inputs
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('.object-data-container') ||
        activeElement.closest('.elements-data')
      );
      
      // Don't trigger hotkeys when typing in inspector panels
      if (isInputFocused) {
        return;
      }
      
      if (event.key === 'F2') {
        event.preventDefault();
        debouncedToggleSideView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [debouncedToggleSideView]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field - prevent hotkeys when focusing inspector inputs
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('.object-data-container') ||
        activeElement.closest('.elements-data')
      );
      
      // Don't trigger hotkeys when typing in inspector panels
      if (isInputFocused) {
        return;
      }
      
      if (event.key === 'F3') {
        event.preventDefault();
        debouncedToggleTopView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [debouncedToggleTopView]);

  // Add additional camera shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field - prevent hotkeys when focusing inspector inputs
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('.object-data-container') ||
        activeElement.closest('.elements-data')
      );
      
      // Don't trigger hotkeys when typing in inspector panels
      if (isInputFocused) {
        return;
      }
      
      // Home key to reset camera view
      if (event.key === 'Home') {
        event.preventDefault();
        setIsTopView(false);
        setIsFrontView(false);
        setIsSideView(false);
        smoothCameraTransition([0, 20, 20], [0, 0, 0], 1000);
      }
      
      // Number keys for quick view switching
      if (event.key === '1') {
        event.preventDefault();
        debouncedToggleFrontView();
      } else if (event.key === '3') {
        event.preventDefault();
        debouncedToggleSideView();
      } else if (event.key === '7') {
        event.preventDefault();
        debouncedToggleTopView();
      }
      
      // R key to reset view
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        if (orbitControlsRef.current) {
          orbitControlsRef.current.reset();
        }
      }
      
      // + and - keys for transform gizmo size adjustment
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setTransformGizmoSize(prevSize => Math.min(prevSize + 8, 128)); // Max size 128
        setShowTransformGizmoSize(true);
        setTimeout(() => setShowTransformGizmoSize(false), 2000); // Hide after 2 seconds
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        setTransformGizmoSize(prevSize => Math.max(prevSize - 8, 16)); // Min size 16
        setShowTransformGizmoSize(true);
        setTimeout(() => setShowTransformGizmoSize(false), 2000); // Hide after 2 seconds
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [debouncedToggleFrontView, debouncedToggleSideView, debouncedToggleTopView, smoothCameraTransition]);
  
  return (
    <div className='container-TS'>
      <div className="canvas-wrapper">
        <Canvas className='canvas-TS' onPointerMissed={() => {
          if (!altPressed && !controlPressed) {
            debouncedSetSelectedModelNull();
          }
        }}>
        <axesHelper args={[25]} />
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 10]}/>

        {parseInt(environmentData) === 1 && (
          <Environment 
            files={hdr1_local} 
            ground={{ height: 35, radius: 100, scale: 100 }} 
            background 
            intensity={0.25} 
          />
        )}

        {parseInt(environmentData) === 2 && (
          <Environment 
            files={hdr2_local} 
            ground={{ height: 35, radius: 100, scale: 100 }} 
            background 
            intensity={0.25} 
          />
        )}

        {parseInt(environmentData) === 3 && (
          <Environment 
            files={hdr3_local} 
            ground={{ height: 35, radius: 100, scale: 100 }} 
            background 
            intensity={0.25} 
          />
        )}

        {parseInt(environmentData) === 4 && (
          <Environment 
            files={hdr4_local} 
            ground={{ height: 35, radius: 100, scale: 100 }} 
            background 
            intensity={0.25} 
          />
        )}

        {parseInt(environmentData) === 5 && (
          <Environment 
            files={hdr5_local} 
            ground={{ height: 35, radius: 100, scale: 100 }} 
            background 
            intensity={0.25} 
          />
        )}

        {parseInt(environmentData) === 6 && (
          <Environment 
            files={hdr6_local} 
            ground={{ height: 35, radius: 100, scale: 100 }} 
            background 
            intensity={0.25} 
          />
        )}

        {modelFiles.map((modelFile, index) => (
          modelFile.type === 1 && !hiddenModels.includes(index) ? (
            <ImageComponent 
              key={index}
              position={modelFile.position}
              index={index}
              imageFile={modelFile.urlProcessedFile} 
              modelName={modelFile.name}
              scale={modelFile.scale}
              rotation={modelFile.rotation}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setModelFiles={setModelFiles}
              setIsManipulating={setIsManipulating}
              transformGizmoSize={transformGizmoSize}
            />
          ) : null
        ))}

        {modelFiles.map((modelFile, index) => (
          modelFile.type === 2 && !hiddenModels.includes(index) ? (
            <AudioComponent 
              key={index}
              position={modelFile.position}
              index={index}
              audioFile={modelFile.urlProcessedFile} 
              modelName={modelFile.name}
              scale={modelFile.scale}
              rotation={modelFile.rotation}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setModelFiles={setModelFiles}
              setIsManipulating={setIsManipulating}
              transformGizmoSize={transformGizmoSize}
            />
          ) : null
        ))}

        {modelFiles.map((modelFile, index) => (
          modelFile.type === 3 && !hiddenModels.includes(index) ? (
            <VideoComponent 
              key={index}
              position={modelFile.position}
              index={index}
              videoFile={modelFile.urlProcessedFile}
              modelName={modelFile.name}
              scale={modelFile.scale}
              rotation={modelFile.rotation}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setModelFiles={setModelFiles}
              setIsManipulating={setIsManipulating}
              transformGizmoSize={transformGizmoSize}
            />
          ) : null
        ))}

        {modelFiles.map((modelFile, index) => (
          modelFile.type === 0 && !hiddenModels.includes(index) ? (
            <Suspense key={index}>
              <Model
                key={index}
                position={modelFile.position}
                index={index}
                modelFile={modelFile.urlProcessedFile}
                modelName={modelFile.name}
                scale={modelFile.scale}
                rotation={modelFile.rotation}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                setModelFiles={setModelFiles}
                setIsManipulating={setIsManipulating}
                transformGizmoSize={transformGizmoSize}
              />
              </Suspense>
          ) : null
        ))}

        <Rectangle 
          height={height} 
          width={width} 
          depth={depth} 
          position={[0, depth/2, 0]} 
          rotationX={Math.PI/2} 
          rotationY={Math.PI/2} 
          rotationZ={Math.PI/2} 
        />
        
        {parseInt(deviceData) === 5 && (
          <>
            <DefaultModel
              key="desk"
              gltf={`${process.env.PUBLIC_URL}/desk.glb`}
              position={[0, 0.5, -8]}
              scale={1.87}
            />
            <DefaultModel
              key="presenter"
              gltf={`${process.env.PUBLIC_URL}/presenter.glb`}
              position={[0, 0.5, -9.5]}
              scale={1.75}
            />
            <Screens height={3} width={5} position={[-3, 3, -10]} rotationY={Math.PI/-4}/>
            <Screens height={3} width={5} position={[3, 3, -10]} rotationY={Math.PI/4} />
            <Cylinder height={0.5} radius={3} position={[0, 0.25, -8]} />
            <Cylinder height={0.5} radius={2.5} position={[0, 0.25, 8]} />
          </>
        )}
        <gridHelper args={[100, 100]} />

        {dynamicCameras.map((camera, index) => (
           <group key={index}>
            <CameraView
              key={index}
              index={camera.index}
              position={camera.position}
              rotation={camera.rotation}
              updatePositionRotationCamera={updatePositionRotationCamera}
              target={camera.target}
              cameraName={camera.name}
              selectedCamera={selectedCamera}
              setSelectedCamera={setSelectedCamera}
              setIsManipulating={setIsManipulating}
              transformGizmoSize={transformGizmoSize}
            />
            {/*<TruncatedPyramid
              bottomRadius={2}
              topRadius={0.2}
              height={3}
              position={camera.position}
              rotation={camera.rotation}
            />*/}
        </group>
        ))}
        {resetCamera ? null : (
          isTopView ? (
            <OrthographicCamera
              makeDefault
              position={topViewPosition}
              zoom={15}
              near={0.1}
              far={1000}
            />
          ) : isFrontView ? (
            <OrthographicCamera
              makeDefault
              position={frontViewPosition}
              zoom={15}
              near={0.1}
              far={1000}
            />
          ) : isSideView ? (
            <OrthographicCamera
              makeDefault
              position={sideViewPosition}
              zoom={15}
              near={0.1}
              far={1000}
            />
          ) : isOrthographic ? (
            <OrthographicCamera
              ref={cameraRef}
              makeDefault
              position={cameraPosition}
              zoom={15}
              near={0.1}
              far={1000}
            />
          ) : (
            <PerspectiveCamera ref={cameraRef} position={cameraPosition} makeDefault />
          )
        )}
        <EffectComposer disableNormalPass multisampling={8}>
          <N8AO aoRadius={50} distanceFalloff={0.2} intensity={6} screenSpaceRadius halfRes />
        </EffectComposer>
        <OrbitControls 
          ref={orbitControlsRef}
          target={targetPosition} 
          enableRotate={!isFrontView && !isSideView && !isTopView && !isManipulating} 
          enablePan={!isFrontView && !isSideView && !isTopView && !isManipulating}
          enableZoom={!isManipulating}
          enabled={!isManipulating}
          onChange={handleOrbitControlsChange}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.5}
          panSpeed={0.8}
          zoomSpeed={1.2}
          minDistance={1}
          maxDistance={500}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          mouseButtons={{
            LEFT: altPressed ? 0 : 2, // Alt + Left = Rotate, Left = Pan
            MIDDLE: 1, // Middle = Zoom
            RIGHT: altPressed ? 2 : 0  // Alt + Right = Pan, Right = Rotate
          }}
          touches={{
            ONE: 2, // Single touch = rotate
            TWO: 1  // Two finger = zoom/pan
          }}
        />
        
        {/* 3D Orbit Gizmo that rotates with camera */}
        <OrbitGizmo3D orbitControlsRef={orbitControlsRef} />
        
        </Canvas>
      </div>
      
      {showTransformGizmoSize && (
        <div className="transform-gizmo-size-indicator">
          Transform Gizmo Size: {transformGizmoSize} <span style={{opacity: 0.7}}>(+/- keys)</span>
        </div>
      )}
      
      <button className='button-TS' onClick={debouncedToggleCamera}>
        {isOrthographic ? <FontAwesomeIcon icon={faCube} className='icon-TS' /> : <FontAwesomeIcon icon={faBinoculars} className='icon-TS' />}
      </button>
      
      <StatusBar 
        modelFiles={modelFiles}
        selectedModel={selectedModel}
        dynamicCameras={dynamicCameras}
        loading={loading}
        loadingProgress={loadingProgress}
        loadingMessage={loadingMessage}
      />
    </div>
  );
});

export default ThreeScene;
