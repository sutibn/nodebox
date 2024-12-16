'use strict'

function getMousePos(event) {
    let target = event.target
    if (target.id != 'canvas') {
        return {
            x: -Infinity,
            y: +Infinity,
        }
    }

    target = target || event.target;
    let rect = target.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

class Input {
    constructor() {
        this.keyDown = {}
        this.keyPress = {}
        this.lastKey = null

        this.mouseDown = {}
        this.mouseClick = {}

        this.mouseX = 0
        this.mouseY = 0

        this.lastX = 0
        this.lastY = 0
        
        window.onkeyup = (e) =>
            this.keyDown[e.key] = false

        window.onkeydown = (e) => {
            this.keyDown[e.key] = true
            this.keyPress[e.key] = true
            this.lastKey = e.key
        }
        
        window.onmouseup = (e) =>
            this.mouseDown[e.button] = false

        window.onmousedown = (e) => {
            this.mouseDown[e.button] = true
            this.mouseClick[e.button] = true
        }
        
        window.onmousemove = (e) => {
            const pos = getMousePos(e)
            this.lastX = this.mouseX
            this.lastY = this.mouseY
            if (!(pos.x == null || pos.y == null)) {
                this.mouseX = pos.x
                this.mouseY = pos.y
            }
        }
        
        setInterval(() => {
            this.lastX = this.mouseX
            this.lastY = this.mouseY
        }, 50)
    }

    update() {
        for (let key in this.keyPress)
            this.keyPress[key] = false
        for (let key in this.mouseClick)
            this.mouseClick[key] = false
    }

    getMouseDx() { 
        return this.mouseX - this.lastX
    }

    getMouseDy() {
        return this.mouseY - this.lastY
    }

    getLastKeyPress() {
        return this.lastKey
    }

    isKeyDown(x) {
        return this.keyDown[x]
    }

    isKeyPress(x) {
        return this.keyPress[x]
    }

    isMouseDown(x) {
        return this.mouseDown[x]
    }
        
    isMouseClick(x) {
        return this.mouseClick[x]
    }
}

export default new Input()
export {
    getMousePos
}