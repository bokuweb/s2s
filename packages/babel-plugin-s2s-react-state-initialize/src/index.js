// @flow
import { parseExpression } from 'babylon'
import { inheritsOpts } from 's2s-utils'
import { flowFakerSync } from 'flow-faker'
import type { BabelPath, State } from 'types/babel'

import isReactClassCreater from 'babel-helper-is-react-class'
import blog from 'babel-log'

const parseFromObj = obj =>
  parseExpression(JSON.stringify(obj), { plugins: ['flow'] })

export default ({ types: t }) => {
  const isReactClass = isReactClassCreater(t)
  return {
    inherits: inheritsOpts,
    name: 's2s-react-state-initialize',
    visitor: {
      Program(programPath: BabelPath, state: State) {
        const { opts: { from } } = state

        programPath.traverse({
          Class(nodePath) {
            if (!isReactClass(nodePath.node)) {
              return
            }

            const params = nodePath.get('superTypeParameters.params')
            if (params.length < 2) {
              return
            }

            // const stateType = params[1]

            const stateProp = nodePath.get('body.body').find(path => {
              if (!path.isClassProperty()) {
                return false
              }
              return path.get('key.name').node === 'state'
            })

            if (!stateProp) {
              return
            }

            blog(stateProp.node)

            const { line, column } = stateProp.get('value.loc.start').node

            const flowInfoObj = flowFakerSync(from, {
              row: line,
              column: column + 1,
            })

            console.log(flowInfoObj)

            // nodePath.get('init').replaceWith(parseFromObj(flowInfoObj))
          },
        })
      },
    },
  }
}
