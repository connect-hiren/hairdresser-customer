import { combineReducers } from 'redux';

import UserDataReducer from './userData';

export default combineReducers({
    userData: UserDataReducer
})