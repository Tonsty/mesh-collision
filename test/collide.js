var test = require('tape');
var collide = require('../');
var mat4 = require('gl-mat4');
var transformMat4 = require('gl-vec3/transformMat4');
var isarray = require('isarray');
var inspect = require('object-inspect');

var lerp = require('mat4-interpolate');
var teapot = require('teapot');
var bunny = require('bunny');

test(function (t) {
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
    var expected = [
        undefined, // 500
        undefined, // 1000
        undefined, // 1500
        undefined, // 2000
        undefined, // 2500
        {
            mix: 0.81,
            point: [ 7.57, 0.21, 2.99 ],
            normal: [ 0.52, 0.85, -0.10 ]
        }
    ];
    t.plan(expected.length);
    
    while (expected.length) {
        var ex = expected.shift();
        var c = tick(500);
        t.ok(approx(c, ex), inspect(c) + ' ~~ ' + inspect(ex));
    }
    
    function tick (dt) {
        for (var i = 0; i < bodies.length; i++) {
            var b = bodies[i];
            mat4.copy(b.prev, b.next);
            
            var endm = mat4.multiply(tmpm, b.next, b.velocity);
            lerp(b.next, b.next, endm, dt / 1000);
        }
        
        for (var i = 0; i < bodies.length - 1; i++) {
            for (var j = i + 1; j < bodies.length; j++) {
                var c = collide(bodies[i], bodies[j]);
                if (c) return c;
            }
        }
    }
});
function translate (out, xyz) { return mat4.translate(out, out, xyz) }

function approx (a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (isarray(a)) {
        return approx(a[0], b[0]) && approx(a[1], b[1]) && approx(a[2], b[2]);
    }
    if (typeof a === 'object') {
        return approx(a.mix, b.mix)
            && approx(a.point, b.point)
            && approx(a.normal, b.normal)
        ;
    }
    else {
        return Math.round(a * 100) / 100 === Math.round(b * 100) / 100;
    }
}
