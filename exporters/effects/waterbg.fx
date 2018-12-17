/////////////////////////////////////////////////////////
// Water background effect
// Based on code by Viktor Korsun
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

precision mediump float;
uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;

const float PI = 3.1415926535897932;

// speed
uniform float speed;
uniform float speed_x;
uniform float speed_y;

// geometry
uniform float intensity;
const int steps = 8;
uniform float frequency;
uniform float angle; // better when a prime

// reflection and emboss
uniform float delta;
uniform float intence;
uniform float emboss;

float col(vec2 coord)
{
	float delta_theta = 2.0 * PI / angle;
	float col = 0.0;
	float theta = 0.0;
	for (int i = 0; i < steps; i++)
	{
		vec2 adjc = coord;
		theta = delta_theta*float(i);
		adjc.x += cos(theta)*seconds*speed + seconds * speed_x;
		adjc.y -= sin(theta)*seconds*speed - seconds * speed_y;
		col = col + cos( (adjc.x*cos(theta) - adjc.y*sin(theta))*frequency)*intensity;
	}

	return cos(col);
}

void main(void)
{
	vec2 p = vTex, c1 = p, c2 = p;
	float cc1 = col(c1);

	c2.x += (1.0 / pixelWidth) / delta;
	float dx = emboss*(cc1-col(c2))/delta;

	c2.x = p.x;
	c2.y += (1.0 / pixelHeight) / delta;
	float dy = emboss*(cc1-col(c2))/delta;

	c1.x += dx;
	c1.y = -(c1.y+dy);

	float alpha = 1.+dot(dx,dy)*intence;
	c1.y = -c1.y;
	lowp vec4 front = texture2D(samplerFront,c1) * alpha;
	lowp vec4 result;
	
	if (front.a == 0.0)
		result = front + texture2D(samplerBack, mix(destStart, destEnd, vTex)) * (1.0 - front.a);
	else
		result = front + texture2D(samplerBack, mix(destStart, destEnd, c1)) * (1.0 - front.a);
	
	gl_FragColor = result;
}
