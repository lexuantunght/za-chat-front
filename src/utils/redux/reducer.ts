import { AnyAction, combineReducers } from 'redux';
import DispatchType from '../../common/constants/DispatchType';
import UserData from '../../common/models/UserData';
import chatReducer from '../../screens/Chat/reducer';

type AppState = {
    isError: boolean;
    userData?: UserData;
    errorMsg?: string;
};

const defaultAppStates: AppState = {
    isError: false,
};

const appReducer = (state = defaultAppStates, action: AnyAction) => {
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
    app: appReducer,
    chat: chatReducer,
});

export default reducer;
