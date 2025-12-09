// ObjectData2.js

import React, { useState, useEffect } from 'react';
import '../stylesheets/ObjectData2.css';
import { debounce } from 'lodash';

const ObjectData2 = ({heightTS, widthTS, depthTS, onWidthChange, onHeightChange, onDepthChange, data, onToggleObjectData}) => {

  const [width, setWidth] = useState(widthTS);
  const [height, setHeight] = useState(heightTS);
  const [depth, setDepth] = useState(depthTS);

  useEffect(() => {
    setWidth(widthTS);
    setHeight(heightTS);
    setDepth(depthTS);
  }, [widthTS, heightTS, depthTS]);
  
  const handleWidthChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 100) {
      setWidth(value);
    } else {
      setWidth(100);
    }
  };

  const handleHeightChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 100) {
      setHeight(value);
    } else {
      setHeight(100);
    }
  };

  const handleDepthChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 100) {
      setDepth(value);
    } else {
      setDepth(100);
    }
  };

  const debouncedHandleApply = debounce(() => {
    onWidthChange(width);
    onHeightChange(height);
    onDepthChange(depth);
    data.dimensions.w = width;
    data.dimensions.h = height;
    data.dimensions.d = depth;
  }, 100); 

  return (
    <div className='object-wks-container'>
      <h3>Workspace</h3>
      <hr style={{ borderColor: '#3a3e47', marginTop: '20px', marginBottom: '35px' }} />
      <div className='field-wks-container'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className='labelApp' style={{ marginRight: '10px' }}>Device: {data.deviceText}</label>
        </div>
        <br />
      <form style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className='labelApp' style={{ marginRight: '10px' }}>
            W
          </label>
          <input className='rounded-input' type="number" name="width" min="0" max="100" value={width} onChange={handleWidthChange} />
          <label className='labelApp' style={{ marginRight: '14px', marginLeft: '5px' }}>{data.units}</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className='labelApp' style={{ marginRight: '14px' }}>
            H
          </label>
          <input className='rounded-input' type="number" name="height" min="0" max="100" value={height} onChange={handleHeightChange} />
          <label className='labelApp' style={{ marginRight: '14px', marginLeft: '5px' }}>{data.units}</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className='labelApp' style={{ marginRight: '14px' }}>
            D
          </label>
          <input className='rounded-input' type="number" name="depth" min="0" max="100" value={depth} onChange={handleDepthChange} />
          <label className='labelApp' style={{ marginRight: '14px', marginLeft: '5px' }}>{data.units}</label>
        </div>
        <button type="button" className='apply-button' onClick={debouncedHandleApply}>Apply</button>
        <button type="button" className='close-button' onClick={onToggleObjectData}>Close</button>
      </form>
        <br />
      </div>
    </div>
  );
};

export default ObjectData2;
