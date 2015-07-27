"use strict";

var fs = require("fs");
var assert = require("assert");
var babel = require("babel-core");

function test(name, dir, externalHelpers) {
	it("should compile " + name, function () {
		var actual = babel.transformFileSync("./test/fixtures/" + dir + "/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring'],
			externalHelpers: externalHelpers
		}).code;
		var expected = fs.readFileSync("./test/fixtures/" + dir + "/expected.js", "utf8").toString();
		assert.equal(actual, expected);
	});
}

describe("extensible-destructuring", function () {

	test("basic object destructuring", "object-basic", false);
	test("custom object destructuring with string keys", "object-custom", false);
	test("custom object destructuring with non-string keys", "object-non-string-key", false);
	test("custom object destructuring of the book example", "book-example", false);
	test("multiple destructurings", "multiple", false);
	test("destructuring in for-in", "for-in", true);
	test("destructuring of parameters", "parameters", true);
});
