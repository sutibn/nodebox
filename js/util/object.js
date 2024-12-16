'use strict'
import * as mat4 from '../lib/glmatrix/mat4.js'

class Object {
    constructor(gl, shader, vtc, idc, mode) {
        this.mat = mat4.identity(mat4.create())
        this.shader = shader
        this.mode = mode
        this.n = 3

        this.vtc = vtc
        this.vbo = null
        this.createVBO(gl)

        this.idc = idc
        this.ibo = null
        this.createIBO(gl)

        this.vao = null
        this.createVAO(gl, shader)
    }

    setMode(mode) {
        this.mode = mode
    }

    setTransformation(transformation) {
        this.mat = transformation
    }

    createVAO(gl, shader) {
        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.enableVertexAttribArray(shader.getAttributeLocation('a_position'))
        let step = 0, off = 0
        gl.vertexAttribPointer(shader.getAttributeLocation('a_position'), this.n, gl.FLOAT, false, step, off)
        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    createVBO(gl) {
        this.vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtc), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    createIBO(gl) {
        this.ibo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.idc), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }

    render(gl) {
        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
        this.shader.use()
        this.shader.setUniform4x4f('u_m', this.mat)
        gl.drawElements(this.mode, this.idc.length, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        this.shader.unuse()
    }
}

class Box extends Object {
    constructor(gl, shader) {
        let vtc = [
             1.000000,  1.000000, -1.000000,
             1.000000, -1.000000, -1.000000,
             1.000000,  1.000000,  1.000000,
             1.000000, -1.000000,  1.000000,
            -1.000000,  1.000000, -1.000000,
            -1.000000, -1.000000, -1.000000,
            -1.000000,  1.000000,  1.000000,
            -1.000000, -1.000000,  1.000000
        ]

        let idc = [
            0, 1,
            1, 3,
            3, 2,
            2, 0,
            0, 4,
            1, 5,
            2, 6,
            3, 7,
            4, 5,
            5, 7,
            7, 6,
            6, 4
        ]
        
        super(gl, shader, vtc, idc, gl.LINES)
    }
}

export {
    Object,
    Box
}