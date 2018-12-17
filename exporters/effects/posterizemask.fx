/////////////////////////////////////////////////////////
// Posterize mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

uniform mediump float levels;

void main(void)
{	
	// Retrieve front and back pixels and unpremultiply
	lowp float fronta = texture2D(samplerFront, vTex).a;
	lowp vec4 back1 = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	lowp vec4 back2 = back1;
	back2.rgb /= back2.a;
	
	// Posterize and premultiply
	back2.rgb = floor(back2.rgb * (levels-1.0) + vec3(0.5)) / (levels-1.0);
	back2.rgb *= back2.a;
	
	// Output posterized pixel
	gl_FragColor = mix(back1, back2, fronta);
}
