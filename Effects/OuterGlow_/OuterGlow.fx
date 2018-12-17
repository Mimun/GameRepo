///////////////////////////////////////////
//OuterGlow effect
//chrisbrobs2016

varying mediump vec2 vTex;
uniform mediump sampler2D samplerFront;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float strength;  //0 to 16

void main(void)                   
{
   mediump vec4 front = texture2D(samplerFront, vTex);

   mediump vec2 Tex2= vTex;    
    
   mediump float halfpixW = pixelWidth / 2.0;
   mediump float halfpixH = pixelHeight / 2.0;
   mediump float trans = 0.0588;        
   mediump float blur = (strength/2.0);
   
  mediump vec4 finalblur = vec4(0.0);

 finalblur += texture2D(samplerFront, Tex2.xy) * trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x - (halfpixW*blur), Tex2.y))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x - (halfpixW*blur), Tex2.y -(halfpixH*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x - (halfpixW*blur), Tex2.y + (halfpixH*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x + (halfpixW*blur), Tex2.y))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x + (halfpixW*blur), Tex2.y-(halfpixH*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x + (halfpixW*blur), Tex2.y + (halfpixH*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x, Tex2.y - (halfpixH*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x, Tex2.y + (halfpixH*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x - (pixelWidth*blur), Tex2.y))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x - (pixelWidth*blur), Tex2.y -(pixelHeight*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x - (pixelWidth*blur), Tex2.y + (pixelHeight*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x + (pixelWidth*blur), Tex2.y))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x + (pixelWidth*blur), Tex2.y-(pixelHeight*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x + (pixelWidth*blur), Tex2.y + (pixelHeight*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x, Tex2.y - (pixelHeight*blur)))*trans;
 finalblur += texture2D(samplerFront, vec2(Tex2.x, Tex2.y + (pixelHeight*blur)))*trans;    

 gl_FragColor = mix((vec4(0.0,0.0,0.0,1.6)), max(front, finalblur), 4.0)*(1.-front.a) + front;
    
}
