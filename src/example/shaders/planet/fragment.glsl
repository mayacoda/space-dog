varying float vIntensity;
varying vec3 vColor;
varying float vRandom;

void main()
{
    vec3 glow = vColor * vIntensity;
    gl_FragColor = vec4( glow, 1.0 );
}
