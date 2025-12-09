// Login.js

import React, { useState, useEffect, useRef, useCallback} from 'react';
import '../stylesheets/Login.css';
import { useNavigate } from 'react-router-dom';

function PopupLogin({ handleClosePopupLogin, show }) {
  const showHideClassName = show ? 'modalLogin display-block' : 'modalLogin display-none';
  const navigate = useNavigate(); 
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const keycloakUrl = "https://xreco.ari-imet.eu/auth/realms/metasearch/protocol/openid-connect/token";
  const clientId = "metasearch";
  const clientSecret = "JhScOuoKRCyZvSg7yw6sxu8EDO5QJoJd";

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const basketId = queryParams.get('basket_id');
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
  
    if (basketId && accessToken) {
      localStorage.setItem('basket_id', basketId);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }, []);

  useEffect(() => {
    if (show) {
      usernameRef.current.focus();
      // Enable pointer events for login screen
      document.body.style.pointerEvents = 'auto';
      document.body.classList.add('login-active');
    } else {
      // Restore original pointer events
      document.body.style.pointerEvents = '';
      document.body.classList.remove('login-active');
    }
    
    return () => {
      document.body.style.pointerEvents = '';
      document.body.classList.remove('login-active');
    };
  }, [show]);

  const setCookie = (name, value, hours, minutes) => {
    const date = new Date();
    const totalMinutes = (hours * 60) + minutes;
    date.setTime(date.getTime() + (totalMinutes * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const authenticateWithKeycloak = async (username, password) => {
    try {
      const response = await fetch(keycloakUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "password",
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      return data.access_token ? true : false;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  };
  
  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Prevent double submission
    if (isLoading) return;

    // Clear any existing error messages
    setErrorMessage('');
    setIsLoading(true);

    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();

    // Validate input fields
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const isAuthenticated = await authenticateWithKeycloak(username, password);

      if (!isAuthenticated) {
        setErrorMessage('Invalid user credentials');
        usernameRef.current.value = '';
        passwordRef.current.value = '';
        usernameRef.current.focus();
        setIsLoading(false);
        return;
      }

      const userData = { username, password };
      setCookie('userData', JSON.stringify(userData), 1, 0);
      handleClosePopupLogin();
      navigate('/project');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleLabelClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h2 className="h2L">User Authentication</h2>
        <form className='formPopUpL' onSubmit={handleSubmit}>
        {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
          <div>
            <label 
              className='labelPopUpL' 
              htmlFor="username"
              onClick={() => handleLabelClick(usernameRef)}
            >
              Username
            </label>
            <input 
              className='inputPopUpL' 
              type="text" 
              id="username" 
              name="username" 
              autoComplete="off" 
              placeholder='Enter your username' 
              ref={usernameRef}
            />
          </div>

          <div>
            <label 
              className='labelPopUpL' 
              htmlFor="password"
              onClick={() => handleLabelClick(passwordRef)}
            >
              Password
            </label>
            <input 
              className='inputPopUpL' 
              type="password" 
              id="password" 
              name="password" 
              placeholder='Enter your password' 
              autoComplete="off" 
              ref={passwordRef} 
              onKeyDown={handleKeyDown}
            />
          </div>

          <button 
            className="popup-button-inL" 
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </section>
    </div>
  );
}

function Login() {
  const [showPopup, setShowPopup] = useState(true); // Start with popup visible

  const togglePopup = useCallback(() => {
    setShowPopup(prev => !prev);
  }, []);

  return (
    <div>
      <PopupLogin show={showPopup} handleClosePopupLogin={togglePopup} />
    </div>
  );
}

export default Login;
