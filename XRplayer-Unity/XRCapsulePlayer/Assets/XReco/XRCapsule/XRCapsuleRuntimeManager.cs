using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using System.Linq;
using static XREco.XRCapsuleInternal;

namespace XREco {

    public class XRCapsuleRuntimeManager : MonoBehaviour
    {

        [SerializeField]
        [TextArea(1, 5)]
        private string jsonData;

        [SerializeField]
        private Root root;

        [SerializeField]
        private int capsuleIndex;

        [SerializeField]
        private bool autoInit = false;

        // Start is called before the first frame update
        void Start()
        {
            try
            {
                XRCapsuleJsonLoader.Instance.SayHi(this);
            }
            catch (System.Exception)
            {

            }
            

            if (autoInit)
            {
                Run();
            }
        }

        // Update is called once per frame
        void Update()
        {

        }

        public void Init(Root r, int cIndex = 0)
        {
            Debug.Log("XRCapsuleRuntimeManager Init");

            root = r;
            jsonData = JsonConvert.SerializeObject(root);
            capsuleIndex = cIndex;
        }

        public void Run(bool editorMode = false)
        {

            Debug.Log("XRCapsuleRuntimeManager tries to run");

            root = JsonConvert.DeserializeObject<Root>(jsonData);
            Capsule capsule = root.Capsules[capsuleIndex];

            string unit = "";
            if(capsule != null)
            { 
                unit = capsule.Workspace.Unit.ToLower();
            }

            float unitScale = 1f;

            switch (unit)
            {
                case "centimeters":
                    unitScale = 0.01f;
                    break;
                case "kilometers":
                    unitScale = 1000f;
                    break;
                case "meters":
                default:
                    break;
            }

            string name = "XRCapsule Scene - " + capsule.Name;

            GameObject gs = GameObject.Find(name);

            // Create XRCapsuleScene gameobject and populate it
            if (gs == null)
            {
                gs = GameObject.Find(name + "(Clone)");
                if(gs == null)
                {
                    gs = new GameObject(name);
                    Debug.Log("Adding Scene " + name);
                }
            }
            else
            {
                Debug.Log("Found Scene");
                int c = gs.transform.childCount - 1;
                for (int i = c; i > 0; i--)
                {
                    Destroy(gs.transform.GetChild(i).gameObject, 0f);
                }
            }

            gs.transform.SetParent(this.transform);
            gs.transform.localScale = Vector3.one * unitScale;


#if UNITY_EDITOR
            if (editorMode)
            {
                GameObject gvol = GameObject.CreatePrimitive(PrimitiveType.Cube);
                gvol.name = "Workspace Area";
                gvol.transform.localPosition = Vector3.zero + Vector3.up * (capsule.Workspace.Volume[1] / 2.0f);
                gvol.transform.localScale = new Vector3(capsule.Workspace.Volume[0], capsule.Workspace.Volume[1], capsule.Workspace.Volume[2]);
                gvol.transform.SetParent(gs.transform);
                gvol.tag = "EditorModeOnly";

                //gvol.GetComponent<MeshRenderer>().material = config.WorkspaceMaterial;

            }

#endif

            foreach (var obj in capsule.Scene.Objects)
            {
                //GameObject go = new GameObject(obj.UUID);
                GameObject go = new GameObject(obj.Name);// CreatePrimitive(PrimitiveType.Cube);
                go.transform.SetParent(gs.transform);

                Asset assetRef = capsule.Assets.Where(asset => asset.AssetUUID == obj.AssetUUID).First<Asset>();

                go.name = obj.Name;
                go.transform.localPosition = new Vector3(obj.Transform.Position[0], obj.Transform.Position[1], obj.Transform.Position[2]);
                go.transform.localRotation = Quaternion.Euler(obj.Transform.Rotation[0], obj.Transform.Rotation[1], obj.Transform.Rotation[2]);
                go.transform.localScale = new Vector3(obj.Transform.Scale[0], obj.Transform.Scale[1], obj.Transform.Scale[2]);

                go.SetActive(obj.Enabled);
                if (go.GetComponent<MeshRenderer>() == null)
                {
                    go.AddComponent<MeshRenderer>();
                }
                go.GetComponent<MeshRenderer>().enabled = obj.Visible;


                Debug.Log("Adding " + obj.Name);

                XRCapsuleAsset xrca = go.AddComponent<XRCapsuleAsset>();
                xrca.Name = assetRef.Name;
                xrca.AssetUUID = obj.AssetUUID;
                xrca.SceneUUID = obj.SceneUUID;
                xrca.Type = assetRef.Type;
                xrca.SourceURL = assetRef.SourceURL;
                xrca.Metadata = JsonConvert.SerializeObject(assetRef.Metadata);


                // Triggers
                IEnumerable<Trigger> triggers = capsule.Scene.Triggers.Where(trigger => trigger.SceneTargetUUID == obj.SceneUUID);

                foreach (Trigger trigger in triggers)
                {
                    Debug.Log(trigger.Type);
                    foreach (string p in trigger.TriggerParameters)
                    {
                        Debug.Log(p);
                    }
                    Debug.Log(trigger.SceneTargetUUID);
                    Debug.Log(trigger.OnActivate);

                    XRCapsuleTrigger xrct = go.AddComponent<XRCapsuleTrigger>();
                    xrct.Populate(trigger);
                }

            }
        }

        public void DebugPrint()
        {
            foreach (var tmp in root.Capsules)
            {
                foreach (var trigger in tmp.Scene.Triggers)
                {
                    Debug.Log(trigger.Type);
                    Debug.Log(trigger.SceneTargetUUID);
                    Debug.Log(trigger.OnActivate);
                }
            }
        }

    }

}