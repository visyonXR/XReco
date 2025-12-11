# XRCapsule

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.161.0-green.svg)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8.13.7-orange.svg)](https://github.com/pmndrs/react-three-fiber)
[![React Three Drei](https://img.shields.io/badge/React_Three_Drei-9.80.9-yellow.svg)](https://github.com/pmndrs/drei)

## Abstract

This repository will publish the open-source components developed by Visyon360 within the XRECO Project (XR Media Repositories for eXtended Reality Content).
The release will include the XRCapsule web solution, featuring the web and Unity source code of the XRCapsule Player, the documentation of the JSON specification defining the XR Capsule data model, and a collection of associated services and modules that can operate either integrated within the XRECO ecosystem or as standalone components.

This open-source publication aims to promote transparency, reproducibility, and collaboration within the XR research and production community by sharing the technological foundations that enable interoperable and cloud-based XR experiences.

## Overview

XRCapsule is a comprehensive XR (Extended Reality) platform that enables the creation, editing, and deployment of immersive 3D experiences across multiple target devices including AR/VR headsets, smartphones, and web browsers. Built with React and Three.js, it provides a powerful web-based editor for creating interactive 3D scenes with support for various media types and deployment targets.

##  Features

### Core Platform Features
- **Multi-Device XR Support**: Deploy to Smartphone AR, Smartphone VR, Quest 3 AR, Virtual Production setups, and web-based 3D viewers
- **Web-Based 3D Editor**: Intuitive browser-based scene editor with real-time preview
- **Cross-Platform Compatibility**: Works across desktop, mobile, and XR devices
- **Cloud Integration**: Integrated with Keycloak authentication and cloud storage services

### 3D Content Management
- **Multi-Format 3D Model Support**: GLB, GLTF, OBJ, MTL, USD, USDZ file imports
- **Real-Time 3D Scene Editing**: Drag-and-drop interface with transform controls
- **Mesh Optimization**: Built-in 3D model decimation and optimization using Blender
- **Asset Library**: Comprehensive asset management system
- **Environment Support**: HDRI environment mapping with multiple presets

### Media Integration
- **Multimedia Support**: 
  - Audio components with spatial audio support
  - Video playback with interactive controls
  - Image displays and galleries
  - Text overlays and UI elements
- **Interactive Elements**: 
  - Clickable 3D objects
  - Scene triggers and animations
  - Camera controls and viewpoints

### XR-Specific Features
- **AR Mode**: Smartphone and headset AR with real-world anchoring
- **VR Mode**: Immersive VR experiences for mobile and dedicated headsets
- **Virtual Production**: Professional virtual production workflows
- **Dynamic Camera System**: Multiple camera viewpoints with smooth transitions
- **Advanced Controls**: Orbit gizmo, viewport switching (top/front/side views)
- **Responsive Design**: Adaptive UI for different screen sizes and input methods

##  Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and context
- **React Three Fiber 8.13.7**: React renderer for Three.js
- **Three.js 0.161.0**: 3D graphics library
- **React Three Drei**: Useful helpers and abstractions for R3F
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **Keycloak**: Authentication and authorization

### Backend Services
- **Flask Python Server**: Asset processing and file management
- **Blender Integration**: 3D model optimization via mesh_reducer.py
- **Cloud Storage**: File upload and management system

### 3D Technologies
- **WebGL**: Hardware-accelerated 3D rendering
- **GLTF/GLB**: Optimized 3D model format
- **HDRI**: High Dynamic Range Image environments
- **Post-processing**: Advanced rendering effects (N8AO, TiltShift)

##  Installation

### Prerequisites
- Node.js (version 14 or higher)
- Python 3.7+ (for backend services)
- Blender (for 3D model processing)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/visyonXR/XRCapsule.git
cd XRCapsule

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup (Python Services)
```bash
# Navigate to Python directory
cd py

# Install Python dependencies
pip install flask flask-cors

# Start Flask server
python app.py
```

##  Usage

### Getting Started
1. **Login**: Access the platform through the login screen with Keycloak authentication
2. **Project Management**: Create new projects or open existing ones
3. **Scene Editor**: Use the main scene editor to build your XR experience
4. **Asset Import**: Upload 3D models, textures, audio, and video files
5. **Preview & Deploy**: Test your scene and deploy to target devices

### Project Structure
```
XRCapsule/
├── src/
│   ├── components/          # React components
│   │   ├── ThreeScene.js   # Main 3D scene renderer
│   │   ├── Model.js        # 3D model component
│   │   ├── CameraView.js   # Dynamic camera system
│   │   ├── AssetLoader.js  # Asset upload interface
│   │   ├── AudioComponent.js
│   │   ├── VideoComponent.js
│   │   ├── ImageComponent.js
│   │   ├── OrbitGizmo.js   # 3D navigation gizmo
│   │   └── StatusBar.js    # Scene status and info
│   ├── screens/            # Main application screens
│   │   ├── LoginScreen.js
│   │   ├── ProjectScreen.js
│   │   └── SceneScreen.js
│   └── stylesheets/        # CSS styling
├── public/
│   ├── backgrounds/        # Background images
│   ├── hdri/              # HDRI environment maps
│   ├── templates/         # Project templates
│   └── *.glb              # Sample 3D models
└── py/
    ├── app.py             # Flask backend server
    └── mesh_reducer.py    # Blender 3D optimization
```

### Key Components

#### Scene Editor (`ThreeScene.js`)
- Real-time 3D scene rendering
- Interactive camera controls (orbit, perspective/orthographic switching)
- Object manipulation with transform gizmos
- Environment and lighting controls
- Multi-viewport support (top, front, side views)
- Dynamic camera system with smooth transitions

#### Camera System (`CameraView.js`)
- Interactive 3D camera placement and management
- Visual camera icons with Billboard rendering
- Transform controls for camera positioning
- Multiple camera viewpoints within scenes
- Camera selection and manipulation tools

#### Asset Management
- **AssetLoader**: Drag-and-drop file uploads
- **Model Component**: 3D model rendering with LOD support
- **Media Components**: Audio, video, and image integration
- **Environment Loader**: HDRI environment management

#### Project Templates
- Virtual Production setups
- AR/VR scene templates
- Device-specific configurations
- Predefined asset collections

##  Target Devices

XRCapsule supports deployment to multiple XR platforms:

### Mobile Devices
- **Smartphone AR**: Camera-based augmented reality
- **Smartphone VR**: Mobile VR with gyroscope controls
- **Smartphone 3D Viewer**: Web-based 3D model viewing

### XR Headsets
- **Quest 3 AR**: Mixed reality experiences
- **Other VR Headsets**: WebXR-compatible devices

### Professional
- **Virtual Production**: Film and broadcast industry workflows
- **Infographics**: Data visualization and presentations
- **Web Browsers**: Cross-platform web deployment

## 📋 XRCapsule File Format

Projects are saved in the XRCapsule JSON format (.json) which includes:

```json
{
  "$schema": "https://xrcapsule.visyon.tech/schema#",
  "Metadata": {
    "FileVersion": "0.0.2",
    "XRCapsuleEditorVersion": "1.0.0"
  },
  "Capsules": [
    {
      "Name": "Project Name",
      "TargetDevices": ["Smartphone AR", "Virtual Production"],
      "Workspace": {
        "Volume": [250, 500, 500],
        "Unit": "Centimeters"
      },
      "Assets": [...],
      "Scene": {
        "Objects": [...],
        "Triggers": [...]
      }
    }
  ]
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm start          # Start development server on localhost:3000
npm test           # Run test suite
npm run build      # Build for production

# Backend
cd py && python app.py  # Start Flask server for asset processing
```

### Key Development Features
- **Hot Reload**: Automatic page refresh during development
- **Error Boundaries**: Graceful error handling in React components
- **Performance Optimization**: Memoized components and debounced updates
- **Responsive Design**: Mobile-first responsive layouts

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is part of the XReco ecosystem by Visyon360.

## Support

For technical support and questions:
- Visit our documentation at `https://xrcapsule.visyon.tech/`
- Check the GitHub issues for known problems
- Contact the development team

---

**XRCapsule** - Empowering creators to build immersive XR experiences for any device, anywhere.
