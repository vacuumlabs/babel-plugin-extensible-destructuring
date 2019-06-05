import {isCollection} from 'immutable'

let nCalls = 0

export function getN() {
  return nCalls
}

export function resetN() {
  nCalls = 0
}

export const extensibleGet = (o, k, d) => {
  nCalls += 1
  if (isCollection(o)) {
    return o.get(k, d)
  } else if (k in o) {
    return o[k]
  } else if (typeof d === 'number') {
    return 'default' + d
  } else {
    return d
  }
}
