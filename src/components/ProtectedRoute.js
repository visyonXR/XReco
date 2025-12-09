// ProtectedRoute.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  
  const navigate = useNavigate(); 
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, hours, minutes) => {
    const date = new Date();
    const totalMinutes = (hours * 60) + minutes;
    date.setTime(date.getTime() + (totalMinutes * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const keycloakUrl = "https://xreco.ari-imet.eu/auth/realms/metasearch/protocol/openid-connect/token";
  const clientId = "metasearch";
  const clientSecret = "JhScOuoKRCyZvSg7yw6sxu8EDO5QJoJd";

  const isAuthenticated = () => {
    return Boolean(getCookie('userData'));
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
        throw new Error("Error en la autenticación");
      }

      const data = await response.json();
      return data.access_token ? true : false;
    } catch (error) {
      console.error("Error autenticando con Keycloak:", error);
      return false;
    }
  };

  useEffect(() => {
    if (hasRedirected) return;

    const queryParams = new URLSearchParams(location.search);
    const basketId = queryParams.get('basket_id');
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
    
    if (basketId && accessToken) {
      localStorage.setItem('basket_id', basketId);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      const username = "vision";
      const password = "$Pd=pAJg:D";

      authenticateWithKeycloak(username, password).then((isValid) => {
        if (isValid) {
          setCookie('userData', JSON.stringify({ username, password }), 1, 0);
          setHasRedirected(true);

          if (basketId && accessToken) {
            navigate(`/project?basket_id=${basketId}&access_token=${accessToken}&refresh_token=${refreshToken}`);
          } else {
            navigate('/project');
          }
        } else {
          navigate('/login');
        }
      });
    }
  }, [location, navigate, hasRedirected]);

  if (isAuthenticated() && location.pathname === '/login') {
    return <Navigate to="/project" />;
  }

  if (!isAuthenticated() && location.pathname === '/login') {
    return element;
  }

  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
