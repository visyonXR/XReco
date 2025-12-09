// LoginScreen.js
import React, { useState } from 'react';
import NavBarLogin from '.././components/NavBarLogin';
import Login from '.././components/Login';

const LoginScreen = () => {
  const [userName, setUserName] = useState('LOGIN');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #2b2b2b 0%, #1e1e1e 50%, #2b2b2b 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <NavBarLogin userName={userName}/>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
        paddingBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #393939 0%, #2e2e2e 100%)',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #4a4a4a',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          marginBottom: '32px'
        }}>
          <img 
            src="/xrlogo.png" 
            alt="XRCapsule Logo"
            style={{
              width: '280px', 
              height: 'auto',
              display: 'block',
              filter: 'brightness(1.1) contrast(1.1)'
            }} 
          />
        </div>
      </div>
      <Login />
    </div>
  );
};

export default LoginScreen;