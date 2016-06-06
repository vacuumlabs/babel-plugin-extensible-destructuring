import {fromJS} from 'immutable'

let {a, b: {c}} = fromJS({a: 1, b: {c: 2}})
console.log(a, c)

