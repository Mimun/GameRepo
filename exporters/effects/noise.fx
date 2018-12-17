/////////////////////////////////////////////////////////
// Noise effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float seconds;
uniform lowp float intensity;
uniform lowp float color;

void main(void)
{
	// Retrieve source pixel and unpremultiply
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float a = front.a;
	
	if (a != 0.0)
		front.rgb /= a;
	
	mediump float seconds_mod = mod(seconds, 10.0);
	
	// Add pseudorandom noise then premultiply
	mediump vec3 noise = vec3(fract(sin(dot(vTex.xy, vec2(12.9898,78.233)) + seconds_mod) * 43758.5453),
							  fract(sin(dot(vTex.yx, vec2(12.9898,-78.233)) + seconds_mod) * 43758.5453),
							  fract(sin(dot(vTex.xy, vec2(-12.9898,-78.233)) + seconds_mod) * 43758.5453));
	noise = mix(vec3(noise.r), noise, color);
	front.rgb += (noise * intensity) - (intensity / 2.0);
	front.rgb *= a;
	
	gl_FragColor = front;
}
