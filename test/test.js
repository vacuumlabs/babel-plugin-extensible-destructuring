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

	it("should generate correct multiple destructurings", function () {
		var actual = babel.transformFileSync("./test/fixtures/multiple/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring']
		}).code;
		var expected = fs.readFileSync("./test/fixtures/multiple/expected.js").toString();
		assert.equal(actual, expected);
	});

	it("should generate correct destructuring in for-in", function () {
		var actual = babel.transformFileSync("./test/fixtures/for-in/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring'],
			externalHelpers: true
		}).code;
		var expected = fs.readFileSync("./test/fixtures/for-in/expected.js").toString();
		assert.equal(actual, expected);
	});

	it("should generate correct destructuring of parameters", function () {
		var actual = babel.transformFileSync("./test/fixtures/parameters/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring'],
			externalHelpers: true
		}).code;
		var expected = fs.readFileSync("./test/fixtures/parameters/expected.js").toString();
		assert.equal(actual, expected);
	});
});
