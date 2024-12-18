'use strict'
import { Object } from './object.js'
import { Loader } from './loader.js'
import { json2transform } from './utils.js'
import * as mat4 from '../lib/glmatrix/mat4.js'

class Scene {
    constructor(scene, gl, shader) {
        this.models = this.loadModels(scene.models)
        this.scenegraph = this.loadNode(scene.scenegraph, gl, shader)
        this.scenegraph.setTransformation(this.scenegraph.transformation)
    }

    loadModels(_models) {
        let models = {}
        for (let model of _models) {
            let loader = new Loader(model.obj)
            models[model.name] = loader.load()
        }

        return models
    }

    makeModel(name, gl, shader) {
        if (!name in this.models)
            throw `Unable to find model '${name}'`
        let [vtc, idc] = this.models[name]
        return new Object(gl, shader, vtc, idc, gl.TRIANGLES)
    }

    loadNode(_node, gl, shader) {
        let node = null
        switch(_node.type) {
            case 'node':
                node = new SceneNode(
                    _node.name, _node.type,
                    json2transform(_node.transformation)
                )
                break
            case 'model':
                node = new ModelNode(
                    this.makeModel(_node.content, gl, shader),
                    _node.name, _node.type,
                    json2transform(_node.transformation)
                )
                break
        }

        for (let child of _node.children) {
            let childNode = this.loadNode(child, gl, shader)
            node.addChild(childNode)
            childNode.setParent(node)
        }

        return node
    }

    getNodes() {
        let nodes = this.scenegraph.getNodes([])
        return nodes
    }

    getNode(name) {
        let node = this.scenegraph.getNode(name)
        if (node == null)
            throw `Node '${name}' not found`
        return node
    }

    render(gl) {
        this.scenegraph.render(gl)
    }
}

class SceneNode {
    constructor(name, type, transformation) {
        name = name.replace('_node', '')
        name = name.replace('_', ' ')
        this.name = name
        this.type = type
        this.transformation = transformation
        this.world = this.computeWorld()
        this.parent = null
        this.children = []
    }

    getWorld() {
        return this.world
    }
    
    computeWorld() {
        let w = null
        let arr = []
        this.getHierarchy(arr)
        w = mat4.create()
        for (let i = arr.length - 1; i > -1; i--)
            w = mat4.multiply(w, w, arr[i])
        return w
    }

    getHierarchy(transformations) {
        transformations.push(this.transformation)
        if (this.parent != null)
            this.parent.getHierarchy(transformations)
        return transformations
    }

    getTransformation() {
        return this.transformation
    }

    setTransformation(transformation) {
        this.transformation = transformation
        for (let child of this.children) 
            child.setTransformation(child.transformation)
        this.world = this.computeWorld()
    }

    getParent() {
        return this.parent
    }

    setParent(node) {
        this.parent = node
    }

    addChild(node) {
        this.children.push(node)
    }

    getNodes(nodes) {
        nodes.push(this)
        for (let child of this.children)
            child.getNodes(nodes)
        return nodes
    }

    getNode(name) {
        if (this.name == name)
            return this
        for (let child of this.children) {
            let node = child.getNode(name)
            if (node != null)
                return node
        }
        return null
    }

    render(gl) {
        for (let child of this.children) {
            child.render(gl)
        }
    }
}

class ModelNode extends SceneNode {
    constructor(obj, name, type, transformation) {
        super(name, type, transformation)
        this.obj = obj
    }

    setMode(mode) {
        this.obj.setMode(mode)
    }

    setTransformation(transformation) {
        super.setTransformation(transformation)
        this.obj.setTransformation(this.world)
    }

    render(gl) {
        this.obj.render(gl)
        super.render(gl)
    }
}

export {
    Scene,
    SceneNode
}