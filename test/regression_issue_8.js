import {Iterable, fromJS} from 'immutable';
import assert from 'assert'
Iterable.prototype[Symbol.for('get')] = function(value) {return this.get(value) }

describe('Behavioral tests', () => {
  it('regression for issue #8', () => {
    let data = fromJS({
      key1: { key2: 'hello world'}
    });

    let _key1 = 'key1'
    let {[_key1]: {key2}} = data
    assert.equal(key2, 'hello world')
  })
})
