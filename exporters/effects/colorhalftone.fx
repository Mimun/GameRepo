/////////////////////////////////////////////////////////
// Color halftone effect
// Based on code from glfx.js: https://github.com/evanw/glfx.js
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float scale;
uniform mediump float angle_deg;

mediump float pattern(mediump float angle)
{
	mediump float s = sin(angle);
	mediump float c = cos(angle);
	mediump vec2 tex = vTex * vec2(1.0 / pixelWidth, 1.0 / pixelHeight) - vec2(0.5, 0.5);
	mediump vec2 pt = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y) * scale;
	return sin(pt.x) * sin(pt.y) * 4.0;
}

void main(void)
{
	mediump float angle = angle_deg / 57.29578;
	lowp vec4 front = texture2D(samplerFront, vTex);
	mediump vec3 cmy = 1.0 - front.rgb;
	mediump float k = min(cmy.x, min(cmy.y, cmy.z));
	cmy = (cmy - k) / (1.0 - k);
	cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(angle + 0.26179), pattern(angle + 1.30899), pattern(angle)), 0.0, 1.0);
	k = clamp(k * 10.0 - 5.0 + pattern(angle + 0.78539), 0.0, 1.0);
	gl_FragColor = vec4(1.0 - cmy - k, front.a);
}
