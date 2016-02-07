import {Iterable} from 'immutable'

let nCalls = 0

export function getN() {
  return nCalls
}

export function reset() {
  nCalls = 0
}

export const patch = function() {
  if (true || !('extensible_get__' in global)) {
    global.__extensible_get__ = (o, k, d) => { //eslint-disable-line camelcase
      nCalls += 1
      if (Iterable.isIterable(o)) {
        return o.get(k, d)
      } else if (k in o) {
        return o[k]
      } else if (typeof d === 'number') {
        return 'default' + d
      } else {
        return d
      }
    }
  }
}
