/////////////////////////////////////////////////////////
// Pixellate mask effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

uniform mediump float pixelWidth;
uniform mediump float pixelHeight;

uniform mediump float tilesize;

void main(void)
{
	lowp float fronta = texture2D(samplerFront, vTex).a;
	
	mediump vec2 tilecount = vec2((1.0 / pixelWidth) / tilesize, (1.0 / pixelHeight) / tilesize);
	mediump vec2 tile = vec2(1.0 / tilecount.x, 1.0 / tilecount.y);
	mediump vec2 halftile = tile / 2.0;
	
	mediump vec2 tex = floor(vTex / tile) * tile + halftile;
	
	gl_FragColor = vec4(texture2D(samplerBack, mix(destStart, destEnd, tex)).rgb * fronta, fronta);
}
