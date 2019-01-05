import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import config from './config'
import data from './data'
import list from './list'

const rootReducer = combineReducers({
    config,
    data,
    list,
    form: formReducer,
})

export default rootReducer;
