using UnityEngine;
using System.Collections;

public class Rotator : MonoBehaviour {

	// Update is called once per frame
	void Update ()
	{
		transform.Rotate (new Vector3(Random.Range(1, 359),Random.Range(1, 359),Random.Range(1, 359))* Time.deltaTime);
	}
}
