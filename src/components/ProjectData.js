// ProjectData.js

import React, { useState } from 'react';
import '../stylesheets/ProjectData.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCubes, faCog, faHouse, faFileCode, faSave, faCamera, faSeedling, faFileImage, faFileAudio, faFileVideo } from '@fortawesome/free-solid-svg-icons';
import { NotificationModal } from './../screens/SceneScreen';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

function Popup2({ handleClosePopup2, show, jsonString}) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0].replace(/-/g, '');
    
    a.href = url;
    a.download = `XRCapsule_${dateString}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotificationMessage('JSON downloaded successfully');
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setNotificationMessage('JSON copied to clipboard');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    });
  };

  const showHideClassName = show ? 'modal-json display-block' : 'modal-json display-none';

  return (
    <div>
      <div className={showHideClassName}>
        <section className="modal-main">
          <div className="close-button-PuP" onClick={handleClosePopup2}>
            <FontAwesomeIcon style={{ fontSize: '16px' }} icon={faTimes} />
          </div>
          <h3>Code</h3>
          <textarea id="JsonUnityCode"
            rows={20}
            value={jsonString}
            spellCheck="false"
            readOnly
          />
          <div className="button-json-container">
            <button className="download-json-button" onClick={handleDownloadJson}>Download JSON</button>
            <button className="download-json-button" onClick={copyJsonToClipboard}>Copy to Clipboard</button>
          </div>
        </section>
      </div>
      {showNotification && <NotificationModal message={notificationMessage} handleClosePopup2={() => setShowNotification(false)} />}
    </div>
  );
}


function ConfirmationModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="notification-modal display-block">
      <section className="notification-main">
        <div className="notification-message">
          <p>{message}</p>
        </div>
        <button className="close-notification" onClick={onCancel}>No</button>
        <button className="close-notification" onClick={onConfirm}>Yes</button>
      </section>
    </div>
  );
}


const ProjectData = ({ projectNameData, modelFiles, loading, onToggleObjectData, data, toggleJsonLoader, toggleAssetLoader, addDynamicCamera, toggleEnvironmentLoader,
  toggleAudioLoader, toggleVideoLoader, toggleImageLoader, setNotificationMessage, setShowNotification, dynamicCameras
}) => {
  const [showPopup2, setShowPopup2] = useState(false);
  const navigate = useNavigate(); 
  const [jsonString, setJsonString] = useState('');
  const radiansToDegrees = (radians) => radians * (180 / Math.PI);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigateToProject = async () => {
    const hasChanged = await checkIfJsonChanged();
    if (hasChanged) {
      setShowConfirmModal(true);
    } else {
      navigate('/project');
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    navigate('/project');
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };

  const generateJson = (modelFiles, data) => {
    if(data == null){
      const projectName = "Project Name";
      const device = "0";
      const deviceText = "Augmented Reality";
      const dimensionW = 25;
      const dimensionH = 25;
      const dimensionD = 25;
      const units = "Meters";
      
      data = {
        projectName,
        device,
        deviceText,
        units,
        dimensions: { w: dimensionW, h: dimensionH, d: dimensionD },
      };
    }
    const deviceMap = {
      0: "Blank",
      1: "Smartphone AR",
      2: "Smartphone 3D Viewer",
      3: "Quest 3 AR",
      4: "Infographics",
      5: "Virtual Production",
    };
    const typeMap = {
      0: "3D.Model",
      1: "Image",
      2: "Audio",
      3: "Video",
    };
    const capsules = [{
      Name: data.projectName,
      TargetDevices: deviceMap[data.device] ,
      Workspace: {
        Volume: [data.dimensions.w, data.dimensions.h, data.dimensions.d],
        Unit: data.units,
        Environment: {
          Name: data.environmentData,
          Type: "HDRi",
          SourceURL: data.urlEnvironmentData
        }
      },
      Assets: modelFiles.map((file) => ({
        AssetUUID: file.AssetUUID,
        Name: file.name,
        Type: typeMap[file.type],
        SourceURL: file.urlProcessedFile,
        Metadata: {
          XReco: {
            Notes: "Processor Service",
            BoundingBox: [1.0, 1.0, 1.0],
            Polygons: 0,
            Resolution: null,
          },
        },
      })),

      Scene: {
        Cameras: dynamicCameras.map((camera) => ({
          Name: camera.name,
          SceneUUID: camera.SceneUUID,
          Enabled: true,
          Transform: {
            Position: [
              parseFloat(camera.position[0]).toFixed(3),
              parseFloat(camera.position[1]).toFixed(3),
              parseFloat(camera.position[2]).toFixed(3),
            ],
            Rotation: [
              radiansToDegrees(parseFloat(camera.rotation[0])).toFixed(3),
              radiansToDegrees(parseFloat(camera.rotation[1])).toFixed(3),
              radiansToDegrees(parseFloat(camera.rotation[2])).toFixed(3),
            ],
          },
          FollowTarget: {
            Enabled: true,
            TargetPosition: [
              parseFloat(camera.target[0]).toFixed(3),
              parseFloat(camera.target[1]).toFixed(3),
              parseFloat(camera.target[2]).toFixed(3),
            ]
          },
        })),
        Objects: modelFiles.map((file) => ({
          Name: file.name || "Unnamed Object",
          AssetUUID: file.AssetUUID || "",
          SceneUUID: file.SceneUUID || "",
          Visible: file.visible !== undefined ? file.visible : true,
          Enabled: true,
          Transform: {
            Position: [
              parseFloat((file.position && file.position[0]) || 0).toFixed(3),
              parseFloat((file.position && file.position[1]) || 0).toFixed(3),
              parseFloat((file.position && file.position[2]) || 0).toFixed(3),
            ],
            Rotation: [
              radiansToDegrees(parseFloat((file.rotation && file.rotation[0]) || 0)).toFixed(3),
              radiansToDegrees(parseFloat((file.rotation && file.rotation[1]) || 0)).toFixed(3),
              radiansToDegrees(parseFloat((file.rotation && file.rotation[2]) || 0)).toFixed(3),
            ],
            Scale: [
              parseFloat((file.scale && file.scale[0]) || 1).toFixed(3),
              parseFloat((file.scale && file.scale[1]) || 1).toFixed(3),
              parseFloat((file.scale && file.scale[2]) || 1).toFixed(3),
            ],
          },
        })),
        Triggers: modelFiles
          .filter(file => file.triggers && Array.isArray(file.triggers) && file.triggers.length > 0)
          .flatMap(file => 
            file.triggers.map(trigger => ({
              Type: `${trigger.actionText || trigger.Type || ''} - ${trigger.reactionText || ''}`,
              TriggerParameters: [
                ...(trigger.actionText && trigger.actionText.startsWith('Time') ? [
                  `action: ${trigger.actionText}`,
                  `timeValue: ${trigger.timeValue || '0'}`
                ] : []),
                ...(trigger.actionText && trigger.actionText.startsWith('Touch') ? [
                  `action: ${trigger.actionText}`,
                  `timeValue: ${trigger.timeValue || '0'}`
                ] : []),
                ...(trigger.reactionText && trigger.reactionText.startsWith('Transform') ? [
                  `reaction: ${trigger.reactionText}`,
                  `transform: ${JSON.stringify(trigger.transform || [])}`
                ] : []),
                ...(trigger.reactionText && trigger.reactionText.startsWith('Visibility') ? [
                  `reaction: ${trigger.reactionText}`,
                  `visibility: ${trigger.visibility || 'true'}`
                ] : []),
              ],
              SceneTargetUUID: file.SceneUUID || "",
              OnActivate: ''
            }))
          ),
      },
    }];

    return JSON.stringify({
      "$schema": "https://xrcapsule.visyon.tech/schema#",
      "Metadata": {
        "FileVersion": "0.0.2",
        "XRCapsuleEditorVersion": "1.0.0"
      },
      "Capsules": capsules
    }, null, 2);
  };

  const togglePopup2 = () => {
    console.log(modelFiles);
    console.log(data);
    const json = generateJson(modelFiles, data);
    setJsonString(json);
    setShowPopup2(!showPopup2);
  };

  const saveJSONFile2Server = () => {
    const fileName = data.JSONFileName;
    const jsonString = generateJson(modelFiles, data);
  
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    const formData = new FormData();
    formData.append("file", blob, fileName); 
  
    fetch('https://flask-xrcapsule.visyon.tech/upload_json', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        setNotificationMessage(
          "Project saved successfully"
        );
        setShowNotification(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        setNotificationMessage(
          "There was an error saving the project"
        );
        setShowNotification(true);
      });
  };

  const handleCameraViewClick = () => {
    addDynamicCamera();
  };

  const debouncedToggleAssetLoader = debounce(toggleAssetLoader, 100);
  const debouncedToggleImageLoader = debounce(toggleImageLoader, 100);
  const debouncedToggleAudioLoader = debounce(toggleAudioLoader, 100);
  const debouncedToggleVideoLoader = debounce(toggleVideoLoader, 100);
  const debouncedToggleJsonLoader = debounce(toggleJsonLoader, 100);
  const debouncedHandleCameraViewClick = debounce(handleCameraViewClick, 100);
  const debouncedOnToggleObjectData = debounce(onToggleObjectData, 100);
  const debouncedSaveJSONFile2Server = debounce(saveJSONFile2Server, 100);

  const checkIfJsonChanged = async () => {
    const currentJson = generateJson(modelFiles, data);

    try {
      const response = await fetch(`https://flask-xrcapsule.visyon.tech/json_file/${data.JSONFileName}`);
      if (!response.ok) throw new Error("Failed to fetch saved JSON");

      const serverJsonText = await response.text();

      return serverJsonText.trim() !== currentJson.trim();
    } catch (error) {
      console.error("Error comparing JSON:", error);
      return true;
    }
  };

  return (
    <div className='contenedor-form'>
      <div className="boton-persIcon-container">
        <div className="boton-persIcon" onClick={navigateToProject} title="Home">
          <FontAwesomeIcon icon={faHouse} />
        </div>
          <div className="boton-persIcon" onClick={debouncedToggleAssetLoader} title="Upload 3D Model">
            <FontAwesomeIcon icon={faCubes} />
          </div>
          <div className="boton-persIcon" onClick={debouncedToggleImageLoader} title="Upload Image">
            <FontAwesomeIcon icon={faFileImage} />
          </div>
          <div className="boton-persIcon" onClick={debouncedToggleAudioLoader} title="Upload Audio">
            <FontAwesomeIcon icon={faFileAudio} />
          </div>
          <div className="boton-persIcon" onClick={debouncedToggleVideoLoader} title="Upload Video">
            <FontAwesomeIcon icon={faFileVideo} />
          </div>
          <div className="boton-persIcon" onClick={debouncedToggleJsonLoader} title="Upload JSON">
            <FontAwesomeIcon icon={faFileCode} />
          </div>
          {/*<div className="boton-persIcon" title="Upload Environment">
            <FontAwesomeIcon icon={faSeedling} />
          </div>*/}
        {loading && <div className="loader"></div>}
        <ConfirmationModal
          show={showConfirmModal}
          message="You have unsaved changes. If you leave, all changes will be lost. Are you sure you want to continue?"          onConfirm={handleConfirmNavigation}
          onCancel={handleCancelNavigation}
        />
      </div>
      <div className="nombre-proyecto-container">
        <div className="nombre-proyecto">{projectNameData}</div>
      </div>
      <div className="button-code-container">
        <div className="boton-persIcon" onClick={debouncedHandleCameraViewClick} title="CameraView">
          <FontAwesomeIcon icon={faCamera} />
        </div>
        <div className="boton-persIcon" onClick={debouncedOnToggleObjectData} title="Settings">
          <FontAwesomeIcon icon={faCog} />
        </div>
        <div className="boton-persIcon" onClick={debouncedSaveJSONFile2Server} title="Save">
          <FontAwesomeIcon icon={faSave} />
        </div>
        <button onClick={togglePopup2} title="Code" className="button-code"> &lt; / &gt; Code </button>
      </div>
      <Popup2
        show={showPopup2}
        handleClosePopup2={togglePopup2}
        data={data}
        modelFiles={modelFiles}
        jsonString={jsonString}
      />
    </div>
  );
};

export default ProjectData;