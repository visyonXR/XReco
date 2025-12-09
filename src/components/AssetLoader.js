// AssetLoader.js

import React from 'react';
import DraggableModal from './DraggableModal';
import '../stylesheets/AssetLoader.css';

const AssetLoader = ({ fileInputFolderRef, fileInputZipRef, handleModelUpload, loading, toggleAssetLoader }) => {
  
  const uploadFileFromLocalFolderButton = () => {
    fileInputFolderRef.current.click();
  };

    
  const uploadFileFromLocalZipButton = () => {
    fileInputZipRef.current.click();
  };

  return (
    <DraggableModal 
      title="Asset Loader" 
      onClose={toggleAssetLoader}
      className='object-assetloader-container'
      width="420px"
    >
      <div className='field-assetloader-container'>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='assetloader-button' 
            onClick={uploadFileFromLocalFolderButton}
            >Upload Asset from device folder</button>
          </div>
          <div className='field'>
            <input
              ref={fileInputFolderRef}
              type="file"
              multiple
              webkitdirectory="true"
              directory="true"
              onChange={handleModelUpload}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='assetloader-button' 
            onClick={uploadFileFromLocalZipButton}
            >Upload Asset from device ZIP</button>
          </div>
          <div className='field'>
            <input
              ref={fileInputZipRef}
              type="file"
              accept=".zip"
              onChange={handleModelUpload}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='assetloader-button' 
            >Import Asset from XRECO NMR</button>
          </div>
        </form>
      </div>
    </DraggableModal>
  );
};

export default AssetLoader;
