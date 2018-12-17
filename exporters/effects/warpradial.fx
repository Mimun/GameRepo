/////////////////////////////////////////////////////////
// Warp Ripple effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float seconds;

uniform mediump float freq;
uniform mediump float amp;
uniform mediump float speed;

const mediump float PI = 3.1415926;

void main(void)
{	
	mediump vec2 p = vTex;
	
	mediump vec2 tex = vTex * 2.0 - 1.0;
		
	mediump float d = length(tex);
	mediump float a = atan(tex.y, tex.x);
	
	a += sin(a * freq + (seconds * speed)) * amp;
	
	tex.x = cos(a) * d;
	tex.y = sin(a) * d;
	
	tex = (tex + 1.0) / 2.0;
	
	gl_FragColor = texture2D(samplerFront, tex);
}
