/* eslint-disable camelcase*/

import {Iterable, List} from 'immutable'

function safeString(o) {
  let stro = 'String representation of object cannot be computed'
  try {
    stro = `${o}`
  } catch (e) {}
  return stro
}

function stringKeys(obj) {
  let ks
  if (Iterable.isIterable(obj)) {
    ks = List(obj.keys()).toJS()
  } else {
    ks = Object.keys(obj)
  }
  ks = ks.map((k) => `"${k}"`)
  return `[ ${ks.join(', ')} ]`
}

function type(o) {
  return `[${typeof o}]`
}

export function normal(o, k, d) {
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
};


export function immutable(o, k, d) {
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
};

export function safe(o, k, d) {
  if (Iterable.isIterable(o)) {
    let res = o.get(k, d)
    if (res === undefined) {
      throw new Error(`Key Error: object with keys ${stringKeys(o)} does not contain property ${k}`)
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
    throw new Error(`Key Error: object with keys ${stringKeys(o)} does not contain property ${k}`)
  }
  return d
}

export function test(o, k, d) {
  throw new Error('Should not get here')
}
