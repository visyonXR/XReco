using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System;
using System.IO;
using Newtonsoft.Json;
using System.Linq;
using static XREco.XRCapsuleInternal;

namespace XREco
{
    public class WorkspaceEditor : EditorWindow
    {
        private string jsonData;
        private string filePath;

        private Texture2D headerImage;
        private Texture2D iconFileBrowse;
        private Texture2D iconLoadJCapsules;

        [MenuItem("XReco/XRCapsule")]
        public static void ShowWindow()
        {
            GetWindow<WorkspaceEditor>("XRCapsule Loader");
        }

        private void OnEnable()
        {
            headerImage = (Texture2D)EditorGUIUtility.Load("Assets/XReco/XRCapsule/Images/xrcapsule_o.png"); // Replace with your image path
            iconFileBrowse = (Texture2D)EditorGUIUtility.Load("Assets/XReco/XRCapsule/Images/XRCapsule_file_browse.png"); // Replace with your image path
            iconLoadJCapsules = (Texture2D)EditorGUIUtility.Load("Assets/XReco/XRCapsule/Images/XRCapsule_load_workspace.png"); // Replace with your image path

            if (headerImage == null)
            {
                Debug.LogError("Failed to load header image!");
            }

            if (iconFileBrowse == null)
            {
                Debug.LogError("Failed to load icon image! ");
            }

            if (iconLoadJCapsules == null)
            {
                Debug.LogError("Failed to load icon image! ");
            }

        }


        void OnGUI()
        {
            int padding = 20;

            // Custom color for the rectangle
            Color rectangleColor = Color.white;

            Rect rectanglePosition = new Rect(0, 0, position.width, headerImage.height + padding);

            // Draw the rectangle using EditorGUI.DrawRect
            EditorGUI.DrawRect(rectanglePosition, rectangleColor);

            // Draw header image
            var headerRect = new Rect(0, padding / 2, position.width, headerImage.height);
            GUI.DrawTexture(headerRect, headerImage, ScaleMode.ScaleToFit);

            // Calculate remaining space for content
            var contentRect = new Rect(padding, headerRect.height + padding + padding, position.width - padding - padding, position.height - (headerRect.height + padding + padding));

            var firstLineRect = new Rect(padding, headerRect.height + padding + padding, position.width - padding - padding, iconFileBrowse.height + 10);
            var secondLineRect = new Rect(padding, headerRect.height + firstLineRect.height + padding + padding, position.width - padding - padding, iconFileBrowse.height);

            GUILayout.BeginArea(firstLineRect);

            GUILayout.BeginHorizontal();

            GUILayout.BeginVertical();

            GUILayout.FlexibleSpace();

            filePath = EditorGUILayout.TextField("JSON File Path", filePath);

            GUILayout.FlexibleSpace();

            GUILayout.EndVertical();
            if (GUILayout.Button(new GUIContent("Browse JSON", iconFileBrowse)))
            {
                filePath = EditorUtility.OpenFilePanel("Select JSON File", Application.dataPath, "json");
            }

            GUILayout.EndHorizontal();

            GUILayout.EndArea();

            GUILayout.BeginArea(secondLineRect);

            if (GUILayout.Button(new GUIContent("Load Capsules", iconLoadJCapsules)))
            {
                if (string.IsNullOrEmpty(filePath))
                {
                    Debug.LogError("Please enter a valid JSON file path!");
                    return;
                }

                jsonData = File.ReadAllText(filePath);
                if (jsonData == null)
                {
                    Debug.LogError("Failed to load JSON file at path: " + filePath);
                    return;
                }

                LoadCapsules(jsonData);
            }

            GUILayout.EndArea();
        }

        private void LoadCapsules(string jsonData)
        {

            // Deserialize the JSON into a Workspace object
            Root root = JsonConvert.DeserializeObject<Root>(jsonData);

            int capsuleIndex = 0;

            // Loop through Templates and access their data
            foreach (var capsule in root.Capsules)
            {

                string name = "XRCapsule Scene - " + capsule.Name;

                GameObject gs = GameObject.Find(name);
                DestroyImmediate(gs);
                // Create XRCapsuleScene gameobject and populate it
                if (gs == null)
                {
                    gs = new GameObject(name);
                }
                XRCapsuleRuntimeManager xrcs = gs.AddComponent<XRCapsuleRuntimeManager>();
                xrcs.Init(root, capsuleIndex);
                xrcs.Run(true);

                capsuleIndex++;

            }
        }

    }

}