/////////////////////////////////////////////////////////
// Pixellate effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float pixelWidth;
uniform mediump float pixelHeight;

uniform mediump float tilesize;

void main(void)
{
	mediump vec2 tilecount = vec2((1.0 / pixelWidth) / tilesize, (1.0 / pixelHeight) / tilesize);
	mediump vec2 tile = vec2(1.0 / tilecount.x, 1.0 / tilecount.y);
	mediump vec2 halftile = tile / 2.0;
	
	mediump vec2 tex = floor(vTex / tile) * tile + halftile;
	
	gl_FragColor = texture2D(samplerFront, tex);
}
