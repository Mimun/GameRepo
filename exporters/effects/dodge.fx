/////////////////////////////////////////////////////////
// Dodge effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
    front.rgb = (back.rgb * front.a) / (1.0 - front.rgb);
	
	gl_FragColor = front * back.a;
}
