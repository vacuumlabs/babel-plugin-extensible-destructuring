'use extensible'

import {fromJS} from 'immutable'
import patch from 'extensible-polyfill'
patch('safe')

let {a, b: {c}} = fromJS({a: 1, b: {c: 2}})
console.log(a, c)

