'use !extensible'

import fs from 'fs'
import assert from 'assert'
import * as babel from '@babel/core'

let transformFileSync = babel.transformFileSync

function test(name, dir, externalHelpers) {
  it(`should compile ${ name }`, () => {
    let plugins = [['babel-plugin-extensible-destructuring', {mode: 'optout', package_name: 'extensible-runtime', impl: 'test'}]]
    if (externalHelpers) {
      plugins.push('@babel/plugin-external-helpers')
    }
    let actual = transformFileSync(`./test/fixtures/${ dir }/actual.js`, {
      presets: ['@babel/preset-env'],
      plugins: plugins
    }).code
    // create 'expected' fixture from the actual result
    // fs.writeFileSync(`./test/fixtures/${ dir }/expected.js`, actual)
    let expected = fs.readFileSync(`./test/fixtures/${ dir }/expected.js`, 'utf8').toString()
    // get rid of newline at the end of the file
    assert.equal(actual, expected.trim())
  })
}

describe('extensible-destructuring', () => {

  test('destructuring in for-in', 'for-in', true)

})
