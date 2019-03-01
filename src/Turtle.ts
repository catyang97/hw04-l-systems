// A Turtle class to represent the current drawing state of your L-System. 
// It should at least keep track of its current position, current orientation, 
// and recursion depth (how many [ characters have been found while drawing before ]s)

import {vec3, quat, mat4, glMatrix, vec4} from 'gl-matrix';

export default class Turtle {

    position : vec3;
    orientation : quat;
    depth : number;
    globalUp: vec3;

    constructor(pos: vec3, orient: quat, iter: number) {
        this.position = pos;
        this.orientation = orient;
        this.depth = iter;
        this.globalUp = vec3.fromValues(0, 1, 0);
    }

    moveForward(distance: number) {
        let forward: vec4 = vec4.create();
        // Find rotation matrix from the orientation quat
        let rot: mat4 = mat4.create();
        mat4.fromQuat(rot, this.orientation);
        let up: vec4 = vec4.fromValues(this.globalUp[0], this.globalUp[1], this.globalUp[2], 1.0);
        vec4.transformMat4(forward, up, rot);
        let move: vec3 = vec3.fromValues(forward[0] * distance, forward[1] * distance, forward[2] * distance);
        vec3.add(this.position, this.position, move);
        console.log("MOVING");
    }

    rotate(x: number, y: number, z: number) {
        let rotQuat: quat = quat.create();
        // Creates a quaternion from the given euler angle x, y, z.
        quat.fromEuler(rotQuat, x, y, z);
        // Multiply to rotate
        quat.multiply(this.orientation, this.orientation, rotQuat);
    }
    
    getTransformMatrix() : mat4 {
        let translate: mat4 = mat4.create();
        mat4.fromTranslation(translate, this.position);
        
        let rotate: mat4 = mat4.create();
        mat4.fromQuat(rotate, this.orientation);

        let scale: mat4 = mat4.create();
        mat4.fromScaling(scale, vec3.fromValues(0.5, 0.9, 0.5));

        let transform: mat4 = mat4.create();
        mat4.multiply(transform, rotate, scale);
        mat4.multiply(transform, translate, transform);
        return transform;
    }

    getFishTransformMatrix() : mat4 {
        let translate: mat4 = mat4.create();
        let newPos: vec3 = vec3.fromValues(1.0, 1.0, 1.0);
        vec3.add(newPos, this.position, newPos);
        mat4.fromTranslation(translate, newPos);
        
        let rotate: mat4 = mat4.create();
        mat4.fromQuat(rotate, this.orientation);

        let scale: mat4 = mat4.create();
        mat4.fromScaling(scale, vec3.fromValues(1.5, 1.5, 1.5));

        let transform: mat4 = mat4.create();
        mat4.multiply(transform, rotate, scale);
        mat4.multiply(transform, translate, transform);
        return transform;
    }
}