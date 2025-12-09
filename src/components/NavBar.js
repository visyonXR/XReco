// NavBar.js

import React, { useEffect, useState} from 'react';
import '../stylesheets/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket, faFile, faEye, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function NavBar({
    userName, 
    setUserName, 
    toggleAssetLoader,
    toggleImageLoader,
    toggleVideoLoader,
    toggleAudioLoader,
    toggleJsonLoader,
    toggleObjectData,
    addDynamicCamera,
    onExportSceneDownload,
    onExportSceneClipboard,
    onExportSceneServer,
    onGoHome,
    onToggleTopView,
    onToggleFrontView,
    onToggleSideView,
    onTogglePerspectiveView
}) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [isExportSubmenuOpen, setIsExportSubmenuOpen] = useState(false);
    const [showHomeConfirmModal, setShowHomeConfirmModal] = useState(false);

    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.clear();
        deleteCookie('userData');
        navigate('/login');
    };

    const handleGoHome = () => {
        setShowHomeConfirmModal(true);
    };

    const handleConfirmGoHome = () => {
        setShowHomeConfirmModal(false);
        if (onGoHome) {
            onGoHome();
        } else {
            navigate('/project');
        }
    };

    const handleCancelGoHome = () => {
        setShowHomeConfirmModal(false);
    };

    const toggleMenu = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
        // Reset submenu when toggling main menu
        if (menuName !== 'file') {
            setIsExportSubmenuOpen(false);
        }
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.menu-container')) {
                setActiveMenu(null);
                setIsExportSubmenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
    }, []);

    return (
        <header className="App-header">
            <nav className="navbar">
                <div className="navbar-left">
                    <span className="left-text"><FontAwesomeIcon icon={faUser}/> {userName}</span>
                    <div className="menu-container">
                        <div className="menu-item home-button" onClick={handleGoHome}>
                            <FontAwesomeIcon icon={faHome}/> Home
                        </div>
                        <div className="menu-item" onClick={() => toggleMenu('file')}>
                            <FontAwesomeIcon icon={faFile}/> File
                            {activeMenu === 'file' && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); toggleJsonLoader(); setActiveMenu(null);}}>
                                        Load JSON Scene
                                    </div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); toggleObjectData(); setActiveMenu(null);}}>
                                        Workspace Settings
                                    </div>
                                    <div className="dropdown-item submenu-item" 
                                         onClick={(e) => {e.stopPropagation(); setIsExportSubmenuOpen(!isExportSubmenuOpen);}}>
                                        Export Scene {isExportSubmenuOpen ? '▼' : '▶'}
                                        {isExportSubmenuOpen && (
                                            <div className="submenu">
                                                <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onExportSceneDownload && onExportSceneDownload(); setActiveMenu(null); setIsExportSubmenuOpen(false);}}>
                                                    Download JSON
                                                </div>
                                                <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onExportSceneClipboard && onExportSceneClipboard(); setActiveMenu(null); setIsExportSubmenuOpen(false);}}>
                                                    Copy to Clipboard
                                                </div>
                                                <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onExportSceneServer && onExportSceneServer(); setActiveMenu(null); setIsExportSubmenuOpen(false);}}>
                                                    Save to Server
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="menu-item" onClick={() => toggleMenu('create')}>
                            <FontAwesomeIcon icon={faPlus}/> Create
                            {activeMenu === 'create' && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); toggleAssetLoader(); setActiveMenu(null);}}>
                                        Import Asset
                                    </div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); addDynamicCamera(); setActiveMenu(null);}}>
                                        Add Camera
                                    </div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); toggleImageLoader(); setActiveMenu(null);}}>
                                        Add Image
                                    </div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); toggleVideoLoader(); setActiveMenu(null);}}>
                                        Add Video
                                    </div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); toggleAudioLoader(); setActiveMenu(null);}}>
                                        Add Audio
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="menu-item" onClick={() => toggleMenu('view')}>
                            <FontAwesomeIcon icon={faEye}/> View
                            {activeMenu === 'view' && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onToggleTopView && onToggleTopView(); setActiveMenu(null);}}>Top View</div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onToggleFrontView && onToggleFrontView(); setActiveMenu(null);}}>Front View</div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onToggleSideView && onToggleSideView(); setActiveMenu(null);}}>Side View</div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); onTogglePerspectiveView && onTogglePerspectiveView(); setActiveMenu(null);}}>Perspective</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <span className="right-text" onClick={handleLogOut}>
                    <FontAwesomeIcon icon={faRightFromBracket}/> LOGOUT
                </span>
            </nav>
            
            {/* Home Confirmation Modal */}
            {showHomeConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content home-confirm-modal">
                        <div className="modal-header">
                            <h3>Leave Project?</h3>
                            <button className="modal-close-btn" onClick={handleCancelGoHome}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to leave this project?</p>
                            <p>Any unsaved changes will be lost.</p>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={handleCancelGoHome}>
                                    Stay
                                </button>
                                <button className="btn-confirm" onClick={handleConfirmGoHome}>
                                    Leave Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
export default NavBar;