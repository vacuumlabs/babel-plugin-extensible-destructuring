/* eslint-disable no-var */
global.noprint = true
import assert from 'assert'

describe('optin, extensible', () => {

  it('works', () => {
    global.__extensible_get__ = (o, k, d) => { //eslint-disable-line camelcase
      return 'eg'
    }
    let {a, b, c, d} = require('./a')
    assert.equal(a, 'eg')
    assert.equal(b, 'eg')
    assert.equal(c, 1)
    assert.equal(d, 1)
  })

})



