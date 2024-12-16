'use strict'
import Input from "../util/input.js"

class State {
    constructor() {
        this.column = {
            "Canvas": {
                "Clear Canvas": document.getElementById("clearCanvas"),                
            },
        }

        this.state = {
            "Canvas": ""
        }

        this.updateUI("Canvas", "")
    }

    getState(name) {
        return this.state[name]
    }

    update() {
        if (Input.isKeyDown("x"))
            this.updateUI("Canvas", "Clear Canvas")
        else
            this.updateUI("Canvas", "")
    }

    updateUI(col, name, val = null) {
        this.state[col] = name
        for (let key in this.column[col])
            this.updateElement(this.column[col][key], key == name, val)
    }

    updateElement(ele, st, val) {
        ele.classList.remove(st ? "inactive" : "active")
        ele.classList.add(st ? "active" : "inactive")
        if (st && val != null)
            ele.innerHTML = val
    }
}

export default State