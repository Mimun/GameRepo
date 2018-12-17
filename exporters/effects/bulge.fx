/////////////////////////////////////////////////////////
// Bulge effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float radius;
uniform mediump float scale;

void main(void)
{
	mediump vec2 tex = vTex;
	mediump float dist = distance(vec2(0.5, 0.5), vTex);
	tex -= vec2(0.5, 0.5);
	
	if (dist < radius)
	{
		mediump float percent = 1.0 - ((radius - dist) / radius) * scale;
		percent = percent * percent;

		tex = tex * percent;
	}
	
	tex += vec2(0.5, 0.5);

	gl_FragColor = texture2D(samplerFront, tex);
}
