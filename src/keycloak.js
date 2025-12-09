// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'react-realm',
  clientId: 'react-three-fiber-app',
});

export default keycloak;
