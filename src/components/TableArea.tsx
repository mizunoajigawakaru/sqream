import * as React from 'react'
import { DropTarget } from 'react-dnd'
import styled from '@emotion/styled'
import { sum, values } from 'lodash'
import TableHeader from './TableHeader'

interface ITableAreaProps {
  children?: any
  connectDropTarget?: any
  selectedColumns: string[]
  columnWidths: { [s: string]: number }
  indicatorIndex: number
  setIndicatorIndex: any
  updateColumnOrder: any
}

const type = 'ColumnItem'
const spec = {
  hover(props: ITableAreaProps, monitor: any) {
    const { setIndicatorIndex } = props
    const clientOffsetX = monitor.getClientOffset().x

    setIndicatorIndex(clientOffsetX - 200)
  },

  drop(props: ITableAreaProps, monitor: any) {
    const { indicatorIndex } = props

    return { name: 'TableArea', position: indicatorIndex }
  }
}

function collect(connect: any, monitor: any) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

function getTableWidth(columnWidths: { [s: string]: number }) {
  return sum(values(columnWidths)) + 1
}

interface IInnerProps {
  columnWidths: { [s: string]: number }
}

const SWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const STHScroller = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  overflow: scroll;
  z-index: 1000;

  &::-webkit-scrollbar {
    display: none;
  }
`

const STBScroller = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`

const SClipper = styled.div`
  width: ${(props: IInnerProps) => getTableWidth(props.columnWidths)}px;
  overflow: hidden;
`

const STableArea = styled.div`
  position: relative;
  width: 10000px;
  height: 100%;

  table {
    border-collapse: collapse;
  }

  thead {
    text-align: left;
    visibility: hidden;
  }

  tr + tr {
    border-top: solid 1px #787878;
  }

  th,
  td {
    padding: 0;
  }

  th > div,
  td > div {
    padding: 4px 8px;
  }
`

// DnDHeaders
const SDnDHeaders = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  list-style-type: none;
  width: max-content;

  li {
    box-sizing: border-box;
    padding: 4px 8px;
    font-weight: bold;
    background-color: #fff;
    border-bottom: solid 1px #787878;
    cursor: pointer;
  }
`

class TableArea extends React.Component<ITableAreaProps, {}> {
  tableHeadScroller: any
  tableBodyScroller: any

  constructor(props: ITableAreaProps) {
    super(props)

    this.state = {
    }

    this.tableHeadScroller = React.createRef()
    this.tableBodyScroller = React.createRef()

    this.scrollHandler = this.scrollHandler.bind(this)
  }

  scrollHandler() {
    const offsetLeft = this.tableBodyScroller.current.scrollLeft
    this.tableHeadScroller.current.scrollLeft = offsetLeft
  }

  render() {
    const {
      selectedColumns,
      columnWidths,
      children,
      connectDropTarget,
      updateColumnOrder,
    } = this.props

    return connectDropTarget(
      <div id="Container">
        <SWrapper>
          <STHScroller id="Scroller" ref={this.tableHeadScroller}>
            <SDnDHeaders id="DnDHeaders">
              {selectedColumns.map(column => (
                <TableHeader
                  key={column}
                  column={column}
                  selectedColumns={selectedColumns}
                  updateColumnOrder={updateColumnOrder}
                  width={columnWidths[column]}
                >
                  {column}
                </TableHeader>
              ))}
            </SDnDHeaders>
          </STHScroller>
          <STBScroller
            id="Inner"
            ref={this.tableBodyScroller}
            onScroll={this.scrollHandler}
          >
            <SClipper id="Clipper" columnWidths={columnWidths}>
              <STableArea id="Extender">
                {children}
              </STableArea>
            </SClipper>
          </STBScroller>
        </SWrapper>
      </div>
    )
  }
}

export default DropTarget(type, spec, collect)(TableArea)
