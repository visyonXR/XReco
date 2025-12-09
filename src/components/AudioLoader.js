// AudioLoader.js

import React, { useState, useEffect } from 'react';
import DraggableModal from './DraggableModal';
import '../stylesheets/AudioLoader.css';

const AudioLoader = ({ fileAudioRef, handleAudioUpload, loading, toggleAudioLoader }) => {
  
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const uploadAudioFromFileButton = () => {
    fileAudioRef.current.click();
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
      title="Audio Loader" 
      onClose={toggleAudioLoader}
      className='object-Audioloader-container'
      width="420px"
    >
      <div className='field-Audioloader-container'>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='Audioloader-button' 
            onClick={uploadAudioFromFileButton}
            >Upload Audio from your device</button>
          </div>
          <div className='field'>
            <input
              id="AudioInput"
              ref={fileAudioRef}
              type="file"
              onChange={handleAudioUpload}
              style={{ display: 'none' }}
              disabled={loading}
              accept=".mp3,audio/mpeg"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
            className='urlLoader-input' 
            type="text" 
            name="urlAudioloader" 
            placeholder="Enter Audio URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            disabled={loading} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className={`Audioloader-button ${!isUrlValid || loading ? 'disabled' : ''}`}
            onClick={() => handleAudioUpload(null, url)}
            disabled={!isUrlValid || loading} 
            >Import Audio from URL</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </DraggableModal>
  );
};

export default AudioLoader;
