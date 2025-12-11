using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static XREco.XRCapsuleInternal;

namespace XREco
{

    public class XRCapsuleTrigger : MonoBehaviour
    {
        [SerializeField]
        public Trigger trigger;


        [SerializeField]
        private string Type;
        [SerializeField]
        private List<string> TriggerParameters = new List<string>();
        [SerializeField]
        private string SceneTargetUUID;
        [SerializeField]
        private string OnActivate;

        public void Populate(Trigger t)
        {
            trigger = t;

            Type = t.Type;
            TriggerParameters.Clear();
            foreach (string p in t.TriggerParameters)
            {
                TriggerParameters.Add(p);
            }
            SceneTargetUUID = t.SceneTargetUUID;
            OnActivate = t.OnActivate;
        }

        // Start is called before the first frame update
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {

        }
    }


}