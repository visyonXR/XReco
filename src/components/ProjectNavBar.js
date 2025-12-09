// ProjectNavBar.js

import React, { useEffect } from 'react';
import '../stylesheets/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function ProjectNavBar({ userName, setUserName }) {
    const navigate = useNavigate();

    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleLogOut = () => {
        localStorage.clear();
        deleteCookie('userData');
        navigate('/login');
    };

    useEffect(() => {
        const userData = getCookie('userData');
        if (userData) {
            try {
                const { username } = JSON.parse(userData);
                setUserName(username || '');
            } catch (e) {
                setUserName('');
            }
        }
    }, [setUserName]);

    return (
        <header className="App-header">
            <nav className="navbar">
                <div className="navbar-left">
                    <span className="left-text"><FontAwesomeIcon icon={faUser}/> {userName}</span>
                </div>
                <span className="right-text" onClick={handleLogOut}>
                    <FontAwesomeIcon icon={faRightFromBracket}/> LOGOUT
                </span>
            </nav>
        </header>
    );
}

export default ProjectNavBar;
