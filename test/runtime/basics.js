import assert from 'assert'
import {fromJS} from 'immutable'

const runtime = require('extensible-runtime')

describe('runtime basic behavior', () => {

  for (let mode of ['normal', 'immutable', 'safe']) {
    it(`ok when found in mode ${mode}`, () => {
      var __extensible_get__ = runtime[mode] //eslint-disable-line
      let {a} = {a: 1}
      assert.equal(a, 1)
    })
  }

  for (let mode of ['immutable', 'safe']) {
    it(`ok when found in mode ${mode}`, () => {
      var __extensible_get__ = runtime[mode] //eslint-disable-line
      let {a} = fromJS({a: 1})
      assert.equal(a, 1)
    })
  }
})

describe('runtime default', () => {
  it('undefined when not found', () => {
    var __extensible_get__ = runtime['normal'] //eslint-disable-line
    let {b} = {a: 1}
    assert.equal(b, undefined)
  })
})

describe('runtime immutable', () => {

  it('undefined when not found', () => {
    var __extensible_get__ = runtime['immutable'] //eslint-disable-line
    let {b} = fromJS({a: 1})
    assert.equal(b, undefined)
  })

})

describe('runtime safe', () => {

  it('throws when not found in js-obj', () => {
    var __extensible_get__ = runtime['safe'] //eslint-disable-line
    let good
    try {
      let {b} = {a: 1} // eslint-disable-line no-unused-vars
    } catch (e) {
      good = e.message.indexOf('Key Error') !== -1
    }
    assert.equal(good, true)
  })

  it('throws when not found in immutable', () => {
    var __extensible_get__ = runtime['safe'] //eslint-disable-line
    let good
    try {
      let {b} = fromJS({a: 1}) // eslint-disable-line no-unused-vars
    } catch (e) {
      good = e.message.indexOf('Key Error') !== -1
    }
    assert.equal(good, true)
  })
})
