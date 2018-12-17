/////////////////////////////////////////////////////////
// Vibrance effect
// Based on code from glfx.js: https://github.com/evanw/glfx.js
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float vibrance;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float average = front.r / 3.0 + front.g / 3.0 + front.b / 3.0;
	lowp float max_ = max(front.r, max(front.g, front.b));
	lowp float amount = (max_ - average) * (vibrance * -3.0);
	front.rgb = mix(front.rgb, vec3(max_), amount);
	gl_FragColor = front;
}
