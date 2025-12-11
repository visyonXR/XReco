using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace XREco
{

    public class XRCapsuleInternal
    {
        // Define classes to represent the JSON structure
        public class Root
        {
            public string Schema { get; set; }
            public List<Capsule> Capsules { get; set; }
        }

        public class Workspace
        {
            public List<float> Volume { get; set; }
            public string Unit { get; set; }
        }

        public class Capsule
        {
            public string Name { get; set; }
            public List<string> TargetDevices { get; set; }
            public Workspace Workspace { get; set; }
            public List<Asset> Assets { get; set; }
            public Scene Scene { get; set; }
        }

        public class Asset
        {
            public string AssetUUID { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
            public string SourceURL { get; set; }
            public List<string> Extensions { get; set; }
            public Dictionary<string, XRecoMetadata> Metadata { get; set; }
        }

        public class XRecoMetadata
        {
            public string Notes { get; set; }
            public List<float> BoundingBox { get; set; }
            public int Polygons { get; set; }
            public List<float> Resolution { get; set; }
        }

        public class Scene
        {
            public List<Object> Objects { get; set; }
            public List<Trigger> Triggers { get; set; }
        }

        public class Object
        {
            public string Name { get; set; }
            public string AssetUUID { get; set; }
            public string SceneUUID { get; set; }
            public bool Visible { get; set; }
            public bool Enabled { get; set; }
            public Transform Transform { get; set; }
            public Play Play { get; set; }
        }

        public class Transform
        {
            public List<float> Position { get; set; }
            public List<float> Rotation { get; set; }
            public List<float> Scale { get; set; }
        }

        public class Play
        {
            public bool AutoStart { get; set; }
            public bool Reversed { get; set; }
            public bool Loop { get; set; }
            public int LoopIterations { get; set; }
            public float StartAt { get; set; }
            public float StopAt { get; set; }
            public float PlayRate { get; set; }
            public string Stereo { get; set; }
        }

        public class Trigger
        {
            public string Type { get; set; }
            public List<string> TriggerParameters { get; set; }
            public string SceneTargetUUID { get; set; }
            public string OnActivate { get; set; }
        }
    }

}