#version 330 compatibility

const float pi = 3.14159;

uniform float uA;
uniform float uB;
uniform float uD;

out vec3 vNs;
out vec3 vEs;
out vec3 vMC;


void
main( )
{    

	vMC = gl_Vertex.xyz;
    float r = length( vMC.xy );
	vec4 newVertex = gl_Vertex;

	newVertex.z = uA * cos(2.*pi*uB*r) * exp( -uD*r );

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

    float drdx = vMC.x / r;
    float drdy = vMC.y / r;
    float dzdr = uA * (-sin(2.*pi*uB*r) * 2.*pi*uB * exp(-uD*r) + cos(2.*pi*uB*r) * -uD * exp(-uD*r) );
    float dzdx = dzdr * drdx;
    float dzdy = dzdr * drdy;

	vec3 Tx = vec3( 1., 0., dzdx );
    vec3 Ty = vec3( 0., 1., dzdy );

	vec3 newNormal = normalize(cross(Tx, Ty));

	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ;     // vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}