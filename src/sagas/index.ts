import {
    call,
    put,
    takeEvery,
  } from 'redux-saga/effects'
  import ListActions from '../actions/list'
  import axios from '../services/axios'
  
  interface IParams {
    report_folder_id?: number
  }
  
  function* fetchFolders() {
    try {
      const { data } = yield call(() => axios.get('/ajax/report/get_report_folder'), [])
      console.log('data', data)
      yield put(ListActions.fetchFolderListSuccess({ folders: data }))
    } catch (e) {
      yield put(ListActions.fetchFolderListFailure({ message: e.message }))
    }
  }
  
  function* fetchList(action: any) {
    try {
      const id = action.payload
      const params: IParams = {}
  
      if (id !== undefined) {
        params.report_folder_id = id
      }
      console.log('id', id)
      console.log('params', params)
      const { data } = yield call(() => axios.get('/ajax/report/get_report_list', { params }), [])
      yield put(ListActions.fetchReportListSuccess({ list: data }))
    } catch (e) {
      yield put(ListActions.fetchReportListFailure({ message: e.message }))
    }
  }
  
  function* listSaga() {
    yield takeEvery('FETCH_FOLDER_LIST_START', fetchFolders)
    yield takeEvery('FETCH_REPORT_LIST_START', fetchList)
  }
  
  export default listSaga
  