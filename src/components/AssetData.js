// AssetData.js

import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../stylesheets/AssetData.css';
import { debounce } from 'lodash';

const AssetData = React.memo (({ hideModel, hiddenModels, modelFiles, setSelectedModel, setSelectedCamera, dynamicCameras }) => { 
  
  const handleSelectModel= useCallback(
    debounce((index) => {
      const selectedAsset = modelFiles[index];
      if (selectedAsset) {
        setSelectedModel({
          index,
          currentPosition: selectedAsset.position,
          currentRotation: selectedAsset.rotation,
          currentScale: selectedAsset.scale,
          modelName: selectedAsset.name,
        });
      }
    }, 100),
    [modelFiles, setSelectedModel]
  );
  
  const handleSelectCamera= useCallback(
    debounce((index) => {
      const selectedCamera = dynamicCameras[index];
      if (selectedCamera) {
        setSelectedCamera({
          index,
          currentPosition: selectedCamera.position,
          currentTarget: selectedCamera.target,
          cameraName: selectedCamera.name,
        });
      }
    }, 100),
    [dynamicCameras, setSelectedCamera]
  );

  return (
    <div className="elements-data">
      <h3>Outliner</h3>
      <div className="asset-list">
        {modelFiles.map((modelFile, index) => (
          <div key={index} className="asset-item" id={`asset-item-${index}`} onClick={() => handleSelectModel(index)}>
          <span className="asset-name">{modelFile.name}</span>
            <FontAwesomeIcon 
              icon={hiddenModels.includes(index) ? faEyeSlash : faEye} 
              className='iconStyleAsset' onClick={() => hideModel(index)}
            />
          </div>
        ))}
      </div>
      <h3>Cameras</h3>
      <div className="camera-list">
        {dynamicCameras.map((camera, index) => (
          <div key={index} className="camera-item" id={`camera-item-${index}`} onClick={() => handleSelectCamera(index)}>
            <span className="camera-header">{camera.name}</span>
          </div>
        ))}
      </div>
      <hr style={{ borderColor: '#3a3e47', marginTop: '20px', marginBottom: '15px' }} />
    </div>
  );
});

export default AssetData;