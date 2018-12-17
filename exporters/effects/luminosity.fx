/////////////////////////////////////////////////////////
// Luminosity effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
precision mediump float;

vec3 rgb_to_hsl(vec3 color)
{
	vec3 hsl = vec3(0.0, 0.0, 0.0);
	
	float fmin = min(min(color.r, color.g), color.b);
	float fmax = max(max(color.r, color.g), color.b);
	float delta = fmax - fmin;

	hsl.z = (fmax + fmin) / 2.0;

	if (delta == 0.0)
	{
		hsl.x = 0.0;
		hsl.y = 0.0;
	}
	else 
	{
		if (hsl.z < 0.5)
			hsl.y = delta / (fmax + fmin);
		else
			hsl.y = delta / (2.0 - fmax - fmin);
		
		float dR = (((fmax - color.r) / 6.0) + (delta / 2.0)) / delta;
		float dG = (((fmax - color.g) / 6.0) + (delta / 2.0)) / delta;
		float dB = (((fmax - color.b) / 6.0) + (delta / 2.0)) / delta;

		if (color.r == fmax)
			hsl.x = dB - dG;
		else if (color.g == fmax)
			hsl.x = (1.0 / 3.0) + dR - dB;
		else if (color.b == fmax)
			hsl.x = (2.0 / 3.0) + dG - dR;

		if (hsl.x < 0.0)
			hsl.x += 1.0;
		else if (hsl.x > 1.0)
			hsl.x -= 1.0;
	}

	return hsl;
}

float hue_to_rgb(float f1, float f2, float hue)
{
	if (hue < 0.0)
		hue += 1.0;
	else if (hue > 1.0)
		hue -= 1.0;
		
	float ret;
	
	if ((6.0 * hue) < 1.0)
		ret = f1 + (f2 - f1) * 6.0 * hue;
	else if ((2.0 * hue) < 1.0)
		ret = f2;
	else if ((3.0 * hue) < 2.0)
		ret = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
	else
		ret = f1;
	
	return ret;
}

vec3 hsl_to_rgb(vec3 hsl)
{
	vec3 rgb = vec3(hsl.z);
	
	if (hsl.y != 0.0)
	{
		float f2;
		
		if (hsl.z < 0.5)
			f2 = hsl.z * (1.0 + hsl.y);
		else
			f2 = (hsl.z + hsl.y) - (hsl.y * hsl.z);
			
		float f1 = 2.0 * hsl.z - f2;
		
		rgb.r = hue_to_rgb(f1, f2, hsl.x + (1.0 / 3.0));
		rgb.g = hue_to_rgb(f1, f2, hsl.x);
		rgb.b = hue_to_rgb(f1, f2, hsl.x - (1.0 / 3.0));
	}
	
	return rgb;
}

void main(void)
{
	// Retrieve front and back pixels
	vec4 front = texture2D(samplerFront, vTex);
	vec3 fronthsl = rgb_to_hsl(front.rgb / front.a);
	vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	vec3 backhsl = rgb_to_hsl(back.rgb / back.a);

	// Use luminosity of front and hue and saturation of back
	fronthsl = hsl_to_rgb(vec3(backhsl.x, backhsl.y, fronthsl.z));
	fronthsl *= front.a;

	gl_FragColor = vec4(fronthsl.r, fronthsl.g, fronthsl.b, front.a) * back.a;
}
