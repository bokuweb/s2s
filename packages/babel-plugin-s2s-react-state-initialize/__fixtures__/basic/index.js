// @flow
import * as React from 'react'

type C = { d: string, e: number }

type State = { a: string, b: number, c: C }

class Fixture extends React.Component<{}, State> {
  state = {}
  x = 'test'
  render() {
    this.state
    return null
  }
}

export default Fixture
