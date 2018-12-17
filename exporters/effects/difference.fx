/////////////////////////////////////////////////////////
// Difference effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

void main(void)
{
	// Retrieve front and back pixels unpremultiplied
	lowp vec4 front = texture2D(samplerFront, vTex);
	front.rgb /= front.a;
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	back.rgb /= back.a;
	
	// Difference blend and premultiply
	front.rgb = (max(front.rgb, back.rgb) - min(front.rgb, back.rgb)) * front.a;
	
	gl_FragColor = front;
}
