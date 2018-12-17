/////////////////////////////////////////////////////////
// Grayscale mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

void main(void)
{
	// Retrieve front alpha and back pixel
	lowp float fronta = texture2D(samplerFront, vTex).a;
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	// Calculate grayscale amount
	lowp float gray = back.r * 0.299 + back.g * 0.587 + back.b * 0.114;
	
	// Output a gray pixel with source alpha
	gl_FragColor = mix(back, vec4(gray, gray, gray, back.a), fronta);
}
