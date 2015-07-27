# babel-plugin-extensible-destructuring

> Babel plugin that enables extensible destructuring as per [vacuumlabs/es-proposals][es-proposals].

[![Join the chat at https://gitter.im/vacuumlabs/babel-destructuring](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vacuumlabs/babel-destructuring?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Plugin for extensible destructuring in Babel


## Install

```sh
npm install --save-dev babel-plugin-extensible-destructuring
```

## Usage

The `extensible-destructuring` plugin replaces babel's `es6.destructuring` transformer, so the latter needs to be prevented from running.

Run:

```sh
babel --plugins extensible-destructuring --blacklist es6.destructuring script.js
```

Or add the plugin to your `.babelrc` configuration:

```json
{
  "plugins": [ "extensible-destructuring" ],
  "blacklist": [ "es6.destructuring" ]
}
```

Or directly from code:

```javascript
var babel = require("babel-core");
babel.transform("code", {
    plugins: ['extensible-destructuring'],
    blacklist: ['es6.destructuring']
})
```

[es-proposals]: https://github.com/vacuumlabs/es-proposals
