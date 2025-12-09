// JsonLoader.js

import React, { useState, useEffect } from 'react';
import DraggableModal from './DraggableModal';
import '../stylesheets/JsonLoader.css';

const JsonLoader = ({ fileJSONRef, JSONUploaderFunction, loading, toggleJsonLoader }) => {
  
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const uploadJsonFromFileButton = () => {
    fileJSONRef.current.click();
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const importJsonFromURLButton = async () => {
    setError(null);
    if (!url.trim()) {
      setError('URL cannot be empty.');
      return;
    }

    try {
      new URL(url);
    } catch (err) {
      setError('Invalid URL format.');
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const timeout = setTimeout(() => {
      controller.abort();
      setError('Request timed out.');
    }, 5000);
  

    try {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`Failed to fetch JSON. HTTP Status: ${response.status}`);
      }

      const jsonText = await response.text();
      const virtualFile = new File([jsonText], "remote.json", { type: "application/json" });
      const fakeEvent = { target: { files: [virtualFile] } };
      const fileName = url.substring(url.lastIndexOf("/") + 1);

      JSONUploaderFunction(fakeEvent, fileName);
    } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timed out.');
        } else {
          setError(`Error fetching JSON: ${err.message}`);
        }
      } finally {
        clearTimeout(timeout);
      }
  };

  useEffect(() => {
    setIsUrlValid(validateUrl(url));
  }, [url]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name; 
      JSONUploaderFunction(event, fileName);
    }
  };

  return (
    <DraggableModal 
      title="JSON Loader" 
      onClose={toggleJsonLoader}
      className='object-jsonloader-container'
      width="420px"
    >
      <div className='field-jsonloader-container'>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='jsonloader-button' 
            onClick={uploadJsonFromFileButton}
            >Upload JSON from your device</button>
          </div>
          <div className='field'>
            <input
              id="jsonInput"
              ref={fileJSONRef}
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={loading}
              accept="application/json"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
            className='urlLoader-input' 
            type="text" 
            name="urljsonloader" 
            placeholder="Enter JSON URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            disabled={loading} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className={`jsonloader-button ${!isUrlValid || loading ? 'disabled' : ''}`}
            onClick={importJsonFromURLButton}
            disabled={!isUrlValid || loading} 
            >Import JSON from URL</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </DraggableModal>
  );
};

export default JsonLoader;
