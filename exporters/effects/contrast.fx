/////////////////////////////////////////////////////////
// Contrast effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float contrast;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float a = front.a;
	
	if (a != 0.0)
		front.rgb /= front.a;
	
	front.rgb = (front.rgb - vec3(0.5)) * contrast + vec3(0.5);
	
	front.rgb *= a;
	gl_FragColor = front;
}
