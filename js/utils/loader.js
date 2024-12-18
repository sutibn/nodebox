'use strict'

function loadFile(url) {
    let req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send(null)
    return (req.status == 200) ? req.responseText : null
}

class Loader {
    constructor(name) {
        this.name = name
    }

    load() {
        let file = loadFile(this.name)
        let vtc = []
        let idc = []
        for (let line of file.split('\n')){
            let token = line.split(' ')[0]
            switch(token) {
                case 'v':
                    vtc.push(...this.parseV(line))
                    break
                case 'f':
                    idc.push(...this.parseF(line))
                    break
            }
        }

        let max = -Infinity
        let min = Infinity
        for (let v of vtc) {
            if (v > max) max = v
            if (v < min) min = v
        }

        let d = max - min
        for (let i = 0; i < vtc.length; i++)
            vtc[i] = 2 * ((vtc[i] - min) / d) - 1.0
        
        return [vtc, idc]
    }

    parseV(v_str) {
        let line = v_str.split(' ')
        let coord = []
        for (let i = 1; i < line.length; i++)
            coord.push(parseFloat(line[i]))
        return coord
    }

    parseF(f_str) {
        let line = f_str.split(' ')
        let idx = []
        for (let i = 1; i < line.length; i++) {
            if (line[i].includes('/')) {
                let vals = line[i].split('/')
                idx.push(parseInt(vals[0]) - 1)
            } else
                idx.push(parseInt(line[i]) - 1)
        }

        if (idx.length == 4) {
            let res = this.triangulate(idx)
            idx = res
        }
        
        return idx
    }

    triangulate(f) {
        let idx = []
        for (let i = 0; i < 3; i++)
            idx.push(f[i])
        idx.push(f[0])
        idx.push(f[2])
        idx.push(f[3])
        return idx
    }
}

export {
    loadFile,
    Loader
}