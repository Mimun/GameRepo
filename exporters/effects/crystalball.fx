/////////////////////////////////////////////////////////
// Crystal Ball effect
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
const highmedp vec3 lightPosition = vec3(-0.5, 0.5, 1.0);
const highmedp vec3 ambientLightPosition = vec3(0.0, 0.0, 1.0);
uniform highmedp float radius;
uniform highmedp float refractiveIndex;

void main(void)
{
	highmedp vec2 center = vec2(0.5, 0.5);
	highmedp float aspectRatio = pixelWidth/pixelHeight;
 
	highmedp vec2 otherTex = vec2(vTex.x, (vTex.y * aspectRatio + 0.5 - 0.5 * aspectRatio));
	highmedp float distanceFromCenter = distance(center, otherTex);
	lowp float checkForPresenceWithinSphere = step(distanceFromCenter, radius);

	distanceFromCenter = distanceFromCenter / radius;

	highmedp float normalizedDepth = radius * sqrt(1.0 - distanceFromCenter * distanceFromCenter);
	highmedp vec3 sphereNormal = normalize(vec3(otherTex - center, normalizedDepth));

	highmedp vec3 refractedVector = 2.0 * refract(vec3(0.0, 0.0, -1.0), sphereNormal, refractiveIndex);
	refractedVector.xy = -refractedVector.xy;

	highmedp vec4 front = texture2D(samplerFront, (refractedVector.xy + 1.0) * 0.5);
	highmedp vec3 finalSphereColor = front.rgb;

	// Grazing angle lighting
	highmedp float lightingIntensity = 2.5 * (1.0 - pow(clamp(dot(ambientLightPosition, sphereNormal), 0.0, 1.0), 0.25));
	finalSphereColor += lightingIntensity;

	// Specular lighting
	lightingIntensity  = clamp(dot(normalize(lightPosition), sphereNormal), 0.0, 1.0);
	lightingIntensity  = pow(lightingIntensity, 15.0);
	finalSphereColor += vec3(0.8, 0.8, 0.8) * lightingIntensity;

	gl_FragColor = vec4(finalSphereColor, front.a) * checkForPresenceWithinSphere;
}
