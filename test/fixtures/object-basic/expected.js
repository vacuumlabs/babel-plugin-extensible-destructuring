"use strict";

var coords = [1, 2];
var x = coords[Symbol.for("get")] ? coords[Symbol.for("get")]("x") : coords.x;
var y = coords[Symbol.for("get")] ? coords[Symbol.for("get")]("y") : coords.y;