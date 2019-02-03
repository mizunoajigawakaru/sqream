import * as React from 'react'
import styled from '@emotion/styled'
import Builder from './containers/Builder'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

const Index: React.SFC<{}> = () => (
  <div>
    <h1>Index</h1>
    <Link to={{ pathname: "/report", search: "?mode=create" }}>Create report</Link>
  </div>
)

const Wrapper = styled.div`
  height: 100%;
`
const App: React.SFC<{}> = () => (
  <Router>
    <Wrapper>
      <Route
        path="/"
        exact={true}
        component={Index}
      />
      <Route
        path="/report/"
        component={Builder}
      />
    </Wrapper>
  </Router>
)

export default App
