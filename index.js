var intersect = require('ray-triangle-intersection');
var transform = require('gl-vec3/transformMat4');
var sub = require('gl-vec3/subtract');
var dist = require('gl-vec3/distance');
var copy = require('gl-vec3/copy');
var lerp = require('mat4-interpolate');

var origin = [0,0,0];
var start = [0,0,0];
var end = [0,0,0];
var dir = [0,0,0];
var hit = [0,0,0];
var minhit = [0,0,0];

var tri = [null,null,null];

var ca = [0,0,0];
var cb = [0,0,0];

module.exports = function (out, a, b) {
    var da = collide(ca, a, b);
    var db = collide(cb, a, b);
    if (da === Infinity && db === Infinity) return null;
    
    if (da < db) {
        copy(out, ca);
        return da;
    }
    else {
        copy(out, cb);
        return db;
    }
};

function collide (out, a, b) {
    transform(start, origin, a.prev);
    transform(end, origin, a.next);
    sub(dir, start, end);
    var dse = dist(start, end);
    var hitcount = 0;
    var mindist = Infinity;
    
    for (var i = 0; i < a.positions.length; i++) {
        var pt = a.positions[i];
        for (var j = 0; j < b.cells.length; j++) {
            loadtri(tri, b.positions, b.cells[j]);
            if (!intersect(hit, pt, dir, tri)) continue;
            var hd = dist(start, pt);
            if (hd < dse && hd < mindist) {
                copy(minhit, hit);
                mindist = hd;
                hitcount ++;
            }
        }
    }
    if (hitcount > 0) {
        copy(out, minhit);
        return mindist / dse; // between 0 and 1
    }
    return Infinity;
}

function loadtri (out, ps, cell) {
    out[0] = ps[cell[0]];
    out[1] = ps[cell[1]];
    out[2] = ps[cell[2]];
}
