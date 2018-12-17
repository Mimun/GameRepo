/////////////////////////////////////////////////////////
// Sepia mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

void main(void)
{
	// Retrieve front and back pixels
	lowp float fronta = texture2D(samplerFront, vTex).a;
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	lowp vec4 sepia = back * mat4( 0.3588, 0.7044, 0.1368, 0.0,
									0.2990, 0.5870, 0.1140, 0.0,
									0.2392, 0.4696, 0.0912, 0.0,
									0.0,	0.0,	0.0,	1.0);
	
	gl_FragColor = mix(back, vec4(sepia.r, sepia.g, sepia.b, back.a), fronta);
}
