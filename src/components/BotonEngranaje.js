// BotonEngranaje.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import '../stylesheets/BotonEngranaje.css';

const BotonEngranaje = ({ onClick }) => {
  return (
    <div className="boton-engranaje" onClick={onClick}>
      <FontAwesomeIcon icon={faCog} />
    </div>
  );
};

export default BotonEngranaje;
