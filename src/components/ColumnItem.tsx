import * as React from 'react'
import { DragSource } from 'react-dnd'

// interface IColumn {
//   name: string,
//   field: string,
//   type: string,
// }

interface IColumnItemProps {
  column: any
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

const icons = {
  INTEGER: 'looks_one',
  STRING: 'text_format',
  DATE: 'date_range',
  MASTER: 'dns',
}

const ColumnItem: React.SFC<IColumnItemProps> = ({
  column,
  connectDragSource,
}) => {
  return connectDragSource(
    <li
      key={column.field}
    >
      <i className="material-icons">{icons[column.type]}</i>
      <span>{column.name}</span>
    </li>
  )
}

export default DragSource(type, spec, collect)(ColumnItem)
