'use strict'
import State from "./state.js"
import Input from "../util/input.js"
import Shader from "../util/shader.js"
import { WebGLApp } from "../../object.js"

class App {
    constructor() {
        this.impl = new WebGLApp()
        this.canvas = document.getElementById("canvas")
        this.canvas.addEventListener(
            "contextmenu", event => event.preventDefault())
        this.gl = this.init()
        this.shader = new Shader(this.gl,
            "../../shaders/vertex.glsl", "../../shaders/fragment.glsl")
        this.resize()
        this.w = this.canvas.width
        this.h = this.canvas.height
        window.onresize = this.resize.bind(this)
        this.appstate = new State()
    }

    init() {
        return this.impl.init()
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
    }

    start() {
        requestAnimationFrame(() => { this.update() })
    }

    update() {
        this.appstate.update()
        if (Input.isMouseClick(0)) {
            let scaleX = (this.w / this.canvas.width)
            let scaleY = (this.h / this.canvas.height)
            let pos = [Input.mouseX * scaleX, Input.mouseY * scaleY]
            let len = this.w / 15 * Math.sqrt(2)
            this.impl.addTriangle(this.gl, this.shader, pos, len)
        }

        if (this.appstate.getState('Canvas') == "Clear Canvas")
            this.impl.clearShapes()
        Input.update()
        this.render()
        requestAnimationFrame(() => { this.update() })
    }

    render() {
        this.shader.use()
        this.shader.setUniform2f("u_resolution", new Float32Array([this.w, this.h]))
        this.impl.render(this.gl, this.canvas.width, this.canvas.height)
    }
}

export default App