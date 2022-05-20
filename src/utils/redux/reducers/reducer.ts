import { combineReducers } from 'redux';
import DispatchType from '../../../common/constants/DispatchType';
import UserData from '../../../common/models/UserData';

type AppState = {
    isError: boolean | string;
    userData?: UserData;
};

const defaultAppStates: AppState = {
    isError: false,
    userData: undefined
};

const appReducer = (state = defaultAppStates, action: any) => {
    switch (action.type) {
        case DispatchType.APP.ERROR:
            return { ...state, isError: action.data };
        case DispatchType.APP.USER_DATA:
            return { ...state, userData: action.data };
        default:
            return state;
    }
};

const reducer = combineReducers({
    app: appReducer
});

export default reducer;
