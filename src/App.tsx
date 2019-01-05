import * as React from 'react'
import styled from '@emotion/styled'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import dataActions from './actions/data'
import configActions from './actions/config'

import Builder from './containers/Builder'

interface IColumn {
  name: string,
  field: string,
}

interface IStore {
  config: {
    mainTable: string,
    selectedColumns: string[],
  },
  data: {
    columns: IColumn[],
    records: any[],
  },
}

interface IStateToProps {
  mainTable: string,
  selectedColumns: string[],
  columns: IColumn[],
  records: any[],
}

interface IDispatchToProps {
  fetchTableColumnsStart: (mainTable: string) => any,
  fetchTableRecordsStart: (mainTable: string) => any,
  addSelectedColumn: (column: string) => any,
}

const mapStateToProps = (state: IStore) => ({
  mainTable: state.config.mainTable,
  selectedColumns: state.config.selectedColumns,
  columns: state.data.columns,
  records: state.data.records,
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators(
  {
    fetchTableColumnsStart: dataActions.fetchTableColumnsStart,
    fetchTableRecordsStart: dataActions.fetchTableRecordsStart,
    addSelectedColumn: configActions.addSelectedColumn,
  },
  dispatch
)

interface IProps {
  mainTable: string,
  columns: IColumn[],
  records: any[],
  selectedColumns: string[],
  fetchTableColumnsStart: any,
  fetchTableRecordsStart: any,
  addSelectedColumn: any,
}

const Wrapper = styled.div`
  height: 100%;
`

class App extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props)
  }

  public render() {
    return (
      <Wrapper>
        <Builder/>
      </Wrapper>
    );
  }
}

export default connect<IStateToProps, IDispatchToProps>(mapStateToProps, mapDispatchToProps)(App)
