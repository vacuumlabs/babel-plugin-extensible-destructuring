/* eslint-disable max-len */

import {Iterable, List} from 'immutable'

function safeString(o) {
  let stro = 'String representation of object cannot be computed'
  try {
    stro = `${o}`
  } catch (e) {}
  return stro
}

function type(o) {
  return `[${typeof o}]`
}

let gets = {
  'default': (o, k, d) => {
    if (typeof k !== 'string') {
      throw new Error(`cannot resolve non-string property ${type(k)} ${safeString(k)}`)
    }
    if (typeof o !== 'object') {
      throw new Error(`cannot resolve property ${k} in object of type ${typeof o} (${safeString(o)})`)
    }
    if (k in o) {
      return o[k]
    }
    return d
  },

  'immutable': (o, k, d) => {
    if (Iterable.isIterable(o)) {
      return o.get(k, d)
    }
    if (typeof k !== 'string') {
      throw new Error(`cannot resolve non-string property ${type(k)} ${safeString(k)}`)
    }
    if (typeof o !== 'object') {
      throw new Error(`cannot resolve property ${k} in object of type ${typeof o} (${safeString(o)})`)
    }
    if (k in o) {
      return o[k]
    }
    return d
  },

  'safe': (o, k, d) => {
    if (Iterable.isIterable(o)) {
      let res = o.get(k, d)
      if (res === undefined) {
        throw new Error(`Key Error: object with keys ${List(o.keys()).toJS()} does not contain property ${k}`)
      }
      return o.get(k, d)
    }
    if (typeof k !== 'string') {
      throw new Error(`cannot resolve non-string property ${type(k)} ${safeString(k)}`)
    }
    if (typeof o !== 'object') {
      throw new Error(`cannot resolve property ${k} in object of type ${typeof o} (${safeString(o)})`)
    }
    if (k in o) {
      return o[k]
    }
    if (d === undefined) {
      throw new Error(`Key Error: object with keys ${Object.keys(o)} does not contain property ${k}`)
    }
    return d
  }
}

export default function patch(what) {
  if (what in patch) {
    if (typeof global === 'object') {
      global.__extenible_get__ = patch[what]
    }
    if (typeof window === 'object') {
      window.__extenible_get__ = patch[what]
    }
  } else {
    throw new Error(`patch argument must be one of ${Object.keys(gets)}`)
  }
}
