import * as React from 'react'
import { reduxForm, Field, FieldArray, InjectedFormProps } from 'redux-form'
import styled from '@emotion/styled'
import { find, get, isEmpty } from 'lodash'

interface IFilter {
  column: string,
  operator: string,
  value: string,
}

interface IColumn {
  name: string,
  field: string,
}

interface IWherePredicatesProps {
  columns: IColumn[],
  mainTable: string,
  fetchTableRecordsStart: any,
}

interface IFormData {
  wherePredicates: IFilter[],
}

interface IWherePredicatesState {
  values: Array<IFilter & { editing: boolean }>,
  editingFilter: null | number,
}

const SWherePredicates = styled.div`
  padding: 16px;
  border-bottom: solid 1px #787878;

  h2 {
    margin-bottom: 12px;
  }

  .wherePredicateFromItems {
    display: flex;

    li + li {
      margin-left: 12px;
    }
  }
`

const operatorList = [
  {
    name: 'equals',
    value: '=',
  },
  {
    name: 'less than',
    value: '<',
  },
  {
    name: 'greater than',
    value: '>',
  },
  {
    name: 'less or equal',
    value: '<=',
  },
  {
    name: 'greater or equal',
    value: '>=',
  },
  {
    name: 'not equal to',
    value: '!=',
  },
  {
    name: 'contains',
    value: '%like%',
  },
  {
    name: 'does not contain',
    value: '!%like%',
  },
  {
    name: 'starts with',
    value: 'like%',
  },
]


function getColumnName(columns: IColumn[], field: string): string {
  return get(find(columns, ['field', field]), 'name', '')
}

function getOperatorName(value: string): string {
  return get(find(operatorList, ['value', value]), 'name', '')
}

function getFilterStringValues(columns: IColumn[], values: IFilter) {
  return [
    getColumnName(columns, values.column),
    getOperatorName(values.operator),
    values.value
  ]
}

const WherePredicateForms = ({
    change,
    columns,
    fields,
    editingFilter,
    onSubmitHandler,
    currentValues,
    setEditingFilter,
  }: {
    change: any,
    columns: IColumn[],
    fields: any,
    editingFilter: null | number,
    onSubmitHandler: any,
    currentValues: IFilter[],
    setEditingFilter: (index: number | null) => void,
  }) => {
  const addFilter = () => {
    fields.push({
      column: 'id',
      operator: '=',
      value: '',
    })
    setEditingFilter(fields.length)
  }

  return (
    <div>
      <ul>
        {fields.map((wherePredicate: any, index: number) => {
          const removeFilter = () => {
            fields.remove(index)
            const nextFilterValues = fields.getAll().filter((filter: any, i: number) => i !== index)
            onSubmitHandler({ wherePredicates: nextFilterValues })
          }

          const editFilter = () => {
            setEditingFilter(index)
          }

          const cancel = () => {
            const currentValue = currentValues[index]

            if (isEmpty(currentValue)) {
              setEditingFilter(null)
              fields.remove(index)
            } else {
              const { column, operator, value } = currentValues[index]

              setEditingFilter(null)
              change(`wherePredicates[${index}].column`, column)
              change(`wherePredicates[${index}].operator`, operator)
              change(`wherePredicates[${index}].value`, value)
            }
          }

          return (
            <li key={index}>
              {editingFilter === index ?
                <ul className="wherePredicateFromItems">
                  <li>
                    <Field
                      name={`${wherePredicate}.column`}
                      component="select"
                    >
                      {columns.map(column => (
                        <option value={column.field}>{column.name}</option>
                      ))}
                    </Field>
                  </li>
                  <li>
                    <Field
                      name={`${wherePredicate}.operator`}
                      component="select"
                    >
                      {operatorList.map(operator => (
                        <option value={operator.value}>{ operator.name }</option>
                      ))}
                    </Field>
                  </li>
                  <li>
                    <Field
                      name={`${wherePredicate}.value`}
                      component="input"
                      type="text"
                      placeholder="value"
                    />
                  </li>
                  <li>
                    <button type="submit">Submit</button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </li>
                </ul>
                :
                <ul className="wherePredicateFromItems">
                  {getFilterStringValues(columns, fields.get(index)).map(filter => (
                    <li>{ filter }</li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={editFilter}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={removeFilter}
                    >
                      Remove
                    </button>
                  </li>
                </ul>
              }
            </li>
          )}
        )}
      </ul>
      <button
        type="button"
        onClick={addFilter}
        disabled={editingFilter !== null}
      >
        Add Filter
      </button>
    </div>
  )
}

class WherePredicates extends React.Component<IWherePredicatesProps & InjectedFormProps<IFormData, IWherePredicatesProps>, IWherePredicatesState> {
  constructor(props: IWherePredicatesProps & InjectedFormProps<IFormData, IWherePredicatesProps>) {
    super(props)

    this.state = {
      values: [],
      editingFilter: null
    }
    this.onSubmitHandler = this.onSubmitHandler.bind(this)
    this.setEditingFilter = this.setEditingFilter.bind(this)
  }

  onSubmitHandler(values: any) {
    this.setState({
      values: values.wherePredicates,
      editingFilter: null,
    })
    this.props.fetchTableRecordsStart({
      mainTable: this.props.mainTable,
      filters: values.wherePredicates,
    })
  }

  setEditingFilter(index: number | null) {
    this.setState({
      editingFilter: index
    })
  }

  render() {
    return (
      <SWherePredicates>
        <h2>Filters</h2>
        <form onSubmit={this.props.handleSubmit(this.onSubmitHandler)}>
          <FieldArray
            name="wherePredicates"
            change={this.props.change}
            columns={this.props.columns}
            onSubmitHandler={this.onSubmitHandler}
            setEditingFilter={this.setEditingFilter}
            editingFilter={this.state.editingFilter}
            currentValues={this.state.values}
            component={WherePredicateForms}
          />
        </form>
      </SWherePredicates>
    )
  }
}

export default reduxForm<IFormData, IWherePredicatesProps>({
  form: 'wherePredicates',
})(WherePredicates)
