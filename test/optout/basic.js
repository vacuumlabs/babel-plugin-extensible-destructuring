/* eslint-disable no-var */
'use !extensible'

global.noprint = true
import assert from 'assert'

const runtime = require('extensible-runtime')
var __extensible_get__ = (o, k, d) => { //eslint-disable-line
  return 'eg'
}
runtime.test = __extensible_get__

describe('optout, !extensible', () => {
  it('works', () => {
    let {a, b, c} = require('./a')
    assert.equal(a, 'eg')
    assert.equal(b, 'eg')
    assert.equal(c, 1)
  })

})



