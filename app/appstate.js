'use strict'

import Input from "../input/input.js"

class AppState {
    constructor() {
        // UI indicators
        this.ui_categories = {
            "Canvas": {
                "Clear Canvas": document.getElementById("clearCanvas"),                
            },
        }

        // State dictionary
        this.ui_state = {
            "Canvas": ""
        }

        // Default UI values
        this.updateUI("Canvas", "")
    }

    // Returns the content of a UI state
    getState(name) {
        return this.ui_state[name]
    }

    // Updates app state by checking changes in user input
    update() {
        // Canvas
        if (Input.isKeyDown("x"))
            this.updateUI("Canvas", "Clear Canvas")
        else
            this.updateUI("Canvas", "")
    }

    // Updates the ui to represent the current interaction
    updateUI(category, name, value = null) {
        this.ui_state[category] = name
        for (let key in this.ui_categories[category])
            this.updateUIElement(this.ui_categories[category][key], key == name, value)
    }

    // Updates a single ui element with given state and value
    updateUIElement(ele, state, val) {
        ele.classList.remove(state ? "inactive" : "active")
        ele.classList.add(state ? "active" : "inactive")
        if (state && val != null)
            ele.innerHTML = val
    }
}

export default AppState

