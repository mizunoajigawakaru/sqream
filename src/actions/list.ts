import { createActions } from 'redux-actions'

export default createActions({
  FETCH_REPORT_LIST_START: undefined,
  FETCH_REPORT_LIST_SUCCESS: ({ list }) => ({ list }),
  FETCH_REPORT_LIST_FAILURE: e => ({ message: e.message }),

  FETCH_FOLDER_LIST_START: undefined,
  FETCH_FOLDER_LIST_SUCCESS: ({ folders }) => ({ folders }),
  FETCH_FOLDER_LIST_FAILURE: e => ({ message: e.message }),
})
