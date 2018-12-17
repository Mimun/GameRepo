/////////////////////////////////////////////////////////
// Exposure effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float exposure;

void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	gl_FragColor = vec4(front.rgb * pow(2.0, exposure), front.a);
}
