/////////////////////////////////////////////////////////
// Soft light effect
precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

void main(void)
{
	// Retrieve front and back pixels
	lowp vec4 front = texture2D(samplerFront, vTex);
	front.rgb /= front.a;
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	back.rgb /= back.a;
	
	front.r = ((front.r < 0.5) ? (2.0 * back.r * front.r + back.r * back.r * (1.0 - 2.0 * front.r)) : (sqrt(back.r) * (2.0 * front.r - 1.0) + 2.0 * back.r * (1.0 - front.r)));
	front.g = ((front.g < 0.5) ? (2.0 * back.g * front.g + back.g * back.g * (1.0 - 2.0 * front.g)) : (sqrt(back.g) * (2.0 * front.g - 1.0) + 2.0 * back.g * (1.0 - front.g)));
	front.b = ((front.b < 0.5) ? (2.0 * back.b * front.b + back.b * back.b * (1.0 - 2.0 * front.b)) : (sqrt(back.b) * (2.0 * front.b - 1.0) + 2.0 * back.b * (1.0 - front.b)));
	front.rgb *= front.a;
	
	gl_FragColor = front * back.a;
}
