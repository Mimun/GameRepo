/////////////////////////////////////////////////////////
// Polar invert effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float intensity;
const mediump float PI = 3.1415926;

void main(void)
{
	mediump vec2 tex = vTex * 2.0 - 1.0;
		
	mediump float d = length(tex);
	mediump float a = atan(tex.y, tex.x);
	
	if (a < 0.0)
		a += PI;
	
	mediump float temp = a;
	a = d * 2.0 * PI;
	d = temp / (2.0 * PI);
	
	tex.x = cos(a) * d;
	tex.y = sin(a) * d;
	
	tex = (tex + 1.0) / 2.0;
	
	// Output a gray pixel with source alpha
	gl_FragColor = texture2D(samplerFront, mix(vTex, tex, intensity));
}
