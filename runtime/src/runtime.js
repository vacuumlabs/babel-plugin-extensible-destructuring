/* eslint-disable camelcase*/

import {isCollection, List} from 'immutable'

function safeString(o) {
  let stro = 'String representation of object cannot be computed'
  try {
    stro = `${o}`
  } catch (e) {}
  return stro
}

function stringKeys(obj) {
  let ks
  if (isCollection(obj)) {
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
  if (o === null || o === undefined) {
    throw new Error(`cannot resolve property ${safeString(k)} of ${o}`)
  }
  if (typeof k !== 'string') {
    throw new Error(`cannot resolve non-string property ${type(k)} ${safeString(k)}`)
  }
  const value = o[k]
  return value !== undefined ? value : d
}

export function immutable(o, k, d) {
  if (o === null || o === undefined) {
    throw new Error(`cannot resolve property ${safeString(k)} of ${o}`)
  }
  if (isCollection(o)) {
    return o.get(k, d)
  }
  if (typeof k !== 'string') {
    throw new Error(`cannot resolve non-string property ${type(k)} ${safeString(k)}`)
  }
  const value = o[k]
  return value !== undefined ? value : d
}

export function safe(o, k, d) {
  if (o === null || o === undefined) {
    throw new Error(`cannot resolve property ${safeString(k)} of ${o}`)
  }
  if (isCollection(o)) {
    let res = o.get(k, d)
    if (res === undefined) {
      throw new Error(`Key Error: object of type ${typeof o} with keys ${stringKeys(o)} does not contain property ${k}`)
    }
    return o.get(k, d)
  }
  if (typeof k !== 'string') {
    throw new Error(`cannot resolve non-string property ${type(k)} ${safeString(k)}`)
  }
  const value = o[k]
  if (value !== undefined) {
    return value
  }
  if (d === undefined) {
    throw new Error(`Key Error: object of type ${typeof o} with keys ${stringKeys(o)} does not contain property ${k}`)
  }
  return d
}

export function test(o, k, d) {
  throw new Error('Should not get here')
}
