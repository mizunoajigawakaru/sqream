import { handleActions } from 'redux-actions'
import { includes } from 'lodash'

export interface ConfigState {
  mainTable: string
  selectedColumns: string[]
}

const initialState: ConfigState = {
  mainTable: 'USERS',
  selectedColumns: [],
}

interface IConfigAction {
  type: string
  payload: { [k: string]: any }
}

export default handleActions(
  {
    ADD_SELECTED_COLUMN: (state: ConfigState = initialState, action: IConfigAction): ConfigState => {
      const { column, position } = action.payload
      const nextSelectedColumns: string[] = [...state.selectedColumns];

      if (!includes(nextSelectedColumns, column)) {
        nextSelectedColumns.splice(position, 0, column)
      }

      return {
        ...state,
        selectedColumns: nextSelectedColumns,
      }
    },
    CHANGE_COLUMN_INDEX: (state: ConfigState = initialState, action: IConfigAction): ConfigState => {
      const { nextSelectedColumns } = action.payload

      return {
        ...state,
        selectedColumns: nextSelectedColumns,
      }
    },
  },
  initialState,
)
