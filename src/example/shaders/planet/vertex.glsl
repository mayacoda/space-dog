uniform vec3 viewVector;

attribute float aRandom;

varying float vIntensity;
varying vec3 vColor;
varying float vRandom;

void main() {

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

    vec3 viewDirection = normalize(-viewPosition.xyz);
    vec3 viewNormalVector  = normalize(normalMatrix * normal.xyz);

    float dotProduct = dot(viewDirection, viewNormalVector);
    vIntensity = pow(abs(dotProduct), 1.8) ;

    mat4 inv = inverse(viewMatrix);

    vec3 pos = vec3(inv[3]);
    vec3 dir = -vec3(inv[2]);

    vec3 normalNormal = normalize(normal);
    vec3 normalView = normalize(viewVector);

    vColor = vec3(1.0);
    vRandom = aRandom;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
