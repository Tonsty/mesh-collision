var intersect = require('ray-triangle-intersection');
var transform = require('gl-vec3/transformMat4');
var sub = require('gl-vec3/subtract');
var dist = require('gl-vec3/distance');
var copy = require('gl-vec3/copy');
var lerp = require('mat4-interpolate');
var trinorm = require('triangle-normal');

var origin = [0,0,0];
var start = [0,0,0];
var end = [0,0,0];
var dir = [0,0,0];
var hit = [0,0,0];
var minhit = [0,0,0];

var tri = [null,null,null];

module.exports = function (a, b) {
    var ca = collide(a, b);
    var cb = collide(b, a);
    if (ca && cb) return ca.mix < cb.mix ? ca : cb;
    else if (ca) return ca;
    else if (cb) return cb;
    return null;
};

function collide (a, b) {
    transform(start, origin, a.prev);
    transform(end, origin, a.next);
    sub(dir, start, end);
    var dse = dist(start, end);
    var hitcount = 0;
    var mintri = null;
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
                mintri = tri;
                hitcount ++;
            }
        }
    }
    if (hitcount > 0) {
        return {
            mix: mindist / dse, // between 0 and 1
            point: copy([], minhit),
            normal: trinorm(
                mintri[0][0], mintri[0][1], mintri[0][2],
                mintri[1][0], mintri[1][1], mintri[1][2],
                mintri[2][0], mintri[2][1], mintri[2][2],
                []
            )
        };
    }
    return null;
}

function loadtri (out, ps, cell) {
    out[0] = ps[cell[0]];
    out[1] = ps[cell[1]];
    out[2] = ps[cell[2]];
}
