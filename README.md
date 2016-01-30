# babel-plugin-extensible-destructuring

> Babel plugin that enables extensible destructuring, inspired by [vacuumlabs/es-proposals][es-proposals].

[![Join the chat at https://gitter.im/vacuumlabs/babel-destructuring](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vacuumlabs/babel-destructuring?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Install

```sh
npm install --save-dev babel-plugin-extensible-destructuring
```

## Usage

Add the plugin to your `.babelrc` configuration:

```json
{
  "presets": ["es2015"],
  "plugins": ["extensible-destructuring"]
}
```

Or directly from code:

```javascript
var babel = require("babel-core");
babel.transform("code", {
  presets: ["es2015"],
  plugins: ["extensible-destructuring"]
});
```

## What it does

The plugin gives you more explicit controll of what exactly happens in the process of destructuring.
The plugin transforms all destructuring assignments such as:
```javascript
var {a = 10} = o
```
becomes
```javascript
var a = __extensible_get__(o, a, 10)
```
Now, it's up to you to write the global (god help us!) function `__extensible_get__`. Currently, the
library comes with three implementations of `__extensible_get__`, that you can use OOTB:

- `defaut`: standard ES6 compatible: no magic here
- `immutable`: the one that you can use with [Immutable.js](https://facebook.github.io/immutable-js/) to destructure its Maps and Lists
- `safe`: prevent returning values from being `undefined`. Also includes features of `immutable`
    
## Immutable destructuring example

First, we'll import 

```javascript
// main.js, first file loaded
require(babel-plugin-extensible-destructuring).patch('immutable')
```

And then we can use anywhere
```javascript
import {fromJS} from 'immutable';
const map = fromJS({author: {name: {first: "John", last: "Doe"}, birthdate: "10-10-2010"}});
const {author: {name: {first, last}, birthdate}} = map;
```

## Safe destructuring example

```javascript
// main.js, first file loaded
require(babel-plugin-extensible-destructuring).patch('safe')
```

Now, if I write:
```javascript
import {fromJS} from 'immutable';
const map = {a: 10, b: 20}
const {a, b, c} = map;
```
I got:
...

On the other hand
```javascript
const {a, b, c = null} = map;
```
is perfectly OK.

## Under The Hood

The plugin uses global `__extensible_get__` function to destructure the assignment. The number of
calls to `__extensible_get__` is minimized, so if one writes:

```javascript
const {a: {b: {c, d, e}}} = map;
```
plugin uses the unique temporary variable to get result such as:

```javascript
var _tmp = __extensible_get__(__extensible_get__(map, "a"), "b");
var c = __extensible_get__(_tmp, "c");
var d = __extensible_get__(_tmp, "d");
var e = __extensible_get__(_tmp, "e");
```

[es-proposals]: https://github.com/vacuumlabs/es-proposals
