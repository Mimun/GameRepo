/////////////////////////////////////////////////////////
// Overlay effect
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
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	front.r = back.r < 0.5 ? 2.0 * back.r * front.r : 2.0 * (front.r + back.r * front.a - back.r * front.r) - front.a;
	front.g = back.g < 0.5 ? 2.0 * back.g * front.g : 2.0 * (front.g + back.g * front.a - back.g * front.g) - front.a;
	front.b = back.b < 0.5 ? 2.0 * back.b * front.b : 2.0 * (front.b + back.b * front.a - back.b * front.b) - front.a;
	front *= back.a;
	
	gl_FragColor = front;
}
