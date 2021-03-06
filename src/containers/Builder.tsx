import * as React from 'react'
import styled from '@emotion/styled'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { withContentRect, MeasuredComponentProps } from 'react-measure'
import { get, take, sum, sortedIndex } from 'lodash'

import Util from '../services/util'

import dataActions from '../actions/data'
import configActions from '../actions/config'

import TableSelector from '../components/TableSelector'
import TableArea from '../components/TableArea'
import Columns from '../components/Columns'
import WherePredicates from './WherePredicates'

const { useEffect } = React

interface ITable {
  name: string,
}

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
    tables: ITable[],
    columns: IColumn[],
    records: any[],
  },
}

interface IFilter {
  column: string,
  operator: string,
  value: string,
}

interface IStateToProps {
  tables: ITable[],
  mainTable: string,
  selectedColumns: string[],
  columns: IColumn[],
  records: any[],
}

interface IDispatchToProps {
  setTables: (payload: any) => any,
  fetchTableColumnsStart: (mainTable: string) => any,
  fetchTableRecordsStart: (mainTable: string, filters: IFilter[]) => any,
  addSelectedColumn: (column: string) => any,
}

const getMode = (queryString: string): string => {
  const params = new URLSearchParams(queryString)
  const mode = params.get('mode')
  return typeof mode === 'string' ? mode : 'create'
}

const mapStateToProps = (state: IStore, ownProps: any) => ({
  mode: getMode(ownProps.location.search),
  tables: state.data.tables,
  mainTable: state.config.mainTable,
  selectedColumns: state.config.selectedColumns,
  columns: state.data.columns,
  records: state.data.records,
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators(
  {
    fetchTablesStart: dataActions.fetchTablesStart,
    fetchTableColumnsStart: dataActions.fetchTableColumnsStart,
    fetchTableRecordsStart: dataActions.fetchTableRecordsStart,
    setTables: configActions.setTables,
    addSelectedColumn: configActions.addSelectedColumn,
    changeColumnIndex: configActions.changeColumnIndex,
  },
  dispatch
)

interface IProps {
  history: any
  mode: string
  tables: ITable[]
  mainTable: string
  columns: IColumn[]
  records: any[]
  selectedColumns: string[]
  setTables: any
  fetchTablesStart: any
  fetchTableColumnsStart: any
  fetchTableRecordsStart: any
  addSelectedColumn: any
  changeColumnIndex?: any
}

interface IColumnWidths {
  column: string
  width: number
}

interface IState {
  columnWidths: { [s: string]: number }
  columnBounds: number[]
  indicatorPositions: number[]
  indicatorIndex: number
}

const SBuilder = styled.div`
  display: flex;
  height: 100%;

  #Container {
    width: 100%;
    height: 100vh;
  }
`

const SRightArea = styled.div`
  width: calc(100% - 200px);
  height: 100%;
  overflow: scroll;
`

interface IIndicatorProps {
  leftOffset: number
}

const SIndicator = styled.span`
  position: absolute;
  z-index: 2000;
  top: 0;
  bottom: 0;
  left: ${(props: IIndicatorProps) => props.leftOffset}px;
  width: 1px;
  background-color: #4286f4;
`

interface WrappedComponentProps {
  column: string
  currentWidth: number
  setColumnWidth: any
}

const WrappedComponent: React.SFC<MeasuredComponentProps & WrappedComponentProps> = ({
  measureRef,
  contentRect,
  column,
  currentWidth,
  setColumnWidth,
}) => {
  const measuredWidth = get(contentRect, 'bounds.width', 0)

  useEffect(() => {
    if (currentWidth !== measuredWidth) {
      setColumnWidth({
        column,
        width: measuredWidth,
      })
    }
  })

  return (
    <div ref={measureRef}>
      {column}
    </div>
  )
}

const ItemToMeasure = withContentRect('bounds')(WrappedComponent)

function getColumnBounds(selectedColumns: string[], columnWidths: { [s: string]: number }): number[] {
  const columnWidthsArray = selectedColumns.map(selectedColumn => columnWidths[selectedColumn])
  const columnBounds: number[] = [];

  columnWidthsArray.forEach((columnWidth, i) => {
    columnBounds.push((columnWidth / 2) + sum(take(columnWidthsArray, i)))
  })

  return columnBounds
}

function getIndicatorPositions(selectedColumns: string[], columnWidths: { [s: string]: number }): number[] {
  const columnWidthsArray = selectedColumns.map(selectedColumn => columnWidths[selectedColumn])
  const indicatorPositions: number[] = [0];

  columnWidthsArray.forEach((columnWidth, i) => {
    indicatorPositions.push(sum(take(columnWidthsArray, i + 1)))
  })

  return indicatorPositions
}

function getIndicatorIndex(columnBounds: number[], offset: number): number {
  return sortedIndex(columnBounds, offset)
}

class Builder extends React.Component<IProps, IState> {
  addSelectedColumn: any

  constructor(props: IProps) {
    super(props)

    this.state = {
      columnWidths: {},
      columnBounds: [],
      indicatorPositions: [],
      indicatorIndex: 0,
    }

    this.addSelectedColumn = this.props.addSelectedColumn.bind(this)
    this.setColumnWidth = this.setColumnWidth.bind(this)
    this.setIndicatorIndex = this.setIndicatorIndex.bind(this)
    this.updateColumnOrder = this.updateColumnOrder.bind(this)
    this.renderBuilder = this.renderBuilder.bind(this)
    this.renderTableSelector = this.renderTableSelector.bind(this)
    this.fetchDataByTables = this.fetchDataByTables.bind(this)
  }

  componentDidMount() {
    this.props.fetchTablesStart()
  }

  fetchDataByTables(mainTable: string) {
    this.props.history.push('/report?mode=edit')
    this.props.fetchTableColumnsStart({ mainTable })
    this.props.fetchTableRecordsStart({ mainTable, filters: [] })
  }

  updateColumnOrder(currentColumnIndex: number, nextColumnIndex: number) {
    const nextSelectedColumns: string[] = Util.arrayMove(this.props.selectedColumns, currentColumnIndex, nextColumnIndex)

    const nextColumnBounds = getColumnBounds(nextSelectedColumns, { ...this.state.columnWidths })
    const nextIndicatorPositions = getIndicatorPositions(nextSelectedColumns, { ...this.state.columnWidths })

    this.setState({
      columnBounds: nextColumnBounds,
      indicatorPositions: nextIndicatorPositions,
    })
    this.props.changeColumnIndex({ nextSelectedColumns })
  }

  setColumnWidth(payload: IColumnWidths) {
    const { selectedColumns } = this.props
    const { column, width } = payload
    const nextColumnWidths = {
      ...this.state.columnWidths,
      [column]: width,
    }
    const nextColumnBounds = getColumnBounds(selectedColumns, nextColumnWidths)
    const nextIndicatorPositions = getIndicatorPositions(selectedColumns, nextColumnWidths)

    this.setState({
      columnWidths: nextColumnWidths,
      columnBounds: nextColumnBounds,
      indicatorPositions: nextIndicatorPositions,
    })
  }

  setIndicatorIndex(offset: number) {
    const { columnBounds, indicatorIndex } = this.state
    const nextIndicatorIndex = getIndicatorIndex(columnBounds, offset)

    if (indicatorIndex !== nextIndicatorIndex) {
      this.setState({
        indicatorIndex: nextIndicatorIndex
      })
    }
  }

  renderBuilder() {
    const indicatorLeftOffset = this.state.indicatorPositions[this.state.indicatorIndex]

    return (
      <SBuilder>
        <Columns
          columns={this.props.columns}
          addSelectedColumn={this.addSelectedColumn}
        />

        <SRightArea>
          <WherePredicates
            columns={this.props.columns}
            mainTable={this.props.mainTable}
            fetchTableRecordsStart={this.props.fetchTableRecordsStart}
          />
          <TableArea
            selectedColumns={this.props.selectedColumns}
            columnWidths={this.state.columnWidths}
            indicatorIndex={this.state.indicatorIndex}
            setIndicatorIndex={this.setIndicatorIndex}
            updateColumnOrder={this.updateColumnOrder}
          >
            <table>
              <thead>
                <tr>
                  {this.props.selectedColumns.map(column => (
                    <th key={column}>
                      <ItemToMeasure
                        column={column}
                        currentWidth={get(this.state.columnWidths, [column], 0)}
                        setColumnWidth={this.setColumnWidth}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.props.records.map((row: any, i: number) => (
                  <tr key={i}>
                    {this.props.selectedColumns.map((key, j) => (
                      <td key={j}>
                        <div>
                          {this.props.records[i][key]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <SIndicator leftOffset={indicatorLeftOffset}/>
          </TableArea>
        </SRightArea>
      </SBuilder>
    );
  }

  renderTableSelector() {
    return (
      <TableSelector
        tables={this.props.tables}
        setTables={this.props.setTables}
        fetchDataByTables={this.fetchDataByTables}
      />
    )
  }

  render() {
    return this.props.mode === 'create' ? this.renderTableSelector() : this.renderBuilder()
  }
}

export default DragDropContext(HTML5Backend)(
  connect<IStateToProps, IDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
  )(Builder)
)
