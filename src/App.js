import React from 'react';
import './stylesheets/App.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProjectScreen from './screens/ProjectScreen';
import SceneScreen from './screens/SceneScreen';
import LoginScreen from './screens/LoginScreen';
import { DataProvider } from './components/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  document.documentElement.lang = 'en';
  
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/project" element={<ProtectedRoute element={<ProjectScreen />} />} />
          <Route path="/xrcapsule" element={<ProtectedRoute element={<SceneScreen />} />} />
          <Route path="/login" element={<ProtectedRoute element={<LoginScreen />} />} />
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;