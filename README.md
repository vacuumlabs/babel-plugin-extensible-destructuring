# babel-plugin-extensible-destructuring

Babel plugin that enables extensible destructuring, inspired by [vacuumlabs/es-proposals][es-proposals].

[![Circle CI](https://circleci.com/gh/vacuumlabs/babel-plugin-extensible-destructuring.svg?style=svg)](https://circleci.com/gh/vacuumlabs/babel-plugin-extensible-destructuring)
[![Join the chat at https://gitter.im/vacuumlabs/babel-destructuring](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vacuumlabs/babel-destructuring?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Install

```sh
npm install --save-dev babel-plugin-extensible-destructuring
npm install --save extensible-runtime
```

## Usage (for version 4.x.x and Babel 6)

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
    presets: ['es2015'],
    plugins: ['extensible-destructuring']
})
```

### Usage for babel 7

Add the plugin to your `.babelrc` configuration using the full name:

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["babel-plugin-extensible-destructuring"]
}
```

## What it does

The plugin gives you more explicit control of what exactly happens in the process of destructuring.
The plugin transforms all destructuring assignments such as:
```javascript
var {a = 10} = o
```
to:
```javascript
var a = __extensible_get__(o, a, 10)
```

Function `__extensible_get__` gets automatically required from `extensible-runtime` package (this is
a separate package and needs to be installed alongside this one. This package currently defines
three different versions of `__extensible_get__` you can choose from using the `impl` plugin option (see
the section Plugin Options below).

- `normal`: standard ES6 compatible: no magic here
- `immutable`: the one that you can use with [Immutable.js](https://facebook.github.io/immutable-js/) to destructure its Maps and Lists
- `safe`: prevent returning values from being `undefined`. Also includes features of `immutable`

Option `safe` is the default one. Typically, there is no reason to use this plugin with `normal` option.

Check out the `example` folder for a working example; this is a standalone `npm` package with all the
configuration necessary.

## Plugin Options
In case you don't know, babel allows to specify options for each plugin. The syntax looks such as:

```json
{
  "presets": ["es2015"],
  "plugins": [["extensible-destructuring", {"mode": "optout", "impl": "safe"}]]
}
```

Semantics of these options is:

### mode
either 'optin' or 'optout'. In `optin` (default) mode, the destructuring
assignments are transformed only if "use extensible" directive is present at the beginning of the
file. OTOH, in `optout` mode the destructuring assignments are transformed unless you use "use
!extensible" directive at the beginning of the file. You can change (default) `optin` in your
.babelrc (note that `plugins` now becomes nested array)

This machinery is cool for already existing bigger projects in which you may want to start using
safe mode gradually: You can use safe destructuring, but optin only those files, that are already
written with no-undefined-policy in mind.

### impl
Either 'normal', 'immutable' or 'safe'; specifies what version of `__extensible_get__` to use.

## Immutable destructuring example

Use `.babelrc` such as:

```json
{
  "presets": ["es2015"],
  "plugins": [["extensible-destructuring", {"mode": "optout", "impl": "immutable"}]]
}
```

This code works as expected:

```javascript
import {fromJS} from 'immutable';
const map = fromJS({author: {name: {first: "John", last: "Doe"}, birthdate: "10-10-2010"}});
const {author: {name: {first, last}, birthdate}} = map;
```

## Safe destructuring example

Use `.babelrc` such as:

```json
{
  "presets": ["es2015"],
  "plugins": [["extensible-destructuring", {"mode": "optout", "impl": "safe"}]]
}
```

Now, the code:

```javascript
import {fromJS} from 'immutable';
const map = {a: 10, b: 20}
const {a, b, c} = map;
```

logs the error to the console:

```
Error: Key Error: object with keys [ "a", "b" ] does not contain property c
```

On the other hand
```javascript
const {a, b, c = null} = map;
```
is perfectly OK.

## Differences from version 3

- no need to patch your code at the entry-point, no need to define global `__extensible_get__`. We see
  this as a bad practice and this was the most relevant reason for doing version 4.

- option `default` was renamed to `normal` (default is sort-of reserved keyword when dealing with ES6
import/export)

- 'polyfill' renamed to 'runtime', which is much more accurate naming

## Using your own implementation of `__extensible_get__`

Although we believe the existing implementations of `__extensible_get__` are quite sufficient, you
still might want to use your own. In such a case:

In the `.babelrc`, set `{impl: "mymyget"}`, `mymyget` being the name of your newly created resolver.
Then in the entry-point of your code you monkey-patch it inside the package (yes, this makes it
accessible also for other parts of your project):

```
var extensibleRuntime = require('extensible-runtime');
const mymyget = () => ...;
extensibleRuntime.mymyget = mymyget;
```

## Under The Hood

The plugin uses global `__extensible_get__` function to destructure the assignment. The number of
calls to `__extensible_get__` is minimized, so if one writes:

```javascript
const {a: {b: {c, d, e}}} = map;
```
plugin uses the unique temporary variable to get result such as:

```javascript
var __extensible_get__ = require('extensible-runtime').safe
var _tmp = __extensible_get__(__extensible_get__(map, "a"), "b");
var c = __extensible_get__(_tmp, "c");
var d = __extensible_get__(_tmp, "d");
var e = __extensible_get__(_tmp, "e");
```

[es-proposals]: https://github.com/vacuumlabs/es-proposals
