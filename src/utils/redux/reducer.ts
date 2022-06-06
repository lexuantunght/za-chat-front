import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import AppError from '../../common/types/AppError';
import { UserData } from '../../domain/model/UserData';
import chatReducer from '../../presentation/Chat/reducer';

type AppState = {
    error?: string;
    userData?: UserData;
};

const defaultAppState: AppState = {
    error: undefined,
    userData: undefined,
};

const appSlice = createSlice({
    name: 'chat',
    initialState: defaultAppState,
    reducers: {
        setError: (state: AppState, action: PayloadAction<AppError | undefined>) => {
            state.error = action.payload?.response?.data?.message || action.payload?.message;
        },
        setUserData: (state: AppState, action: PayloadAction<UserData | undefined>) => {
            state.userData = action.payload;
        },
    },
});

export const { setError, setUserData } = appSlice.actions;

const reducer = combineReducers({
    app: appSlice.reducer,
    chat: chatReducer,
});

export default reducer;
