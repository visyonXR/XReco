using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using GLTFast;
using System.Threading.Tasks;

namespace XREco
{

    public class XRCapsuleAsset : MonoBehaviour
    {
        private internalState iState;

        [SerializeField]
        private string assetuuid;

        [SerializeField]
        private string sceneuuid;

        public string AssetUUID
        {
            get { return assetuuid; }
            set { assetuuid = value; }
        }
        public string SceneUUID
        {
            get { return sceneuuid; }
            set { sceneuuid = value; }
        }

        [SerializeField]
        private new string name;
        public string Name
        {
            get { return name; }
            set { name = value; }
        }

        [SerializeField]
        private string type;
        public string Type
        {
            get { return type; }
            set { type = value; }
        }

        [SerializeField]
        private string sourceURL;
        public string SourceURL
        {
            get { return sourceURL; }
            set { sourceURL = value; }
        }

        [SerializeField]
        [TextArea(3, 15)]
        private string metadata;
        public string Metadata
        {
            get { return metadata; }
            set { metadata = JsonPrettify(value); }
        }

        public static string JsonPrettify(string json)
        {
            using (var stringReader = new StringReader(json))
            using (var stringWriter = new StringWriter())
            {
                var jsonReader = new JsonTextReader(stringReader);
                var jsonWriter = new JsonTextWriter(stringWriter) { Formatting = Formatting.Indented };
                jsonWriter.WriteToken(jsonReader);
                return stringWriter.ToString();
            }
        }

        private struct internalState
        {
            public bool hasModel;
            public enum eLoadState
            {
                Uninitialized,
                Loading,
                Done,
                Error
            };

            public eLoadState loadState;

        }

        async void Start()
        {
            iState = new internalState();

            iState.hasModel = !string.IsNullOrEmpty(sourceURL);
            iState.loadState = internalState.eLoadState.Uninitialized;

            if (iState.hasModel)
            {
                await TryLoadModel(sourceURL);
            }

        }

        async Task TryLoadModel(string sourceURL = null)
        {

            if (!string.IsNullOrEmpty(sourceURL))
            {

                var gltfImport = new GltfImport();
                await gltfImport.Load(sourceURL);

                if (this == null)
                {
                    iState.loadState = internalState.eLoadState.Error;
                    return;

                }

                var instantiator = new GameObjectInstantiator(gltfImport, transform);
                var success = await gltfImport.InstantiateMainSceneAsync(instantiator);
                if (success && this != null)
                {
                    iState.loadState = internalState.eLoadState.Done;

                    // Get the SceneInstance to access the instance's properties
                    var sceneInstance = instantiator.SceneInstance;

                    // Enable the first imported camera (which are disabled by default)
                    if (sceneInstance.Cameras is { Count: > 0 })
                    {
                        sceneInstance.Cameras[0].enabled = true;
                    }

                    // Decrease lights' ranges
                    if (sceneInstance.Lights != null)
                    {
                        foreach (var glTFLight in sceneInstance.Lights)
                        {
                            glTFLight.range *= 0.1f;
                        }
                    }

                    // Play the default (i.e. the first) animation clip
                    var legacyAnimation = instantiator.SceneInstance.LegacyAnimation;
                    if (legacyAnimation != null)
                    {
                        legacyAnimation.Play();
                    }

                }
            }
        }
    }

}