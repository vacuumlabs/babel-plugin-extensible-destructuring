"use strict";

import Plugin from '../src'
import fs from 'fs'
import assert from 'assert'
import { transformFileSync } from 'babel-core'

function test(name, dir, externalHelpers) {
	it("should compile " + name, function () {
		var actual = transformFileSync("./test/fixtures/" + dir + "/actual.js", {
			plugins: [Plugin],
			blacklist: ['es6.destructuring'],
			externalHelpers: externalHelpers
		}).code;
		var expected = fs.readFileSync("./test/fixtures/" + dir + "/expected.js", "utf8").toString();
		assert.equal(actual, expected);
	});
}

describe("extensible-destructuring", () => {

	test("basic object destructuring", "object-basic", false);
	test("custom object destructuring with string keys", "object-custom", false);
	test("custom object destructuring with non-string keys", "object-non-string-key", false);
	test("custom object destructuring of the book example", "book-example", false);
	test("multiple destructurings", "multiple", false);
	test("destructuring in for-in", "for-in", true);
	test("destructuring of parameters", "parameters", true);
});
