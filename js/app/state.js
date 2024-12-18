'use strict'
import Input from '../utils/input.js'

class State {
    constructor() {
        this.column = {
            'Mode': {
                'Point':    document.getElementById('modeDot'),
                'Triangle': document.getElementById('modeTri')
            },

            'Control': {
                'Camera': document.getElementById('controlCamera'),
                'Node':   document.getElementById('controlNode')
            },

            'Select': document.getElementById('selectNode'),
            'Scene':  document.getElementById('openfileActionInput')
        }

        this.state = {
            'Mode':    '',
            'Control': '',
            'Select':  '',
        }

        this.updateUI('Mode', 'Point')
        this.updateUI('Control', 'Camera')

        this.column['Select'].onchange = () => {
            this.state['Select'] = this.column['Select'].value
        }

        this.onOpen3DSceneCallback = null
        this.column['Scene'].onchange = (e) => {
            if (this.onOpen3DSceneCallback == null)
                return
            
            let scene = this.onOpen3DSceneCallback(e.target.files[0].name)
            this.column['Select'].innerHTML = ''
            for (let node of scene.getNodes()) {
                let option = document.createElement('option')
                option.value = node.name
                option.innerHTML = node.name
                this.column['Select'].appendChild(option)
            }

            this.column['Select'].removeAttribute('disabled')
            this.column['Select'].value = this.column['Select'].getElementsByTagName('option')[0].value
            this.state['Select'] = this.column['Select'].value
        }
    }

    onOpen3DScene(callback) {
        this.onOpen3DSceneCallback = callback
    }

    getState(name) {
        return this.state[name]
    }

    update() {
        if (Input.isKeyPress('1'))
            this.updateUI('Mode', 'Point')
        else if (Input.isKeyPress('2'))
            this.updateUI('Mode', 'Triangle')
        if (Input.isKeyDown('q') || Input.isKeyDown('Q'))
            this.updateUI('Control', 'Node')
        else
            this.updateUI('Control', 'Camera')
    }

    updateUI(col, name, val = null) {
        this.state[col] = name
        for (let key in this.column[col])
            this.updateElement(this.column[col][key], key == name, val)
    }

    updateElement(ele, state, val) {
        ele.classList.remove(state ? 'inactive' : 'active')
        ele.classList.add(state ? 'active' : 'inactive')
        if (state && val != null)
            ele.innerHTML = val
    }
}

export default State