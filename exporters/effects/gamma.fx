/////////////////////////////////////////////////////////
// Gamma effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float gamma;

void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	gl_FragColor = vec4(pow(front.rgb, vec3(gamma)), front.a);
}
