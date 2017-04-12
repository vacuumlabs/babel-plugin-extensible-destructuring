import {Promise} from 'bluebird'
import path from 'path'
import file from 'file'
import Mocha from 'mocha'
//import fs from 'fs'

require('babel-register')({
  'babelrc': false,
  'presets': ['es2015'],
  'plugins': [['extensible-destructuring', {mode: 'optout', impl: 'test'}]],
})

function addFiles(mocha, root) {
  file.walkSync(root, (pth, dirs, files) => {
    for (let f of files) {
      if (pth.indexOf('fixtures') === -1 &&
          pth.indexOf('optin') === -1 &&  // will run optout later
          f.substr(-3) === '.js' &&
          f.length > 4) { // helper one-letter .js files
        mocha.addFile(path.join(pth, f))
      }
    }
  })
}

function mocharun(mocha) {
  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      resolve(failures)
    })
  })
}

let mocha = new Mocha()

addFiles(mocha, './test/')

let failures1 = mocharun(mocha)

let failures2 = failures1.then(() => {
  mocha = new Mocha()

  require('babel-register')({
    'babelrc': false,
    'presets': ['es2015'],
    'plugins': [['extensible-destructuring', {mode: 'optin', impl: 'test'}]],
  })

  addFiles(mocha, './test/optin')

  return mocharun(mocha)
})

Promise.all([failures1, failures2]).then(([f1, f2]) => {
  process.on('exit', function() {
    process.exit(Math.max(f1, f2))  // exit with non-zero status if there were failures
  })
})
