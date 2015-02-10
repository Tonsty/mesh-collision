# mesh-collision

return the contact set (point, depth, normal) between two meshes in motion

# example

``` js
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

* point - contact point
* depth - penetration depth
* normal - contact normal

# install

With [npm](https://npmjs.org) do:

```
npm install mesh-collision
```

# license

MIT
