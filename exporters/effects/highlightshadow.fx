/////////////////////////////////////////////////////////
// Highlight shadows effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float shadows;
uniform lowp float highlights;

const mediump vec3 luminanceWeighting = vec3(0.3, 0.3, 0.3);

void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);
	mediump float luminance = dot(front.rgb, luminanceWeighting);

	mediump float shadow = clamp((pow(luminance, 1.0 / (shadows + 1.0)) + (-0.76) * pow(luminance, 2.0 / (shadows + 1.0))) - luminance, 0.0, 1.0);
	mediump float highlight = clamp((1.0 - (pow(1.0 - luminance, 1.0 / (2.0 - highlights)) + (-0.8) * pow(1.0 - luminance, 2.0 / (2.0 - highlights)))) - luminance, -1.0, 0.0);
	lowp vec3 result = vec3(0.0, 0.0, 0.0) + ((luminance + shadow + highlight) - 0.0) * ((front.rgb - vec3(0.0, 0.0, 0.0)) / (luminance - 0.0));

	gl_FragColor = vec4(result.rgb, front.a);
}
