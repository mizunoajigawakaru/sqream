import * as React from 'react'
import styled from '@emotion/styled'

import ColumnItem from './ColumnItem'

// box-shadow: 0 0 0.5rem #9da5ab;

const SColumns = styled.div`
  width: 200px;
  height: 100%;
  border-right: solid 1px #787878;

  ul {
    padding: 0;
    list-style-type: none;
  }

  li {
    padding: 4px 12px;
    cursor: pointer;
  }
`

interface IColumn {
  name: string,
  field: string,
}

interface IColumnProps {
  columns: IColumn[]
  addSelectedColumn: any
}

const Columns: React.SFC<IColumnProps> = ({
  columns,
  addSelectedColumn,
}) => {
  return (
    <SColumns>
      <ul>
        {columns.map(column => (
          <ColumnItem
            key={column.field}
            column={column}
            addSelectedColumn={addSelectedColumn}
          />
        ))}
      </ul>
    </SColumns>
  )
}

export default Columns
