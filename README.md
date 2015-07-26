# babel-destructuring

[![Join the chat at https://gitter.im/vacuumlabs/babel-destructuring](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vacuumlabs/babel-destructuring?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Plugin for extensible destructuring in Babel

## Usage

```javascript
var babel = require("babel-core");
babel.transform("code", {
    plugins: ['vacuumlabs-destructuring'],
    blacklist: ['es6.destructuring']
})
```
