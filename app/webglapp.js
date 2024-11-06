import { hex2rgb, deg2rad, getRelativeMousePosition } from './js/utils/utils.js'

class Shape {
    constructor(gl, shader, vertices, indices, color, draw_mode, num_elements) {
        this.shader = shader

        this.vertices = vertices
        this.vertices_buffer = null
        this.createVBO(gl)

        this.indices = indices
        this.index_buffer = null
        this.createIBO(gl)

        this.color = color
        this.draw_mode = draw_mode
        this.num_components = 2
        this.num_elements = num_elements

        this.vertex_array_object = null
        this.createVAO(gl, shader)
    }

    // Sets up a vertex attribute object used during rendering to point WebGL to buffer access
    createVAO(gl, shader) {
        this.vertex_array_object = gl.createVertexArray()
        gl.bindVertexArray(this.vertex_array_object)
        shader.setArrayBuffer("a_position", this.vertices_buffer, this.num_components)
        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    // Creates vertex buffer object for vertex data
    createVBO(gl) {
        this.vertices_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    // Creates index buffer object for vertex data
    createIBO(gl) {
        this.index_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }

    // Render call for an individual shape
    render(gl) {
        gl.bindVertexArray(this.vertex_array_object)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
        this.shader.setUniform3f("u_color", this.color)
        gl.drawElements(this.draw_mode, this.num_elements, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

// Triangle extension for Shape, creates vertex list and indices and calls the super constructor.
class Triangle extends Shape {
    constructor(gl, shader, position, color, sideLength) {
        let cosangle = Math.cos(deg2rad(30))
        let sinangle = Math.sin(deg2rad(30))

        var cx = position.x
        var cy = position.y

        // Create a list of vertices defining the triangle
        let vertices = [
            cx, cy - sideLength,
            cx - cosangle*sideLength, cy + sinangle*sideLength,
            cx + cosangle*sideLength, cy + sinangle*sideLength,
        ]

        // Create a list of indices referencing the vertices in order
        let indices = [0, 1, 2]

        super(gl, shader, vertices, indices, color, gl.TRIANGLES, indices.length)
    }
}

// WebGlApp that calls basic GL functions, manages a list of shapes, and renders them
class WebGlApp {
    // Initializes an empty list of shapes
    constructor() {
        this.shapes = []
    }

    // Initializes webgl2
    initGl() {
        const canvas = document.getElementById('canvas')
        if (!canvas) {
            console.error('No HTML5 Canvas found on this page.')
            return
        }
        return canvas.getContext('webgl2')
    }

    // Sets viewport of the canvas to fill the full width and height of the canvas
    setViewport(gl, width, height) {
        gl.viewport(0, 0, width, height)
    }

    // Clears canvas color
    clearCanvas(gl) {
        var agblue = hex2rgb('022851')
        gl.clearColor(...agblue, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        var self = this
        function check(e, self) {
            if (e.code === 88) {
                gl.clear(gl.COLOR_BUFFER_BIT)
                self.clearShapes()
            }
        }
        window.onkeypress = function(e) { check(e, self)}
    }

    // Adds triangle to the list of shapes
    addTriangle(gl, shader, position, sideLength) {
        var gold = hex2rgb('FFBF00')
        var self = this
        function click(e, self) {
            var pos = getRelativeMousePosition(e)
            self.shapes.push(new Triangle(gl, shader, pos, gold, 50))
        }
        window.onmousedown = function(e) { click(e, self) }
    }

    // Clears list of shapes, emptying canvas
    clearShapes() {
        this.shapes = []
    }

    // Main render loop which sets up the active viewport
    render(gl, canvas_width, canvas_height) {
        this.setViewport(gl, canvas_width, canvas_height)
        this.clearCanvas(gl)
        for (let i = 0; i < this.shapes.length; i++)
            this.shapes[i].render(gl)
    } 
}

export {
    Triangle,
    WebGlApp
}

