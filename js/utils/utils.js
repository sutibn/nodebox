'use strict'
import * as mat4 from '../lib/glmatrix/mat4.js'
import * as quat4 from '../lib/glmatrix/quat.js'

function hex2rgb(hex) {
    let rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255)
    return [rgb[0], rgb[1], rgb[2]]
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function json2transform(transform) {
    if (transform.rotation.length == 3)
        transform.rotation = quat4.fromEuler(quat4.create(), transform.rotation[0], transform.rotation[1], transform.rotation[2])
    return mat4.fromRotationTranslationScale(mat4.create(), 
        transform.rotation,
        transform.translation,
        transform.scale
    )
}

export {
    hex2rgb,
    deg2rad,
    json2transform
}