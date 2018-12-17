/////////////////////////////////////////////////////////
// Scanlines effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float pixelHeight;

uniform mediump float lineHeight;

void main(void)
{	
	// Retrieve source pixel
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	// Darken if an alternate row
	mediump float factor = 1.0 + (floor(mod(vTex.y, pixelHeight * lineHeight * 2.0) / (pixelHeight * lineHeight)) / 3.0);
	front.rgb /= factor;
	
	// Output a gray pixel with source alpha
	gl_FragColor = front;
}
