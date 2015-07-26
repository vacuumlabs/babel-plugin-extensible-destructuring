"use strict";

let book = {};

var _book$author = book[Symbol.for("get")] ? book[Symbol.for("get")]("author") : book.author;

var _book$author$name = _book$author[Symbol.for("get")] ? _book$author[Symbol.for("get")]("name") : _book$author.name;

let first = _book$author$name[Symbol.for("get")] ? _book$author$name[Symbol.for("get")]("first") : _book$author$name.first;
let last = _book$author$name[Symbol.for("get")] ? _book$author$name[Symbol.for("get")]("last") : _book$author$name.last;
let birthdate = _book$author[Symbol.for("get")] ? _book$author[Symbol.for("get")]("birthdate") : _book$author.birthdate;