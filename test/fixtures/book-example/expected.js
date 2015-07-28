"use strict";

var book = {};

var _book$author = book[Symbol.for("get")] ? book[Symbol.for("get")]("author") : book.author;

var _book$author$name = _book$author[Symbol.for("get")] ? _book$author[Symbol.for("get")]("name") : _book$author.name;

var first = _book$author$name[Symbol.for("get")] ? _book$author$name[Symbol.for("get")]("first") : _book$author$name.first;
var last = _book$author$name[Symbol.for("get")] ? _book$author$name[Symbol.for("get")]("last") : _book$author$name.last;
var birthdate = _book$author[Symbol.for("get")] ? _book$author[Symbol.for("get")]("birthdate") : _book$author.birthdate;