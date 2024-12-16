'use strict'

function loadFile(url) {
    let req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send(null)
    return (req.status == 200) ? req.responseText : null
}

function hex2rgb(hex) {
    let rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255)
    return [rgb[0], rgb[1], rgb[2]]
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

export {
    loadFile,
    hex2rgb,
    deg2rad,
}