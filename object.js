'use strict'
import { getMousePos } from './js/util/input.js'
import { hex2rgb, deg2rad } from './js/util/helper.js'

class Shape {
    constructor(gl, shader, vtc, idc, color, mode, ele) {
        this.shader = shader
        this.color = color
        this.mode = mode
        this.ele = ele
        this.n = 2

        this.vtc = vtc
        this.vbo = null
        this.createVBO(gl)

        this.idc = idc
        this.ibo = null
        this.createIBO(gl)

        this.vao = null
        this.createVAO(gl, shader)
    }

    createVAO(gl, shader) {
        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)
        shader.setArrayBuffer("a_position", this.vbo, this.n)
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
        this.shader.setUniform3f("u_color", this.color)
        gl.drawElements(this.mode, this.ele, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

class Triangle extends Shape {
    constructor(gl, shader, pos, color, len) {
        let cosine = Math.cos(deg2rad(30))
        let sine = Math.sin(deg2rad(30))

        let idc = [0, 1, 2]
        let vtc = [
            pos.x,                pos.y - len,
            pos.x - cosine * len, pos.y + sine * len,
            pos.x + cosine * len, pos.y + sine * len,
        ]

        super(gl, shader, vtc, idc, color, gl.TRIANGLES, idc.length)
    }
}

class WebGLApp {
    constructor() {
        this.shapes = []
    }

    init() {
        const canvas = document.getElementById('canvas')
        if (!canvas) {
            console.error('No HTML5 Canvas')
            return
        }

        return canvas.getContext('webgl2')
    }

    setViewport(gl, w, h) {
        gl.viewport(0, 0, w, h)
    }

    clearCanvas(gl) {
        var color = hex2rgb('C0C0C0')
        gl.clearColor(...color, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        
        var self = this
        function check(e, self) {
            if (e.code === 88) {
                gl.clear(gl.COLOR_BUFFER_BIT)
                self.clearShapes()
            }
        }
        window.onkeypress = function(e) { check(e, self) }
    }

    addTriangle(gl, shader) {
        var color = hex2rgb('FFFFFF')
        var self = this

        function click(e, self) {
            var pos = getMousePos(e)
            self.shapes.push(new Triangle(gl, shader, pos, color, 50))
        }

        window.onmousedown = function(e) { click(e, self) }
    }

    clearShapes() {
        this.shapes = []
    }

    render(gl, w, h) {
        this.setViewport(gl, w, h)
        this.clearCanvas(gl)
        for (let i = 0; i < this.shapes.length; i++)
            this.shapes[i].render(gl)
    }
}

export {
    Triangle,
    WebGLApp
}