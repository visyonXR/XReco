// StatusBar.js
import React, { useState, useEffect } from 'react';
import '../stylesheets/StatusBar.css';

const StatusBar = ({ modelFiles, selectedModel, dynamicCameras, loading, loadingProgress, loadingMessage }) => {
  const [sceneStats, setSceneStats] = useState({
    objects: 0,
    vertices: 0,
    faces: 0,
    triangles: 0,
    materials: 0,
    cameras: 0,
    lights: 2, // ambient + point light
    selectedType: null,
    selectedName: null
  });

  useEffect(() => {
    const calculateStats = () => {
      let totalObjects = 0;
      let totalVertices = 0;
      let totalFaces = 0;
      let totalTriangles = 0;
      let totalMaterials = 0;

      // Count different types of objects
      const models = modelFiles.filter(file => file.type === 0); // 3D models
      const images = modelFiles.filter(file => file.type === 1); // Images
      const audio = modelFiles.filter(file => file.type === 2);   // Audio
      const videos = modelFiles.filter(file => file.type === 3);  // Videos

      totalObjects = modelFiles.length;

      // Estimate geometry stats for 3D models
      // In a real implementation, you'd get these from the actual geometry
      models.forEach(model => {
        // Estimate based on file size or provide default values
        totalVertices += 5000; // Default estimate
        totalFaces += 2500;
        totalTriangles += 5000;
        totalMaterials += 3;
      });

      // Selected object info
      const selectedInfo = selectedModel && selectedModel.index >= 0 && selectedModel.index < modelFiles.length ? {
        selectedType: getObjectTypeName(modelFiles[selectedModel.index]?.type),
        selectedName: modelFiles[selectedModel.index]?.name || 'Unnamed'
      } : { selectedType: null, selectedName: null };

      setSceneStats({
        objects: totalObjects,
        vertices: totalVertices,
        faces: totalFaces,
        triangles: totalTriangles,
        materials: totalMaterials,
        cameras: (dynamicCameras?.length || 0) + 1, // +1 for main camera
        lights: 2, // Default lighting setup
        ...selectedInfo
      });
    };

    calculateStats();
  }, [modelFiles, selectedModel, dynamicCameras]);

  const getObjectTypeName = (type) => {
    switch (type) {
      case 0: return '3D Model';
      case 1: return 'Image';
      case 2: return 'Audio';
      case 3: return 'Video';
      default: return 'Object';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="status-bar">
      {/* Progress bar section - shows when loading */}
      {loading && (
        <div className="status-progress-section">
          <div className="status-progress-container">
            <div className="status-progress-text">
              {loadingMessage || 'Loading asset...'}
            </div>
            <div className="status-progress-bar">
              <div 
                className="status-progress-fill" 
                style={{ width: `${loadingProgress || 0}%` }}
              ></div>
            </div>
            <div className="status-progress-percent">
              {Math.round(loadingProgress || 0)}%
            </div>
          </div>
        </div>
      )}
      
      {/* Normal status sections - hidden when loading */}
      {!loading && (
        <>
          <div className="status-section">
            <span className="status-label">Objects:</span>
            <span className="status-value">{sceneStats.objects}</span>
          </div>
          
          <div className="status-separator"></div>
          
          <div className="status-section">
            <span className="status-label">Vertices:</span>
            <span className="status-value">{formatNumber(sceneStats.vertices)}</span>
          </div>
          
          <div className="status-separator"></div>
          
          <div className="status-section">
            <span className="status-label">Faces:</span>
            <span className="status-value">{formatNumber(sceneStats.faces)}</span>
          </div>
          
          <div className="status-separator"></div>
          
          <div className="status-section">
            <span className="status-label">Triangles:</span>
            <span className="status-value">{formatNumber(sceneStats.triangles)}</span>
          </div>
          
          <div className="status-separator"></div>
          
          <div className="status-section">
            <span className="status-label">Materials:</span>
            <span className="status-value">{sceneStats.materials}</span>
          </div>
          
          <div className="status-separator"></div>
          
          <div className="status-section">
            <span className="status-label">Cameras:</span>
            <span className="status-value">{sceneStats.cameras}</span>
          </div>
          
          <div className="status-separator"></div>
          
          <div className="status-section">
            <span className="status-label">Lights:</span>
            <span className="status-value">{sceneStats.lights}</span>
          </div>
          
          {/* Selected object info */}
          {sceneStats.selectedType && (
            <>
              <div className="status-spacer"></div>
              <div className="status-section status-selected status-right">
                <span className="status-label">Selected:</span>
                <span className="status-value">{sceneStats.selectedType}</span>
                {sceneStats.selectedName && (
                  <span className="status-value"> - {sceneStats.selectedName}</span>
                )}
              </div>
            </>
          )}
          
          {/* Version/Build info */}
          <div className="status-spacer"></div>
          <div className="status-section status-right">
            <span className="status-label">XRCapsule</span>
            <span className="status-version">v1.0</span>
          </div>
        </>
      )}
    </div>
  );
};

export default StatusBar;