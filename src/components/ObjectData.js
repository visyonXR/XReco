// ObjectData.js

import React, { useState, useEffect } from 'react';
import '../stylesheets/ObjectData.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCamera, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

const ObjectData = React.memo (({ selectedModel, setSelectedModel, modelFiles, setModelFiles, modelTriggerInfo, setModelTriggerInfo,
   selectedCamera, setSelectedCamera, setDynamicCameras, cameraClickHandler, handleDeleteCamera, hiddenModels, setNotificationMessageDel, setShowNotificationDel}) => {
  
  const [previousSelectedIndex, setPreviousSelectedIndex] = useState(null);

  useEffect(() => {
    if (selectedModel !== null && selectedModel !== undefined) {
      setSelectedCamera(null);
      setPreviousSelectedIndex(selectedModel.index);
      
      if (!selectedModel.modelName) {
        selectedModel.modelName = `Asset ${selectedModel.index}`;
        setSelectedModel({ ...selectedModel });
      }

      const prevSelectedAssetItemIds = Array.from(document.querySelectorAll('.asset-item[selected]'));
      prevSelectedAssetItemIds.forEach(assetItem => {
        assetItem.removeAttribute('selected');
        assetItem.style.backgroundColor = null;
        assetItem.style.color = '#ccc';
      });

      const assetItemId = `asset-item-${selectedModel.index}`;
      const assetItemElement = document.getElementById(assetItemId);
      if (assetItemElement) {
        assetItemElement.setAttribute('selected', true);
        assetItemElement.style.backgroundColor = '#3a3e47';
        assetItemElement.style.color = '#ccc';
      }
    } else {
      if (previousSelectedIndex !== null) {
        const assetItemId2 = `asset-item-${previousSelectedIndex}`;
        const assetItemElement2 = document.getElementById(assetItemId2);
        if (assetItemElement2) {
          assetItemElement2.removeAttribute('selected');
          assetItemElement2.style.backgroundColor = null;
          assetItemElement2.style.color = '#ccc';
        }
      }
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedCamera !== null && selectedCamera !== undefined) {
      setSelectedModel(null);
      setPreviousSelectedIndex(selectedCamera.index);

      if (!selectedCamera.cameraName) {
        selectedCamera.cameraName = `Camera ${selectedCamera.index}`;
        setSelectedCamera({ ...selectedCamera });
      }
      
      const prevSelectedCameraItemIds = Array.from(document.querySelectorAll('.camera-item[selected]'));
      prevSelectedCameraItemIds.forEach(cameraItem => {
        cameraItem.removeAttribute('selected');
        cameraItem.style.backgroundColor = null;
        cameraItem.style.color = '#ccc';
      });

      const cameraItemId = `camera-item-${selectedCamera.index}`;
      const cameraItemElement = document.getElementById(cameraItemId);
      if (cameraItemElement) {
        cameraItemElement.setAttribute('selected', true);
        cameraItemElement.style.backgroundColor = '#3a3e47';
        cameraItemElement.style.color = '#ccc';
      }
    } else {
      if (previousSelectedIndex !== null) {
        const cameraItemId2 = `camera-item-${previousSelectedIndex}`;
        const cameraItemElement2 = document.getElementById(cameraItemId2);
        if (cameraItemElement2) {
          cameraItemElement2.removeAttribute('selected');
          cameraItemElement2.style.backgroundColor = null;
          cameraItemElement2.style.color = '#ccc';
        }
      }
    }
  }, [selectedCamera]);

  const radiansToDegrees = (radians) => radians * (180 / Math.PI);
  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

  const [tempPosition, setTempPosition] = useState([0, 0, 0]);
  const [tempRotation, setTempRotation] = useState([0, 0, 0]);
  const [tempScale, setTempScale] = useState([1, 1, 1]);
  const [tempModelName, setTempModelName] = useState('');
  const [tempPositionC, setTempPositionC] = useState([0, 0, 0]);
  const [tempTargetC, settempTargetC] = useState([0, 0, 0]);
  const [tempCameraName, setTempCameraName] = useState('');

  useEffect(() => {
    if (selectedModel) {
      if (selectedModel.currentPosition) {
        setTempPosition([
          parseFloat(selectedModel.currentPosition[0]).toFixed(3),
          parseFloat(selectedModel.currentPosition[1]).toFixed(3),
          parseFloat(selectedModel.currentPosition[2]).toFixed(3),
        ]);
      }
      if (selectedModel.currentRotation) {
        setTempRotation([
          radiansToDegrees(parseFloat(selectedModel.currentRotation[0])).toFixed(3),
          radiansToDegrees(parseFloat(selectedModel.currentRotation[1])).toFixed(3),
          radiansToDegrees(parseFloat(selectedModel.currentRotation[2])).toFixed(3),
        ]);
      }
      if (selectedModel.currentScale) {
        setTempScale([
          parseFloat(selectedModel.currentScale[0]).toFixed(3),
          parseFloat(selectedModel.currentScale[1]).toFixed(3),
          parseFloat(selectedModel.currentScale[2]).toFixed(3),
        ]);
      }
      if (selectedModel.modelName) {
        setTempModelName(selectedModel.modelName);
      }
    }
  }, [selectedModel?.currentPosition, selectedModel?.currentRotation, selectedModel?.currentScale, selectedModel?.modelName]);

  useEffect(() => {
    if (selectedCamera) {
      if (selectedCamera.currentPosition) {
        setTempPositionC([
          parseFloat(selectedCamera.currentPosition[0]).toFixed(3),
          parseFloat(selectedCamera.currentPosition[1]).toFixed(3),
          parseFloat(selectedCamera.currentPosition[2]).toFixed(3),
        ]);
      }
      if (selectedCamera.currentTarget) {
        settempTargetC([
          parseFloat(selectedCamera.currentTarget[0]).toFixed(3),
          parseFloat(selectedCamera.currentTarget[1]).toFixed(3),
          parseFloat(selectedCamera.currentTarget[2]).toFixed(3),
        ]);
      }
      if (selectedCamera.cameraName) {
        setTempCameraName(selectedCamera.cameraName);
      }
    }
  }, [selectedCamera?.currentPosition, selectedCamera?.currentTarget, selectedCamera?.cameraName]);
  
  const handleChangeModel = (e, index, type) => {
    let value = e.target.value;
    value = value.replace(',', '.');
    if (value === '-' || !isNaN(value) || value === '') {
      switch(type) {
        case 'position':
          setTempPosition((prev) => {
            const newPosition = [...prev];
            newPosition[index] = value;
            return newPosition;
          });
          break;
        case 'rotation':
          setTempRotation((prev) => {
            const newRotation = [...prev];
            newRotation[index] = value;
            return newRotation;
          });
          break;
        case 'scale':
          setTempScale((prev) => {
            const newScale = [...prev];
            newScale[index] = value;
            return newScale;
          });
          break;
        default:
          break;
      }
    }
  };

  const handleKeyDownAsset = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedModel) {
        const modelIndex = selectedModel.index;
        const updatedPosition = [
          parseFloat(tempPosition[0]).toFixed(3),
          parseFloat(tempPosition[1]).toFixed(3),
          parseFloat(tempPosition[2]).toFixed(3)
        ];

        const updatedRotation = [
          degreesToRadians(parseFloat(tempRotation[0])).toFixed(3),
          degreesToRadians(parseFloat(tempRotation[1])).toFixed(3),
          degreesToRadians(parseFloat(tempRotation[2])).toFixed(3)
        ];

        const updatedScale = [
          parseFloat(tempScale[0]).toFixed(3),
          parseFloat(tempScale[1]).toFixed(3),
          parseFloat(tempScale[2]).toFixed(3)
        ];

        const updatedModelName = tempModelName;
    
        setSelectedModel((prevSelectedModel) => {
          if (prevSelectedModel.index === modelIndex) {
            return {
              ...prevSelectedModel,
              currentPosition: updatedPosition, 
              currentRotation: updatedRotation,
              currentScale: updatedScale, 
              modelName: updatedModelName
            };
          }
          return prevSelectedModel; 
        });
    
        setModelFiles(prevModelFiles => {
          const updatedModelFiles = [...prevModelFiles];
          updatedModelFiles[modelIndex] = {
            ...updatedModelFiles[modelIndex],
            position: updatedPosition,
            rotation: updatedRotation,
            scale: updatedScale,
            name: updatedModelName
          };
          return updatedModelFiles;
        });
      }
      e.target.blur();
    }
  };

  const handleChangeModelName = (e, field) => {
    const newValue = e.target.value;
    switch (field) {
      case 'name':
        setTempModelName(newValue);
        break;
      default:
        break;
    }
  };

  const handleChangeCamera = (e, index, type) => {
    let value = e.target.value;
    value = value.replace(',', '.');
    if (value === '-' || !isNaN(value) || value === '') {
      switch(type) {
        case 'position':
          setTempPositionC((prev) => {
            const newPosition = [...prev];
            newPosition[index] = value;
            return newPosition;
          });
          break;
        case 'target':
          settempTargetC((prev) => {
            const newTarget = [...prev];
            newTarget[index] = value;
            return newTarget;
          });
          break;
        default:
          break;
      }
    }
  };

  const handleKeyDownCamera = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCamera) {
        const cameraIndex = selectedCamera.index;
        const updatedPosition = [
          parseFloat(tempPositionC[0]).toFixed(3),
          parseFloat(tempPositionC[1]).toFixed(3),
          parseFloat(tempPositionC[2]).toFixed(3)
        ];

        const updatedTarget = [
          parseFloat(tempTargetC[0]).toFixed(3),
          parseFloat(tempTargetC[1]).toFixed(3),
          parseFloat(tempTargetC[2]).toFixed(3)
        ];

        const updatedCameraName = tempCameraName;
    
        setSelectedCamera((prevSelectedCamera) => {
          if (prevSelectedCamera.index === cameraIndex) {
            return {
              ...prevSelectedCamera,
              currentPosition: updatedPosition, 
              currentTarget: updatedTarget,
              cameraName: updatedCameraName
            };
          }
          return prevSelectedCamera; 
        });
    
        setDynamicCameras(prevCameraFiles => {
          const updatedCameraFiles = [...prevCameraFiles];
          updatedCameraFiles[cameraIndex] = {
            ...updatedCameraFiles[cameraIndex],
            position: updatedPosition,
            target: updatedTarget,
            name: updatedCameraName
          };
          return updatedCameraFiles;
        });
      }
      e.target.blur();
    }
  };

  const handleChangeCameraName = (e, field) => {
    const newValue = e.target.value;
    switch (field) {
      case 'name':
        setTempCameraName(newValue);
        break;
      default:
        break;
    }
  };

  const debouncedCameraClickHandler = debounce(cameraClickHandler, 100);
  const debouncedHandleDeleteCamera = debounce(handleDeleteCamera, 100);

  const handleDeleteSelectedCamera = () => {
    if (selectedCamera && selectedCamera.index != null) {
      debouncedHandleDeleteCamera(selectedCamera.index);
      setSelectedCamera(null);
    }
  };

  const updateTriggerInfo = (modelIndex, triggerInfo) => {
    setModelTriggerInfo(prevTriggerInfo => ({
      ...prevTriggerInfo,
      [modelIndex]: triggerInfo
    }));
  };

  const getTriggerInfoForModel = (modelIndex) => {
    return modelTriggerInfo[modelIndex] || [];
  };

  const updateTriggersInModelFiles = (modelIndex, newTriggers) => {
    setModelFiles(prevModelFiles => {
      const updatedModelFiles = [...prevModelFiles];
      updatedModelFiles[modelIndex] = {
        ...updatedModelFiles[modelIndex],
        triggers: newTriggers
      };
      return updatedModelFiles;
    });
  };

  const debouncedHandleTriggerButtonUpClick = debounce(() => {
    if (selectedModel && selectedModel.index != null) {
      const modelIndex = selectedModel.index;
      const triggerInfoForModel = getTriggerInfoForModel(modelIndex);

      if (triggerInfoForModel.length < 3) {
        let actionText = document.getElementById('selector-action').value;
        let reactionText = document.getElementById('selector-reaction').value;
        let timeValue = "0";
        let transform = [selectedModel.currentPosition, selectedModel.currentRotation, selectedModel.currentScale ];
        let visibility = "Visible";
        const newTriggerInfo = [...triggerInfoForModel, 
          { actionText: actionText, 
            reactionText: reactionText,
            timeValue: timeValue,
            transform: transform, 
            visibility: visibility
          }];
        updateTriggerInfo(modelIndex, newTriggerInfo);
        updateTriggersInModelFiles(modelIndex, newTriggerInfo);
      }
    }
  }, 100); 

  const debouncedHandleTriggerButtonDownClick = debounce(() => {
    if (selectedModel && selectedModel.index != null) {
      const modelIndex = selectedModel.index;
      const newTriggerInfo = [...getTriggerInfoForModel(modelIndex)];
      newTriggerInfo.pop();
      updateTriggerInfo(modelIndex, newTriggerInfo);
      updateTriggersInModelFiles(modelIndex, newTriggerInfo);

      setTransformVisibility(prev => {
        const updatedTransformVisibility = { ...prev };
        delete updatedTransformVisibility[modelIndex];
        return updatedTransformVisibility;
      });
    }
  }, 100); 

  const [transformVisibility, setTransformVisibility] = useState({});

  const handleToggleTransformVisibility = (index) => {
    setTransformVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const [selectedValuesVisibility, setSelectedValuesVisibility] = useState({});

  const isHidden = (index) => hiddenModels.includes(selectedModel?.index);
  const selectedValueVisibility = (index) => 
      selectedValuesVisibility[index] ?? (isHidden(index) ? 'Hidden' : 'Visible');

  const shouldHighlight = (index) =>
  (isHidden(index) && selectedValueVisibility(index) === 'Hidden') || 
  (!isHidden(index) && selectedValueVisibility(index) === 'Visible');
  
  const updateTriggerValue = (modelIndex, triggerIndex, key, value) => {
    const triggerInfoForModel = getTriggerInfoForModel(modelIndex);
    
    const updatedTriggerInfo = triggerInfoForModel.map((trigger, index) => {
      if (index === triggerIndex) {
        return {
          ...trigger,
          [key]: value
        };
      }
      return trigger;
    });
  
    updateTriggerInfo(modelIndex, updatedTriggerInfo);
    updateTriggersInModelFiles(modelIndex, updatedTriggerInfo);
  };
  
  const handleTimeValueChange = (e, modelIndex, triggerIndex) => {
    const newTimeValue = e.target.value;
    updateTriggerValue(modelIndex, triggerIndex, 'timeValue', newTimeValue);
  };

  const handleVisibilityChange = (e, modelIndex, triggerIndex) => {
    const newVisibility = e.target.value;
    updateTriggerValue(modelIndex, triggerIndex, 'visibility', newVisibility);
    setSelectedValuesVisibility(prev => ({
        ...prev,
        [triggerIndex]: e.target.value
    }));
  };

  const handleTransformChange = (e, modelIndex, triggerIndex, transformIndex, axis) => {
    const newTransformValue = parseFloat(e.target.value);
    
    const triggerInfoForModel = getTriggerInfoForModel(modelIndex);
    const updatedTriggerInfo = triggerInfoForModel.map((trigger, index) => {
      if (index === triggerIndex) {
        const updatedTransform = [...trigger.transform];
        updatedTransform[transformIndex][axis] = newTransformValue;
  
        return {
          ...trigger,
          transform: updatedTransform
        };
      }
      return trigger;
    });
  
    updateTriggerInfo(modelIndex, updatedTriggerInfo);
    updateTriggersInModelFiles(modelIndex, updatedTriggerInfo);
  };

  const showMessageOnDelete= () => {
    setNotificationMessageDel(
      "Are you sure you want to delete the asset?"
    );
    setShowNotificationDel(true);
  }
  

  return (
    <div className='object-data-container'>
      <h3>Inspector</h3>
      <hr style={{ borderColor: '#3a3e47', marginTop: '20px', marginBottom: '35px' }} />
      <div>
        {selectedModel !== null && selectedModel !== undefined ? (
          <>
          <input
            type="text"
            id="modelName"
            className="rounded-inspector-name"
            value={tempModelName}
            onChange={(e) => handleChangeModelName(e, 'name')}
            onKeyDown={(e) => handleKeyDownAsset(e)}
          />
          <div className='field-container'>
            <div className='field'>
              <label htmlFor="positionP" title="Position">P</label>
              <input
                id="position-x"
                className="rounded-inspector"
                type="text"
                value={tempPosition[0]}
                onChange={(e) => handleChangeModel(e, 0, 'position')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id="position-y"
                className="rounded-inspector"
                type="text"
                value={tempPosition[1]}
                onChange={(e) => handleChangeModel(e, 1, 'position')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id="position-z"
                className="rounded-inspector"
                type="text"
                value={tempPosition[2]}
                onChange={(e) => handleChangeModel(e, 2, 'position')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
            </div>
            <div className='field'>
            <label htmlFor="position" title="Rotation">R</label>
              <input
                id="rotation-x"
                className="rounded-inspector"
                type="text"
                value={tempRotation[0]}
                onChange={(e) => handleChangeModel(e, 0, 'rotation')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id="rotation-y"
                className="rounded-inspector"
                type="text"
                value={tempRotation[1]}
                onChange={(e) => handleChangeModel(e, 1, 'rotation')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id="rotation-z"
                className="rounded-inspector"
                type="text"
                value={tempRotation[2]}
                onChange={(e) => handleChangeModel(e, 2, 'rotation')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
            </div>
            <div className='field'>
              <label htmlFor="position" title="Scale">S</label>
              <input
                id="scale-x"
                className="rounded-inspector"
                type="text"
                value={tempScale[0]}
                onChange={(e) => handleChangeModel(e, 0, 'scale')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id="scale-y"
                className="rounded-inspector"
                type="text"
                value={tempScale[1]}
                onChange={(e) => handleChangeModel(e, 1, 'scale')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id="scale-z"
                className="rounded-inspector"
                type="text"
                value={tempScale[2]}
                onChange={(e) => handleChangeModel(e, 2, 'scale')}
                onKeyDown={(e) => handleKeyDownAsset(e)}
                maxLength="8"
                autoComplete='off'
              />
            </div>
            <br />
          </div>
          <h3>Triggers</h3>
          <hr style={{ borderColor: '#3a3e47', marginTop: '20px', marginBottom: '35px' }} />
          <div className='field'>
            <select id="selector-action" className='select-trigger'>
              <option>Time</option>
              <option>Touch</option>
            </select>
            <select id="selector-reaction" className='select-trigger'>
              <option>Transform</option>
              <option>Visibility</option>
            </select>
            <div id="trigger-button-up" className='select-trigger-button-up' onClick={debouncedHandleTriggerButtonUpClick}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div id="trigger-button-down" className='select-trigger-button-down' onClick={debouncedHandleTriggerButtonDownClick}>
              <FontAwesomeIcon icon={faMinus} />
            </div>
          </div>
          <div className='field-container'>
            <div>
            {selectedModel && selectedModel.index != null && getTriggerInfoForModel(selectedModel.index).map((info, index) => (
              <div className='triggers-container' key={index}>
                {/* ACTION */}
                <div className='triggers-field'>
                  {(() => {
                    switch (true) {
                      case info.actionText.startsWith('Time'):
                        return (
                          <>
                            <div className='triggers-div'>
                              <label className='triggers-label' htmlFor={`action-${index}`}>
                                {info.actionText}_{index}
                              </label>
                            </div>
                            <input
                              className="rounded-input-trigger"
                              type="number"
                              placeholder="Time from start"
                              value={info.timeValue}
                              onChange={(e) => handleTimeValueChange(e, selectedModel.index, index)}
                              title={'Time in seconds'}
                            />
                          </>
                        );

                      case info.actionText.startsWith('Touch'):
                        return (
                          <>
                            <div className='triggers-div'>
                              <label className='triggers-label' htmlFor={`action-${index}`}>
                                {info.actionText}_{index}
                              </label>
                            </div>
                            <input
                              className="rounded-input-trigger"
                              type="number"
                              placeholder="Transition time"
                              value={info.timeValue}
                              onChange={(e) => handleTimeValueChange(e, selectedModel.index, index)}
                              title={'Time in seconds'}
                            />
                          </>
                        );

                      default:
                        return (
                          null
                        );
                    }
                  })()}
                </div>

                {/* REACTION */}
                <div className='triggers-field'>
                    {(() => {
                    switch (true) {
                      case info.reactionText.startsWith('Transform'):
                        return (
                          <>
                           <div>
                            <FontAwesomeIcon
                              className='dropViwInfoCamera'
                              onClick={() => handleToggleTransformVisibility(index)}
                              icon={transformVisibility[index] ? faAngleDown : faAngleUp}
                            />
                          </div>
                            {transformVisibility[index] && (
                              <div className='field-container'>
                                <div className='field'>
                                  <label htmlFor="positionP">P</label>
                                  <input
                                    id="position-x"
                                    className="rounded-inspector"
                                    type="text"
                                    value={parseFloat(info.transform[0][0]).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 0, 0)}
                                  />
                                  <input
                                    id="position-y"
                                    className="rounded-inspector"
                                    type="text"
                                    value={parseFloat(info.transform[0][1]).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 0, 1)}
                                  />
                                  <input
                                    id="position-z"
                                    className="rounded-inspector"
                                    type="text"
                                    value={parseFloat(info.transform[0][2]).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 0, 2)}
                                  />
                                </div>
                                <div className='field'>
                                <label htmlFor="position">R</label>
                                  <input
                                    id="rotation-x"
                                    className="rounded-inspector"
                                    type="text"
                                    value={radiansToDegrees(parseFloat(info.transform[1][0])).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 1, 0)}
                                  />
                                  <input
                                    id="rotation-y"
                                    className="rounded-inspector"
                                    type="text"
                                    value={radiansToDegrees(parseFloat(info.transform[1][1])).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 1, 1)}
                                  />
                                  <input
                                    id="rotation-z"
                                    className="rounded-inspector"
                                    type="text"
                                    value={radiansToDegrees(parseFloat(info.transform[1][2])).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 1, 2)}
                                  />
                                </div>
                                <div className='field'>
                                  <label htmlFor="position">S</label>
                                  <input
                                    id="scale-x"
                                    className="rounded-inspector"
                                    type="text"
                                    value={parseFloat(info.transform[2][0]).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 2, 0)}
                                  />
                                  <input
                                    id="scale-y"
                                    className="rounded-inspector"
                                    type="text"
                                    value={parseFloat(info.transform[2][1]).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 2, 1)}
                                  />
                                  <input
                                    id="scale-z"
                                    className="rounded-inspector"
                                    type="text"
                                    value={parseFloat(info.transform[2][2]).toFixed(3)}
                                    onChange={(e) => handleTransformChange(e, selectedModel.index, index, 2, 2)}
                                  />
                                </div>
                                <br />
                              </div>
                            )}
                          </>
                        );

                      case info.reactionText.startsWith('Visibility'):
                        return (
                          <>
                            <div className='triggers-div'>
                              <label className='triggers-label' htmlFor={`reaction-${index}`}>
                                  {info.reactionText}_{index}
                              </label>
                            </div>
                            <select 
                                id={`selector-action-${index}`}  
                                className={`select-trigger ${shouldHighlight(index) ? 'highlighted' : ''}`}
                                value={selectedValueVisibility(index)}
                                onChange={(e) => handleVisibilityChange(e, selectedModel.index, index)}
                                title={shouldHighlight(index) ? 'Same as current state' : ''}
                            >
                              <option value="Visible">Visible</option>
                              <option value="Hidden">Hidden</option>
                            </select>
                          </>
                        );

                      default:
                        return (
                          null
                        );
                    }
                  })()}
                </div>
              </div>
            ))}
            </div>
          </div>
          <button type="button" className='delete-button' onClick={showMessageOnDelete}>Delete</button>
        </>
        ) : selectedCamera !== null && selectedCamera !== undefined ? ( 
          <>
          <input
            type="text"
            id="cameraName"
            className="rounded-inspector-name"
            value={tempCameraName}
            onChange={(e) => handleChangeCameraName(e, 'name')}
            onKeyDown={(e) => handleKeyDownCamera(e)}
          />
          <div className='field-container'>
            <div className='fieldCameras'>
              <label htmlFor={`camera-position-${selectedCamera.index}`}>P</label>
              <input
                id={`camera-position-x-${selectedCamera.index}`}
                className='rounded-inspector-camera'
                type="text"
                value={tempPositionC[0]}
                onChange={(e) => handleChangeCamera(e, 0, 'position')}
                onKeyDown={(e) => handleKeyDownCamera(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id={`camera-position-y-${selectedCamera.index}`}
                className='rounded-inspector-camera'
                type="text"
                value={tempPositionC[1]}
                onChange={(e) => handleChangeCamera(e, 1, 'position')}
                onKeyDown={(e) => handleKeyDownCamera(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id={`camera-position-z-${selectedCamera.index}`}
                className='rounded-inspector-camera'
                type="text"
                value={tempPositionC[2]}
                onChange={(e) => handleChangeCamera(e, 2, 'position')}
                onKeyDown={(e) => handleKeyDownCamera(e)}
                maxLength="8"
                autoComplete='off'
              />
            </div>
            <div className='fieldCameras'>
              <label htmlFor={`camera-target-${selectedCamera.index}`}>T</label>
              <input
                id={`camera-target-x-${selectedCamera.index}`}
                className='rounded-inspector-camera'
                type="text"
                value={tempTargetC[0]}
                onChange={(e) => handleChangeCamera(e, 0, 'target')}
                onKeyDown={(e) => handleKeyDownCamera(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id={`camera-target-y-${selectedCamera.index}`}
                className='rounded-inspector-camera'
                type="text"
                value={tempTargetC[1]}
                onChange={(e) => handleChangeCamera(e, 1, 'target')}
                onKeyDown={(e) => handleKeyDownCamera(e)}
                maxLength="8"
                autoComplete='off'
              />
              <input
                id={`camera-target-z-${selectedCamera.index}`}
                className='rounded-inspector-camera'
                type="text"
                value={tempTargetC[2]}
                onChange={(e) => handleChangeCamera(e, 2, 'target')}
                onKeyDown={(e) => handleKeyDownCamera(e)}
                maxLength="8"
                autoComplete='off'
              />
            </div>
          </div>
          <button type="button" className='gotoView-button' onClick={() => debouncedCameraClickHandler(selectedCamera)}>
            <FontAwesomeIcon 
              icon={faCamera} 
            />
          </button>
          <button type="button" className='delete-button' onClick={handleDeleteSelectedCamera}>Delete</button>
        </>
      )
        : ( <span>Select an item for more details...</span>)
      }
      </div>
    </div>
  );
});

export default ObjectData;