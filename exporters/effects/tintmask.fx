/////////////////////////////////////////////////////////
// Tint mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform lowp float red;
uniform lowp float green;
uniform lowp float blue;

void main(void)
{
	// Retrieve front and back pixels
	lowp float fronta = texture2D(samplerFront, vTex).a;
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	gl_FragColor = mix(back, back * vec4(red, green, blue, 1.0), fronta);
}
