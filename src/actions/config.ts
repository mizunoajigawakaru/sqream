import { createActions } from 'redux-actions'

export default createActions({
  ADD_SELECTED_COLUMN: ({ column, position }) => ({ column, position }),
  CHANGE_COLUMN_INDEX: ({ nextSelectedColumns }) => ({ nextSelectedColumns }),
})
