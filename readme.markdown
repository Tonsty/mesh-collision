# mesh-collision

return the contact set (point, depth, normal) between two meshes in motion

# example

``` js
var collide = require('mesh-collision');
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
            var c = collide(bodies[i], bodies[j]);
            if (c) {
                console.log(c);
                engine.pause();
            }
        }
    }
});
engine.run();

function translate (out, xyz) { return mat4.translate(out, out, xyz) }
```

output:

```
{ mix: 0.7277780106077933,
  point: [ -1.070312, 0.234375, 0.0786932272210148 ],
  normal: [ -0.5790840193768065, -0.8026245943343034, 0.14302258238508114 ] }
```

# method

``` js
var collision = require('mesh-collision')
```

## var contact = collision(a, b)

Raycast from each point in `a` onto `b`.

`a` and `b` both must have these properties:

* next - a mat4 of the next position and rotation
* prev - a mat4 of the previous position and rotation
* positions - an array of `[x,y,z]` coordinate arrays
* cells - an array of arrays of indexes

The `positions` and `cells` array structures are compatible with
[simplicial-complex](https://npmjs.org/simplicial-complex).

If there was not a collision, return null.

Otherwise return `contact`, an object with these properties:

* point - contact point as an `[x,y,z]`
* normal - contact normal as an `[x,y,z]`
* mix - the amount of linear interpolation (`0` to `1`) between `prev` and `next` where the
collision occured.

The contact object is modeled after the contact set mentioned in the [SPOOK][1]
paper but using `mix` instead of a penetration depth.

[1]: https://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf

# install

With [npm](https://npmjs.org) do:

```
npm install mesh-collision
```

# license

MIT
