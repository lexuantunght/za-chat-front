import { AnyAction, combineReducers } from 'redux';
import DispatchType from '../../common/constants/DispatchType';
import UserData from '../../common/models/UserData';
import chatReducer from '../../screens/Chat/reducer';
import contactReducer from '../../screens/Contact/reducer';

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
    contact: contactReducer,
});

export default reducer;
