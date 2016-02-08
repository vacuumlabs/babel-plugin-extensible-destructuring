/* eslint-disable no-var */
global.noprint = true

import assert from 'assert'
import {patch, getN} from './extensibleGet'
import {Map, fromJS} from 'immutable'

describe('basics', () => {

  beforeEach(() => {
    patch()
  })

  it('destructures simple map (1 key)', () => {
    var o = {a: 1}
    var {a} = o
    assert.equal(a, 1)
    assert.equal(getN(), 1)
  })

  it('destructures simple map (2 keys)', () => {
    var o = {a: 1, b: 2}
    var {a, b} = o
    assert.equal(a, 1)
    assert.equal(b, 2)
    assert.equal(getN(), 2)
  })

  it('works with multiple assignments', () => {
    var o = [1, 2]
    var [a, b] = o, c = 3
    assert.equal(a, 1)
    assert.equal(b, 2)
    assert.equal(c, 3)
  })

  it('handles default values right', () => {
    var o = {a: 1}
    var {a, b = 2} = o
    assert.equal(a, 1)
    assert.equal(b, 'default2')
    assert.equal(getN(), 2)
  })

  it('works on nested maps', () => {
    var o = {a: {b: {c: 4}, d: 5}, e: 6}
    var {a: {b: {c}, d}, e} = o
    assert.equal(c, 4)
    assert.equal(d, 5)
    assert.equal(e, 6)
    assert.equal(getN(), 5)
  })

  it('works on nested maps with default values', () => {
    var o = {a: {b: {}}}
    var {a: {b: {c = 3}, d = 4}, e = 5} = o
    assert.equal(c, 'default3')
    assert.equal(d, 'default4')
    assert.equal(e, 'default5')
    assert.equal(getN(), 5)
  })

  it('works on nested defaults', () => {
    var o = {}
    var {a: {b: {c}, d} = {b: {c: 'default3'}, d: 'default4'}} = o
    assert.equal(c, 'default3')
    assert.equal(d, 'default4')
    assert.equal(getN(), 4)
  })

  it('works with arrays', () => {
    var o = {a: {b: [1, 2]}, d: [3, 4]}
    var {a: {b: [v1, v2]}, d: [v3, v4]} = o
    assert.equal(v1, 1)
    assert.equal(v2, 2)
    assert.equal(v3, 3)
    assert.equal(v4, 4)
  })

  it('works with arrays 2', () => {
    var o = [{a: 1}, {b: {c: 2}}, 3]
    var [{a}, {b: {c}}, d] = o
    assert.equal(a, 1)
    assert.equal(c, 2)
    assert.equal(d, 3)
    assert.equal(getN(), 3)
  })

  it('works with computed propertied', () => {
    var o = {hello: {world: {a: 4}}}
    var w = 'world'
    var {['he' + 'llo']: {[w]: {a}}} = o
    assert.equal(a, 4)
  })

  it('works with non-string keys', () => {
    let o = Map([[fromJS([1, 2, 3]), 'a'], [fromJS({b: 'c'}), 'd']])
    let {[fromJS([1, 2, 3])]: a, [fromJS({b: 'c'})] : d} = o
    assert.equal(a, 'a')
    assert.equal(d, 'd')
  })

  it('works with non-string keys (2)', () => {
    let aa = {}
    let bb = {}
    let o = Map([[aa, 'a'], [bb, 'b']])
    let {[aa]: a, [bb]: b} = o
    assert.equal(a, 'a')
    assert.equal(b, 'b')
  })

})



