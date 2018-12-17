/////////////////////////////////////////////////////////
// Alpha Threshold effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float threshold;
uniform mediump float smoothness;
uniform mediump float unpremultiply;


void main(void)
{
	lowp vec4 color = texture2D( samplerFront, vTex ) ;
	if( unpremultiply > 0.0 ){ color.rgb /= color.a ; }
	
	mediump float range = ( color.a - (1.0 - threshold) - (smoothness * 0.05) ) / (0.0001 + smoothness * 0.1) ;
	color.a = smoothstep( 0.0, 1.0, range ) ;
	color.rgb *= color.a ;
	
	gl_FragColor = color ;
}