using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using UnityEngine;
using UnityEngine.Networking;
using XREco;
using static XREco.XRCapsuleInternal;

public class XRCapsuleJsonLoader : MonoBehaviour
{

    public static XRCapsuleJsonLoader Instance { get; private set; }

    XRCapsuleRuntimeManager xrcrm;
    Root root;

    public TMPro.TMP_InputField tmpi;

    public UnityEngine.Transform ARRootTransform;

    public bool autoload = false;

    // Start is called before the first frame update
    void Start()
    {
        // If there is an instance, and it's not me, delete myself.


        if (Instance != null && Instance != this)
        {
            Destroy(this);
        }
        else
        {
            Instance = this;
        }

        if (autoload!=true)
        {
            return;
        }

        string clipboardtext = UniClipboard.GetText();
        Debug.Log("CLIPBOARD TEXT: " + clipboardtext);
        tmpi.text = clipboardtext;
        LoadJSON(clipboardtext);
    }

    public void LoadJSON(string url)
    {
        Debug.Log("Trying to load " + url);
        StartCoroutine(GetRequest(url));

    }

    IEnumerator GetRequest(string url)
    {
        UnityWebRequest wr = UnityWebRequest.Get(url);
        yield return wr.SendWebRequest();

        string json = "";

        switch (wr.result)
        {
            case UnityWebRequest.Result.Success:
                json = wr.downloadHandler.text;
                break;
        }

        if(json != "")
        {
            root = JsonConvert.DeserializeObject<Root>(json);
            if(xrcrm != null)
            {
                RunXRCapsuleRuntimeManager();
            }

        }
    }

    public void SayHi(XRCapsuleRuntimeManager x)
    {
        /*
        Debug.Log("XRCapsuleRuntimeManager says Hi");
        xrcrm = x;
        RunXRCapsuleRuntimeManager();
        */
    }

    private void RunXRCapsuleRuntimeManager()
    {
        Debug.Log("Sending new data to XRCapsuleRuntimeManager");

        xrcrm.Init(root, 0);
        xrcrm.Run(false);
    }
}
