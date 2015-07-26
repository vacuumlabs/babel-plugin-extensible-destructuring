"use strict";

var fs = require("fs");
var assert = require("assert");
var babel = require("babel-core");

describe("vacuumlabs-destructuring", function () {

	it("should generate correct custom destructuring", function () {
		var actual = babel.transformFileSync("./test/fixtures/object-custom/actual.js", {
			plugins: [require('../src/index')],
			blacklist: ['es6.destructuring']
		}).code;
		var expected = fs.readFileSync("./test/fixtures/object-custom/expected.js").toString();
		assert.equal(actual, expected);
	});
});
