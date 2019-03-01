// A Turtle class to represent the current drawing state of your L-System. 
// It should at least keep track of its current position, current orientation, 
// and recursion depth (how many [ characters have been found while drawing before ]s)

import {vec3, quat, mat4, glMatrix, vec4} from 'gl-matrix';

export default class Turtle {

    position : vec3;
    orientation : quat;
    depth : number;
    globalUp: vec3;
    // forward : vec4;
    // right : vec4;
    // up : vec4;

    // constructor(pos: vec3, forward: vec4, right: vec4, up: vec4) {
    constructor(pos: vec3, orient: quat) {
        this.position = pos;
        this.orientation = orient;
        // this.forward = forward;
        // this.right = right;
        // this.up = up;
        this.depth = 0;
        this.globalUp = vec3.fromValues(0, 1, 0);
    }

    moveForward(distance: number) {
        // let dist3: vec3 = vec3.fromValues(distance, distance, distance);
        // // let forw: vec3 = vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]);
        // let trans: vec3 = vec3.create();
        // trans = vec3.multiply(trans, forw, dist3);
        // vec3.add(this.position, this.position, trans);
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
        console.log(y);
        let rotQuat: quat = quat.create();
        // Creates a quaternion from the given euler angle x, y, z.
        quat.fromEuler(rotQuat, x, y, z);
        // Multiply to rotate
        quat.multiply(this.orientation, this.orientation, rotQuat);
    }

    // forwardRotate(angle: number) {
    //     let rot: mat4 = mat4.create();
    //     let for3: vec3 = vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]);
    //     rot = mat4.rotate(rot, mat4.create(), glMatrix.toRadian(angle), for3);
    //     // Transform up and right vectors too
    //     this.up = vec4.transformMat4(this.up, this.up, rot);
    //     // this.up = vec4.normalize(this.up, this.up);
    //     this.right = vec4.transformMat4(this.right, this.right, rot);
    //     // this.right = vec4.normalize(this.right, this.right);
    // }

    // rightRotate(angle: number) {
    //     let rot: mat4 = mat4.create();
    //     let right3: vec3 = vec3.fromValues(this.right[0], this.right[1], this.right[2]);
    //     rot = mat4.rotate(rot, mat4.create(), glMatrix.toRadian(angle), right3);
    //     // Transform up and foward vectors too
    //     this.up = vec4.transformMat4(this.up, this.up, rot);
    //     // this.up = vec4.normalize(this.up, this.up);
    //     this.forward = vec4.transformMat4(this.forward, this.forward, rot);
    //     // this.forward = vec4.normalize(this.forward, this.forward);
    // }

    // upRotate(angle: number) {
    //     let rot: mat4 = mat4.create();
    //     let up3: vec3 = vec3.fromValues(this.up[0], this.up[1], this.up[2]);
    //     rot = mat4.rotate(rot, mat4.create(), glMatrix.toRadian(angle), up3);
    //     // Transform right and foward vectors too
    //     this.right = vec4.transformMat4(this.right, this.right, rot);
    //     // this.right = vec4.normalize(this.right, this.right);
    //     this.forward = vec4.transformMat4(this.forward, this.forward, rot);
    //     // this.forward = vec4.normalize(this.forward, this.forward);
    // }

    getTransformMatrix() : mat4 {
        let translate: mat4 = mat4.create();
        mat4.fromTranslation(translate, this.position);
        
        let rotate: mat4 = mat4.create();
        mat4.fromQuat(rotate, this.orientation);

        let scale: mat4 = mat4.create();
        mat4.fromScaling(scale, vec3.fromValues(0.7, 2.0, 0.7));

        // // Rotate
        // let rotate: mat4 = mat4.fromValues(this.right[0], this.forward[0], this.up[0], 0,
        //                                 this.right[1], this.forward[1], this.up[1], 0,
        //                                 this.right[2], this.forward[2], this.up[2], 0,
        //                                 0, 0, 0, 1);
        let transform: mat4 = mat4.create();
        mat4.multiply(transform, rotate, scale);
        mat4.multiply(transform, translate, transform);
        return transform;

    }
}