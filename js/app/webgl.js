'use strict'
import Input from '../utils/input.js'
import { Box } from '../utils/object.js'
import { Scene } from '../utils/scene.js'
import { loadFile } from '../utils/loader.js'
import { hex2rgb, deg2rad } from '../utils/utils.js'
import * as vec3 from '../lib/glmatrix/vec3.js'
import * as mat4 from '../lib/glmatrix/mat4.js'

class WebGL {
    constructor(gl, shader, state) {
        this.setFlags(gl)
        this.shader = shader
        this.box = new Box(gl, shader)
        this.scene = null

        state.onOpen3DScene((name) => {
            let scene = JSON.parse(loadFile(`./scenes/${name}`))
            this.scene = new Scene(scene, gl, shader)
            return this.scene
        })

        this.eye = [2.0, 0.5, -2.0]
        this.center = [0, 0, 0]
        this.forward = null
        this.right = null
        this.up = null

        this.updateVec()
        this.view = mat4.lookAt(mat4.create(), this.eye, this.center, this.up)
        this.projection = mat4.perspective(mat4.create(), deg2rad(60), 16 / 9, 0.1, -0.1)

        this.shader.use()
        this.shader.setUniform4x4f('u_v', this.view)
        this.shader.setUniform4x4f('u_p', this.projection)
        this.shader.unuse()
    }  

    setFlags(gl) {
        gl.enable(gl.DEPTH_TEST)
    }

    setViewport(gl, w, h) {
        gl.viewport(0, 0, w, h)
    }

    clearCanvas(gl) {
        gl.clearColor(...hex2rgb('#000000'), 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
    
    update(gl, state, delta) {
        if (this.scene != null) {
            let mode = state.getState('Mode')
            let nodes = this.scene.getNodes()
            for (const ele of nodes) {
                if ('obj' in ele) {
                    if (mode == 'Triangle')
                        ele.setMode(gl.TRIANGLES)
                    else
                        ele.setMode(gl.POINTS)
                }
            }
        }

        switch(state.getState('Control')) {
            case 'Camera':
                this.updateCam(delta)
                break
            case 'Node':
                if (this.scene == null)
                    break
                let node = this.scene.getNode(state.getState('Select'))
                this.updateNode(node, delta)
                break
        }
    }

    updateVec() {
        this.forward = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.eye, this.center))
        this.right = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), [0, 1, 0], this.forward))
        this.up = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.forward, this.right))
    }

    updateCam(delta) {
        let dirty = false

        if (Input.isMouseDown(2)) {
            let t = vec3.scale(vec3.create(), this.forward, -Input.getDy() * delta)
            this.eye = vec3.add(vec3.create(), this.eye, t)
            dirty = true
        }

        if (Input.isMouseDown(0) && !Input.isKeyDown(' ')) {
            this.eye = vec3.rotateY(vec3.create(), this.eye, this.center, deg2rad(-50 * Input.getDx() * delta))
            let r = mat4.fromRotation(mat4.create(), deg2rad(-50 * Input.getDy() * delta), this.right)
            this.eye = vec3.transformMat4(vec3.create(), this.eye, r)
            dirty = true
        }

        if (Input.isMouseDown(1) || (Input.isMouseDown(0) && Input.isKeyDown(' '))) {
            let t = vec3.add(vec3.create(), 
                vec3.scale(vec3.create(), this.right, -Input.getDx() * delta),
                vec3.scale(vec3.create(), this.up,     Input.getDy() * delta)
            )

            this.eye = vec3.add(vec3.create(), this.eye, t)
            this.center = vec3.add(vec3.create(), this.center, t)
            dirty = true
        }

        if (dirty) {
            this.updateVec()
            this.view = mat4.lookAt(mat4.create(), this.eye, this.center, this.up)
            this.shader.use()
            this.shader.setUniform4x4f('u_v', this.view)
            this.shader.unuse()
        }
    }

    updateNode(node, delta) {
        let dirty = false
        let t = mat4.create()
        let r = mat4.create()
        let s = mat4.create()

        if (Input.isMouseDown(2)) {
            let d = 1.0 + Input.getDy() * delta
            s = mat4.fromScaling(mat4.create(), [d, d, d])
            dirty = true
        }

        if (Input.isMouseDown(0) && !Input.isKeyDown(' ')) {
            let r_up    = mat4.fromRotation(mat4.create(), deg2rad(50 * Input.getDx() * delta), this.up)
            let r_right = mat4.fromRotation(mat4.create(), deg2rad(50 * Input.getDy() * delta), this.right)
            r = mat4.multiply(mat4.create(), r_right, r_up)
            dirty = true
        }

        if (Input.isMouseDown(1) || (Input.isMouseDown(0) && Input.isKeyDown(' '))) {
            t = mat4.fromTranslation(mat4.create(),
                vec3.add(vec3.create(), 
                    vec3.scale(vec3.create(), this.right, Input.getDx() * delta),
                    vec3.scale(vec3.create(), this.up,   -Input.getDy() * delta)
                ))
            dirty = true
        }

        if (dirty) {
            let w = mat4.clone(node.getWorld())
            let i = null

            if (w != null) {
                w[12] = 0, w[13] = 0, w[14] = 0
                i = mat4.invert(mat4.create(), w)
            } else {
                w = mat4.create()
                i = mat4.create()
            }

            let transformation = node.getTransformation()
            transformation = mat4.multiply(mat4.create(), transformation, s)
            transformation = mat4.multiply(mat4.create(), transformation, i)
            transformation = mat4.multiply(mat4.create(), transformation, t)
            transformation = mat4.multiply(mat4.create(), transformation, r)
            transformation = mat4.multiply(mat4.create(), transformation, w)        
            node.setTransformation(transformation)
        }
    }

    render(gl, w, h) {
        this.setViewport(gl, w, h)
        this.clearCanvas(gl)
        this.box.render(gl)
        if (this.scene)
            this.scene.render(gl)
    }
}

export default WebGL