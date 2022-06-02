import { AnyAction, combineReducers } from 'redux';
import { UserData } from '../../../domain/model/UserData';
import chatReducer from '../../../presentation/Chat/reducer';

type AppState = {
    isError: boolean;
    userData?: UserData;
    errorMsg?: string;
};

const defaultAppStates: AppState = {
    isError: false,
    userData: undefined,
    errorMsg: undefined,
};

const appReducer = (state = defaultAppStates, action: AnyAction) => {
    switch (action.type) {
        case 'APP_IS_ERROR':
            return { ...state, isError: action.data };
        case 'APP_ERROR_MSG':
            return { ...state, errorMsg: action.data };
        case 'APP_USER_DATA':
            return { ...state, userData: action.data };
        default:
            return state;
    }
};

const reducer = combineReducers({
    app: appReducer,
    chat: chatReducer,
});

export default reducer;
