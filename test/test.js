"use strict";

var fs = require("fs");
var assert = require("assert");
var babel = require("babel-core");

describe("vacuumlabs-destructuring", function () {

	it("should generate correct basic object destructuring", function () {
		var actual = babel.transformFileSync("./test/fixtures/object-basic/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring']
		}).code;
		var expected = fs.readFileSync("./test/fixtures/object-basic/expected.js").toString();
		assert.equal(actual, expected);
	});

	it("should generate correct custom object destructuring with string keys", function () {
		var actual = babel.transformFileSync("./test/fixtures/object-custom/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring']
		}).code;
		var expected = fs.readFileSync("./test/fixtures/object-custom/expected.js").toString();
		assert.equal(actual, expected);
	});

	it("should generate correct custom object destructuring with non-string keys", function () {
		var actual = babel.transformFileSync("./test/fixtures/object-non-string-key/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring']
		}).code;
		var expected = fs.readFileSync("./test/fixtures/object-non-string-key/expected.js").toString();
		assert.equal(actual, expected);
	});

	it("should generate correct custom object destructuring of the book example", function () {
		var actual = babel.transformFileSync("./test/fixtures/book-example/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring']
		}).code;
		var expected = fs.readFileSync("./test/fixtures/book-example/expected.js").toString();
		assert.equal(actual, expected);
	});
});
