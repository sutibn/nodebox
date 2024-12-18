'use strict'
import State from './state.js'
import WebGL from './webgl.js'
import Input from '../utils/input.js'
import Shader from '../utils/shader.js'

class App {
    constructor() {
        this.canvas = document.getElementById('canvas')
        this.canvas.addEventListener('contextmenu', e => e.preventDefault())

        this.gl = this.init()
        this.shader = new Shader(this.gl, '../../shader/vert.glsl', '../../shader/frag.glsl')

        this.resize()
        this.w = this.canvas.width
        this.h = this.canvas.height
        window.onresize = this.resize.bind(this)

        this.tick = Date.now() / 1000.0
        this.delta = 0

        this.state = new State()
        this.impl = new WebGL(this.gl, this.shader, this.state)
    }

    init() {
        let canvas = document.getElementById('canvas')
        return canvas.getContext('webgl2')
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
    }

    start() {
        requestAnimationFrame(() => { this.update() })
    }

    update() {
        this.delta = (Date.now() / 1000.0) - this.tick
        this.tick  =  Date.now() / 1000.0

        this.state.update()
        Input.update()
        this.impl.update(this.gl, this.state, this.delta)

        this.render()
        requestAnimationFrame(() => { this.update() })
    }

    render() {
        this.impl.render(this.gl, this.canvas.width, this.canvas.height)
    }
}

export default App