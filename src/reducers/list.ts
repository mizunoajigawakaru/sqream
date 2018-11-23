import { handleActions } from 'redux-actions'
import { get } from 'lodash'

const initialState = {
  folderListIsFetching: false,
  reportListIsFetching: false,
  list: [],
  folders: [],
}

export default handleActions(
  {
    FETCH_REPORT_LIST_START: state => ({
      ...state,
      reportListIsFetching: true,
    }),

    FETCH_REPORT_LIST_SUCCESS: (state, action) => ({
      ...state,
      list: get(action, 'payload.list', []),
      reportListIsFetching: false,
    }),

    FETCH_FOLDER_LIST_START: state => ({
      ...state,
      folderListIsFetching: true,
    }),

    FETCH_FOLDER_LIST_SUCCESS: (state, action) => ({
      ...state,
      folders: get(action, 'payload.folders', []),
      folderListIsFetching: false,
    }),
  },
  initialState,
)
