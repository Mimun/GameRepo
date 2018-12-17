/////////////////////////////////////////////////////////
// Tint effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float red;
uniform lowp float green;
uniform lowp float blue;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	gl_FragColor = front * vec4(red, green, blue, 1.0);
}
