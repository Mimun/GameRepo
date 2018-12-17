/////////////////////////////////////////////////////////
// Dot screen effect
// Based on code from glfx.js: https://github.com/evanw/glfx.js
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float scale;
uniform mediump float angle_deg;

mediump float pattern()
{
	mediump float angle = angle_deg / 57.29578;
	mediump float s = sin(angle);
	mediump float c = cos(angle);
	mediump vec2 tex = vTex * vec2(1.0 / pixelWidth, 1.0 / pixelHeight) - vec2(0.5, 0.5);
	mediump vec2 pt = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y) * scale;
	return sin(pt.x) * sin(pt.y) * 4.0;
}

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float average = front.r / 3.0 + front.g / 3.0 + front.b / 3.0;
	gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), front.a);
}
