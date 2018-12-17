/////////////////////////////////////////////////////////
// Inverse effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float intensity;

void main(void)
{
	// Retrieve source pixel
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	// Inverse the RGB components
	lowp vec3 inverse = vec3(front.a - front.rgb);
	
	// Output inverted pixel
	gl_FragColor = vec4(mix(front.rgb, inverse, intensity), front.a);
}
