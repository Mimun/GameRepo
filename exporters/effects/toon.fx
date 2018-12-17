/////////////////////////////////////////////////////////
// Toon effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

precision highmedp float;
uniform highmedp float pixelWidth;
uniform highmedp float pixelHeight;
uniform highmedp float threshold;
uniform highmedp float quantizationLevels;

void main(void)
{
	vec4 front = texture2D(samplerFront, vTex);

	float dx = pixelWidth;
	float dy = pixelHeight;
	
    float bottomLeftIntensity = texture2D(samplerFront, vTex + vec2(-dx, dy)).r;
    float topRightIntensity = texture2D(samplerFront, vTex + vec2(dx, -dy)).r;
    float topLeftIntensity = texture2D(samplerFront, vTex + vec2(-dx, -dy)).r;
    float bottomRightIntensity = texture2D(samplerFront, vTex + vec2(dx, dy)).r;
    float leftIntensity = texture2D(samplerFront, vTex + vec2(-dx, 0.0)).r;
    float rightIntensity = texture2D(samplerFront, vTex + vec2(dx, 0.0)).r;
    float bottomIntensity = texture2D(samplerFront, vTex + vec2(0.0, dy)).r;
    float topIntensity = texture2D(samplerFront, vTex + vec2(0.0, -dy)).r;
	float h = -topLeftIntensity - 2.0 * topIntensity - topRightIntensity + bottomLeftIntensity + 2.0 * bottomIntensity + bottomRightIntensity;
	float v = -bottomLeftIntensity - 2.0 * leftIntensity - topLeftIntensity + bottomRightIntensity + 2.0 * rightIntensity + topRightIntensity;

	float mag = length(vec2(h, v));

	vec3 posterized = floor((front.rgb * (quantizationLevels-1.0)) + 0.5) / (quantizationLevels-1.0);

	float thresholdTest = 1.0 - step(threshold, mag);

	gl_FragColor = vec4(posterized * thresholdTest, front.a);
}
