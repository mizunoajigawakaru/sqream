import {
  call,
  put,
  takeEvery,
} from 'redux-saga/effects'
import ListActions from '../actions/list'
import dataActions from '../actions/data'
import axios from '../services/axios'
import { get } from 'lodash'

interface IParams {
  report_folder_id?: number
}

function* fetchFolders() {
  try {
    const { data } = yield call(() => axios.get('/ajax/report/get_report_folder'), [])
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

    const { data } = yield call(() => axios.get('/ajax/report/get_report_list', { params }), [])
    yield put(ListActions.fetchReportListSuccess({ list: data }))
  } catch (e) {
    yield put(ListActions.fetchReportListFailure({ message: e.message }))
  }
}

function* fetchTables() {
  try {
    const { data } = yield call(() => axios.get('http://localhost:3000/tables'), [])
    yield put(dataActions.fetchTablesSuccess({ tables: data }))
  } catch (e) {
    yield put(dataActions.fetchTablesFailure({ message: e.message }))
  }
}

function* fetchTableColumns(action: any) {
  try {
    const params = {
      mainTable: action.payload.mainTable,
    }
    const { data } = yield call(() => axios.get('http://localhost:3000/columns', { params }), [])
    yield put(dataActions.fetchTableColumnsSuccess({ columns: data }))
  } catch (e) {
    yield put(dataActions.fetchTableColumnsFailure({ message: e.message }))
  }
}

function* fetchTableRecords(action: any) {
  try {
    const filters = get(action, 'payload.filters', [])
    const params: any = {
      mainTable: action.payload.mainTable,
      filters: JSON.stringify(filters),
    }
    const { data } = yield call(() => axios.get('http://localhost:3000/records', { params }), [])

    yield put(dataActions.fetchTableRecordsSuccess({ records: data }))
  } catch (e) {
    yield put(dataActions.fetchTableRecordsFailure({ message: e.message }))
  }
}

function* listSaga() {
  yield takeEvery('FETCH_FOLDER_LIST_START', fetchFolders)
  yield takeEvery('FETCH_REPORT_LIST_START', fetchList)

  yield takeEvery('FETCH_TABLES_START', fetchTables)
  yield takeEvery('FETCH_TABLE_COLUMNS_START', fetchTableColumns)
  yield takeEvery('FETCH_TABLE_RECORDS_START', fetchTableRecords)
}

export default listSaga
