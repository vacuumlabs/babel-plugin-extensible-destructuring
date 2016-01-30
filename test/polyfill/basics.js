import patch from '../../polyfill/polyfill'
import assert from 'assert'
import {fromJS} from 'immutable'

describe('polyfill basic behavior', () => {

  for (let mode of ['default', 'immutable', 'safe']) {
    it(`ok when found in mode ${mode}`, () => {
      patch(mode)
      let {a} = {a: 1}
      assert.equal(a, 1)
    })
  }

  for (let mode of ['immutable', 'safe']) {
    it(`ok when found in mode ${mode}`, () => {
      patch(mode)
      let {a} = fromJS({a: 1})
      assert.equal(a, 1)
    })
  }
})

describe('polyfill default', () => {
  it('undefined when not found', () => {
    patch('default')
    let {b} = {a: 1}
    assert.equal(b, undefined)
  })
})

describe('polyfill immutable', () => {

  it('undefined when not found', () => {
    patch('immutable')
    let {b} = fromJS({a: 1})
    assert.equal(b, undefined)
  })

})

describe('polyfill safe', () => {

  it('throws when not found in js-obj', () => {
    patch('safe')
    let good
    try {
      let {b} = {a: 1} // eslint-disable-line no-unused-vars
    } catch (e) {
      good = e.message.indexOf('Key Error') !== -1
    }
    assert.equal(good, true)
  })

  it('throws when not found in immutable', () => {
    patch('safe')
    let good
    try {
      let {b} = fromJS({a: 1}) // eslint-disable-line no-unused-vars
    } catch (e) {
      good = e.message.indexOf('Key Error') !== -1
    }
    assert.equal(good, true)
  })

})

