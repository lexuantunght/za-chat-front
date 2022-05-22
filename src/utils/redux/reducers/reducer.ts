import { combineReducers } from 'redux';
import DispatchType from '../../../common/constants/DispatchType';
import UserData from '../../../common/models/UserData';

type AppState = {
    isError: boolean;
    userData?: UserData;
    errorMsg?: string;
};

const defaultAppStates: AppState = {
    isError: false
};

const appReducer = (state = defaultAppStates, action: any) => {
    switch (action.type) {
        case DispatchType.app.isError:
            return { ...state, isError: action.data };
        case DispatchType.app.errorMsg:
            return { ...state, errorMsg: action.data };
        case DispatchType.app.userData:
            return { ...state, userData: action.data };
        default:
            return state;
    }
};

const reducer = combineReducers({
    app: appReducer
});

export default reducer;
