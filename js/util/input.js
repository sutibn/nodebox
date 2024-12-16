'use strict'

function getMousePos(e) {
    let target = e.target
    if (target.id != 'canvas')
        return { x: null, y: null }
    target = target || e.target
    let rect = target.getBoundingClientRect()
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }
}

class Input {
    constructor() {
        this.keyDown = {}
        this.keyPress = {}
        this.lastKey = null

        this.mouseDown = {}
        this.mouseClick = {}

        this.x = 0
        this.y = 0

        this.lastX = 0
        this.lastY = 0

        window.onkeyup = (e) => this.keyDown[e.key] = false
        window.onkeydown = (e) => {
            this.keyDown[e.key] = true
            this.keyPress[e.key] = true
            this.lastKey = e.key
        }

        window.onmouseup = (e) => this.mouseDown[e.button] = false
        window.onmousedown = (e) => {
            this.mouseDown[e.button] = true
            this.mouseClick[e.button] = true
        }

        window.onmousemove = (e) => {
            const pos = getMousePos(e)
            this.lastX = this.x
            this.lastY = this.y
            if (!(pos.x == null || pos.y == null)) {
                this.x = pos.x
                this.y = pos.y
            }
        }

        setInterval(() => {
            this.lastX = this.x
            this.lastY = this.y
        }, 50)
    }

    update() {
        for (let key in this.keyPress)
            this.keyPress[key] = false
        for (let key in this.mouseClick)
            this.mouseClick[key] = false
    }

    getDx() {
        return this.x - this.lastX
    }

    getDy() {
        return this.y - this.lastY
    }

    getLastKey() {
        return this.lastKey
    }

    isKeyDown(key) {
        return this.keyDown[key]
    }

    isKeyPress(key) {
        return this.keyPress[key]
    }

    isMouseDown(button) {
        return this.mouseDown[button]
    }

    isMouseClick(button) {
        return this.mouseClick[button]
    }
}

export default new Input()
export {
    getMousePos
}