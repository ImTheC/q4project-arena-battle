using UnityEngine;
using System.Collections;

[System.Serializable]
public class Boundary
{
	public float xMin, xMax, zMin, zMax;
}

public class PlayerController : MonoBehaviour 
{

	public float speed;
	public float turnSpeed;
	public float tilt;
	public Boundary boundary;

	public GameObject shot;
	public Transform shotSpawnL;
	public Transform shotSpawnR;
	public float fireRate;

	private float moveHorizontal;
	private float moveVertical;
	private float nextFire;
	private Rigidbody rb;
	private AudioSource audio;

	private void Start()
	{
		rb = GetComponent<Rigidbody> ();
		audio = GetComponent<AudioSource> ();

	}

	void Update ()
	{

		moveHorizontal = Input.GetAxis ("Horizontal");
		moveVertical = Input.GetAxis ("Vertical");

		if (Input.GetButton("Fire1") || Input.GetKey ("space") ) {
			if ( Time.time > nextFire ) {
				nextFire = Time.time + fireRate;
				Instantiate(shot, shotSpawnL.position, shotSpawnL.rotation);
				Instantiate(shot, shotSpawnR.position, shotSpawnR.rotation);
				audio.Play ();
			}
		}
	}

	void FixedUpdate ()
	{
		Move ();
		Turn ();
	}

	private void Move ()
	{
		// Create a vector in the direction the tank is facing with a magnitude based on the input, speed and the time between frames.
		Vector3 movement = transform.forward * moveVertical * speed * Time.deltaTime;
		rb.velocity = movement * speed;

		rb.position = new Vector3 
		(
			Mathf.Clamp (rb.position.x, boundary.xMin, boundary.xMax),
			0.0f,
			Mathf.Clamp (rb.position.z, boundary.zMin, boundary.zMax)
		);

		// Apply this movement to the rigidbody's position.
		rb.MovePosition(rb.position + movement);
	}


	private void Turn ()
	{
		// Determine the number of degrees to be turned based on the input, speed and time between frames.
		float turn = moveHorizontal * turnSpeed * Time.deltaTime;

		// Make this into a rotation in the y axis.
		Quaternion turnRotation = Quaternion.Euler (0.0f, turn, 0.0f);

		// Apply this rotation to the rigidbody's rotation.
		rb.MoveRotation (rb.rotation * turnRotation);
	}



			
//	void FixedUpdate ()
//	{
//
//		Vector3 movement = new Vector3 (moveHorizontal, 0.0f, moveVertical);
//		rb.velocity = movement * speed;
//
//		rb.position = new Vector3 
//		(
//			Mathf.Clamp (rb.position.x, boundary.xMin, boundary.xMax),
//			0.0f,
//			Mathf.Clamp (rb.position.z, boundary.zMin, boundary.zMax)
//		);
//
//		rb.rotation = Quaternion.Euler (0.0f, 0.0f, rb.velocity.x * -tilt);
//
//	}

}
