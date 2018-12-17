/////////////////////////////////////////////////////////
// Grayscale effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float intensity;

void main(void)
{
	// Retrieve source pixel
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	// Calculate grayscale amount
	lowp float gray = front.r * 0.299 + front.g * 0.587 + front.b * 0.114;
	
	// Output a gray pixel with source alpha
	gl_FragColor = mix(front, vec4(gray, gray, gray, front.a), intensity);
}
