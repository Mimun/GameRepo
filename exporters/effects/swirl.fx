/////////////////////////////////////////////////////////
// Swirl effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float radius;
uniform mediump float angle;

void main(void)
{
	mediump vec2 center = vec2(0.5, 0.5);
	
	highmedp vec2 tex = vTex;
	highmedp float dist = distance(center, vTex);
	tex -= center;
	
	if (dist < radius)
	{
		highmedp float percent = (radius - dist) / radius;
		highmedp float theta = percent * percent * angle * 8.0;
		highmedp float s = sin(theta);
		highmedp float c = cos(theta);
		tex = vec2(dot(tex, vec2(c, -s)), dot(tex, vec2(s, c)));
	}
	
	tex += center;

	gl_FragColor = texture2D(samplerFront, tex);
}
