/* eslint-disable no-var */

import assert from 'assert'
import {resetN, getN, extensibleGet} from './extensibleGet'

var __extensible_get__ = extensibleGet // eslint-disable-line

describe('advanced', () => {

  beforeEach(() => {
    resetN()
  })

  it('for-of works', () => {
    let aa = 0
    let bb = 0
    for (let [a, b] of [[1, 2], [3, 4]]) {
      aa += a
      bb += b
    }
    assert.equal(aa, 4)
    assert.equal(bb, 6)
    assert.equal(getN(), 0)
  })

  it('for-of with nested maps works', () => {
    let aa = 0
    let cc = 0
    for (let {a, b: {c}} of [{a:1, b: {c: 2}}, {a:3, b: {c: 4}}]) {
      aa += a
      cc += c
    }
    assert.equal(aa, 4)
    assert.equal(cc, 6)
    assert.equal(getN(), 6)
  })

  it('destructures function arguments', () => {
    let fn = ([a, b], {c: {d: e}}, [f, {g = 5}]) => {
      return [a, b, e, f, g]
    }
    let res = fn([1, 2], {c: {d: 3}}, [4, {}])
    assert.equal(res[0], 1)
    assert.equal(res[1], 2)
    assert.equal(res[2], 3)
    assert.equal(res[3], 4)
    assert.equal(res[4], 'default5')
    assert(getN(), 3)
  })

})


