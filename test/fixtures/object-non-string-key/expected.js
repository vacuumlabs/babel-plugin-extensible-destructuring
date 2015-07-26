"use strict";

let map = {};
let weekday = (map[Symbol.for("get")] ? map[Symbol.for("get")](List.of(20, 10, 1989)) : map[List.of(20, 10, 1989)])[Symbol.for("get")] ? (map[Symbol.for("get")] ? map[Symbol.for("get")](List.of(20, 10, 1989)) : map[List.of(20, 10, 1989)])[Symbol.for("get")]("weekday") : (map[Symbol.for("get")] ? map[Symbol.for("get")](List.of(20, 10, 1989)) : map[List.of(20, 10, 1989)]).weekday;
let year = (map[Symbol.for("get")] ? map[Symbol.for("get")]("another") : map.another)[Symbol.for("get")] ? (map[Symbol.for("get")] ? map[Symbol.for("get")]("another") : map.another)[Symbol.for("get")]("year") : (map[Symbol.for("get")] ? map[Symbol.for("get")]("another") : map.another).year;