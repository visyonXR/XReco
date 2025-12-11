using UnityEditor;
using UnityEngine;

[CreateAssetMenu(fileName = "XRCapsuleEditorConfigFile", menuName = "XReco/XRCapsule/XRCapsuleEditorConfig", order = 1)]
public class XRCapsuleEditorConfig : ScriptableObject
{
    public Material WorkspaceMaterial;


    private void OnEnable()
    {
        WorkspaceMaterial = (Material)AssetDatabase.LoadAssetAtPath("Assets/XReco/XRCapsule/Materials/M_XRCapsuleWorkspace", typeof(Material));
    }
}
