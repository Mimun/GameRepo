/////////////////////////////////////////////////////////
// Posterize effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float levels;

void main(void)
{	
	// Retrieve source pixel and unpremultiply
	mediump vec4 front = texture2D(samplerFront, vTex);
	lowp float a = front.a;
	
	if (a != 0.0)
		front.rgb /= a;
	
	// Posterize and premultiply
	front.rgb = floor(front.rgb * (levels-1.0) + vec3(0.5)) / (levels-1.0);
	
	front.rgb *= a;
	
	// Output posterized pixel
	gl_FragColor = front;
}
