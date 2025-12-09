// VideoLoader.js

import React, { useState, useEffect } from 'react';
import DraggableModal from './DraggableModal';
import '../stylesheets/VideoLoader.css';

const VideoLoader = ({ fileVideoRef, handleVideoUpload, loading, toggleVideoLoader }) => {
  
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const uploadVideoFromFileButton = () => {
    fileVideoRef.current.click();
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

  useEffect(() => {
    setIsUrlValid(validateUrl(url));
  }, [url]);

  return (
    <DraggableModal 
      title="Video Loader" 
      onClose={toggleVideoLoader}
      className='object-VideoLoader-container'
      width="420px"
    >
      <div className='field-VideoLoader-container'>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='VideoLoader-button' 
            onClick={uploadVideoFromFileButton}
            >Upload Video from your device</button>
          </div>
          <div className='field'>
            <input
              id="VideoInput"
              ref={fileVideoRef}
              type="file"
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
              disabled={loading}
              accept=".mp4,video/mp4"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
            className='urlLoader-input' 
            type="text" 
            name="urlVideoLoader" 
            placeholder="Enter Video URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            disabled={loading} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className={`VideoLoader-button ${!isUrlValid || loading ? 'disabled' : ''}`}
            onClick={() => handleVideoUpload(null, url)}
            disabled={!isUrlValid || loading} 
            >Import Video from URL</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </DraggableModal>
  );
};

export default VideoLoader;
