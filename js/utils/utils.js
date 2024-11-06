'use strict'

// Loads a given URL, used to load the shaders from file
function loadExternalFile(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status == 200) ? req.responseText : null;
}

// Converts a hex color string to a normalized RGBA array
function hex2rgb(hex) {
    let rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
    return [rgb[0], rgb[1], rgb[2]]
}

// Converts degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


// Returns the mouse coordinates relative to the canvas
function getRelativeMousePosition(event) {
    let target = event.target
    if (target.id != 'canvas') {
        return {
            x: -Infinity,
            y: +Infinity,
        }
    }

    target = target || event.target;
    let rect = target.getBoundingClientRect( );
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

export {
    loadExternalFile,
    hex2rgb,
    deg2rad,
    getRelativeMousePosition
}

