import createSagaMiddleware from 'redux-saga'
import list from '../reducers/list'
import saga from '../sagas'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

const sagaMiddleware = createSagaMiddleware()

export default createStore(
  list,
  applyMiddleware(
    sagaMiddleware,
    createLogger(),
  ),
)

sagaMiddleware.run(saga)
