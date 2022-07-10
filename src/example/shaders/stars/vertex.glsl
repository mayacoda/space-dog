uniform float uSize;

attribute float aScale;

varying float vScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = aScale * uSize * 10.0;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vScale = aScale;
}
