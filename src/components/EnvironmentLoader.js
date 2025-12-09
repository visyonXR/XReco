// EnvironmentLoader.js

import React, { useState, useEffect } from 'react';
import '../stylesheets/EnvironmentLoader.css';

const EnvironmentLoader = ({ fileEnvironmentRef, EnvironmentUploaderFunction, loading }) => {
  
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const uploadEnvironmentFromFileButton = () => {
    fileEnvironmentRef.current.click();
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const importEnvironmentFromURLButton = async () => {
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
        throw new Error(`Failed to fetch Environment. HTTP Status: ${response.status}`);
      }

      const EnvironmentText = await response.text();
      const virtualFile = new File([EnvironmentText], "remote.Environment.hdr", { type: "application/x-hdr" });
      const fakeEvent = { target: { files: [virtualFile] } };
      const fileName = url.substring(url.lastIndexOf("/") + 1);

      EnvironmentUploaderFunction(fakeEvent, fileName);
    } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timed out.');
        } else {
          setError(`Error fetching Environment: ${err.message}`);
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
      EnvironmentUploaderFunction(event, fileName);
    }
  };

  return (
    <div className='object-Environmentloader-container'>
      <h3>Environment Loader</h3>
      <hr style={{ borderColor: '#3a3e47', marginTop: '20px'}} />
      <div className='field-Environmentloader-container'>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className='Environmentloader-button' 
            onClick={uploadEnvironmentFromFileButton}
            >Upload Environment from your device</button>
          </div>
          <div className='field'>
            <input
              id="EnvironmentInput"
              ref={fileEnvironmentRef}
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={loading}
              accept=".hdr,application/x-hdr"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
            className='urlLoader-input' 
            type="text" 
            name="urlEnvironmentloader" 
            placeholder="Enter Environment URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            disabled={loading} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
            type="button" 
            className={`Environmentloader-button ${!isUrlValid || loading ? 'disabled' : ''}`}
            onClick={importEnvironmentFromURLButton}
            disabled={!isUrlValid || loading} 
            >Import Environment from URL</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default EnvironmentLoader;
