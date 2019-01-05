import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers/rootReducer'
import saga from '../sagas'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

const sagaMiddleware = createSagaMiddleware()

export default createStore(
  rootReducer,
  applyMiddleware(
    sagaMiddleware,
    createLogger(),
  ),
)

sagaMiddleware.run(saga)
