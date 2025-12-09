// Project.js

import React, { useState, useEffect, useRef } from 'react';
import '../stylesheets/Project.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from 'qrcode.react';

function Popup({ handleClosePopup, show, handleProjectData }) {

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  const projectNameRef = useRef(null);
  const [projectName, setProjectName] = useState('');
  const [environmentData, setEnvironmentData] = useState("0");
  const [urlEnvironmentData, setUrlEnvironmentData] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [jsonData, setJsonData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedURLJSONFileName, setSelectedURLJSONFileName] = useState(null);
  const [selectedURLFromTable, setSelectedURLFromTable] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('tab1');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [selectedHDRIndex, setSelectedHDRIndex] = useState(null);
  const [showHDRSelector, setShowHDRSelector] = useState(false);

  const hdrData = [
    { id: "1", name: "Old Depot", url: "https://xrcapsule.visyon.tech/public/hdri/old_depot_2k.hdr", preview: `${process.env.PUBLIC_URL}/hdri/previews/old_depot_2k.png` },
    { id: "2", name: "Buikslotermeerplein", url: "https://xrcapsule.visyon.tech/public/hdri/buikslotermeerplein_2k.hdr", preview: `${process.env.PUBLIC_URL}/hdri/previews/buikslotermeerplein_2k.png` },
    { id: "3", name: "Sunset JHB Central", url: "https://xrcapsule.visyon.tech/public/hdri/sunset_jhbcentral_2k.hdr", preview: `${process.env.PUBLIC_URL}/hdri/previews/sunset_jhbcentral_2k.png` },
    { id: "4", name: "Zwartkops Afternoon", url: "https://xrcapsule.visyon.tech/public/hdri/zwartkops_curve_afternoon_2k.hdr", preview: `${process.env.PUBLIC_URL}/hdri/previews/zwartkops_curve_afternoon_2k.png` },
    { id: "5", name: "Symmetrical Garden", url: "https://xrcapsule.visyon.tech/public/hdri/symmetrical_garden_02_2k.hdr", preview: `${process.env.PUBLIC_URL}/hdri/previews/symmetrical_garden_02_2k.png` },
    { id: "6", name: "UnderWater", url: "https://xrcapsule.visyon.tech/public/hdri/UnderWater_A_1k.hdr", preview: `${process.env.PUBLIC_URL}/hdri/previews/UnderWater_A_1k.png` }
  ];

  const handleHDRSelection = (index) => {
    if (selectedHDRIndex === index) {
      setSelectedHDRIndex(null);
      setEnvironmentData("0");
      setUrlEnvironmentData(null);
    } else {
      setSelectedHDRIndex(index);
      setEnvironmentData(hdrData[index].id);
      setUrlEnvironmentData(hdrData[index].url);
    }
  };

  const handleCheckboxChange = () => {
    setShowHDRSelector(!showHDRSelector);
    if (showHDRSelector) {
      setSelectedHDRIndex(null);
      setEnvironmentData("0");
      setUrlEnvironmentData(null);
    }
  };

  const rectanglesData = [
    { template: 'Blank', background: '/backgrounds/blank-background.jpg', unit:'meters' },
    { template: 'Smartphone AR', background: '/backgrounds/smartphone-ar-background.jpg', unit:'meters' },
    { template: 'Smartphone 3D Viewer', background: '/backgrounds/smartphone-3d-viewer-background.jpg', unit:'meters' },
    { template: 'Quest 3 AR', background: '/backgrounds/quest-3-ar-background.jpg', unit:'meters' },
    { template: 'Infographics', background: '/backgrounds/infographics-background.jpg', unit:'meters' },
    { template: 'Virtual Production', background: '/backgrounds/virtual-production-background.jpg', unit:'meters' },
  ];

  // Bootstrap CSS is not needed for Maya-style interface
  // useEffect(() => {
  //   const link = document.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = '/bootstrap/bootstrap.min.css';
  //   // Remove integrity check as it's causing conflicts
  //   
  //   document.head.appendChild(link);
  //   return () => {
  //     document.head.removeChild(link);
  //   };
  // }, []);

  useEffect(() => {
    if (show) {
      projectNameRef.current.focus();
      getJsonFilesList();
    }
  }, [show]);

  useEffect(() => {
    if (activeTab === 'tab1') {
      setIsButtonDisabled(!projectName);
    } else if (activeTab === 'tab2') {
      setIsButtonDisabled(selectedRow === null);
    }
  }, [projectName, activeTab, selectedRow]);  

  useEffect(() => {
    if (activeTab === 'tab1') {
      setSelectedURLFromTable(null);
      setSelectedURLJSONFileName(null);
      setSelectedRow(null);
    }
  }, [activeTab]);

  const handleClick = () => {
    if (isButtonDisabled) {
      setErrorMessage('Please complete all required fields');
    }
  };

  const createButton = () => {
    let projectName = "Project Name";
    let selectedEnvironment = "0";
    if (activeTab === 'tab1') {
      projectName = document.getElementById('projectName').value;
      selectedEnvironment = document.getElementById('environmentSelector') ? document.getElementById('environmentSelector').value : "0";
    }

    const selectedDevice = rectanglesData[selectedIndex];
    const device = selectedIndex;
    const units = selectedDevice.unit;
    const deviceText = selectedDevice.template;                
    const url = selectedURLFromTable;

    let JSONFileName = null;
    if(selectedURLJSONFileName != null){
      JSONFileName = selectedURLJSONFileName + '.json';
    }
    else{
      JSONFileName = deviceText + '_' + projectName + '.json';
    }

    var dimensionW = 0;
    var dimensionH = 0;
    var dimensionD = 0;

    if(parseInt(device) == 0){
      dimensionW=5;
      dimensionH=5;
      dimensionD=5;
    }
    else if(parseInt(device) == 1){
      dimensionW=5;
      dimensionH=5;
      dimensionD=2.5;
    }
    else if(parseInt(device) == 2){
      dimensionW=5;
      dimensionH=5;
      dimensionD=2.5;
    }
    else if(parseInt(device) == 3){
      dimensionW=5;
      dimensionH=5;
      dimensionD=2.5;
    }
    else if(parseInt(device) == 4){
      dimensionW=5;
      dimensionH=5;
      dimensionD=5;
    }
    else{
      dimensionW=30;
      dimensionH=30;
      dimensionD=8;
    }
    const projectData = {
      projectName,
      device,
      deviceText,
      units,
      dimensions: { w: dimensionW, h: dimensionH, d: dimensionD },
      url,
      JSONFileName,
      environmentData,
      urlEnvironmentData
    };

    handleProjectData(projectData);
    handleClosePopup();
  }

  const getJsonFilesList = async () => {
  
    try {
      const response = await fetch('https://flask-xrcapsule.visyon.tech/json_files_list');
      if (!response.ok) {
        throw new Error('Error al obtener la lista de archivos JSON');
      }
      const data = await response.json();
      setJsonData(data.files);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRowSelect = (id, url, name) => {
    setSelectedRow(id === selectedRow ? null : id);
    setSelectedURLFromTable(id === selectedRow ? null : url);
    setSelectedURLJSONFileName(id === selectedRow ? null : name);
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleRectangleClick = (index) => {
    setSelectedIndex(index);
  };

  const getButtonText = () => {
    return activeTab === 'tab1' ? 'Create' : 'Open';
  };

  const [qrValue, setQrValue] = useState(null);
  
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'tab1' ? 'active' : ''}`}
            onClick={() => setActiveTab('tab1')}
          >
            NEW PROJECT
          </button>
          <button
            className={`tab ${activeTab === 'tab2' ? 'active' : ''}`}
            onClick={() => setActiveTab('tab2')}
          >
            OPEN PROJECT
          </button>
        </div>  
        {activeTab === 'tab1' && (
          <div>
            <form className='formPopUpP'>
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}
              <label className='labelPopUpP' htmlFor="projectName">Name<span style={{ color: '#ec655f' }}>*</span></label>
              <input className='inputPopUpP' type="text" id="projectName" name="projectName" 
              autoComplete="off" placeholder='Project' ref={projectNameRef} value={projectName}
              onChange={(e) => setProjectName(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();}}}/>              
              <label className='labelPopUpP' htmlFor="template">Template</label>
              <div className='templateRectangles-p1'>
                {rectanglesData.map((data, index) => (
                  <div 
                    key={index} 
                    className={`templateRectangles-p2 ${selectedIndex === index ? 'selected' : ''}`} 
                    onClick={() => handleRectangleClick(index)}
                    style={{
                      backgroundImage: `url(${data.background})`,
                    }}
                  >
                    <div className='templateRectangle-form'>{data.template}</div>
                    <div style={{ color: 'white', textAlign: 'left', width: '100%' }}>
                    </div>
                  </div>
                ))}
              </div>
              <label className="labelPopUpP">
                Environment
                <input className="checkEnv" type="checkbox" checked={showHDRSelector} onChange={handleCheckboxChange} />
              </label>
              {showHDRSelector && (
                <>
                  <div className="templateEnv-p1">
                    {hdrData.map((hdr, index) => (
                      <div
                        key={hdr.id}
                        className={`templateEnv-p2 ${selectedHDRIndex === index ? 'selected' : ''}`}
                        onClick={() => handleHDRSelection(index)}
                        style={{ backgroundImage: `url(${hdr.preview})` }}
                      >
                        <div className="templateEnv-form">{hdr.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </form>
          </div>
        )}
        {activeTab === 'tab2' && (
          <div>
            <form className='formPopUpP'>
              <label className='labelPopUpP' htmlFor="units" >JSON Public Files 
                <FontAwesomeIcon className='dropTableIcon' onClick={toggleTableVisibility} 
                icon={isTableVisible ? faAngleUp : faAngleDown} />
              </label>
              {isTableVisible && (
                <div className="table-container">
                  <table className="table table-striped">
                    <tbody>
                      {jsonData.map((item) => (
                        <tr
                          key={item.id}
                          className={item.id === selectedRow ? 'table-active' : ''}
                          onClick={() => handleRowSelect(item.id, item.url, item.name)}
                        >
                          <td>{item.name}</td>
                          <td>{`xrcapsule://loadcapsule?${item.url}`}</td>
                          <td>
                            <button className="qr-link-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQrValue(`${item.url}`);
                            }}>
                              <FontAwesomeIcon icon={faQrcode} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </form>
          </div>
        )}
        {qrValue && (
          <div className="qr-modal-backdrop" onClick={() => setQrValue(null)}>
            <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
              <h4>Scan to upload the project</h4>
              <QRCodeCanvas value={qrValue} size={200} />
              <button className="close-qr-btn" onClick={() => setQrValue(null)}>Close</button>
            </div>
          </div>
        )}
        <Link to={isButtonDisabled ? "#" : "/xrcapsule"}>
        <button
            className="popup-button-inP"
            onClick={() => {
              handleClick();
              if (!isButtonDisabled) {
                createButton();
              }
            }}
          >
            {getButtonText()}
          </button>
        </Link>
      </section>
    </div>
  );
}

function Project({ handleProjectData }) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    togglePopup();
  }, []);

  return (
    <div className="App-project">
      <div className="gradient-backgroundP">
        <Popup
          show={showPopup}
          handleClosePopup={togglePopup}
          handleProjectData={handleProjectData}
        />
      </div>
    </div>
  );
}

export default Project;
