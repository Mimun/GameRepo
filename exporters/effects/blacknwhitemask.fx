/////////////////////////////////////////////////////////
// Black & white mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform lowp float threshold;

void main(void)
{
	// Retrieve front and back pixels
	lowp float fronta = texture2D(samplerFront, vTex).a;
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	// Calculate grayscale amount
	lowp float gray = back.r * 0.299 + back.g * 0.587 + back.b * 0.114;
	
	// Output either black or white with foreground alpha intensity
	if (gray < threshold)
		gl_FragColor = mix(back, vec4(0.0, 0.0, 0.0, back.a), fronta);
	else
		gl_FragColor = mix(back, vec4(back.a, back.a, back.a, back.a), fronta);
}
