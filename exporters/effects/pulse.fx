/////////////////////////////////////////////////////////
// Pulse effect
// Based on code by Danguafer/Silexars, used with permission
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float intensity;
uniform lowp float lighting;
uniform mediump float frequency;
uniform mediump float speed;
uniform mediump float centerX;
uniform mediump float centerY;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;
uniform mediump float seconds;

void main(void)
{
	mediump vec2 res = vec2(1.0 / pixelWidth, 1.0 / pixelHeight);
	mediump vec2 halfres = res / 2.0;
    mediump vec2 cPos = (vTex - vec2(centerX, 1.0 - centerY)) * res;
    mediump float cLength = length(cPos);

    mediump vec2 uv = vTex+(cPos/cLength)*sin(cLength/frequency/layerScale-seconds*speed)/25.0;
	lowp vec4 front = texture2D(samplerFront, mix(vTex, uv, intensity));
    lowp vec3 col = mix(front.rgb, front.rgb*50.0/cLength, lighting * intensity);

    gl_FragColor = vec4(col,front.a);
}
