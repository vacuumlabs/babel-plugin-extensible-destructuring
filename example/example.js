import {fromJS} from 'immutable'
import patch from 'extensible-polyfill'

patch('immutable')
//patch('safe')

let {a, b: {c}} = fromJS({a: 1, b: {cc: 2}})
console.log(a, c)

