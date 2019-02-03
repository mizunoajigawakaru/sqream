import { createActions } from 'redux-actions'

export default createActions({
  FETCH_TABLES_START: () => ({}),
  FETCH_TABLES_SUCCESS: ({ tables }) => ({ tables }),

  FETCH_TABLE_COLUMNS_START: ({ mainTable }) => ({ mainTable }),
  FETCH_TABLE_COLUMNS_SUCCESS: ({ columns }) => ({ columns }),

  FETCH_TABLE_RECORDS_START: ({ mainTable, filters }) => ({ mainTable, filters }),
  FETCH_TABLE_RECORDS_SUCCESS: ({ records }) => ({ records }),
})
