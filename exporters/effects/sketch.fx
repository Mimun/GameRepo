/////////////////////////////////////////////////////////
// Sketch effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

precision mediump float;
uniform float pixelWidth;
uniform float pixelHeight;

void main()
{
	float dx = pixelWidth;
	float dy = pixelHeight;
	
    float bottomLeftIntensity = texture2D(samplerFront, vTex + vec2(-dx, dy)).r;
    float topRightIntensity = texture2D(samplerFront, vTex + vec2(dx, -dy)).r;
    float topLeftIntensity = texture2D(samplerFront, vTex + vec2(-dx, -dy)).r;
    float bottomRightIntensity = texture2D(samplerFront, vTex + vec2(dx, dy)).r;
    float leftIntensity = texture2D(samplerFront, vTex + vec2(-dx, 0.0)).r;
    float rightIntensity = texture2D(samplerFront, vTex + vec2(dx, 0.0)).r;
    float bottomIntensity = texture2D(samplerFront, vTex + vec2(0.0, dy)).r;
    float topIntensity = texture2D(samplerFront, vTex + vec2(0.0, -dy)).r;
    float h = -topLeftIntensity - 2.0 * topIntensity - topRightIntensity + bottomLeftIntensity + 2.0 * bottomIntensity + bottomRightIntensity;
    float v = -bottomLeftIntensity - 2.0 * leftIntensity - topLeftIntensity + bottomRightIntensity + 2.0 * rightIntensity + topRightIntensity;
    
    float mag = 1.0 - length(vec2(h, v));
	float a = texture2D(samplerFront, vTex).a;
     
    gl_FragColor = vec4(vec3(mag) * a, a);
}