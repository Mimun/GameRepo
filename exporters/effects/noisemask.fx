/////////////////////////////////////////////////////////
// Noise mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float seconds;
uniform lowp float intensity;

void main(void)
{
	// Retrieve front and back pixels and unpremultiply
	lowp float fronta = texture2D(samplerFront, vTex).a;
	lowp vec4 back1 = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	lowp vec4 back2 = back1;
	back2.rgb /= back2.a;
	
	mediump float seconds_mod = mod(seconds, 10.0);
	
	// Add pseudorandom noise then premultiply
	mediump vec3 noise = vec3(fract(sin(dot(vTex.xy, vec2(12.9898,78.233)) + seconds_mod) * 43758.5453),
							  fract(sin(dot(vTex.yx, vec2(12.9898,-78.233)) + seconds_mod) * 43758.5453),
							  fract(sin(dot(vTex.xy, vec2(-12.9898,-78.233)) + seconds_mod) * 43758.5453));
	back2.rgb += (noise * intensity) - (intensity / 2.0);
	back2.rgb *= back2.a;
	
	gl_FragColor = mix(back1, back2, fronta);
}
