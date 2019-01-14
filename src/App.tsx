import * as React from 'react'
import styled from '@emotion/styled'
import Builder from './containers/Builder'
import { BrowserRouter as Router, Route } from "react-router-dom"

const Wrapper = styled.div`
  height: 100%;
`
const App: React.SFC<{}> = () => (
  <Wrapper>
    <Router>
      <Route path="/report/" component={Builder} />
    </Router>
  </Wrapper>
)

export default App
