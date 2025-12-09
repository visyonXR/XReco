// ImageLoader.js

import React, { useState, useEffect } from 'react';
import DraggableModal from './DraggableModal';
import '../stylesheets/ImageLoader.css';

const ImageLoader = ({ fileImageRef, handleImageUpload, loading, toggleImageLoader }) => {
  
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const uploadImageFromFileButton = () => {
    fileImageRef.current.click();
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    setIsUrlValid(validateUrl(url));
  }, [url]);

  return (
    <DraggableModal 
      title="Image Loader" 
      onClose={toggleImageLoader}
      className='object-Imageloader-container'
      width="420px"
    >
      <div className='field-Imageloader-container'>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='Imageloader-button' 
            onClick={uploadImageFromFileButton}
            >Upload Image from your device</button>
          </div>
          <div className='field'>
            <input
              id="ImageInput"
              ref={fileImageRef}
              type="file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={loading}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
            className='urlLoader-input' 
            type="text" 
            name="urlImageloader" 
            placeholder="Enter Image URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className={`Imageloader-button ${!isUrlValid || loading ? 'disabled' : ''}`}
            onClick={() => handleImageUpload(null, url)}
            disabled={!isUrlValid || loading} 
            >Import Image from URL</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </DraggableModal>
  );
};

export default ImageLoader;
