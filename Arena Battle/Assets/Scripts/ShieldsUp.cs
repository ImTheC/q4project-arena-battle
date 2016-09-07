using UnityEngine;
using System.Collections;

public class ShieldsUp : MonoBehaviour {

	// Instantiates a prefab in a circle around a specific point (shieldGen)

	public GameObject prefab;
	public int numberOfObjects;
	public Transform shieldGen;
	public float radius = 5f;

	void Start() {
		for (int i = 0; i < numberOfObjects; i++) {
			float angle = i * Mathf.PI * 2 / numberOfObjects;
			Vector3 pos = new Vector3(Mathf.Cos(angle), 0, Mathf.Sin(angle)) * radius;
			Instantiate(prefab, shieldGen.position + pos, Quaternion.identity, shieldGen);
		}
	}

	void FixedUpdate () 
	{
		
	}

}
