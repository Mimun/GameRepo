/////////////////////////////////////////////////////////
// Sphere effect
// Based on the glass sphere filter from GPUImage: https://github.com/BradLarson/GPUImage
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform highmedp float radius;
uniform highmedp float refractiveIndex;
uniform highmedp float progress;

void main(void)
{
	highmedp vec2 center = vec2(0.5, 0.5);
	highmedp float aspectRatio = pixelWidth/pixelHeight;

	highmedp vec2 otherTex = vec2(1.0 - vTex.x, ((1.0 - vTex.y) * aspectRatio + 0.5 - 0.5 * aspectRatio));
	highmedp float distanceFromCenter = distance(center, otherTex);
	lowp float checkForPresenceWithinSphere = mix(1.0, step(distanceFromCenter, radius), progress);

	distanceFromCenter = distanceFromCenter / radius;

	highmedp float normalizedDepth = radius * sqrt(1.0 - distanceFromCenter * distanceFromCenter);
	highmedp vec3 sphereNormal = normalize(vec3(otherTex - center, normalizedDepth));

	highmedp vec3 refractedVector = refract(vec3(0.0, 0.0, -1.0), sphereNormal, refractiveIndex);

	gl_FragColor = texture2D(samplerFront, mix(vTex, ((refractedVector.xy + 1.0) * 0.5) * checkForPresenceWithinSphere, progress));
}
