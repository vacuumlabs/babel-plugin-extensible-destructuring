/* eslint-disable no-var */
'use !extensible'

global.noprint = true
import assert from 'assert'

describe('optout, !extensible', () => {

  it('works', () => {
    global.__extensible_get__ = (o, k, d) => { //eslint-disable-line camelcase
      return 'eg'
    }
    let {a, b, c} = require('./a')
    assert.equal(a, 'eg')
    assert.equal(b, 'eg')
    assert.equal(c, 1)
  })

})



