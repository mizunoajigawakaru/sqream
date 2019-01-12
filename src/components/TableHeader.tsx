import * as React from 'react'
import { DragSource } from 'react-dnd'

interface IProps {
  width: number
  column: string
  selectedColumns: string[]
  updateColumnOrder: any
  connectDragSource?: any
}

function getCanDrop(currentColumnIndex: number, indicatorIndex: number): boolean {
  return indicatorIndex < currentColumnIndex || indicatorIndex > currentColumnIndex + 1
}

function getNextColumnIndex(currentColumnIndex: number, indicatorIndex: number): number {
  return indicatorIndex < currentColumnIndex ? indicatorIndex : indicatorIndex - 1
}

const type = 'ColumnItem'
const spec = {
  beginDrag(props: IProps) {
    return { field: props.column }
  },

  endDrag(props: IProps, monitor: any) {
    const {
      column,
      selectedColumns,
      updateColumnOrder,
    } = props
    const dropResult = monitor.getDropResult()

    if (!dropResult) {
      return;
    } else if (dropResult.name === 'TableArea') {
      const currentColumnIndex = selectedColumns.indexOf(column)
      const canDrop = getCanDrop(currentColumnIndex, dropResult.position)

      if (canDrop) {
        const nextColumnIndex = getNextColumnIndex(currentColumnIndex, dropResult.position)
        updateColumnOrder(currentColumnIndex, nextColumnIndex)
      }
    }
  }
}

function collect(connect: any) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

const TableHeader: React.SFC<IProps> = ({
  width,
  children,
  connectDragSource,
}) => {
  return connectDragSource(
    <li style={{ width }}>{children}</li>
  )
}

export default DragSource(type, spec, collect)(TableHeader)
