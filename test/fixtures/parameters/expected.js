"use strict";

function somethingAdvanced(_ref, p2, p3) {
	var _ref2 = _ref[Symbol.for("get")] ? _ref[Symbol.for("get")]("topLeft") : _ref.topLeft;

	_ref2 = _ref2 === undefined ? {} : _ref2;
	var x1 = _ref2[Symbol.for("get")] ? _ref2[Symbol.for("get")]("x") : _ref2.x;
	var y1 = _ref2[Symbol.for("get")] ? _ref2[Symbol.for("get")]("y") : _ref2.y;

	var _ref3 = _ref[Symbol.for("get")] ? _ref[Symbol.for("get")]("bottomRight") : _ref.bottomRight;

	_ref3 = _ref3 === undefined ? {} : _ref3;
	var x2 = _ref3[Symbol.for("get")] ? _ref3[Symbol.for("get")]("x") : _ref3.x;
	var y2 = _ref3[Symbol.for("get")] ? _ref3[Symbol.for("get")]("y") : _ref3.y;
}

function unpackObject(_ref4) {
	var title = _ref4[Symbol.for("get")] ? _ref4[Symbol.for("get")]("title") : _ref4.title;
	var author = _ref4[Symbol.for("get")] ? _ref4[Symbol.for("get")]("author") : _ref4.author;

	return title + " " + author;
}

console.log(unpackObject({ title: "title", author: "author" }));

var unpackArray = function unpackArray(_ref5, _ref6) {
	var _ref52 = babelHelpers.slicedToArray(_ref5, 3);

	var a = _ref52[0];
	var b = _ref52[1];
	var c = _ref52[2];

	var _ref62 = babelHelpers.slicedToArray(_ref6, 3);

	var x = _ref62[0];
	var y = _ref62[1];
	var z = _ref62[2];

	return a + b + c;
};

console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));