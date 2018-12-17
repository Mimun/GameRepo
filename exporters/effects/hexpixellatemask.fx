/////////////////////////////////////////////////////////
// Hexagonal pixellate mask effect
// Based on code from glfx.js: https://github.com/evanw/glfx.js
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
precision mediump float;
uniform vec2 destStart;
uniform vec2 destEnd;
uniform float pixelWidth;
uniform float pixelHeight;
uniform float scale;

void main()
{
	float fronta = texture2D(samplerFront, vTex).a;
	vec2 texSize = vec2(1.0 / pixelWidth, 1.0 / pixelHeight);
	vec2 tex = (mix(destStart, destEnd, vTex) * texSize - vec2(0.5, 0.5)) / scale;
	tex.y /= 0.866025404;
	tex.x -= tex.y * 0.5;
	
	vec2 a;
	if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0)
		a = vec2(floor(tex.x), floor(tex.y));
	else
		a = vec2(ceil(tex.x), ceil(tex.y));
	
	vec2 b = vec2(ceil(tex.x), floor(tex.y));
	vec2 c = vec2(floor(tex.x), ceil(tex.y));
	
	vec3 tex2 = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);
	vec3 a2 = vec3(a.x, a.y, 1.0 - a.x - a.y);
	vec3 b2 = vec3(b.x, b.y, 1.0 - b.x - b.y);
	vec3 c2 = vec3(c.x, c.y, 1.0 - c.x - c.y);
	
	float alen = length(tex2 - a2);
	float blen = length(tex2 - b2);
	float clen = length(tex2 - c2);
	
	vec2 choice;
	if (alen < blen)
	{
		if (alen < clen)
			choice = a;
		else
			choice = c;
	}
	else
	{
		if (blen < clen)
			choice = b;
		else
			choice = c;
	}
	
	choice.x += choice.y * 0.5;
	choice.y *= 0.866025404;
	choice *= scale / texSize;
	gl_FragColor = texture2D(samplerBack, choice + vec2(0.5, 0.5) / texSize) * fronta;
}