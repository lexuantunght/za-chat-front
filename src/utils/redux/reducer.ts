import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import AppError from '../../common/types/AppError';
import { Contact } from '../../domain/model/Contact';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';
import chatReducer from '../../presentation/Chat/reducer';
import loginReducer from '../../presentation/Login/reducer';

type AppState = {
    error?: string;
    userData?: UserData;
    searchResult: {
        messages: Message[];
        contacts: Contact[];
    };
};

const defaultAppState: AppState = {
    error: undefined,
    userData: undefined,
    searchResult: {
        messages: [],
        contacts: [],
    },
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
        setSearchContactsResult: (state: AppState, action: PayloadAction<Contact[]>) => {
            state.searchResult.contacts = action.payload;
        },
        clearSearchResult: (state: AppState) => {
            state.searchResult = defaultAppState.searchResult;
        },
    },
});

export const { setError, setUserData, setSearchContactsResult, clearSearchResult } =
    appSlice.actions;

const reducer = combineReducers({
    app: appSlice.reducer,
    chat: chatReducer,
    login: loginReducer,
});

export default reducer;
