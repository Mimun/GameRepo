/////////////////////////////////////////////////////////
// Radial pixellate effect
// Based on code from: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float pixelWidth;
uniform mediump float pixelHeight;

uniform mediump float tilesize;

void main(void)
{
	highmedp vec2 center = vec2(0.5, 0.5);
	
	highmedp vec2 normCoord = 2.0 * vTex - 1.0;
	highmedp vec2 normCenter = 2.0 * center - 1.0;

	normCoord -= normCenter;

	highmedp float r = length(normCoord);
	highmedp float phi = atan(normCoord.y, normCoord.x);

	r = r - mod(r, pixelWidth * tilesize);
	phi = phi - mod(phi, pixelHeight * tilesize);
	   
	normCoord.x = r * cos(phi);
	normCoord.y = r * sin(phi);

	normCoord += normCenter;

	gl_FragColor = texture2D(samplerFront, normCoord / 2.0 + 0.5);
}
