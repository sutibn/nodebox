'use strict'
import { getRelativeMousePosition } from '../utils/utils.js'

class Input {
    constructor() {
        this.down_keys = {}
        this.pressed_keys = {}
        this.last_key_pressed = null
        this.mouse_down = {}
        this.mouse_clicked = {}
        this.mousex = 0
        this.mousey = 0
        this.last_mousex = 0
        this.last_mousey = 0

        window.onkeyup = (e) => 
            this.down_keys[e.key] = false;

        window.onkeydown = (e) => {
            this.down_keys[e.key]    = true
            this.pressed_keys[e.key] = true
            this.last_key_pressed    = e.key
        }

        window.onmousedown = (e) => {
            this.mouse_down[e.button] = true
            this.mouse_clicked[e.button] = true
        }

        window.onmouseup = (e) => 
            this.mouse_down[e.button] = false

        window.onmousemove = (e) => {
            const pos = getRelativeMousePosition(e)
            this.last_mousex = this.mousex
            this.last_mousey = this.mousey
            if (!(pos.x == null || pos.y == null)) {
                this.mousex = pos.x
                this.mousey = pos.y
            }
        }
        
        setInterval(() => {
            this.last_mousex = this.mousex
            this.last_mousey = this.mousey
        }, 50)
    }

    update() {
        for (let key in this.pressed_keys)
            this.pressed_keys[key]  = false
        for (let key in this.mouse_clicked)
            this.mouse_clicked[key] = false
    }

    getMouseDx() {
        return this.mousex - this.last_mousex
    }

    getMouseDy() {
        return this.mousey - this.last_mousey
    }

    getLastKeyPressed() {
        return this.last_key_pressed
    }

    isKeyDown(key_code) {
        return this.down_keys[key_code]
    }

    isKeyPressed(key_code) {
        return this.pressed_keys[key_code]
    }

    isMouseDown(button) {
        return this.mouse_down[button]
    }

    isMouseClicked(button) {
        return this.mouse_clicked[button]
    }
}

export default new Input()