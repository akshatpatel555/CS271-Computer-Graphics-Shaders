#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;

uniform float uKa=0.1, uKd=0.6, uKs=0.3;
uniform float uShininess=100.;

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler3D Noise3;				//in-built noise texture in glman
uniform bool uUseXYZforNoise;

in vec2 vST;
in vec3 vMCposition;
in float vLightIntensity;

in vec3 vN;
in vec3 vL;
in vec3 vE;


const vec3 WHITE = vec3(1., 1., 1.);


void
main(){

	//sample noise vertex

	vec4 nv;
	if(uUseXYZforNoise){
		nv = texture(Noise3, uNoiseFreq * vMCposition);
	}
	else{
		nv = texture(Noise3, uNoiseFreq * vec3(vST, 0.));
	}

	
    float n = (nv.r + nv.g + nv.b + nv.a);
    n = n - 2;
    n *= uNoiseAmp;

    vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3(1.0, 0.4, 0.7);
	vec3 mySpecularColor = vec3(1, 2, 0.9);
	
	float s = vST.s;
	float t = vST.t;

	float Ar = uAd /2.;
	float Br = uBd /2.;

	int numins = int(s / uAd);
    int numint = int(t / uBd);

	//ellipse centers
	float s_c = (numins * uAd) + Ar;
    float t_c = (numint * uBd) + Br;

    float ds = s - s_c;
    float dt = t - t_c;

    float oldDist = sqrt((ds * ds) + (dt * dt));
    float newDist = oldDist + n;
    float scale = newDist / oldDist;

    ds = ds * scale;
    dt = dt * scale;

    ds = ds / Ar;
    dt = dt / Br;


	//ellipse equation
	float ellipse = ((s - s_c)/Ar) * ((s - s_c)/Ar) + ((t - t_c)/Br) * ((t - t_c)/Br);
	//blend ellipse color with bg


	//smoothstep function
	float d = smoothstep(1. - uTol, 1. + uTol, (ds * ds) + (dt * dt));
	myColor = mix(myColor, mySpecularColor, d);


	//vertex per-fragment lighting
	vec3 ambient = uKa * myColor;
	float a = 0.;
	float q = 0.;

	//lighting function
	if(vLightIntensity > 0.){
	
		a = vLightIntensity;
		vec3 ref = normalize(reflect(-Light, Normal));
		q = pow( max( dot(Eye, ref), 0.), uShininess);
	
	}
	vec3 diffuse = uKd * a * myColor;
	vec3 specular = uKs * q * mySpecularColor;

	gl_FragColor = vec4(ambient + diffuse + specular, 1.);

	
}