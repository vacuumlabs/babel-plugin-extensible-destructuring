# babel-plugin-extensible-destructuring

> Babel plugin that enables extensible destructuring as per [vacuumlabs/es-proposals][es-proposals].

[![Join the chat at https://gitter.im/vacuumlabs/babel-destructuring](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vacuumlabs/babel-destructuring?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Install

```sh
npm install --save-dev babel-plugin-extensible-destructuring
```

## Usage

The `extensible-destructuring` plugin replaces babel's `es6.destructuring` transformer, so the latter needs to be prevented from running.

Run:

```sh
babel --plugins extensible-destructuring:after --blacklist es6.destructuring script.js
```

Or add the plugin to your `.babelrc` configuration:

```json
{
  "plugins": [ "extensible-destructuring:after" ],
  "blacklist": [ "es6.destructuring" ]
}
```

Or directly from code:

```javascript
var babel = require("babel-core");
babel.transform("code", {
    plugins: ['extensible-destructuring:after'],
    blacklist: ['es6.destructuring']
});
```

## Example

The plugin will compile the following code:

```javascript
const book = {};
const {author: {name: {first, last}, birthdate}} = book;
```

into:

```javascript
var book = {};

var _book$author = book[Symbol.for("get")] ? book[Symbol.for("get")]("author") : book.author;

var _book$author$name = _book$author[Symbol.for("get")] ? _book$author[Symbol.for("get")]("name") : _book$author.name;

var first = _book$author$name[Symbol.for("get")] ? _book$author$name[Symbol.for("get")]("first") : _book$author$name.first;
var last = _book$author$name[Symbol.for("get")] ? _book$author$name[Symbol.for("get")]("last") : _book$author$name.last;
var birthdate = _book$author[Symbol.for("get")] ? _book$author[Symbol.for("get")]("birthdate") : _book$author.birthdate;
```

[es-proposals]: https://github.com/vacuumlabs/es-proposals
