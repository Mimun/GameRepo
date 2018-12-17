/////////////////////////////////////////////////////////
// Sepia effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float intensity;

void main(void)
{
	// Retrieve source pixel and unpremultiply
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	lowp vec4 sepia = front * mat4( 0.3588, 0.7044, 0.1368, 0.0,
									0.2990, 0.5870, 0.1140, 0.0,
									0.2392, 0.4696, 0.0912, 0.0,
									0.0,	0.0,	0.0,	1.0);
	
	gl_FragColor = mix(front, vec4(sepia.r, sepia.g, sepia.b, front.a), intensity);
}
