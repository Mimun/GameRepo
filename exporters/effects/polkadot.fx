/////////////////////////////////////////////////////////
// Polka dot effect
// Based on code from GPUImage: https://github.com/BradLarson/GPUImage
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float dotSize;
uniform mediump float dotScale;

void main(void)
{
	mediump float aspectRatio = pixelWidth / pixelHeight;
	mediump vec2 sampleDivisor = vec2(dotSize, dotSize / aspectRatio);

	mediump vec2 samplePos = vTex - mod(vTex, sampleDivisor) + 0.5 * sampleDivisor;
	mediump vec2 textureCoordinateToUse = vec2(vTex.x, (vTex.y * aspectRatio + 0.5 - 0.5 * aspectRatio));
	mediump vec2 adjustedSamplePos = vec2(samplePos.x, (samplePos.y * aspectRatio + 0.5 - 0.5 * aspectRatio));
	mediump float distanceFromSamplePoint = distance(adjustedSamplePos, textureCoordinateToUse);
	lowp float checkForPresenceWithinDot = step(distanceFromSamplePoint, (dotSize * 0.5) * dotScale);

	gl_FragColor = texture2D(samplerFront, samplePos) * checkForPresenceWithinDot;
}
