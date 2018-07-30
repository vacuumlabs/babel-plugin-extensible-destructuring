let sourceCode
let writes

function printNode(node) {
  if (!writes) {
    return
  }
  _printNode(node, 2, 0)
}

function print(str) {
  if (writes) {
    console.log(str)
  }
}

function _printNode(node, lvl, indent) {
  if (lvl === 0) return
  if (node == null) return
  if (node.type != null) {
    let ind = []
    for (let i = 0; i < indent + 1; i++) {
      ind.push('  ')
    }
    ind = ind.join('')
    console.log(ind + node.type)
    if ('loc' in node) {
      let sl = node.loc.start.line
      let el = node.loc.end.line
      if (sl !== el) {throw new Error('sl != el')}
      let toPrint = []
      for (let i = 0; i < indent + 1; i++) {
        toPrint.push('  ')
      }
      console.log(ind + '  ' + sourceCode[sl - 1].substring(node.loc.start.column, node.loc.end.column))
    }
    for (let k of Object.keys(node)) {
      _printNode(node[k], lvl - 1, indent + 1)
    }
  }
}


export default function({types: t}) {

  /*
    Babel 7 renamed RestProperty to RestElement.
    Check which one is available, then make a copy of it for future references.
    Prefer the older version when both exist for babel 6 compatibility
  */
  const isRestElement = (tx, node, opts) => 
    tx.isRestElement && !tx.isRestProperty ? 
        tx.isRestElement(node, opts) :
        tx.isRestProperty(node, opts);

  function generateRequire(pkgName, methodName)  {
    return t.variableDeclaration(
      'var',
      [
        t.variableDeclarator(
          t.identifier('__extensible_get__'),
          t.memberExpression(
            t.callExpression(
              t.identifier('require'),
              [
                t.stringLiteral(pkgName)
              ]
            ),
            t.identifier(methodName),
            false
          )
        )
      ]
    )
  };

  function extensibleGet(obj, prop, def) {
    let args = [obj, prop]
    if (def !== undefined) {
      args.push(def)
    }
    return t.callExpression(t.identifier('__extensible_get__'), args)
  }
  /**
   * Test if a VariableDeclaration's declarations contains any Patterns.
   */

  function variableDeclarationHasPattern(node) {
    for (let declar of node.declarations) {
      if (t.isPattern(declar.id)) {
        return true
      }
    }
    return false
  }

  /**
   * Test if an ArrayPattern's elements contain any RestElements.
   */

  function hasRest(pattern) {
    for (let elem of pattern.elements) {
      if (isRestElement(t, elem)) {
        return true
      }
    }
    return false
  }

  let arrayUnpackVisitor = {
    ReferencedIdentifier(path, state) {
      if (state.bindings[path.node.name]) {
        state.deopt = true
        path.stop()
      }
    }
  }

  class DestructuringTransformer {
    constructor(opts) {
      this.blockHoist = opts.blockHoist
      this.operator   = opts.operator
      this.arrays     = {}
      this.nodes      = opts.nodes || []
      this.scope      = opts.scope
      this.file       = opts.file
      this.kind       = opts.kind
    }

    buildVariableAssignment(id, init) {
      let op = this.operator
      if (t.isMemberExpression(id)) op = '='

      let node

      if (op) {
        node = t.expressionStatement(t.assignmentExpression(op, id, init))
      } else {
        node = t.variableDeclaration(this.kind, [
          t.variableDeclarator(id, init)
        ])
      }

      node._blockHoist = this.blockHoist

      return node
    }

    buildVariableDeclaration(id, init) {
      let declar = t.variableDeclaration('var', [
        t.variableDeclarator(id, init)
      ])
      declar._blockHoist = this.blockHoist
      return declar
    }

    push(id, init) {
      if (t.isObjectPattern(id)) {
        this.pushObjectPattern(id, init)
      } else if (t.isArrayPattern(id)) {
        this.pushArrayPattern(id, init)
      } else if (t.isAssignmentPattern(id)) {
        throw new Error('shouldnt get here, handling of AssignmentPattert is inlined into ObjectPattern')
      } else {
        this.nodes.push(this.buildVariableAssignment(id, init))
      }
    }

    toArray(node, count) {
      if (this.file.opts.loose || (t.isIdentifier(node) && this.arrays[node.name])) {
        return node
      } else {
        return this.scope.toArray(node, count)
      }
    }

    pushObjectRest(pattern, objRef, spreadProp, spreadPropIndex) {
      print('pushObjectRest')
      // get all the keys that appear in this object before the current spread

      let keys = []

      for (let i = 0; i < pattern.properties.length; i++) {
        let prop = pattern.properties[i]

        // we've exceeded the index of the spread property to all properties to the
        // right need to be ignored
        if (i >= spreadPropIndex) break

        // ignore other spread properties
        if (isRestElement(t, prop)) continue

        let key = prop.key
        if (t.isIdentifier(key) && !prop.computed) key = t.stringLiteral(prop.key.name)
        keys.push(key)
      }

      keys = t.arrayExpression(keys)

      let value = t.callExpression(this.file.addHelper('objectWithoutProperties'), [objRef, keys])
      this.nodes.push(this.buildVariableAssignment(spreadProp.argument, value))
    }

    pushObjectProperty(prop, propRef) {
      print('pushObjectProperty')
      if (t.isLiteral(prop.key)) prop.computed = true

      let pattern = prop.value
      let objRef = extensibleGet(propRef, prop.computed ? prop.key : t.stringLiteral(prop.key.name))

      if (t.isPattern(pattern)) {
        if (t.isAssignmentPattern(pattern)) {
          objRef = extensibleGet(propRef, t.stringLiteral(prop.key.name), pattern.right)
          print('recursive')
          this.push(pattern.left, objRef)
        } else {
          print('recursive')
          this.push(pattern, objRef)
        }

      } else {
        this.nodes.push(this.buildVariableAssignment(pattern, objRef))
      }
    }

    pushObjectPattern(pattern, objRef) {
      print('pushObjectPattern')
      printNode(pattern)
      printNode(objRef)

      if (!pattern.properties.length) {
        this.nodes.push(t.expressionStatement(
            t.callExpression(this.file.addHelper('objectDestructuringEmpty'), [objRef])
        ))
      }

      // if we have more than one properties in this pattern and the objectRef is a
      // member expression then we need to assign it to a temporary variable so it's
      // only evaluated once

      if (pattern.properties.length > 1 && !this.scope.isStatic(objRef)) {
        let temp = this.scope.generateUidIdentifierBasedOnNode(objRef)
        let tempFullObjRef = objRef
        this.nodes.push(this.buildVariableDeclaration(temp, tempFullObjRef))
        objRef = temp
      }

      for (let i = 0; i < pattern.properties.length; i++) {
        let prop = pattern.properties[i]
        if (isRestElement(t, prop)) {
          this.pushObjectRest(pattern, objRef, prop, i)
        } else {
          this.pushObjectProperty(prop, objRef)
        }
      }
    }

    canUnpackArrayPattern(pattern, arr) {
      // not an array so there's no way we can deal with this
      if (!t.isArrayExpression(arr)) return false

      // pattern has less elements than the array and doesn't have a rest so some
      // elements wont be evaluated
      if (pattern.elements.length > arr.elements.length) return
      if (pattern.elements.length < arr.elements.length && !hasRest(pattern)) return false

      for (let elem of pattern.elements) {
        // deopt on holes
        if (!elem) return false

        // deopt on member expressions as they may be included in the RHS
        if (t.isMemberExpression(elem)) return false
      }

      for (let elem of arr.elements) {
        // deopt on spread elements
        if (t.isSpreadElement(elem)) return false
      }

      // deopt on reference to left side identifiers
      let bindings = t.getBindingIdentifiers(pattern)
      let state = {deopt: false, bindings}
      this.scope.traverse(arr, arrayUnpackVisitor, state)
      return !state.deopt
    }

    pushUnpackedArrayPattern(pattern, arr) {
      for (let i = 0; i < pattern.elements.length; i++) {
        let elem = pattern.elements[i]
        if (isRestElement(t, elem)) {
          this.push(elem.argument, t.arrayExpression(arr.elements.slice(i)))
        } else {
          this.push(elem, arr.elements[i])
        }
      }
    }

    pushArrayPattern(pattern, arrayRef) {
      print('pushArrayPattern')
      if (!pattern.elements) return

      // optimise basic array destructuring of an array expression
      //
      // we can't do this to a pattern of unequal size to it's right hand
      // array expression as then there will be values that wont be evaluated
      //
      // eg: let [a, b] = [1, 2]

      if (this.canUnpackArrayPattern(pattern, arrayRef)) {
        return this.pushUnpackedArrayPattern(pattern, arrayRef)
      }

      // if we have a rest then we need all the elements so don't tell
      // `scope.toArray` to only get a certain amount

      let count = !hasRest(pattern) && pattern.elements.length

      // so we need to ensure that the `arrayRef` is an array, `scope.toArray` will
      // return a locally bound identifier if it's been inferred to be an array,
      // otherwise it'll be a call to a helper that will ensure it's one

      let toArray = this.toArray(arrayRef, count)

      if (t.isIdentifier(toArray)) {
        // we've been given an identifier so it must have been inferred to be an
        // array
        arrayRef = toArray
      } else {
        arrayRef = this.scope.generateUidIdentifierBasedOnNode(arrayRef)
        this.arrays[arrayRef.name] = true
        this.nodes.push(this.buildVariableDeclaration(arrayRef, toArray))
      }

      for (let i = 0; i < pattern.elements.length; i++) {
        let elem = pattern.elements[i]

        // hole
        if (!elem) continue

        let elemRef

        if (isRestElement(t, elem)) {
          elemRef = this.toArray(arrayRef)

          if (i > 0) {
            elemRef = t.callExpression(t.memberExpression(elemRef, t.identifier('slice')), [t.numericLiteral(i)])
          }

          // set the element to the rest element argument since we've dealt with it
          // being a rest already
          elem = elem.argument
        } else {
          elemRef = t.memberExpression(arrayRef, t.numericLiteral(i), true)
        }

        this.push(elem, elemRef)
      }
    }

    init(pattern, ref) {
      // trying to destructure a value that we can't evaluate more than once so we
      // need to save it to a variable

      if (!t.isArrayExpression(ref) && !t.isMemberExpression(ref)) {
        let memo = this.scope.maybeGenerateMemoised(ref, true)
        if (memo) {
          this.nodes.push(this.buildVariableDeclaration(memo, ref))
          ref = memo
        }
      }

      this.push(pattern, ref)

      return this.nodes
    }
  }

  let shouldTransform = false

  // 0 - no directive
  // 1 - 'use extensible' directive
  // -1 - 'use !extensible' directive
  function getDirective(path) {
    for (let directive of path.node.directives) {
      let dirstr = directive.value.value
      if (dirstr.startsWith('use ')) {
        let uses = dirstr.substr(4).split(',').map((use) => use.trim())
        if (uses.indexOf('extensible') !== -1) {
          return 1
        }
        if (uses.indexOf('!extensible') !== -1) {
          return -1
        }
      }
    }
    return 0
  }

  return {
    visitor: {
      Program(path, state) {
        sourceCode = path.scope.hub.file.code.split('\n') // debug purposes
        let directive = getDirective(path)
        if (state.opts == null) {
          state.opts = {}
        }
        if (state.opts.mode == null) {
          state.opts.mode = 'optin'
        }
        if (state.opts.mode === 'optin') {
          shouldTransform = (directive === 1)
        } else if (state.opts.mode === 'optout') {
          shouldTransform = (directive !== -1)
        }
        if (state.opts.package_name == null) {
          state.opts.package_name = 'extensible-runtime'
        }
        if (state.opts.impl == null) {
          state.opts.impl = 'safe'
        }
        writes = (state.opts.verbose === true)
        if (shouldTransform) {
          path.node.body = [
            generateRequire(state.opts['package_name'], state.opts['impl']),
            ...path.node.body
          ]
        }
        //console.log(path.scope.hub.file.opts.filename)
        //console.log(shouldTransform)
      },
      ForXStatement(path, file) {
        if (!shouldTransform) {return}
        let {node, scope} = path
        let left = node.left

        if (t.isPattern(left)) {
          // for ({ length: k } in { abc: 3 })

          let temp = scope.generateUidIdentifier('ref')

          node.left = t.variableDeclaration('var', [
            t.variableDeclarator(temp)
          ])

          path.ensureBlock()

          node.body.body.unshift(t.variableDeclaration('var', [
            t.variableDeclarator(left, temp)
          ]))

          return
        }

        if (!t.isVariableDeclaration(left)) return

        let pattern = left.declarations[0].id
        if (!t.isPattern(pattern)) return

        let key = scope.generateUidIdentifier('ref')
        node.left = t.variableDeclaration(left.kind, [
          t.variableDeclarator(key, null)
        ])

        let nodes = []

        let destructuring = new DestructuringTransformer({
          kind: left.kind,
          file: file,
          scope: scope,
          nodes: nodes
        })

        destructuring.init(pattern, key)

        path.ensureBlock()

        let block = node.body
        block.body = nodes.concat(block.body)
      },

      CatchClause({node, scope}, file) {
        if (!shouldTransform) {return}
        let pattern = node.param
        if (!t.isPattern(pattern)) return

        let ref = scope.generateUidIdentifier('ref')
        node.param = ref

        let nodes = []

        let destructuring = new DestructuringTransformer({
          kind: 'let',
          file: file,
          scope: scope,
          nodes: nodes
        })
        destructuring.init(pattern, ref)

        node.body.body = nodes.concat(node.body.body)
      },

      AssignmentExpression(path, file) {
        if (!shouldTransform) {return}
        let {node, scope} = path
        if (!t.isPattern(node.left)) return

        let nodes = []

        let destructuring = new DestructuringTransformer({
          operator: node.operator,
          file: file,
          scope: scope,
          nodes: nodes
        })

        let ref
        if (path.isCompletionRecord() || !path.parentPath.isExpressionStatement()) {
          ref = scope.generateUidIdentifierBasedOnNode(node.right, 'ref')

          nodes.push(t.variableDeclaration('var', [
            t.variableDeclarator(ref, node.right)
          ]))

          if (t.isArrayExpression(node.right)) {
            destructuring.arrays[ref.name] = true
          }
        }

        destructuring.init(node.left, ref || node.right)

        if (ref) {
          nodes.push(t.expressionStatement(ref))
        }

        path.replaceWithMultiple(nodes)
      },

      VariableDeclaration(path, file) {
        if (!shouldTransform) { return }
        let {node, scope, parent} = path
        if (t.isForXStatement(parent)) return
        if (!parent || !path.container) return // i don't know why this is necessary - TODO
        if (!variableDeclarationHasPattern(node)) return

        let nodes = []
        let declar

        for (let i = 0; i < node.declarations.length; i++) {
          declar = node.declarations[i]

          let patternId = declar.init
          let pattern   = declar.id

          let destructuring = new DestructuringTransformer({
            blockHoist: node._blockHoist,
            nodes:      nodes,
            scope:      scope,
            kind:       node.kind,
            file:       file
          })

          if (t.isPattern(pattern)) {
            destructuring.init(pattern, patternId)

            if (+i !== node.declarations.length - 1) {
              // we aren't the last declarator so let's just make the
              // last transformed node inherit from us
              t.inherits(nodes[nodes.length - 1], declar)
            }
          } else {
            nodes.push(t.inherits(destructuring.buildVariableAssignment(declar.id, declar.init), declar))
          }
        }

        path.replaceWithMultiple(nodes)
      }
    }
  }
}
