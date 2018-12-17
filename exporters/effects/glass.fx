/////////////////////////////////////////////////////////
// Glass effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float magnification;

void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	// Glass distort
	mediump float src = front.r * 0.299 + front.g * 0.587 + front.b * 0.114;
	
	mediump vec3 front2 = texture2D(samplerFront, vTex + vec2(pixelWidth, 0.0)).rgb;
	mediump float diffx = src - (front2.r * 0.299 + front2.g * 0.587 + front2.b * 0.114);
	
	mediump vec3 front3 = texture2D(samplerFront, vTex + vec2(0.0, pixelHeight)).rgb;
	mediump float diffy = src - (front3.r * 0.299 + front3.g * 0.587 + front3.b * 0.114);
	
	mediump vec2 p = vTex;
	p.x += diffx * magnification * pixelWidth * 64.0 * front.a;
	p.y += diffy * magnification * pixelHeight * 64.0 * front.a;

	gl_FragColor = texture2D(samplerBack, mix(destStart, destEnd, p));
}
