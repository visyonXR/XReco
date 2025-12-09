// SceneScreen.js
import React , { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '.././components/NavBar';
import ThreeScene from '.././components/ThreeScene';
import ObjectData from '.././components/ObjectData';
import ObjectData2 from '.././components/ObjectData2';
import AssetData from '../components/AssetData';
import DataContext from '.././components/DataContext';
import ProjectData from '.././components/ProjectData';
import JsonLoader from '.././components/JsonLoader';
import AssetLoader from '.././components/AssetLoader';
import EnvironmentLoader from '.././components/EnvironmentLoader';
import ImageLoader from '.././components/ImageLoader';
import AudioLoader from '.././components/AudioLoader';
import VideoLoader from '.././components/VideoLoader';
import { debounce } from 'lodash';
import JSZip from 'jszip';

export function NotificationModal({ message, handleCloseNotificationModal }) {
  return (
    <div className="notification-modal display-block">
      <section className="notification-main">
        <div className="notification-message">
          <p>{message}</p>
        </div>
        <button className="close-notification" onClick={handleCloseNotificationModal}>Close</button>
      </section>
    </div>
  );
}

export function NotificationModalOnDelete({ messageDel, handleCloseNotificationModalDel, handleDeleteSelectedAsset }) {
  return (
    <div className="notification-modal display-block">
      <section className="notification-main">
        <div className="notification-message">
          <p>{messageDel}</p>
        </div>
        <button className="close-notification" onClick={handleCloseNotificationModalDel}>No</button>
        <button className="close-notification" onClick={handleDeleteSelectedAsset}>Yes</button>
      </section>
    </div>
  );
}

const SceneScreen = () => {

  let { data, updateData } = useContext(DataContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    if(data == null){
      navigate('/project');
    }
  }, []);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const [showNotificationDel, setShowNotificationDel] = useState(false);
  const [notificationMessageDel, setNotificationMessageDel] = useState('');

  const [wData, setWData] = useState(50);
  const [hData, setHData] = useState(50);
  const [dData, setDData] = useState(50);
  const [projectNameData, setProjectNameData] = useState("Project Name");
  const [environmentData, setEnvironmentData] = useState("0");
  const [urlEnvironmentData, setUrlEnvironmentData] = useState(null);
  const [deviceData, setDeviceData] = useState(0);

  let [numberOfItems, setNumberOfItems] = useState(0); // # of models
  const [userName, setUserName] = useState('');

  const [isDataProcessed, setIsDataProcessed] = useState(false);

  const url2JSONFromTable = async () => {
    try {
      const response = await fetch(data.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch JSON. HTTP Status: ${response.status}`);
      }

      const jsonText = await response.text();
      const virtualFile = new File([jsonText], "remote.json", { type: "application/json" });
      const fakeEvent = { target: { files: [virtualFile] } };

      JSONUploaderFunction(fakeEvent);
      setIsDataProcessed(true);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Error");
      }
    }
  };

  const handleItemUpload = (item) => {
    const { type, content } = item;
    if (type === 'model') {
      handleModelUpload(null, content);
    } else if (type === 'audio') {
      handleAudioUpload(null, content);
    } else if (type === 'video') {
      handleVideoUpload(null, content);
    } else if (type === 'image') {
      handleImageUpload(null, content);
    }
  };

  useEffect(() => {
    if (data) {
      if (!isDataProcessed) {
        if (data.dimensions.w && data.dimensions.h && data.projectName) {
          setWData(data.dimensions.w);
          setHData(data.dimensions.h);
          setDData(data.dimensions.d);
          setProjectNameData(data.projectName);
          setEnvironmentData(data.environmentData);
          setUrlEnvironmentData(data.urlEnvironmentData);
          setDeviceData(data.device);
          if(data.url != null){
            url2JSONFromTable();
          }
        }
        else if(data.device){
          setDeviceData(data.device);
        }
        if(data.basketData){
          setNumberOfItems(data.basketData.items.length);
          setUserName(data.basketData.basket_name);
          console.log(data.basketData);
          data.basketData.items.forEach(item => handleItemUpload(item));
        };
      }
    }
  }, [data, isDataProcessed]);
    
  useEffect(() => {
    if (numberOfItems > 0) {
      const timeoutId = setTimeout(() => {
        if (data && data.basketData) {
          let dataName = data.basketData.items[numberOfItems-1].name;
        }
        else{
          
        }
        setNumberOfItems((prevNumberOfItems) => prevNumberOfItems - 1);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [numberOfItems]);

  const [modelFiles, setModelFiles] = useState([]);
  const fileInputFolderRef = useRef(null);
  const fileInputZipRef = useRef(null);
  const fileJSONRef = useRef(null);
  const fileEnvironmentRef = useRef(null);
  const fileImageRef = useRef(null);
  const fileAudioRef = useRef(null);
  const fileVideoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleDeleteSelectedAsset = () => {
    if (selectedModel && selectedModel.index != null) {
      const modelIndex = selectedModel.index;
  
      setModelFiles((prevModelFiles) => {
        const updatedModelFiles = [...prevModelFiles];
        updatedModelFiles.splice(modelIndex, 1);
        return updatedModelFiles;
      });
        setSelectedModel(null);
  
      setModelTriggerInfo((prevTriggerInfo) => {
        const updatedTriggerInfo = { ...prevTriggerInfo };
        delete updatedTriggerInfo[modelIndex];
        return updatedTriggerInfo;
      });
    }
    setShowNotificationDel(false);
  };

  const handleModelUpload = async (input, assetUrl = null) => {
    setLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Preparing asset upload...');
    setIsAssetLoaderVisible(false);
    const formData = new FormData();
    let files = [];
  
    try {
      const selectedFile = input?.target?.files[0];
      if (selectedFile && selectedFile.name.endsWith(".zip")) {
        setLoadingMessage('Extracting ZIP file...');
        setLoadingProgress(10);
        
        const zipFile = input.target.files[0];
        const zipBlob = zipFile.slice(0, zipFile.size);
       
        const zip = await JSZip.loadAsync(zipBlob);
        const fileNames = Object.keys(zip.files);
        
        setLoadingMessage('Processing ZIP contents...');
        setLoadingProgress(25);
  
        for (const fileName of fileNames) {
          const file = zip.files[fileName];
          if (!file.dir) {
            const fileContent = await file.async("blob");
            const fileObject = new File([fileContent], fileName, { type: file._data.date });
  
            formData.append("files", fileObject);
            formData.append("paths", fileName);
          }
        }
      }
      else if (input?.target?.files) {
        setLoadingMessage('Processing files...');
        setLoadingProgress(15);
        
        files = input.target.files;
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
          formData.append("paths", files[i].webkitRelativePath || files[i].name);
        }
      }  
      else if (assetUrl) {
        setLoadingMessage('Downloading asset from URL...');
        setLoadingProgress(10);
        
        const response = await fetch(assetUrl);
        if (!response.ok) throw new Error("Error downloading file");
        
        setLoadingMessage('Processing downloaded asset...');
        setLoadingProgress(30);
  
        const contentType = response.headers.get("content-type");
        const fileNameFromUrl = assetUrl.split('/').pop();
        const fileBlob = await response.blob();
  
        if (assetUrl.endsWith(".zip") || contentType === "application/zip") {
          setLoadingMessage('Extracting downloaded ZIP...');
          setLoadingProgress(40);
          
          const zip = await JSZip.loadAsync(fileBlob);
          const fileNames = Object.keys(zip.files);
  
          for (const fileName of fileNames) {
            const file = zip.files[fileName];
            if (!file.dir) {
              const fileContent = await file.async("blob");
              const fileObject = new File([fileContent], fileName, { type: file._data.date });
  
              formData.append("files", fileObject);
              formData.append("paths", fileName);
            }
          }
        } 
        else if (assetUrl.endsWith(".glb") || assetUrl.endsWith(".gltf") || contentType.includes("model/gltf") || contentType.includes("model/glb")) {
          const glbFile = new File([fileBlob], fileNameFromUrl, { type: contentType });
          formData.append("files", glbFile);
          formData.append("paths", fileNameFromUrl);
        } 
        else {
          throw new Error("Unsupported file format");
        }
      }
  
      if (formData.has("files")) {
        setLoadingMessage('Uploading to server...');
        setLoadingProgress(50);
        
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://flask-xrcapsule.visyon.tech/read_3D_model");
        xhr.responseType = "blob";
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const uploadProgress = 50 + (e.loaded / e.total) * 30; // 50% to 80%
            setLoadingProgress(Math.round(uploadProgress));
            setLoadingMessage('Uploading to server...');
          }
        });
  
        xhr.onload = function () {
          if (xhr.status === 200) {
            setLoadingMessage('Processing 3D model...');
            setLoadingProgress(85);
            
            const processedFile = xhr.response;
            const contentDisposition = xhr.getResponseHeader("Content-Disposition");
            const OriginalFolderName = xhr.getResponseHeader("Original-Folder-Name");
            const TempFolderName = xhr.getResponseHeader("Temp-Folder-Name");
            const fileListString = xhr.getResponseHeader("File-List");
  
            if (contentDisposition) {
              const fileName = contentDisposition.split("filename=")[1].trim();
  
              const randomPosition = [Math.random() * 10 - 5, 1.75, Math.random() * 10 - 5];
              const initialScale = [1, 1, 1];
              const initialRotation = [0, 0, 0];
  
              const assetUUID = TempFolderName;
              const sceneUUID = crypto.randomUUID();
              const triggers = null;
  
              setLoadingMessage('Finalizing asset import...');
              setLoadingProgress(95);
              
              setModelFiles((prevModelFiles) => [
                ...prevModelFiles,
                {
                  file: processedFile,
                  name: OriginalFolderName,
                  fileList: fileListString,
                  urlProcessedFile: `https://flask-xrcapsule.visyon.tech/download_procesed_file/${TempFolderName}/${fileName}`,
                  position: randomPosition,
                  scale: initialScale,
                  rotation: initialRotation,
                  AssetUUID: assetUUID,
                  SceneUUID: sceneUUID,
                  visible: true,
                  triggers: triggers,
                  type: 0,
                },
              ]);
              
              setLoadingMessage('Asset imported successfully!');
              setLoadingProgress(100);
  
              setNotificationMessage(
                "This is a test application, if you want to import your result in JSON format to the Unity application the material will only be available in the next 60 minutes."
              );
              setShowNotification(true);
  
              let fileList = [];
              try {
                fileList = JSON.parse(fileListString);
              } catch (error) {
                console.error("Error parsing File-List:", error);
                return;
              }
  
              if (!Array.isArray(fileList)) {
                console.error("File-List no es un array:", fileList);
              }
            } else {
              console.error("El encabezado Content-Disposition no está presente en la respuesta.");
            }
          } else {
            console.error("Error al cargar el archivo");
            setLoadingMessage('Failed to process asset');
          }
  
          // Reset progress after a short delay to show completion
          setTimeout(() => {
            setLoading(false);
            setLoadingProgress(0);
            setLoadingMessage('');
          }, 1000);
        };
  
        xhr.onerror = function () {
          console.error("Error de red al cargar el archivo.");
          setLoadingMessage('Network error occurred');
          setTimeout(() => {
            setLoading(false);
            setLoadingProgress(0);
            setLoadingMessage('');
          }, 2000);
        };
  
        xhr.send(formData);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoadingMessage('Error processing asset');
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
        setLoadingMessage('');
      }, 2000);
    }
  
    if (input?.target?.value) {
      input.target.value = "";
    }
  };

  const getFileNameFromUrl = (url) => {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/').pop();
  };

  const handleImageUpload = async (event, imageUrl = null) => {
    setLoading(true);
    let file;
    let fileName = "remote_image.jpeg";
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          fileName = getFileNameFromUrl(imageUrl) || fileName;
          file = new File([blob], fileName, { type: "image/jpeg" });
        } else {
          alert("Error downloading the image from the URL.");
          setLoading(false);
          return;
        }
      } catch (error) {
        alert("Error downloading the image from the URL: " + error.message);
        setLoading(false);
        return;
      }
    } else {
      file = event.target.files[0];
      if (!file || !file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        setLoading(false);
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://flask-xrcapsule.visyon.tech/upload/image", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        const fileName = file.name; 
        const randomPositionImage = [Math.random() * 10 - 5, 1.75, Math.random() * 10 - 5];
        const initialScaleImage = [1, 1, 1];
        const initialRotationImage = [0, 0, 0];
        const sceneUUIDImage = crypto.randomUUID();
        const triggersImage = null;
        const imageUrl = data.file_url;
        const assetUUIDImage = data.random_name;
        console.log(data);
  
        setModelFiles((prevModelFiles) => [
          ...prevModelFiles,
          {
            file: file,
            name: fileName,
            fileList: null,
            urlProcessedFile: imageUrl,
            position: randomPositionImage,
            scale: initialScaleImage,
            rotation: initialRotationImage,
            AssetUUID: assetUUIDImage,
            SceneUUID: sceneUUIDImage,
            visible: true,
            triggers: triggersImage,
            type: 1
          },
        ]);
  
        setIsImageLoaderVisible(false);

        setNotificationMessage(
          "This is a test application, if you want to import your result in JSON format to the Unity application the material will only be available in the next 60 minutes."
        );
        setShowNotification(true);
      } else {
        alert(data.error || "Error uploading image");
      }
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (event, audioUrl = null) => {
    setLoading(true);
    let file;
    let fileName = "remote_audio.jpeg";
    if (audioUrl) {
      try {
        const response = await fetch(audioUrl);
        if (response.ok) {
          const blob = await response.blob();
          fileName = getFileNameFromUrl(audioUrl) || fileName;
          file = new File([blob], fileName, { type: "audio/mpeg" });
        } else {
          alert("Error downloading the audio from the URL.");
          setLoading(false);
          return;
        }
      } catch (error) {
        alert("Error downloading the audio from the URL: " + error.message);
        setLoading(false);
        return;
      }
    } else {
      file = event.target.files[0];
      if (!file || (file.type !== "audio/mpeg" && !file.name.endsWith('.mp3'))) {
        alert("Please select a valid MP3 audio file.");
        setLoading(false);
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://flask-xrcapsule.visyon.tech/upload/audio", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        const fileName = file.name;
        const randomPositionAudio = [Math.random() * 10 - 5, 1.75, Math.random() * 10 - 5];
        const initialScaleAudio = [1, 1, 1];
        const initialRotationAudio = [0, 0, 0];
        const sceneUUIDAudio = crypto.randomUUID();
        const triggersAudio = null;
        const audioUrl = data.file_url;
        const assetUUIDAudio = data.random_name;

        setModelFiles((prevModelFiles) => [
          ...prevModelFiles,
          {
            file: file,
            name: fileName,
            fileList: null,
            urlProcessedFile: audioUrl,
            position: randomPositionAudio,
            scale: initialScaleAudio,
            rotation: initialRotationAudio,
            AssetUUID: assetUUIDAudio,
            SceneUUID: sceneUUIDAudio,
            visible: true,
            triggers: triggersAudio,
            type: 2
          },
        ]);
  
        setIsAudioLoaderVisible(false);
        setNotificationMessage(
          "This is a test application, if you want to import your result in JSON format to the Unity application the material will only be available in the next 60 minutes."
        );
        setShowNotification(true);
      } else {
        alert(data.error || "Error uploading audio");
      }
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (event, videoUrl = null) => {
    setLoading(true);
    let file;
    let fileName = "remote_video.mp4";
    if (videoUrl) {
      try {
        const response = await fetch(videoUrl);
        if (response.ok) {
          const blob = await response.blob();
          fileName = getFileNameFromUrl(videoUrl) || fileName;
          file = new File([blob], fileName, { type: "video/mp4" });
        } else {
          alert("Error downloading the video from the URL.");
          setLoading(false);
          return;
        }
      } catch (error) {
        alert("Error downloading the video from the URL: " + error.message);
        setLoading(false);
        return;
      }
    } else {
      file = event.target.files[0];
      if (!file || file.type !== "video/mp4" || !file.name.endsWith('.mp4')) {
        alert("Please select a valid MP4 video file.");
        setLoading(false);
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://flask-xrcapsule.visyon.tech/upload/video", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        const fileName = file.name;
        const randomPositionVideo = [Math.random() * 10 - 5, 1.75, Math.random() * 10 - 5];
        const initialScaleVideo = [1, 1, 1];
        const initialRotationVideo = [0, 0, 0];
        const sceneUUIDVideo = crypto.randomUUID();
        const triggersVideo = null;
        const videoUrl = data.file_url;
        const assetUUIDVideo = data.random_name;

        setModelFiles((prevModelFiles) => [
          ...prevModelFiles,
          {
            file: file,
            name: fileName,
            fileList: null,
            urlProcessedFile: videoUrl,
            position: randomPositionVideo,
            scale: initialScaleVideo,
            rotation: initialRotationVideo,
            AssetUUID: assetUUIDVideo,
            SceneUUID: sceneUUIDVideo,
            visible: true,
            triggers: triggersVideo,
            type: 3
          },
        ]);
  
        setIsVideoLoaderVisible(false);
        setNotificationMessage(
          "This is a test application, if you want to import your result in JSON format to the Unity application the material will only be available in the next 60 minutes."
        );
        setShowNotification(true);
      } else {
        alert(data.error || "Error uploading video");
      }
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setLoading(false);
    }
  };  
  
  const processJSONAssets = async (jsonData) => {
    if (!jsonData || !jsonData.Capsules) {
      console.error("JSON no contiene datos válidos.");
      return;
    }

    setLoading(true);
  
    const newModelFiles = [];
    const newDynamicCameras = [];
    let projectName = null;
    let workspaceVolume = null;
    let env = null;
    let envURL = null;

    for (const capsule of jsonData.Capsules) {
      const assets = capsule.Assets || [];
      const cameras = capsule.Scene?.Cameras || [];
      const objects = capsule.Scene?.Objects || [];
      const triggers = capsule.Scene?.Triggers || [];
      projectName = capsule.Name;
      env = capsule.Workspace.Environment.Name;
      envURL = capsule.Workspace.Environment.SourceURL;
      setEnvironmentData(env);
      setUrlEnvironmentData(envURL);
      setProjectNameData(projectName);

      workspaceVolume = capsule.Workspace.Volume;
      setWData(workspaceVolume?.[0]);
      setHData(workspaceVolume?.[1]);
      setDData(workspaceVolume?.[2]);

      for (const camera of cameras) {
        const cameraData = {
          name: camera.Name || "Unnamed Camera",
          sceneUUID: camera.SceneUUID,
          enabled: camera.Enabled ?? true,
          position: camera.Transform?.Position || [0, 0, 0],
          rotation: camera.Transform?.Rotation || [0, 0, 0],
          followTarget: camera.FollowTarget || { Enabled: false, TargetPosition: [0, 0, 0] },
        };
        newDynamicCameras.push(cameraData);
      }
  
      for (const object of objects) {  
        const matchingAsset = assets.find(asset => asset.AssetUUID === object.AssetUUID);
  
        if (matchingAsset) {
          try {
            const response = await fetch(matchingAsset.SourceURL);
            const blob = await response.blob();
  
            const associatedTriggers = triggers
              .filter(trigger => trigger.SceneTargetUUID === object.SceneUUID)
              .map(trigger => ({
                time: trigger.TriggerParameters?.find(param => param.startsWith("time:"))?.split(": ")[1] || "",
                action: trigger.TriggerParameters?.find(param => param.startsWith("action:"))?.split(": ")[1] || "",
                timeText: "Time",
                actionText: trigger.Type || "",
              }));

              let type = 0;
              if (matchingAsset.SourceURL.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) type = 1;
              if (matchingAsset.SourceURL.match(/\.(mp3|wav|ogg|aac)$/i)) type = 2;
              if (matchingAsset.SourceURL.match(/\.(mp4|webm|avi|mov)$/i)) type = 3;
      
              const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
              const rotation = object.Transform?.Rotation || [0, 0, 0];
              const rotationInRadians = rotation.map(degreesToRadians);

            const newModel = {
              file: blob,
              name: matchingAsset.Name || "Unnamed Asset",
              fileList: null,
              urlProcessedFile: matchingAsset.SourceURL,
              position: object.Transform?.Position || [0, 0, 0],
              scale: object.Transform?.Scale || [1, 1, 1],
              rotation: rotationInRadians,
              AssetUUID: object.AssetUUID,
              SceneUUID: object.SceneUUID,
              visible: object.Visible ?? true,
              triggers: associatedTriggers,
              type: type
            };
  
            newModelFiles.push(newModel);

          } catch (error) {
            console.error(`Error descargando el archivo desde ${matchingAsset.SourceURL}:`, error);
          }
        } else {
          console.warn(`No se encontró un asset coincidente para AssetUUID ${object.AssetUUID} en SceneUUID ${object.SceneUUID}`);
        }
      }
    }

    if (newDynamicCameras.length > 0) {
      const updatedCameras = [];
      newDynamicCameras.forEach(cameraData => {
        updatedCameras.push({
          SceneUUID: cameraData.sceneUUID,
          position: cameraData.position.map(val => parseFloat(val)),
          rotation: cameraData.rotation.map(val => parseFloat(val)),
          target: cameraData.followTarget.TargetPosition.map(val => parseFloat(val)),
          name: cameraData.name,
          index: cameraIdCounter,
        });
        setCameraIdCounter(prevId => prevId + 1);
      });

      setDynamicCameras(prevCameras => [...prevCameras, ...updatedCameras]);
    }
  
    setModelFiles(prevModelFiles => [...prevModelFiles, ...newModelFiles]);

    newModelFiles.forEach((modelFile, index) => {
      if(!modelFile.visible){
        hideModel(index);
      }

      if (modelFile.triggers != null) {
        setModelFiles(prevModelFiles => {
          const updatedModelFiles = [...prevModelFiles];
          updatedModelFiles[index] = {
            ...updatedModelFiles[index],
            triggers: modelFile.triggers
          };
          return updatedModelFiles;
        });
        setModelTriggerInfo(prevTriggerInfo => ({
          ...prevTriggerInfo,
          [index]: modelFile.triggers
        }));
      }
    });

    if (projectName || workspaceVolume || env) {
      updateData(prevData => ({
        ...prevData,
        projectName: projectName,
        dimensions: {
          w: workspaceVolume?.[0],
          h: workspaceVolume?.[1],
          d: workspaceVolume?.[2],
        },
        environmentData: env,
        urlEnvironmentData: envURL
      }));
    }
    setLoading(false);
  };   

  const JSONUploaderFunction = async (event, fileName) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const JSONdata = JSON.parse(e.target.result);
          if(fileName != undefined) {
                updateData(prevData => ({
              ...prevData,          
              JSONFileName: fileName 
            }));
          }
          processJSONAssets(JSONdata);
          setIsJsonLoaderVisible(false);
        } catch (error) {
          console.error("Error parsing JSON", error);
        }
      };
      reader.readAsText(file);
    } else {
      setNotificationMessage(
        "Select a JSON file"
      );
      setShowNotification(true);
    }
  }; 

  const [selectedModel, setSelectedModel] = useState(null);  
  const [selectedCamera, setSelectedCamera] = useState(null);  
  const [hiddenModels, setHiddenModels] = useState([]);
  const [modelTriggerInfo, setModelTriggerInfo] = useState({});

  const hideModel = (modelIndex) => {
      setHiddenModels(prevHiddenModels => {
        if (prevHiddenModels.includes(modelIndex)) {
          setModelFiles(prevModelFiles => {
            const updatedModelFiles = [...prevModelFiles];
            updatedModelFiles[modelIndex] = {
              ...updatedModelFiles[modelIndex],
              visible: true,
            };
            return updatedModelFiles;
          });
          return prevHiddenModels.filter(index => index !== modelIndex);
        } else {
          setModelFiles(prevModelFiles => {
            const updatedModelFiles = [...prevModelFiles];
            updatedModelFiles[modelIndex] = {
              ...updatedModelFiles[modelIndex],
              visible: false,
            };
            return updatedModelFiles;
          });
          return [...prevHiddenModels, modelIndex];
        }
      });
  };

  const [isObjectDataVisible, setIsObjectDataVisible] = useState(false);
  const [isJsonLoaderVisible, setIsJsonLoaderVisible] = useState(false);
  const [isEnvironmentLoaderVisible, setIsEnvironmentLoaderVisible] = useState(false);
  const [isAudioLoaderVisible, setIsAudioLoaderVisible] = useState(false);
  const [isImageLoaderVisible, setIsImageLoaderVisible] = useState(false);
  const [isVideoLoaderVisible, setIsVideoLoaderVisible] = useState(false);
  const [isAssetLoaderVisible, setIsAssetLoaderVisible] = useState(false);

  const toggleObjectData = () => {
    setIsObjectDataVisible(prev => !prev);
  };

  const toggleJsonLoader = () => {
    setIsJsonLoaderVisible((prev) => !prev);
  };

  const toggleEnvironmentLoader = () => {
    setIsEnvironmentLoaderVisible((prev) => !prev);
  };

  const toggleImageLoader = () => {
    setIsImageLoaderVisible((prev) => !prev);
  };

  const toggleAudioLoader = () => {
    setIsAudioLoaderVisible((prev) => !prev);
  };

  const toggleVideoLoader = () => {
    setIsVideoLoaderVisible((prev) => !prev);
  };

  const toggleAssetLoader = () => {
    setIsAssetLoaderVisible((prev) => !prev);
  };

  const handleWidthChange = (newWidth) => {
    setWData(newWidth);
  };

  const handleHeightChange = (newHeight) => {
    setHData(newHeight);
  };

  const handleDepthChange = (newDepth) => {
    setDData(newDepth);
  };

  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [cameraPosition, setCameraPosition] = useState([0, 20, 20]);
  const [orbitCameraPosition, setOrbitCameraPosition] = useState(cameraPosition);
  const [orbitCameraTarget, setOrbitCameraTarget] = useState(targetPosition);
  const [initialCameraRotation, setInitialCameraRotation] = useState([0, 0, 0]);
  const [dynamicCameras, setDynamicCameras] = useState([]);
  const [resetCamera, setResetCamera] = useState(false);
  const [cameraIdCounter, setCameraIdCounter] = useState(0);

  const handleDeleteCamera = (indexToDelete) => {
    setDynamicCameras((prevCameras) => prevCameras.filter((_, index) => index !== indexToDelete));
  };

  // Create ref for ThreeScene to access its view toggle functions
  const threeSceneRef = useRef(null);

  // View toggle handlers for NavBar menu
  const handleToggleTopView = () => {
    if (threeSceneRef.current) {
      threeSceneRef.current.toggleTopView();
    }
  };

  const handleToggleFrontView = () => {
    if (threeSceneRef.current) {
      threeSceneRef.current.toggleFrontView();
    }
  };

  const handleToggleSideView = () => {
    if (threeSceneRef.current) {
      threeSceneRef.current.toggleSideView();
    }
  };

  const handleTogglePerspectiveView = () => {
    if (threeSceneRef.current) {
      threeSceneRef.current.togglePerspectiveView();
    }
  };
  
  const cameraClickHandler = (camera) => {
    // Use smooth transition instead of immediate reset
    const newPosition = camera.currentPosition.map((val) => parseFloat(val));
    const newTarget = camera.currentTarget.map((val) => parseFloat(val));
    
    // Gradually transition to new camera position and target
    const transitionDuration = 1200; // 1.2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = transitionDuration / steps;
    
    const startPosition = [...cameraPosition];
    const startTarget = [...targetPosition];
    
    let currentStep = 0;
    
    const animateCamera = () => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      // Interpolate position and target
      const currentPos = startPosition.map((start, i) => 
        start + (newPosition[i] - start) * easeProgress
      );
      const currentTgt = startTarget.map((start, i) => 
        start + (newTarget[i] - start) * easeProgress
      );
      
      setCameraPosition(currentPos);
      setTargetPosition(currentTgt);
      
      if (currentStep < steps) {
        setTimeout(animateCamera, stepDuration);
      }
    };
    
    animateCamera();
  };

  const addDynamicCamera = () => {
    const SceneUUID = crypto.randomUUID();
    const newCamera = {
      SceneUUID: SceneUUID,
      position: [...orbitCameraPosition],
      rotation: [...initialCameraRotation],
      target: [...orbitCameraTarget],
      name: `Camera ${cameraIdCounter+1}`,
      index: cameraIdCounter,
    };
    setDynamicCameras((prevCameras) => [...prevCameras, newCamera]);
    setCameraIdCounter((prevId) => prevId + 1);
  };

  const updatePositionRotationCamera = (index, newPosition, newRotation) => {
    setDynamicCameras(prevCameras =>
      prevCameras.map(camera =>
        camera.index === index ? { ...camera, position: newPosition, rotation: newRotation } : camera
      )
    );
  };

  // Export functions for NavBar menu
  const radiansToDegrees = (radians) => radians * (180 / Math.PI);

  const generateJson = (modelFiles, data) => {
    if(data == null){
      const projectName = projectNameData;
      const device = deviceData.toString();
      const deviceText = "Augmented Reality";
      const dimensionW = wData;
      const dimensionH = hData;
      const dimensionD = dData;
      const units = "Meters";
      
      data = {
        projectName,
        device,
        deviceText,
        units,
        dimensions: { w: dimensionW, h: dimensionH, d: dimensionD },
        environmentData,
        urlEnvironmentData
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

  const handleExportSceneDownload = () => {
    const jsonString = generateJson(modelFiles, data);
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

  const handleExportSceneClipboard = () => {
    const jsonString = generateJson(modelFiles, data);
    navigator.clipboard.writeText(jsonString).then(() => {
      setNotificationMessage('JSON copied to clipboard');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    });
  };

  const handleExportSceneServer = () => {
    const fileName = data?.JSONFileName || `XRCapsule_${Date.now()}.json`;
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

  const handleGoHome = () => {
    // Clear the current data context and navigate to project selection
    updateData(null);
    navigate('/project');
  };

  const [environmentFile, setEnvironmentFile] = useState(null);
  const EnvironmentUploaderFunction = async (event, fileName) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/x-hdr" || file.name.endsWith('.hdr'))) {
      setEnvironmentFile(file);
    } else {
      alert("Please select a valid HDR file.");
    }
  };

  const debouncedCloseNotification = debounce(() => setShowNotification(false), 100); 
  const debouncedCloseNotificationDel = debounce(() => setShowNotificationDel(false), 100); 

  return (
    <div>
      <NavBar 
        userName={userName} 
        setUserName={setUserName}
        toggleAssetLoader={toggleAssetLoader}
        toggleImageLoader={toggleImageLoader}
        toggleVideoLoader={toggleVideoLoader}
        toggleAudioLoader={toggleAudioLoader}
        toggleJsonLoader={toggleJsonLoader}
        toggleObjectData={toggleObjectData}
        addDynamicCamera={addDynamicCamera}
        onExportSceneDownload={handleExportSceneDownload}
        onExportSceneClipboard={handleExportSceneClipboard}
        onExportSceneServer={handleExportSceneServer}
        onGoHome={handleGoHome}
        onToggleTopView={handleToggleTopView}
        onToggleFrontView={handleToggleFrontView}
        onToggleSideView={handleToggleSideView}
        onTogglePerspectiveView={handleTogglePerspectiveView}
      />      
      <div className='contenedor-canvas'>
        <AssetData 
          hideModel={hideModel} 
          hiddenModels={hiddenModels} 
          modelFiles={modelFiles}
          setSelectedModel={setSelectedModel}
          setSelectedCamera={setSelectedCamera}
          dynamicCameras={dynamicCameras}
        />
        <ProjectData 
          projectNameData={projectNameData} 
          modelFiles={modelFiles} 
          loading={loading} 
          onToggleObjectData={toggleObjectData} 
          data={data}
          toggleJsonLoader={toggleJsonLoader}
          toggleAssetLoader={toggleAssetLoader}
          addDynamicCamera={addDynamicCamera}
          toggleEnvironmentLoader={toggleEnvironmentLoader}
          toggleImageLoader={toggleImageLoader}
          toggleAudioLoader={toggleAudioLoader}
          toggleVideoLoader={toggleVideoLoader}
          setNotificationMessage={setNotificationMessage}
          setShowNotification={setShowNotification}
          dynamicCameras={dynamicCameras}
        />
        <ThreeScene 
          ref={threeSceneRef}
          hiddenModels={hiddenModels} 
          height={hData} 
          width={wData}
          depth={dData}
          deviceData={deviceData} 
          modelFiles={modelFiles} 
          setModelFiles={setModelFiles}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          targetPosition={targetPosition}
          cameraPosition={cameraPosition}
          setOrbitCameraPosition={setOrbitCameraPosition}
          setOrbitCameraTarget={setOrbitCameraTarget}
          dynamicCameras={dynamicCameras}
          resetCamera={resetCamera}
          updatePositionRotationCamera={updatePositionRotationCamera}
          environmentFile={environmentFile}
          environmentData={environmentData}
          setModelTriggerInfo={setModelTriggerInfo}
          selectedCamera={selectedCamera}
          setSelectedCamera={setSelectedCamera}
          loading={loading}
          loadingProgress={loadingProgress}
          loadingMessage={loadingMessage}
        />
        <ObjectData 
          selectedModel={selectedModel} 
          setSelectedModel={setSelectedModel}
          selectedCamera={selectedCamera}
          setSelectedCamera={setSelectedCamera}
          modelFiles={modelFiles} 
          setModelFiles={setModelFiles}
          modelTriggerInfo={modelTriggerInfo}
          setModelTriggerInfo={setModelTriggerInfo}
          setDynamicCameras={setDynamicCameras}
          cameraClickHandler={cameraClickHandler}
          handleDeleteCamera={handleDeleteCamera}
          hiddenModels={hiddenModels}
          setNotificationMessageDel={setNotificationMessageDel}
          setShowNotificationDel={setShowNotificationDel}
        />
        {isObjectDataVisible && 
        <ObjectData2 
          heightTS={hData} 
          widthTS={wData} 
          depthTS={dData} 
          onWidthChange={handleWidthChange} 
          onHeightChange={handleHeightChange} 
          onDepthChange={handleDepthChange} 
          data={data} 
          onToggleObjectData={toggleObjectData}
        />}
        {isAssetLoaderVisible && 
        <AssetLoader 
          fileInputFolderRef={fileInputFolderRef}
          fileInputZipRef={fileInputZipRef}
          handleModelUpload={handleModelUpload}
          loading={loading}
          toggleAssetLoader={toggleAssetLoader}
        />}
        {isImageLoaderVisible && 
        <ImageLoader 
          fileImageRef={fileImageRef}
          handleImageUpload={handleImageUpload} 
          loading={loading} 
          toggleImageLoader={toggleImageLoader}
        />}
        {isAudioLoaderVisible && 
        <AudioLoader 
          fileAudioRef={fileAudioRef}
          handleAudioUpload={handleAudioUpload} 
          loading={loading} 
          toggleAudioLoader={toggleAudioLoader}
        />}
        {isVideoLoaderVisible && 
        <VideoLoader 
          fileVideoRef={fileVideoRef}
          handleVideoUpload={handleVideoUpload} 
          loading={loading} 
          toggleVideoLoader={toggleVideoLoader}
        />}
        {isJsonLoaderVisible && 
        <JsonLoader 
          fileJSONRef={fileJSONRef}
          JSONUploaderFunction={JSONUploaderFunction} 
          loading={loading} 
          toggleJsonLoader={toggleJsonLoader}
        />}
        {isEnvironmentLoaderVisible && 
        <EnvironmentLoader 
          fileEnvironmentRef={fileEnvironmentRef}
          EnvironmentUploaderFunction={EnvironmentUploaderFunction} 
          loading={loading} 
        />}
      </div>
      {showNotification && 
      <NotificationModal 
        message={notificationMessage} 
        handleCloseNotificationModal={debouncedCloseNotification} 
      />}
      {showNotificationDel && 
      <NotificationModalOnDelete
        messageDel={notificationMessageDel} 
        handleCloseNotificationModalDel={debouncedCloseNotificationDel}
        handleDeleteSelectedAsset={handleDeleteSelectedAsset}
      />}
    </div>
  );
};

export default SceneScreen;
