#version 300 es

precision mediump float;

uniform vec3 u_color;

out vec4 o_fragColor;

void main(void) {
    o_fragColor = vec4(u_color, 1);
}

