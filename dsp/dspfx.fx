/* 
  drop shadow +
 gigatron for C2 
 V1.0 initial release 
 */
  
#ifdef GL_ES
precision mediump float;
#endif

uniform mediump sampler2D samplerBack;
uniform mediump sampler2D samplerFront;
varying mediump vec2 vTex;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);
 
uniform float speed,p1,p2,p3,rr,gg,bb;
 

void main()
{
		
	vec2 uv = vTex;
	vec4 tx = texture2D(samplerFront, uv,1.0);
    
	
    vec4 txs = texture2D(samplerFront,uv-vec2(p1,p2),1.0);
  
    for (float ii=0.01;ii<6.0;ii++){
  
	txs += texture2D(samplerFront,uv-vec2(p1,p2)-ii/250.0,1.0);
  
    tx.r  =  (p3 * txs.a*rr)/ii;
    tx.g  =  (p3 * txs.a*gg)/ii;
    tx.b  =  (p3 * txs.a*bb)/ii;
    tx.a +=txs.a;
	}
	
   	txs = texture2D(samplerFront, uv);
    
	
	
    gl_FragColor = mix(tx*p3,txs, txs.a);
	
	    
   
}