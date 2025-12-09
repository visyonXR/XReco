// DraggableModal.js

import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DraggableModal = ({ title, onClose, children, className, width = '400px' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  // Handle dragging functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.modal-close-button')) return; // Don't drag when clicking close button
    
    const rect = modalRef.current.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    setDragOffset({
      x: e.clientX - (centerX + position.x),
      y: e.clientY - (centerY + position.y)
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const newX = e.clientX - dragOffset.x - centerX;
    const newY = e.clientY - dragOffset.y - centerY;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
    background: 'linear-gradient(145deg, #393939 0%, #2e2e2e 100%)',
    color: '#e0e0e0',
    padding: 0,
    borderRadius: '8px',
    border: '1px solid #4a4a4a',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    zIndex: 9999,
    width: width,
    maxWidth: '90vw',
    animation: 'modalFadeIn 0.3s ease-out',
    userSelect: 'none',
    cursor: isDragging ? 'grabbing' : 'default'
  };

  const headerStyle = {
    padding: '16px 20px',
    background: 'linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 100%)',
    borderBottom: '1px solid #2a2a2a',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  const titleStyle = {
    margin: 0,
    color: '#e0e0e0',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px'
  };

  const closeButtonStyle = {
    background: 'linear-gradient(145deg, #6a6a6a 0%, #5a5a5a 100%)',
    border: '1px solid #4a4a4a',
    borderRadius: '3px',
    color: '#e0e0e0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: '10px',
    boxShadow: `
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.2)
    `
  };

  return (
    <div ref={modalRef} className={className} style={modalStyle}>
      <div 
        style={headerStyle}
        onMouseDown={handleMouseDown}
      >
        <h3 style={titleStyle}>{title}</h3>
        <button 
          className="modal-close-button"
          style={closeButtonStyle}
          onClick={onClose}
          title="Close"
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #7a7a7a 0%, #6a6a6a 100%)';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.color = '#ffffff';
            e.target.style.boxShadow = `
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 2px 4px rgba(0, 0, 0, 0.3)
            `;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #6a6a6a 0%, #5a5a5a 100%)';
            e.target.style.transform = 'scale(1)';
            e.target.style.color = '#e0e0e0';
            e.target.style.boxShadow = `
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 1px 2px rgba(0, 0, 0, 0.2)
            `;
          }}
          onMouseDown={(e) => {
            e.target.style.background = 'linear-gradient(145deg, #5a5a5a 0%, #4a4a4a 100%)';
            e.target.style.transform = 'scale(0.95)';
            e.target.style.boxShadow = `
              inset 0 1px 3px rgba(0, 0, 0, 0.3),
              0 1px 2px rgba(0, 0, 0, 0.1)
            `;
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      {children}
    </div>
  );
};

export default DraggableModal;
