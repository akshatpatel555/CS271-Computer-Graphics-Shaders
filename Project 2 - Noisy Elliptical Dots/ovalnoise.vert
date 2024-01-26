#version 330 compatibility

out float vLightIntensity;

out vec2 vST;
out vec3 vMCposition;
out vec3 ECposition;

out vec3 vN; //normal vector
out vec3 vL; //light position
out vec3 vE; //eye position



const vec3 LIGHTPOSITION = vec3( 1, 0.8, 0.4);

void
main(){


	vST = gl_MultiTexCoord0.st;
	vMCposition = gl_Vertex.xyz;
	vec3 ECposition = vec3(gl_ModelViewMatrix * gl_Vertex); // eye coordinate position
	vN = normalize( gl_NormalMatrix * gl_Normal ); // normal vector
	vL = LIGHTPOSITION - ECposition.xyz; // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

	vLightIntensity  = dot(normalize(vL), vN);
}