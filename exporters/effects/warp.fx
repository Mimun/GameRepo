/////////////////////////////////////////////////////////
// Warp effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;

uniform mediump float freqX;
uniform mediump float freqY;
uniform mediump float ampX;
uniform mediump float ampY;
uniform mediump float speedX;
uniform mediump float speedY;

void main(void)
{	
	mediump float boxLeft = 0.0;
	mediump float boxTop = 0.0;
	mediump float aspect = pixelHeight / pixelWidth;
	
	mediump vec2 p = vTex;
    p.x += (cos((vTex.y - boxTop) * freqX / layerScale / (pixelWidth * 750.0) + (seconds * speedX)) * ampX * pixelWidth * layerScale);
	p.y += (sin((vTex.x - boxLeft) * freqY * aspect / layerScale / (pixelHeight * 750.0) + (seconds * speedY)) * ampY * pixelHeight * layerScale);
	
	gl_FragColor = texture2D(samplerFront, p);
}
