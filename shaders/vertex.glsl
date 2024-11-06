#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
    // Convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // Convert from 0 -> 1 to 0 -> 2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from 0 -> 2 to -1 -> +1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    gl_PointSize = 10.0;
}

