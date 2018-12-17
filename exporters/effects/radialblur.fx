/////////////////////////////////////////////////////////
// Radial blur effect
precision mediump float;
varying vec2 vTex;
uniform sampler2D samplerFront;

uniform float pixelWidth;
uniform float pixelHeight;
uniform float intensity;
uniform float radius;

void main(void)
{
	vec2 dir = 0.5 - vTex; 
	float dist = sqrt(dir.x*dir.x + dir.y*dir.y); 
	dir = dir/dist; 
	vec4 front = texture2D(samplerFront, vTex); 

	vec4 sum = front;

	sum += texture2D(samplerFront, vTex + dir * -0.08 * radius);
	sum += texture2D(samplerFront, vTex + dir * -0.05 * radius);
	sum += texture2D(samplerFront, vTex + dir * -0.03 * radius);
	sum += texture2D(samplerFront, vTex + dir * -0.02 * radius);
	sum += texture2D(samplerFront, vTex + dir * -0.01 * radius);
	sum += texture2D(samplerFront, vTex + dir * 0.01 * radius);
	sum += texture2D(samplerFront, vTex + dir * 0.02 * radius);
	sum += texture2D(samplerFront, vTex + dir * 0.03 * radius);
	sum += texture2D(samplerFront, vTex + dir * 0.05 * radius);
	sum += texture2D(samplerFront, vTex + dir * 0.08 * radius);

	sum /= 11.0;

	float t = dist * 2.2;
	t = clamp(t, 0.0, 1.0);

	gl_FragColor = mix(front, mix(front, sum, t), intensity);
}
