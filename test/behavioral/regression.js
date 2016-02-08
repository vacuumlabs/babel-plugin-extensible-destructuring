import {Iterable, fromJS} from 'immutable'
import assert from 'assert'

describe('regression', () => {
  beforeEach(() =>{
    global.__extensible_get__ = function(o, k, d) { //eslint-disable-line camelcase
      if (Iterable.isIterable(o)) {
        return o.get(k, d)
      } else if (k in o) {
        return o[k]
      } else {
        return d
      }
    }
  })

  it('issue #8', () => {
    let data = fromJS({
      key1: {key2: 'hello world'}
    })

    let _key1 = 'key1'
    let {[_key1]: {key2}} = data
    assert.equal(key2, 'hello world')
  })
})
