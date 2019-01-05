import * as React from 'react'
import { DragSource } from 'react-dnd'

interface IColumn {
  name: string,
  field: string,
}

interface IColumnItemProps {
  column: IColumn
  addSelectedColumn: any
  connectDragSource?: any
}

const type = 'ColumnItem'
const spec = {
  beginDrag(props: IColumnItemProps) {
    return { field: props.column.field }
  },

  endDrag(props: IColumnItemProps, monitor: any) {
    const dropResult = monitor.getDropResult()

    if (!dropResult) {
      return;
    } else if (dropResult.name === 'TableArea') {
      props.addSelectedColumn({
        column: props.column.field,
        position: dropResult.position,
      })
    }
  }
}

function collect(connect: any) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

const ColumnItem: React.SFC<IColumnItemProps> = ({
  column,
  connectDragSource,
}) => {
  return connectDragSource(
    <li
      key={column.field}
    >
      {column.name}
    </li>
  )
}

export default DragSource(type, spec, collect)(ColumnItem)
