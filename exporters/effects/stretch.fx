/////////////////////////////////////////////////////////
// Stretch effect
// Based on code from: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

void main(void)
{
	highmedp vec2 center = vec2(0.5, 0.5);
	highmedp vec2 normCoord = 2.0 * vTex - 1.0;
	highmedp vec2 normCenter = 2.0 * center - 1.0;

	normCoord -= normCenter;
	mediump vec2 s = sign(normCoord);
	normCoord = abs(normCoord);
	normCoord = 0.5 * normCoord + 0.5 * smoothstep(0.25, 0.5, normCoord) * normCoord;
	normCoord = s * normCoord;

	normCoord += normCenter;

	gl_FragColor = texture2D(samplerFront, normCoord / 2.0 + 0.5);
}
