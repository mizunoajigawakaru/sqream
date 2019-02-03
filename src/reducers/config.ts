import { handleActions } from 'redux-actions'
import { includes } from 'lodash'

export interface ConfigState {
  mainTable: string | null,
  joinTables: any[],
  selectedColumns: string[],
}

const initialState: ConfigState = {
  mainTable: null,
  joinTables: [],
  selectedColumns: [],
}

interface IConfigAction {
  type: string
  payload: { [k: string]: any }
}

export default handleActions(
  {
    SET_TABLES: (state: ConfigState = initialState, action: IConfigAction): ConfigState => {
      const { mainTable, joinTables } = action.payload

      return {
        ...state,
        mainTable,
        joinTables,
      }
    },
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
