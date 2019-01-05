import { handleActions } from 'redux-actions'
import { get } from 'lodash'

const initialState = {
  columns: [],
  records: [],
  fetching: {
    columns: false,
  }
}

export default handleActions(
  {
    FETCH_TABLE_COLUMNS_START: state => ({
      ...state,
      fetching: {
        ...state.fetching,
        columns: true,
      },
    }),

    FETCH_TABLE_COLUMNS_SUCCESS: (state, action) => ({
      ...state,
      columns: get(action, 'payload.columns'),
      fetching: {
        ...state.fetching,
        columns: false,
      },
    }),

    FETCH_TABLE_RECORDS_START: state => ({
      ...state,
      fetching: {
        ...state.fetching,
        records: true,
      },
    }),

    FETCH_TABLE_RECORDS_SUCCESS: (state, action) => ({
      ...state,
      records: get(action, 'payload.records'),
      fetching: {
        ...state.fetching,
        records: false,
      },
    }),
  },
  initialState,
)
