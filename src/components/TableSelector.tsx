import * as React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'

interface ITable {
  name: string,
}

interface ITableSelectorProps {
  tables: ITable[],
  setTables: any,
  fetchDataByTables: any,
}

class TableSelector extends React.Component<ITableSelectorProps & InjectedFormProps<{}, ITableSelectorProps>, {}> {
  constructor(props: ITableSelectorProps & InjectedFormProps<{}, ITableSelectorProps>) {
    super(props)

    this.onSubmitHandler = this.onSubmitHandler.bind(this)
  }

  onSubmitHandler(values: any) {
    this.props.setTables({
      mainTable: values.mainTable,
      joinTables: [],
    })
    this.props.fetchDataByTables(values.mainTable)
  }

  render() {
    const hasTables = this.props.tables.length

    return (
      <div>
        <h1>Create report</h1>
        <div>
          <h2>Select tables</h2>
          <form onSubmit={this.props.handleSubmit(this.onSubmitHandler)}>
            <ul>
              <li>
                <Field
                  name="mainTable"
                  component="select"
                >
                  {hasTables && this.props.tables.map(table => (
                    <option
                      key={table.name}
                      value={table.name}
                    >
                      {table.name}
                    </option>
                  ))}
                </Field>
              </li>
            </ul>
            <button>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default reduxForm<{}, ITableSelectorProps>({
  form: 'TableSelector',
})(TableSelector)
