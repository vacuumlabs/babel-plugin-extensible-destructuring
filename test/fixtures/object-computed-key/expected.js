"use strict";

var data = { a: 1, b: 2 };
var key = "a";

var _fromJS = fromJS(data);

var value = _fromJS[Symbol.for("get")] ? _fromJS[Symbol.for("get")](key) : _fromJS[key];