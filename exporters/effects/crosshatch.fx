/////////////////////////////////////////////////////////
// Crosshatch effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform highmedp float crosshatch_spacing;
uniform highmedp float line_width;

void main(void)
{
	highmedp vec4 front = texture2D(samplerFront, vTex);
	
	highmedp float lum = dot(front.rgb, vec3(0.2125, 0.7154, 0.0721));
     
	lowp vec3 colorToDisplay = vec3(1.0, 1.0, 1.0);
	
	if (lum < 1.00) 
	{
		if (mod(vTex.x + vTex.y, crosshatch_spacing) <= line_width) 
		{
			colorToDisplay = vec3(0.0, 0.0, 0.0);
		}
	}
	if (lum < 0.75) 
	{
		if (mod(vTex.x - vTex.y, crosshatch_spacing) <= line_width) 
		{
			colorToDisplay = vec3(0.0, 0.0, 0.0);
		}
	}
	if (lum < 0.50) 
	{
		if (mod(vTex.x + vTex.y - (crosshatch_spacing / 2.0), crosshatch_spacing) <= line_width) 
		{
			colorToDisplay = vec3(0.0, 0.0, 0.0);
		}
	}
	if (lum < 0.3) 
	{
		if (mod(vTex.x - vTex.y - (crosshatch_spacing / 2.0), crosshatch_spacing) <= line_width) 
		{
			colorToDisplay = vec3(0.0, 0.0, 0.0);
		}
	}

	gl_FragColor = vec4(colorToDisplay * front.a, front.a);
}
