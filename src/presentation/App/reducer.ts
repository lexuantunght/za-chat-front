import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _update from 'lodash-es/update';
import AppError from '../../common/types/AppError';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';

export type AppState = {
    error?: string;
    userData?: UserData;
    searchResult: {
        messages?: Message[];
        users?: UserData[];
    };
    errorConnection?: boolean;
    theme: 'light' | 'dark';
    accent: 'green' | 'blue' | 'red';
};

const defaultAppState: AppState = {
    error: undefined,
    userData: undefined,
    searchResult: {
        messages: undefined,
        users: undefined,
    },
    errorConnection: false,
    theme: 'light',
    accent: 'blue',
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
        setSearchContactsResult: (state: AppState, action: PayloadAction<UserData[]>) => {
            state.searchResult.users = action.payload;
        },
        clearSearchResult: (state: AppState) => {
            state.searchResult = defaultAppState.searchResult;
        },
        updateSearchUsersResult: (state: AppState, action: PayloadAction<UserData>) => {
            if (!state.searchResult.users) return;
            const index = state.searchResult.users.findIndex(
                (user) => user._id === action.payload._id
            );
            if (index >= 0) {
                _update(state.searchResult.users, `[${index}]`, () => action.payload);
            }
        },
        setErrorConnection: (state: AppState, action: PayloadAction<boolean>) => {
            state.errorConnection = action.payload;
        },
        changeTheme: (state: AppState, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        changeAccent: (state: AppState, action: PayloadAction<'green' | 'blue' | 'red'>) => {
            state.accent = action.payload;
        },
    },
});

const appReducer = appSlice.reducer;

export const {
    setError,
    setUserData,
    setSearchContactsResult,
    clearSearchResult,
    updateSearchUsersResult,
    setErrorConnection,
    changeTheme,
    changeAccent,
} = appSlice.actions;

export default appReducer;
