/////////////////////////////////////////////////////////
// Replace color effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float rsource;
uniform mediump float gsource;
uniform mediump float bsource;
uniform mediump float rdest;
uniform mediump float gdest;
uniform mediump float bdest;
uniform lowp float tolerance;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float a = front.a;
	
	if (a != 0.0)
		front.rgb /= a;
	
	// Calculate distance from source color
	lowp float diff = length(front.rgb - vec3(rsource, gsource, bsource) / 255.0);
	
	if (diff <= tolerance)
	{
		front.rgb = mix(front.rgb, vec3(rdest, gdest, bdest) / 255.0, 1.0 - diff / tolerance);
	}
	
	front.rgb *= a;
	gl_FragColor = front;
}
