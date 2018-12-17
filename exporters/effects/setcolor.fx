/////////////////////////////////////////////////////////
// Set color effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float red;
uniform lowp float green;
uniform lowp float blue;

void main(void)
{
	lowp float a = texture2D(samplerFront, vTex).a;
	
	gl_FragColor = vec4(red * a, green * a, blue * a, a);
}
