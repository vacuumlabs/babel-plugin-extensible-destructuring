/* eslint-disable no-var */
global.noprint = true
import assert from 'assert'

global.__extensible_get__ = (o, k, d) => { //eslint-disable-line camelcase
  return 'eg'
}

describe('basics', () => {

  it('', () => {
    let {a, b, c} = require('./a')
    assert.equal(a, 'eg')
    assert.equal(b, 'eg')
    assert.equal(c, 1)
  })

})



