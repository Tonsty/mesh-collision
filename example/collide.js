var collision = require('../');
var mat4 = require('gl-mat4');
var transformMat4 = require('gl-vec3/transformMat4');

var loop = require('frame-loop');
var lerp = require('mat4-interpolate');
var teapot = require('teapot');
var bunny = require('bunny');

var bodies = [
    {
        prev: mat4.create(),
        next: translate(mat4.create(), [-15,0,5]),
        cells: bunny.cells,
        positions: bunny.positions,
        velocity: translate(mat4.create(), [5,0,0])
    },
    {
        prev: mat4.create(),
        next: translate(mat4.create(), [0,0,10]),
        cells: teapot.cells,
        positions: teapot.positions,
        velocity: translate(mat4.create(), [0,0,-1.6])
    }
];
var tmpm = mat4.create();
var tmpv = [0,0,0];
var origin = [0,0,0];

var engine = loop({ fps: 10 }, function (dt) {
    for (var i = 0; i < bodies.length; i++) {
        var b = bodies[i];
        mat4.copy(b.prev, b.next);
        
        var endm = mat4.multiply(tmpm, b.next, b.velocity);
        lerp(b.next, b.next, endm, dt / 1000);
    }
    
    for (var i = 0; i < bodies.length - 1; i++) {
        for (var j = i + 1; j < bodies.length; j++) {
            var contact = collision(bodies[i], bodies[j]);
            if (contact) {
                console.log(contact);
                engine.pause();
            }
        }
    }
});
engine.run();

function translate (out, xyz) { return mat4.translate(out, out, xyz) }
