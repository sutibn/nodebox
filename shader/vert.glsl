#version 300 es

in vec3 a_position;
uniform mat4x4 u_m;
uniform mat4x4 u_v;
uniform mat4x4 u_p;

void main() {
    gl_PointSize = 2.0f;
    gl_Position = u_p * u_v * u_m * vec4(a_position, 1.0);
}