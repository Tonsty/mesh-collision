var intersect = require('ray-triangle-intersection');
var transform = require('gl-vec3/transformMat4');
var sub = require('gl-vec3/subtract');
var dist = require('gl-vec3/distance');

var origin = [0,0,0];
var start = [0,0,0];
var end = [0,0,0];
var dir = [0,0,0];
var hit = [0,0,0];

var tri = [null,null,null];

module.exports = function (a, b) {
    transform(start, origin, a.prev);
    transform(end, origin, a.next);
    sub(dir, start, end);
    var dse = null;
    
    for (var i = 0; i < a.positions.length; i++) {
        var pt = a.positions[i];
        
        for (var j = 0; j < b.cells.length; j++) {
            loadtri(tri, b.positions, b.cells[j]);
            if (!intersect(hit, pt, dir, tri)) continue;
            if (dse === null) dse = dist(start, end);
            var hd = dist(start, pt);
            if (hd < dse) {
                return hit;
            }
        }
    }
    return null;
};

function translate (out, xyz) {
    return mat4.translate(out, out, xyz);
}

function loadtri (out, ps, cell) {
    out[0] = ps[cell[0]];
    out[1] = ps[cell[1]];
    out[2] = ps[cell[2]];
}
