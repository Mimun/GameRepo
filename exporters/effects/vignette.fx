/////////////////////////////////////////////////////////
// Vignette effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float vignetteStart;
uniform mediump float vignetteEnd;

void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float a = front.a;
	
	if (a != 0.0)
		front.rgb /= a;
	
    lowp float d = distance(vTex, vec2(0.5, 0.5));
    front.rgb *= smoothstep(vignetteEnd, vignetteStart, d);
	front.rgb *= a;
	
    gl_FragColor = front;
}
