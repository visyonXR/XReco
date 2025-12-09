// NavBarLogin.js

import React from 'react';
import '../stylesheets/NavBarLogin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function NavBarLogin({userName}) {

    const handleTextClick = () => {
        window.location.reload();
      };

      const handleTextClick2 = () => {
        window.location.reload();
      };

    return (
        <header className="App-headerL">
            <nav className="navbar">
                <span className="left-textL" onClick={handleTextClick}>XRCapsule</span>
                <span className="right-textL" onClick={handleTextClick2}><FontAwesomeIcon icon={faLock}/> {userName}</span>
            </nav>
        </header>
    );
}
export default NavBarLogin;