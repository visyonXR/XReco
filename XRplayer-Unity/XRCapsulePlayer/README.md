# XR Capsule Player (Android)
A lightweight Unity-based application that loads and displays XR Capsules on Android devices.  
XR Capsules are modular 3D experiences defined by a single `capsule.json` file that references external 3D models, textures, videos, audio, and interaction rules.

---

## Overview
XR Capsule Player dynamically builds a 3D scene at runtime using the instructions provided in the XR Capsule JSON.  
No scene is baked into the app; all content is delivered from the cloud or local storage, enabling continuous updates without rebuilding or republishing the application.

---

## Features

### Unity Native
- Fully implemented in Unity.
- GLB/GLTF 3D model support.
- Video textures and audio.

### JSON-Driven Architecture
- Scene graph, assets, cameras, UI, and interactions are defined in `capsule.json`.
- Supports remote hosting of all referenced content.
- Hotfixes possible by updating JSON or assets without touching the app.

---

## How It Works

1. Load `capsule.json` from URL or local storage.  
2. Parse and validate the JSON schema.  
3. Download and instantiate referenced assets:
   - 3D models (GLB/GLTF)
   - Textures
   - Audio files
   - Videos  
4. Apply materials, lighting, and camera definitions.  
5. Execute interactions, triggers, and user inputs based in templates.  
6. Present the final interactive 3D experience.

---

## Supported Content Types

| Type        | Description |
|-------------|-------------|
| 3D Models   | GLB/GLTF (streamed at runtime) |
| Images      | PNG, JPG, HDR |
| Video       |video textures |
| Audio       | Common audio formats|


---

## Interaction Model
- Touch gestures (orbit, zoom, pan)  
- Object selection via raycast  
- Hotspots and triggers  
- JSON-defined behaviours (visibility, animations, transitions, ...)

---

## Performance & Caching
- All remote assets are cached on device for fast reload.  
- Automatic quality scaling (decimation).  


---

## Use Cases
- Previewing XR Capsules on mobile  
- Interactive product visualization  
- Cultural and educational 3D experiences  
- Cloud-delivered storytelling capsules  
- Internal validation of capsule.json content

---

## Roadmap
- AR mode using ARCore  
- Multi-user support  
- Advanced shader/material support  
- Usage analytics and performance reporting  

---

## License
Apache-2.0 License

---



