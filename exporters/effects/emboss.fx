/////////////////////////////////////////////////////////
// Emboss effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float intensity;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;

void main(void)
{
	// Retrieve source pixel
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	lowp vec3 color = vec3(0.5);
	color -= texture2D(samplerFront, vTex - vec2(pixelWidth, pixelHeight)).rgb * 2.0;
    color += texture2D(samplerFront, vTex + vec2(pixelWidth, pixelHeight)).rgb * 2.0;
	color = vec3(color.r * 0.299 + color.g * 0.587 + color.b * 0.114);
	
	gl_FragColor = mix(front, vec4(color, front.a), intensity);
}
