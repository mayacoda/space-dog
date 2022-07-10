uniform sampler2D uTexture;
uniform float uTime;

varying float vScale;


void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0);


    if (vScale > 0.6) {
        strength *= 3.0 * (sin(uTime + vScale * 1000.0) + 1.0);
    }

    vec4 color = texture2D(uTexture, gl_PointCoord);

    gl_FragColor = vec4(color.rgb * strength, color.a);
}
