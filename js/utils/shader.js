class Shader {
    constructor(gl, _vert, _frag) {
        this.gl = gl
        let vert = gl.createShader(gl.VERTEX_SHADER)
        let frag = gl.createShader(gl.FRAGMENT_SHADER)
        let prog = gl.createProgram()

        gl.shaderSource(vert, _vert)
        gl.compileShader(vert)
        if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the shader: ${gl.getShaderInfoLog(vert)}`)
            gl.deleteShader(vert)
        } gl.attachShader(prog, vert)

        gl.shaderSource(frag, _frag)
        gl.compileShader(frag)
        if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the shader: ${gl.getShaderInfoLog(frag)}`)
            gl.deleteShader(frag)
        } gl.attachShader(prog, frag)

        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            alert( `Unable to initialize the shader program: ${gl.getProgramInfoLog(prog)}` )
            gl.deleteProgram(prog)
        }

        this.program = prog
    }

    use() {
        this.gl.useProgram(this.program)
    }

    unuse() {
        this.gl.useProgram(null)
    }

    getAttributeLocation(name) {
        return this.gl.getAttribLocation(this.program, name)
    }

    getUniformLocation(name) {
        return this.gl.getUniformLocation(this.program, name)
    }

    setUniform1f(name, val) {
        this.gl.uniform1f(this.getUniformLocation(name), val)
    }

    setUniform2f(name, val) {
        this.gl.uniform2fv(this.getUniformLocation(name), val)
    }

    setUniform3f(name, val) {
        this.gl.uniform3fv(this.getUniformLocation(name), val)
    }

    setUniform1i(name, val) {
        this.gl.uniform1i(this.getUniformLocation(name), val)
    }

    setUniform4x4f(name, val) {
        this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, val)
    }

    setArrayBuffer(name, buf, n, step = 0, off = 0) {
        const loc = this.getAttributeLocation(name)
        this.gl.enableVertexAttribArray(loc)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf)
        this.gl.vertexAttribPointer(loc, n, this.gl.FLOAT, false, step, off)
    }
}

export default Shader