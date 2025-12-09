// ProjectScreen.js
import React, { useEffect, useState, useContext } from 'react';
import ProjectNavBar from '.././components/ProjectNavBar';
import Project from '.././components/Project';
import axios from 'axios';
import DataContext from '.././components/DataContext';

const ProjectScreen = () => {
  const [projectData, setProjectData] = useState(null);
  const [userName, setUserName] = useState('');
  const { updateData } = useContext(DataContext);

  const handleProjectData = (data) => {
    const modifiedData = {
      ...data,
      basketData: basketData
    };
    setProjectData(modifiedData);
    updateData(modifiedData);
  };

  const [fetchDone, setFetchDone] = useState(false);
  const [basketData, setbasketData] = useState(null);
  const [basketId, setbasketId] = useState(null);
  const [accessToken, setaccessToken] = useState(null);
  const [refreshToken, setrefreshToken] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const basketId = queryParams.get('basket_id');
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');

    setbasketId(basketId);
    setaccessToken(accessToken);
    setrefreshToken(refreshToken);

    const fetchData = async () => {
      try {
        if (accessToken != null) {
          setFetchDone(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (accessToken && !basketData) {
      const getbasketData = async () => {
        try {
          const response = await axios.get(
            'https://xreco.ari-imet.eu/api/baskets/',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          const basket = response.data.find(basket => basket.basket_id === basketId);
          setbasketData(basket);
          setUserName(basket.basket_name);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      getbasketData();
    }
  }, [fetchDone, accessToken, basketData]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #2b2b2b 0%, #1e1e1e 50%, #2b2b2b 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <ProjectNavBar userName={userName} setUserName={setUserName}/>
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
      <Project handleProjectData={handleProjectData} />
      {projectData && (
        <div style={{
          background: 'linear-gradient(145deg, #393939 0%, #2e2e2e 100%)',
          margin: '20px auto',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #4a4a4a',
          maxWidth: '800px',
          color: '#e0e0e0'
        }}>
          <h3 style={{ color: '#cccccc', marginBottom: '16px' }}>Project Data:</h3>
          <pre style={{ 
            background: '#1e1e1e', 
            padding: '16px', 
            borderRadius: '4px',
            color: '#e0e0e0',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(projectData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProjectScreen;