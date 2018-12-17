/////////////////////////////////////////////////////////
// CGA effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

void main(void)
{
	highmedp vec2 sampleDivisor = vec2(1.0 / 200.0, 1.0 / 320.0);

	highmedp vec2 samplePos = vTex - mod(vTex, sampleDivisor);
	highmedp vec4 color = texture2D(samplerFront, samplePos);

	mediump vec4 colorCyan = vec4(85.0 / 255.0, 1.0, 1.0, 1.0);
	mediump vec4 colorMagenta = vec4(1.0, 85.0 / 255.0, 1.0, 1.0);
	mediump vec4 colorWhite = vec4(1.0, 1.0, 1.0, 1.0);
	mediump vec4 colorBlack = vec4(0.0, 0.0, 0.0, 1.0);

	mediump vec4 endColor;
	highmedp float blackDistance = distance(color, colorBlack);
	highmedp float whiteDistance = distance(color, colorWhite);
	highmedp float magentaDistance = distance(color, colorMagenta);
	highmedp float cyanDistance = distance(color, colorCyan);

	mediump vec4 finalColor;

	highmedp float colorDistance = min(magentaDistance, cyanDistance);
	colorDistance = min(colorDistance, whiteDistance);
	colorDistance = min(colorDistance, blackDistance); 

	if (colorDistance == blackDistance)
		finalColor = colorBlack;
	else if (colorDistance == whiteDistance)
		finalColor = colorWhite;
	else if (colorDistance == cyanDistance)
		finalColor = colorCyan;
	else
		finalColor = colorMagenta;
	
	finalColor.rgb *= color.a;
	finalColor.a = color.a;
	gl_FragColor = finalColor;
}
