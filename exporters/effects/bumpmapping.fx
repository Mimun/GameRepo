/////////////////////////////////////////////////////////
// Bumpmapping effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

uniform mediump float lightx;
uniform mediump float lighty;
uniform mediump float lightz;
uniform mediump float intensity;

void main(void)
{
	// Retrieve front and back pixels
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	mediump vec3 normal = 2.0 * front.rgb - 1.0;
	mediump vec3 light = normalize(vec3(lightx - vTex.x, lighty - vTex.y, lightz));
	mediump float diffuse = clamp(dot(normal, light), 0.0, 1.0); 

	gl_FragColor = intensity * back * diffuse;
}
