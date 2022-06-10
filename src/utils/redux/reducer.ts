import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../../presentation/App/reducer';
import chatReducer from '../../presentation/Chat/reducer';
import loginReducer from '../../presentation/Login/reducer';

const reducer = combineReducers({
    app: appReducer,
    chat: chatReducer,
    login: loginReducer,
});

export default reducer;
